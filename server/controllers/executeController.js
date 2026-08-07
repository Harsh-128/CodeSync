const { submitCode } = require("../services/judge0");

const executeCode = async (req, res) => {
    try {
        const { language_id, source_code, stdin } = req.body;

        // Validation
        if (!language_id || !source_code) {
            return res.status(400).json({
                success: false,
                message: "language_id and source_code are required",
            });
        }

        // Execute code using Judge0
        const result = await submitCode(
            language_id,
            source_code,
            stdin || ""
        );

        console.log(JSON.stringify(result, null, 2));

        return res.status(200).json({
            success: true,
            result,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Code execution failed",
        });
    }
};

module.exports = {
    executeCode,
};