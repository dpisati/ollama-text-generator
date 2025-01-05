import React, { useState } from "react";

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const signal = new AbortController();

  const fetchStream = async () => {
    if (!input.trim()) {
      alert("Please enter a prompt.");
      return;
    }

    const body = {
      model: "llama3.2",
      prompt: `rewrite and enhance the following text in a friendly and short way (only the text reply - without quotes): ${input}`,
      stream: true, // Enable streaming
    };

    setLoading(true);
    setResult(""); // Clear previous results

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: signal.signal,
      });

      if (!response.body) {
        throw new Error("Streaming not supported or no response body.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      let buffer = ""; // Accumulate partial words across chunks

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;

        if (value) {
          const chunk = decoder.decode(value);
          const { response } = JSON.parse(chunk);

          buffer += response; // Accumulate the chunk

          // Process complete words
          const words = buffer.split(/\s+/); // Split by whitespace
          buffer = words.pop() || ""; // Keep the last partial word in the buffer

          // Update result state with complete words
          setResult((prevResult) => prevResult + " " + words.join(" "));
        }
      }

      // Append any remaining buffer content after stream ends
      if (buffer.trim()) {
        setResult((prevResult) => prevResult + " " + buffer.trim());
      }
    } catch (error) {
      console.error("Error while fetching stream:", error);
      alert("An error occurred while generating the text.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#202024",
        border: "1px solid #333",
        padding: "24px",
        borderRadius: "14px",

        width: "95%",
        maxWidth: "900px",

        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1>Text Generation</h1>
      <textarea
        placeholder="Enter your text here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={(e) => {
          e.target.select();
        }}
        onBlur={(e) => {
          e.target.selectionStart = e.target.selectionEnd;
        }}
        onKeyDown={async (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            fetchStream();
          }
        }}
        rows={4}
        style={{
          width: "100%",
          padding: "16px",
          fontSize: "20px",
          borderRadius: "12px",
          border: "1px solid #333",
          backgroundColor: "#23252a",
        }}
      />
      <div>
        <button
          onClick={fetchStream}
          disabled={loading}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            backgroundColor: loading ? "#ccc" : "#007BFF",
            color: "#fff",
            border: "none",
          }}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <button
          onClick={() => {
            signal.abort();
            setResult("");
            setInput("");
          }}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            marginLeft: "10px",
          }}
        >
          Cancel
        </button>
      </div>
      {result && (
        <div style={{ marginTop: "20px" }}>
          <div
            style={{
              fontSize: "20px",
              lineHeight: "1.7",
              whiteSpace: "pre-line",

              overflowY: "auto",
              maxHeight: "400px",
            }}
          >
            {result}
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(result);
            }}
            disabled={!result}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: !result ? "not-allowed" : "pointer",
              backgroundColor: !result ? "#a3a3a3" : "#28a745",
              color: !result ? "#5e5e5e" : "#fff",
              border: "none",
              marginTop: "10px",
            }}
          >
            Copy Result
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
