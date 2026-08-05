const axios = require("axios");

const runCode = async (req, res) => {
    try {

        const { language_id, source_code, stdin } = req.body;

        const languageMap = {
            54: "cpp",
            62: "java",
            71: "python",
            63: "javascript",
        };

        const versionMap = {
            cpp: "10.2.0",
            java: "15.0.2",
            python: "3.10.0",
            javascript: "18.15.0",
        };

        const language = languageMap[language_id];

        const response = await axios.post(
            "https://emkc.org/api/v2/piston/execute",
            {
                language,
                version: versionMap[language],
                files: [
                    {
                        content: source_code,
                    },
                ],
                stdin,
            }
        );

        res.json({
            stdout: response.data.run.stdout,
            stderr: response.data.run.stderr,
            compile_output: response.data.run.output,
        });

    } catch (error) {

        console.log(error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "Error running code",
        });
    }
};

module.exports = {
    runCode,
};
