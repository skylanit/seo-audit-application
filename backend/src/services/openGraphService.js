const axios = require("axios");

const getOpenGraphReport = async (url) => {
    try {

        const apiKey = process.env.OPENGRAPH_API_KEY;

        const endpoint =
            `https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=${apiKey}`;

        const { data } = await axios.get(endpoint);

        if (!data.hybridGraph) {
            return {
                error: true,
                message: "Open Graph data not found"
            };
        }

        const og = data.hybridGraph;

        const issues = [];

        if (!og.title)
            issues.push("Missing Open Graph Title");

        if (!og.description)
            issues.push("Missing Open Graph Description");

        if (!og.image)
            issues.push("Missing Open Graph Image");

        if (!og.url)
            issues.push("Missing Open Graph URL");

        if (!og.type)
            issues.push("Missing Open Graph Type");

        let score = 100;

        score -= issues.length * 10;

        if (score < 0)
            score = 0;

        return {

            score,

            title: og.title || "",

            description: og.description || "",

            image: og.image || "",

            url: og.url || "",

            type: og.type || "",

            siteName: og.site_name || "",

            issues
        };

    } catch (error) {

        return {
            error: true,
            message: error.message
        };

    }
};

module.exports = getOpenGraphReport;