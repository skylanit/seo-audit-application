const axios = require("axios");

const getPageSpeedReport = async (url) => {
    try {

        const apiKey = process.env.PAGESPEED_API_KEY;

        const endpoint =
            `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`;

        const { data } = await axios.get(endpoint);

        if (!data.lighthouseResult) {
            return {
                error: true,
                message: "No Lighthouse data returned",
                apiResponse: data
            };
        }

        const lighthouse = data.lighthouseResult;

        const categories = lighthouse.categories || {};
        const audits = lighthouse.audits || {};

        return {

            performance:
                categories.performance?.score != null
                    ? Math.round(categories.performance.score * 100)
                    : null,

            accessibility:
                categories.accessibility?.score != null
                    ? Math.round(categories.accessibility.score * 100)
                    : null,

            bestPractices:
                categories["best-practices"]?.score != null
                    ? Math.round(categories["best-practices"].score * 100)
                    : null,

            seo:
                categories.seo?.score != null
                    ? Math.round(categories.seo.score * 100)
                    : null,

            coreWebVitals: {

                lcp:
                    audits["largest-contentful-paint"]?.displayValue || "N/A",

                cls:
                    audits["cumulative-layout-shift"]?.displayValue || "N/A",

                inp:
                    audits["interaction-to-next-paint"]?.displayValue ||
                    audits["experimental-interaction-to-next-paint"]?.displayValue ||
                    "N/A",

                fcp:
                    audits["first-contentful-paint"]?.displayValue || "N/A",

                speedIndex:
                    audits["speed-index"]?.displayValue || "N/A",

                tbt:
                    audits["total-blocking-time"]?.displayValue || "N/A"
            }
        };

    } catch (error) {

        return {
            error: true,
            message: error.message,
            details: error.response?.data || null
        };

    }
};

module.exports = getPageSpeedReport;