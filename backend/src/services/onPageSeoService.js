const axios = require("axios");
const cheerio = require("cheerio");
const checkUrlExists = require("../utils/checkUrlExists");

const analyzeOnPageSEO = async (url) => {
    try {

        // ==================================
        // FETCH WEBSITE HTML
        // ==================================

        const response = await axios({
            method: "GET",
            url,
            timeout: 30000,
            maxRedirects: 10,
            validateStatus: () => true,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
                "Accept":
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language":
                    "en-US,en;q=0.9",
                "Cache-Control":
                    "no-cache",
                "Pragma":
                    "no-cache",
                "Referer":
                    "https://www.google.com/"
            }
        });

        if (response.status >= 400) {
            return {
                error: true,
                message: `Website blocked request (${response.status})`
            };
        }

        const html = response.data;

        const $ = cheerio.load(html);

        // ==================================
        // TITLE
        // ==================================

        const title = $("title").text().trim();

        const titleLength = title.length;

        // ==================================
        // META DESCRIPTION
        // ==================================

        const metaDescription =
            $('meta[name="description"]').attr("content") || "";

        const metaDescriptionLength =
            metaDescription.length;

        // ==================================
        // CANONICAL
        // ==================================

        const canonical =
            $('link[rel="canonical"]').attr("href") || "";

        // ==================================
        // H1 / H2
        // ==================================

        const h1Tags = [];

        $("h1").each((i, el) => {
            const text = $(el).text().trim();

            if (text) {
                h1Tags.push(text);
            }
        });

        const h2Tags = [];

        $("h2").each((i, el) => {
            const text = $(el).text().trim();

            if (text) {
                h2Tags.push(text);
            }
        });

        const multipleH1 =
            h1Tags.length > 1;

        // ==================================
        // ROBOTS META
        // ==================================

        const robotsMeta =
            $('meta[name="robots"]').attr("content") ||
            "Not Found";

        // ==================================
        // OPEN GRAPH
        // ==================================

        const openGraph = {

            title:
                $('meta[property="og:title"]').attr("content") || "",

            description:
                $('meta[property="og:description"]').attr("content") || "",

            image:
                $('meta[property="og:image"]').attr("content") || "",

            url:
                $('meta[property="og:url"]').attr("content") || "",

            type:
                $('meta[property="og:type"]').attr("content") || ""
        };

        // ==================================
        // TWITTER TAGS
        // ==================================

        const twitterCard = {

            card:
                $('meta[name="twitter:card"]').attr("content") || "",

            title:
                $('meta[name="twitter:title"]').attr("content") || "",

            description:
                $('meta[name="twitter:description"]').attr("content") || "",

            image:
                $('meta[name="twitter:image"]').attr("content") || ""
        };

        // ==================================
        // STRUCTURED DATA
        // ==================================

        const jsonLdScripts =
            $('script[type="application/ld+json"]');

        const structuredData = {

            found:
                jsonLdScripts.length > 0,

            count:
                jsonLdScripts.length
        };

        // ==================================
        // IMAGES
        // ==================================

        const images = $("img");

        let totalImages = images.length;
        let missingAltTags = 0;

        images.each((i, img) => {

            const alt =
                $(img).attr("alt");

            if (!alt || alt.trim() === "") {
                missingAltTags++;
            }

        });

        // ==================================
        // LINKS
        // ==================================

        let internalLinks = 0;
        let externalLinks = 0;

        const linksToCheck = [];

        $("a").each((i, link) => {

            const href =
                $(link).attr("href");

            if (!href) return;

            if (
                href.startsWith("/") ||
                href.includes(new URL(url).hostname)
            ) {

                internalLinks++;

            } else if (
                href.startsWith("http")
            ) {

                externalLinks++;

            }

            if (
                href.startsWith("http")
            ) {
                linksToCheck.push(href);
            }

        });

        // ==================================
        // BROKEN LINKS
        // ==================================

        let brokenLinks = 0;

        const sampleLinks =
            linksToCheck.slice(0, 15);

        for (const link of sampleLinks) {

            try {

                const exists =
                    await checkUrlExists(link);

                if (!exists) {
                    brokenLinks++;
                }

            } catch (err) {
                brokenLinks++;
            }

        }

        // ==================================
        // SITEMAP
        // ==================================

        const sitemap =
            await checkUrlExists(
                `${new URL(url).origin}/sitemap.xml`
            );

        // ==================================
        // ROBOTS.TXT
        // ==================================

        const robotsTxt =
            await checkUrlExists(
                `${new URL(url).origin}/robots.txt`
            );

        // ==================================
        // SCORE
        // ==================================

        let score = 100;

        if (!title)
            score -= 10;

        if (
            titleLength < 30 ||
            titleLength > 60
        )
            score -= 5;

        if (!metaDescription)
            score -= 10;

        if (
            metaDescriptionLength < 120 ||
            metaDescriptionLength > 160
        )
            score -= 5;

        if (h1Tags.length === 0)
            score -= 10;

        if (multipleH1)
            score -= 5;

        if (!canonical)
            score -= 5;

        if (missingAltTags > 0)
            score -= 5;

        if (!openGraph.title)
            score -= 5;

        if (!twitterCard.card)
            score -= 5;

        if (!structuredData.found)
            score -= 5;

        if (!sitemap)
            score -= 5;

        if (!robotsTxt)
            score -= 5;

        if (brokenLinks > 0)
            score -= 5;

        score = Math.max(score, 0);

        // ==================================
        // RETURN REPORT
        // ==================================

        return {

            score,

            title,
            titleLength,

            metaDescription,
            metaDescriptionLength,

            h1Tags,
            h2Tags,

            multipleH1,

            canonical,

            robotsMeta,

            openGraph,

            twitterCard,

            structuredData,

            sitemap,

            robotsTxt,

            brokenLinks,

            images: {
                totalImages,
                missingAltTags
            },

            links: {
                internalLinks,
                externalLinks
            }

        };

    } catch (error) {

        return {
            error: true,
            message:
                error.response?.data?.message ||
                error.message ||
                "Unable to analyze website"
        };

    }
};

module.exports = analyzeOnPageSEO;