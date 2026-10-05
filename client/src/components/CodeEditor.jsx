import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";

/* ── One colour per remote user ── */
const CURSOR_COLORS = [
    { bg: "#f97316", text: "#fff" },
    { bg: "#3b82f6", text: "#fff" },
    { bg: "#ec4899", text: "#fff" },
    { bg: "#10b981", text: "#fff" },
    { bg: "#f59e0b", text: "#000" },
    { bg: "#8b5cf6", text: "#fff" },
    { bg: "#06b6d4", text: "#000" },
    { bg: "#ef4444", text: "#fff" },
];

const colorCache   = {};
let   colorCounter = 0;

function getColor(socketId) {
    if (colorCache[socketId] === undefined) {
        colorCache[socketId] = colorCounter++ % CURSOR_COLORS.length;
    }
    return CURSOR_COLORS[colorCache[socketId]];
}

const injectedStyles = new Set();
function injectStyle(socketId, color) {
    if (injectedStyles.has(socketId)) return;
    injectedStyles.add(socketId);
    const el = document.createElement("style");
    el.id = `cs-style-${socketId}`;
    el.textContent = `
        .cs-cursor-${socketId} {
            border-left: 2px solid ${color.bg} !important;
            margin-left: -1px;
        }
        .cs-label-${socketId}::after {
            content: attr(data-label);
            background: ${color.bg};
            color: ${color.text};
            font-size: 10px;
            font-weight: 800;
            padding: 0 4px;
            border-radius: 3px 3px 3px 0;
            position: absolute;
            top: -16px;
            left: 0;
            pointer-events: none;
            white-space: nowrap;
            font-family: 'Segoe UI', sans-serif;
            z-index: 999;
        }
        .cs-sel-${socketId} {
            background: ${color.bg}44 !important;
        }
    `;
    document.head.appendChild(el);
}


