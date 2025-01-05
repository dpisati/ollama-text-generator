# **Text Generation App with Vite, React, TypeScript, and Ollama**

This project is a web application that generates text using a local Ollama API (`llama3.2`). It features a sleek interface built with React, TypeScript, and Vite and supports streaming responses for real-time updates.

## **Features**

- **Text Generation**: Rewrite and enhance text prompts using `llama3.2`.
- **Streaming Updates**: Text is rendered word-by-word in real time as the response is received.
- **Abort Requests**: Cancel ongoing text generation anytime.
- **Clipboard Support**: Copy generated text directly to the clipboard.
- **Keyboard Shortcuts**: Press Enter to start text generation.

---

## **Requirements**

1. **Node.js**: Version 16 or later.
2. **Local Ollama Server**:
   - Install and start the Ollama API locally at `http://localhost:11434`.
   - Ensure `llama3.2` is available and configured correctly.
3. **Vite Development Server**:
   - The frontend is built with Vite and requires basic familiarity with its setup.

---

## **Setup Instructions**

### **1. Clone the Repository**

```bash
git clone <repository-url>
cd <repository-folder>
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Start the Local Ollama API**

Ensure the Ollama server is running on http://localhost:11434. You can start it using:

```bash
ollama run llama3.2
```

### **4. Start the Vite Development Server**

Run the Vite server:

```bash
npm run dev
```
