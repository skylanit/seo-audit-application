const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const generateSEORecommendations = async (auditData) => {
    try {

       const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash"
});

        const prompt = `
You are an expert SEO consultant.

Analyze the following SEO audit report and provide:

1. Overall SEO Grade (A+ to F)
2. Strengths
3. Weaknesses
4. Technical Issues
5. Priority Fixes
6. Action Plan
7. Summary

Return only valid JSON.

Audit Report:

${JSON.stringify(auditData, null, 2)}
`;

        const result =
            await model.generateContent(prompt);

        const response =
            result.response.text();

        return JSON.parse(
            response.replace(/```json|```/g, "").trim()
        );

    } catch (error) {

        return {
            error: true,
            message: error.message
        };

    }
};

module.exports = generateSEORecommendations;