function CodeEditor({ language, code, onCodeChange, theme, socketRef, socketReady, roomId }) {

    const editorRef     = useRef(null);
    const monacoRef     = useRef(null);
    const cursorsRef    = useRef({});   // socketId → decoration ids
    const labelsRef     = useRef({});   // socketId → DOM element
    const positionsRef  = useRef({});   // socketId → { lineNumber, column }

    /* ─────────────────────────────────────────────────────────
       Draw a remote cursor + label overlay on the editor DOM
    ───────────────────────────────────────────────────────── */
    function drawCursor({ socketId, username, position, selection }) {
        const editor = editorRef.current;
        const monaco = monacoRef.current;
        if (!editor || !monaco || !position) return;

        const color = getColor(socketId);
        injectStyle(socketId, color);

        const label = (username || "?").charAt(0).toUpperCase();
        const { lineNumber, column } = position;

        /* Build decorations array */
        const decs = [
            {
                range: new monaco.Range(lineNumber, column, lineNumber, column),
                options: {
                    className: `cs-cursor-${socketId}`,
                    stickiness: 1,
                },
            },
        ];

        /* Selection highlight */
        if (selection) {
            const { startLineNumber, startColumn, endLineNumber, endColumn } = selection;
            const isEmpty = startLineNumber === endLineNumber && startColumn === endColumn;
            if (!isEmpty) {
                decs.push({
                    range: new monaco.Range(startLineNumber, startColumn, endLineNumber, endColumn),
                    options: { className: `cs-sel-${socketId}`, stickiness: 1 },
                });
            }
        }

        /* Apply decorations */
        const prev = cursorsRef.current[socketId] || [];
        cursorsRef.current[socketId] = editor.deltaDecorations(prev, decs);

        /* Store position for scroll redraws */
        positionsRef.current[socketId] = { lineNumber, column };

        /* ── Floating DOM label ──
           Monaco decorations can't easily render absolutely-positioned labels,
           so we create a real DOM element and position it over the cursor line.  */
        positionLabel(socketId, label, color, lineNumber, column);
    }

    function positionLabel(socketId, label, color, lineNumber, column) {
        const editor  = editorRef.current;
        if (!editor) return;

        const domNode  = editor.getDomNode();
        if (!domNode) return;

        /* Create the label element once */
        let el = labelsRef.current[socketId];
        if (!el) {
            el = document.createElement("div");
            el.style.cssText = `
                position: absolute;
                z-index: 999;
                pointer-events: none;
                background: ${color.bg};
                color: ${color.text};
                font-size: 10px;
                font-weight: 800;
                width: 16px;
                height: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 3px 3px 3px 0;
                font-family: 'Segoe UI', sans-serif;
                box-shadow: 0 1px 4px rgba(0,0,0,0.4);
            `;
            el.textContent = label;
            /* Attach to the editor's overflow layer */
            const overlayLayer = domNode.querySelector(".overflow-guard");
            (overlayLayer || domNode).appendChild(el);
            labelsRef.current[socketId] = el;
        }

        /* Convert line/col to pixel position */
        try {
            const pos = editor.getScrolledVisiblePosition({ lineNumber, column });
            if (!pos) return;
            el.style.left    = `${pos.left}px`;
            el.style.top     = `${pos.top - 16}px`;
            el.style.display = "flex";
        } catch (_) {}
    }

    function removeCursor(socketId) {
        const editor = editorRef.current;
        if (editor) {
            const prev = cursorsRef.current[socketId] || [];
            editor.deltaDecorations(prev, []);
        }
        delete cursorsRef.current[socketId];
        delete colorCache[socketId];

        /* Remove DOM label */
        const el = labelsRef.current[socketId];
        if (el) { el.remove(); delete labelsRef.current[socketId]; }
    }

    /* ─────────────────────────────────────────────────────────
       Register socket listeners once editor is mounted.
       Re-register whenever socketReady flips (new connection).
    ───────────────────────────────────────────────────────── */
    useEffect(() => {
        const socket = socketRef?.current;
        if (!socket || !socketReady) return;

        const onUpdate = (data) => drawCursor(data);
        const onRemove = ({ socketId }) => removeCursor(socketId);

        socket.on("cursor-update", onUpdate);
        socket.on("cursor-remove", onRemove);

        return () => {
            socket.off("cursor-update", onUpdate);
            socket.off("cursor-remove", onRemove);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socketReady]);

    /* ─────────────────────────────────────────────────────────
       Editor mount — wire up cursor emission
    ───────────────────────────────────────────────────────── */
    const handleMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        editor.onDidChangeCursorPosition((e) => {
            socketRef?.current?.emit("cursor-move", {
                roomId,
                position: {
                    lineNumber: e.position.lineNumber,
                    column:     e.position.column,
                },
            });
        });

        editor.onDidChangeCursorSelection((e) => {
            const sel = e.selection;
            socketRef?.current?.emit("cursor-move", {
                roomId,
                position:  { lineNumber: sel.positionLineNumber, column: sel.positionColumn },
                selection: {
                    startLineNumber: sel.startLineNumber,
                    startColumn:     sel.startColumn,
                    endLineNumber:   sel.endLineNumber,
                    endColumn:       sel.endColumn,
                },
            });
        });

        /* Re-position all existing labels when editor scrolls */
        editor.onDidScrollChange(() => {
            Object.entries(positionsRef.current).forEach(([socketId, pos]) => {
                const el = labelsRef.current[socketId];
                if (!el || !pos) return;
                try {
                    const px = editor.getScrolledVisiblePosition(pos);
                    if (!px) return;
                    el.style.left = `${px.left}px`;
                    el.style.top  = `${px.top - 16}px`;
                } catch (_) {}
            });
        });
    };

    return (
        <Editor
            height="100%"
            language={language}
            theme={theme}
            value={code}
            onChange={onCodeChange}
            onMount={handleMount}
            options={{
                fontSize:                   15,
                fontFamily:                 "'Fira Code', 'Cascadia Code', Consolas, monospace",
                fontLigatures:              true,
                minimap:                    { enabled: false },
                automaticLayout:            true,
                scrollBeyondLastLine:       false,
                wordWrap:                   "on",
                smoothScrolling:            true,
                cursorBlinking:             "smooth",
                cursorSmoothCaretAnimation: "on",
                roundedSelection:           true,
                lineNumbers:                "on",
                renderLineHighlight:        "gutter",
                padding:                    { top: 12, bottom: 12 },
                bracketPairColorization:    { enabled: true },
                guides:                     { bracketPairs: true, indentation: true },
            }}
        />
    );
}

export default CodeEditor;
