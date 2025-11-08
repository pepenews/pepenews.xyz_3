// api/ingest.js
const Parser = require('rss-parser');

module.exports = async (req, res) => {
  try {
    const parser = new Parser({
      headers: { 'User-Agent': 'PepenewsBot/1.0' },
    });

    // Можеш передати ?url=... або воно візьме дефолтний фід (для тесту)
    const rssUrl =
      (req.query && req.query.url) ||
      process.env.RSS_URL ||
      'https://feeds.bbci.co.uk/news/rss.xml';

    const feed = await parser.parseURL(rssUrl);

    // Беремо перші 5, чисто smoke-test
    const items = (feed.items || []).slice(0, 5).map(it => ({
      title: it.title || '',
      link: it.link || '',
      pubDate: it.pubDate || '',
      guid: it.guid || it.link || '',
      description: it.contentSnippet || it.content || '',
    }));

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(JSON.stringify({ source: rssUrl, count: items.length, items }));
  } catch (err) {
    res.status(500).send({ error: String(err?.message || err) });
  }
};
