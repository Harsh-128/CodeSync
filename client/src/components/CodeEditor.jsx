import Editor from "@monaco-editor/react";

function CodeEditor({
    language,
    code,
    onCodeChange,
    theme
}) {
    return (
        <Editor
            height="100%"
            language={language}
            theme={theme}
            value={code}
            onChange={onCodeChange}
            options={{
                fontSize: 16,
                minimap: {
                    enabled: true,
                },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: "on",
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
                roundedSelection: true,
                padding: {
                    top: 12,
                    bottom: 12,
                },
            }}
        />
    );
}

export default CodeEditor;