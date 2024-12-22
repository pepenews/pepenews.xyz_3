// main.js (Minimal version with NO OpenAI code)

const RSSParser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Output directory for articles
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
    // Just return a small slice; no HTML parsing or AI
    return response.data.slice(0, 300) || 'Content not found';
  } catch {
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
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
    .slice(0, 30);
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
 * Main function: fetch articles from RSS and create HTML files.
 */
async function fetchAndProcessArticles() {
  try {
    const parser = new RSSParser();
    const feed = await parser.parseURL('https://www.coindesk.com/arc/outboundfeeds/rss/');
    const articles = [];

    for (const item of feed.items) {
      const content = await fetchFullContent(item.link);
      const safeTitle = slugify(item.title);
      const pubDate = new Date(item.pubDate);
      const formattedDate = `${pubDate.getFullYear()}${String(pubDate.getMonth() + 1).padStart(2, '0')}${String(pubDate.getDate()).padStart(2, '0')}`;

      const articleFilename = `${formattedDate}-${safeTitle}.html`;
      createArticleHTML(item.title, content, articleFilename);

      articles.push({
        title: item.title,
        link: `/articles/${articleFilename}`,
        pubDate: item.pubDate,
        // For now, no AI preview
        preview: content.slice(0, 100) + '...',
      });
    }

    fs.writeFileSync(
      path.join(outputDir, 'article-previews.json'),
      JSON.stringify(articles, null, 2)
    );

    console.log('Articles successfully processed and saved (no OpenAI yet).');
  } catch (error) {
    console.error('Error processing articles:', error);
    process.exit(1);
  }
}

fetchAndProcessArticles();
