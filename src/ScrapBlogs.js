const axios = require("axios");
const cheerio = require("cheerio");
const Article = require("./Article");

async function scrapeBeyondChats() {
  try {
    console.log("🚀 Scraping latest 5 articles...");

    const baseUrl = "https://beyondchats.com";
    const blogUrl = baseUrl + "/blogs/";

    const { data } = await axios.get(blogUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(data);
    const blogLinks = [];

    // 🔹 STEP 1: latest 5 blogs
    $(".card-content h2.entry-title a")
      .slice(0, 5)
      .each((i, el) => {
        blogLinks.push({
          title: $(el).text().trim(),
          url: $(el).attr("href")
        });
      });

    // 🔹 STEP 2: scrape & store
    for (const blog of blogLinks) {
      const { data: blogHtml } = await axios.get(blog.url, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const $$ = cheerio.load(blogHtml);
      let content = "";

      $$(".elementor-widget-theme-post-content")
        .children()
        .each((i, el) => {
          const tag = el.tagName;
          if (["p", "h2", "h3", "h4", "li", "blockquote"].includes(tag)) {
            const text = $$(el).text().trim();
            if (text) content += text + "\n\n";
          }
        });

      // 🔥 UPSERT = insert OR update
      await Article.updateOne(
        { slug: blog.url },
        {
          $set: {
            title: blog.title,
            slug: blog.url,
            content,
            sourceUrl: blog.url,
            scrapedAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    console.log("✅ Latest 5 articles scraped & stored");
  } catch (err) {
    console.error("❌ Scraping error:", err.message);
  }
}

module.exports = scrapeBeyondChats;
