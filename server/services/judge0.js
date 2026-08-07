const axios = require("axios");

// Judge0 URL
const JUDGE0_URL = "http://host.docker.internal:2358";

const submitCode = async (language_id, source_code, stdin = "") => {
    try {
        const response = await axios.post(
            `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
            {
                language_id,
                source_code,
                stdin,
            }
        );

        return response.data;

    } catch (error) {
        console.error("Judge0 Error:", error.message);
        throw error;
    }
};

module.exports = {
    submitCode,
};