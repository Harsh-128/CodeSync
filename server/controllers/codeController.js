const axios = require("axios");

const runCode = async (req, res) => {

    try {

        const { language_id, source_code, stdin } = req.body;

        const options = {
            method: "POST",
            url: "https://judge0-extra-ce1.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
            headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": "judge0-extra-ce1.p.rapidapi.com"
            },
            data: {
    language_id,
    source_code,
    stdin
}
            
             
        };

        const response = await axios.request(options);

        res.json(response.data);

    } catch (error) {

        console.log(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "Error running code"
        });

    }

};

module.exports = {
    runCode
};