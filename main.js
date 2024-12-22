const RSSParser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 1. Output to "public/articles" to work with Vercel
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
    // Fetch more content (500 characters) for better previews
    return response.data.slice(0, 500) || 'Content not found';
  } catch (error) {
    console.error(`Error fetching content from ${url}:`, error.message);
    return 'Content not found';
  }
}

/**
 * Slugify the text to create a shorter filename.
 */
function slugify(text) {
  return text
    ?.toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove invalid characters
    .replace(/-+/g, '-') // Replace multiple hyphens
    .slice(0, 30); // Limit to 30 characters
}

/**
 * Creates a simple HTML file for each article.
 */
function createArticleHTML(title, content, filename) {
  const articleHTML = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${content.slice(0, 150)}" />
    <meta name="keywords" content="crypto, news, pepe, finance" />
    <title>${title}</title>
    <link rel="stylesheet" href="/assets/styles.css">
</head>
<body>
    <main id="app">
        <div class="article-container">
            <h1>${title}</h1>
            <p>${content}</p>
            <a href="/index.html" class="read-full-link">Back to Home</a>
        </div>
    </main>
</body>
</html>`;
  fs.writeFileSync(path.join(outputDir, filename), articleHTML, 'utf-8');
}

/**
 * Main function: fetch articles from RSS and create HTML files.
 */
async function fetchAndProcessArticles() {
  try {
    const parser = new RSSParser();
    const feed = await parser.parseURL('https://www.coindesk.com/arc/outboundfeeds/rss/');
    const articles = [];

    for (const item of feed.items) {
      // Validate item.link
      if (!item.link || typeof item.link !== 'string') {
        console.warn(`Skipping invalid article link for: ${item.title}`);
        continue; // Skip this article
      }

      const content = await fetchFullContent(item.link);
      const safeTitle = slugify(item.title);
      const pubDate = new Date(item.pubDate);
      const formattedDate = `${pubDate.getFullYear()}${String(pubDate.getMonth() + 1).padStart(2, '0')}${String(pubDate.getDate()).padStart(2, '0')}`;

      const articleFilename = `${formattedDate}-${safeTitle}.html`;
      createArticleHTML(item.title, content, articleFilename);

      // Add article metadata for previews
      articles.push({
        title: item.title,
        link: `/articles/${articleFilename}`, // Fixed path for previews
        pubDate: item.pubDate,
        preview: content.slice(0, 150) + '...', // Use longer preview
      });
    }

    // Save previews to "public/articles" folder
    fs.writeFileSync(
      path.join(outputDir, 'article-previews.json'),
      JSON.stringify(articles, null, 2)
    );

    console.log('Articles successfully processed and saved.');
  } catch (error) {
    console.error('Error processing articles:', error);
    process.exit(1);
  }
}

// Start fetching and processing articles
fetchAndProcessArticles();
