const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const LANGUAGE_MAP = {
    54: "cpp",
    62: "java",
    71: "python",
    63: "javascript",
};

// Use MSYS2 g++ on Windows (dev), system g++ on Linux (production/Docker)
const GPP_PATH = process.platform === "win32" && fs.existsSync("C:\\msys64\\ucrt64\\bin\\g++.exe")
    ? "C:\\msys64\\ucrt64\\bin\\g++.exe"
    : "g++";

const MSYS2_BIN = "C:\\msys64\\ucrt64\\bin";

function buildEnv() {
    const env = { ...process.env };
    if (process.platform === "win32") {
        const pathKey = Object.keys(env).find(k => k.toUpperCase() === "PATH") || "PATH";
        const currentPath = env[pathKey] || "";
        if (!currentPath.includes(MSYS2_BIN)) {
            env[pathKey] = MSYS2_BIN + ";" + currentPath;
        }
    }
    return env;
}

/**
 * Runs a command using spawn(), feeds stdin as a string, returns { stdout, stderr }.
 * Using spawn instead of exec avoids Windows shell quoting/pipe issues.
 */
const MAX_OUTPUT_BYTES = 500 * 1024; // 500 KB limit

function runProcess(cmd, args, cwd, stdinData, timeoutMs = 30000) {
    return new Promise((resolve) => {

        const child = spawn(cmd, args, {
            cwd,
            shell: false,
            env: buildEnv(),
        });

        let stdout = "";
        let stderr = "";
        let outputTruncated = false;

        child.stdout.on("data", (d) => {
            if (stdout.length < MAX_OUTPUT_BYTES) {
                stdout += d.toString();
                if (stdout.length >= MAX_OUTPUT_BYTES) {
                    stdout = stdout.slice(0, MAX_OUTPUT_BYTES);
                    outputTruncated = true;
                    child.kill(); // stop the process — output limit hit
                }
            }
        });
        child.stderr.on("data", (d) => {
            if (stderr.length < MAX_OUTPUT_BYTES) {
                stderr += d.toString();
            }
        });

        // Feed stdin then close it
        if (stdinData) {
            child.stdin.write(stdinData);
        }
        child.stdin.end();

        const timer = setTimeout(() => {
            child.kill();
            resolve({ stdout, stderr: stderr || "Time limit exceeded (10s)", timedOut: true });
        }, timeoutMs);

        child.on("close", (code) => {
            clearTimeout(timer);
            if (outputTruncated) {
                stdout += "\n\n[Output truncated — exceeded 500KB limit. Check for infinite loops.]";
            }
            resolve({ stdout, stderr, exitCode: code });
        });

        child.on("error", (err) => {
            clearTimeout(timer);
            resolve({ stdout: "", stderr: err.message, exitCode: -1 });
        });
    });
}

const runCode = async (req, res) => {
    const { language_id, source_code, stdin } = req.body;

    if (!language_id || !source_code) {
        return res.status(400).json({
            success: false,
            message: "language_id and source_code are required",
        });
    }

    const language = LANGUAGE_MAP[language_id];
    if (!language) {
        return res.status(400).json({
            success: false,
            message: `Unsupported language_id: ${language_id}`,
        });
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "codesync-"));

    try {
        let result;

        // ── Python ─────────────────────────────────────────────
        if (language === "python") {
            const srcFile = path.join(tmpDir, "main.py");
            fs.writeFileSync(srcFile, source_code);
            result = await runProcess("python", [srcFile], tmpDir, stdin || "");
        }

        // ── JavaScript ─────────────────────────────────────────
        else if (language === "javascript") {
            const srcFile = path.join(tmpDir, "main.js");
            fs.writeFileSync(srcFile, source_code);
            result = await runProcess("node", [srcFile], tmpDir, stdin || "");
        }

        // ── C++ ────────────────────────────────────────────────
        else if (language === "cpp") {
            const srcFile = path.join(tmpDir, "main.cpp");
            const outFile = path.join(tmpDir, "main.exe");
            fs.writeFileSync(srcFile, source_code);

            // Step 1: compile with C++17 using modern g++ (60s timeout for slow free tier)
            const compile = await runProcess(
                GPP_PATH,
                ["-std=c++17", "-o", outFile, srcFile],
                tmpDir,
                "",
                60000
            );

            if (compile.exitCode !== 0) {
                // Compilation failed — return compiler errors directly
                return res.json({
                    stdout: "",
                    stderr: compile.stderr,
                    output: compile.stderr || "Compilation failed",
                });
            }

            // Step 2: run
            result = await runProcess(outFile, [], tmpDir, stdin || "");
        }

        // ── Java ───────────────────────────────────────────────
        else if (language === "java") {
            const classMatch = source_code.match(/public\s+class\s+(\w+)/);
            const className = classMatch ? classMatch[1] : "Main";
            const srcFile = path.join(tmpDir, `${className}.java`);
            fs.writeFileSync(srcFile, source_code);

            // Step 1: compile Java (60s timeout for slow free tier)
            const compile = await runProcess(
                "javac",
                [srcFile, "-d", tmpDir],
                tmpDir,
                "",
                60000
            );

            if (compile.stderr && compile.exitCode !== 0) {
                return res.json({
                    stdout: "",
                    stderr: compile.stderr,
                    output: compile.stderr,
                });
            }

            // Step 2: run
            result = await runProcess(
                "java",
                ["-cp", tmpDir, className],
                tmpDir,
                stdin || ""
            );
        }

        return res.json({
            stdout: result.stdout,
            stderr: result.stderr,
            output: result.stdout || result.stderr || "No output",
        });

    } catch (error) {
        console.error("Code execution error:", error.message);
        // Always return 200 so the client shows the error instead of "Network Error"
        return res.status(200).json({
            stdout: "",
            stderr: error.message,
            output: "Execution error: " + error.message,
        });
    } finally {
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (_) {}
    }
};

module.exports = { runCode };
