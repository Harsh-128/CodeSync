import Editor from "@monaco-editor/react";

function CodeEditor({ language, code, onCodeChange }) {
    return (
        <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={onCodeChange}
        />
    );
}

export default CodeEditor;