function InputPanel({ input, setInput }) {
    return (
        <div className="input-panel">

            <h3>Custom Input</h3>

            <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter program input..."
                rows={6}
                className="input-textarea"
            />

        </div>
    );
}

export default InputPanel;