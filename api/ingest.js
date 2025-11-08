// api/ingest.js
const Parser = require('rss-parser');
const axios = require('axios');

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
    return 'Content not available';
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

module.exports = async (req, res) => {
  try {
    const parser = new Parser({
      headers: { 'User-Agent': 'PepenewsBot/1.0' },
    });

    // Use CoinDesk RSS feed by default
    const rssUrl =
      (req.query && req.query.url) ||
      process.env.RSS_URL ||
      'https://www.coindesk.com/arc/outboundfeeds/rss/';

    const feed = await parser.parseURL(rssUrl);
    const articles = [];

    // Process each article
    for (const item of feed.items || []) {
      // Validate item.link
      if (!item.link || typeof item.link !== 'string') {
        console.warn(`Skipping invalid article link for: ${item.title}`);
        continue;
      }

      // Fetch content for preview
      const content = await fetchFullContent(item.link);
      const safeTitle = slugify(item.title);
      const pubDate = new Date(item.pubDate);
      const formattedDate = `${pubDate.getFullYear()}${String(pubDate.getMonth() + 1).padStart(2, '0')}${String(pubDate.getDate()).padStart(2, '0')}`;

      // Add article metadata for previews
      articles.push({
        title: item.title || '',
        link: item.link, // Use original link since we're not creating HTML files
        pubDate: item.pubDate || '',
        preview: content.slice(0, 150) + '...',
      });
    }

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(articles);
  } catch (err) {
    console.error('Error processing RSS feed:', err);
    res.status(500).json({ error: String(err?.message || err) });
  }
};
