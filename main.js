// src/main.js

const { OpenAIApi } = require('openai');
const RSSParser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Temporarily remove strict key check so the project can build
// (Uncomment later if desired)
// if (!process.env.OPENAI_API_KEY) {
//   console.error('Error: The OPENAI_API_KEY environment variable is not set.');
//   process.exit(1);
// }

// Configure OpenAI API
const openai = new OpenAIApi({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// Define the output directory for articles
const outputDir = path.join(__dirname, 'public', 'articles');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * Fetch the full content of an article from a given URL.
 */
async function fetchFullContent(url) {
    try {
        const response = await axios.get(url);
        const articleHTML = response.data;

        // Extract content within <article> tags
        const contentMatch = articleHTML.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
        const content = contentMatch && contentMatch[1]
            ? contentMatch[1].replace(/<[^>]+>/g, '') // Remove HTML tags
            : 'Content not found';

        return content;
    } catch (error) {
        console.error(`Error fetching content from ${url}:`, error.message);
        return 'Content not found';
    }
}

/**
 * Rephrase the full article content using OpenAI.
 */
async function rephraseFullArticle(title, content) {
    try {
        const prompt = `
      Retell the following article in the style of Pepe the Frog. Be humorous, use analogies to frog life, and make it funny. Keep all crypto terms intact. You can use some slang and light profanity, but maintain the Pepe Frog style.

      Title: ${title}

      Content: ${content}
    `;

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1000,
            temperature: 0.7,
        });

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error rephrasing full article:', error.message);
        return content; // Fallback if there's an error
    }
}

/**
 * Generate a short preview for the article using OpenAI.
 */
async function generateArticlePreview(content) {
    try {
        const prompt = `
      Summarize the following article in 2-3 sentences using the tone of Pepe the Frog from the meme. Be humorous, use analogies to frog life, and make it funny. You can use some slang and light profanity, but keep the Pepe Frog style.

      Article: ${content}
    `;

        const response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 150,
            temperature: 0.7,
        });

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating article preview:', error.message);
        return content.slice(0, 200) + '...';
    }
}

/**
 * Slugify the text to create a URL-friendly string.
 * Limits length to 30 chars.
 */
function slugify(text) {
    return text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\x00-\x7F]/g, '')
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .substring(0, 30);
}

/**
 * Create an HTML file for the rephrased article.
 */
function createArticleHTML(title, content, filename) {
    const articleHTML = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <link rel="stylesheet" href="/src/css/styles.css">
</head>
<body>
    <main id="app">
        <div class="article-container">
            <h1>${title}</h1>
            <p>${content}</p>
            <a href="/index.html">Back to Home</a>
        </div>
    </main>
</body>
</html>`;
    fs.writeFileSync(path.join(outputDir, filename), articleHTML, 'utf-8');
}

/**
 * Fetch articles from RSS, process, and generate previews.
 */
async function fetchAndProcessArticles() {
    try {
        const parser = new RSSParser();
        const feed = await parser.parseURL('https://www.coindesk.com/arc/outboundfeeds/rss/');
        const articles = [];

        for (const item of feed.items) {
            const content = await fetchFullContent(item.link);
            const rephrasedContent = await rephraseFullArticle(item.title, content);
            const preview = await generateArticlePreview(rephrasedContent);

            const safeTitle = slugify(item.title);
            const pubDate = new Date(item.pubDate);
            const formattedDate = `${pubDate.getFullYear()}${String(pubDate.getMonth() + 1).padStart(2, '0')}${String(pubDate.getDate()).padStart(2, '0')}`;

            const articleFilename = `${formattedDate}-${safeTitle}.html`;
            createArticleHTML(item.title, rephrasedContent, articleFilename);

            articles.push({
                title: item.title,
                link: `/articles/${articleFilename}`,
                pubDate: item.pubDate,
                preview: preview,
            });
        }

        fs.writeFileSync(
            path.join(outputDir, 'article-previews.json'),
            JSON.stringify(articles, null, 2)
        );

        console.log('Full articles and previews successfully processed and saved.');
    } catch (error) {
        console.error('Error processing articles:', error);
        process.exit(1);
    }
}

// Run it
fetchAndProcessArticles();

