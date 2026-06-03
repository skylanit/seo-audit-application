const axios = require("axios");

const checkUrlExists = async (url) => {
    try {

        await axios.head(url, {
            timeout: 5000,
            maxRedirects: 5
        });

        return true;

    } catch {

        return false;

    }
};

module.exports = checkUrlExists;