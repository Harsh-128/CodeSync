import Editor from "@monaco-editor/react";

function CodeEditor({ language, code, onCodeChange }) {
    return (
        <Editor
            height="80vh"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={onCodeChange}
        />
    );
}

export default CodeEditor;