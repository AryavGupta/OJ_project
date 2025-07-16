import { useEffect, useState } from "react";
import { useRef } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from "next-themes";

const AIPanel = ({ 
  code, 
  problem, 
  language, 
  failedTest, 
  defaultMode = "hint",
  // Persistent state props
  aiResponse,
  setAiResponse,
  aiMode,
  setAiMode,
  // Limit-related props
  remaining,
  setRemaining,
  limitReached,
  setLimitReached
}) => {
  const [mode, setMode] = useState(defaultMode);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const currentModeRef = useRef(defaultMode);

  useEffect(() => {
    setMode(defaultMode); // updates mode when defaultMode changes
    setAiMode(defaultMode); // update parent state as well
  }, [defaultMode, setAiMode]);

  const handleAIRequest = async () => {
    setLoading(true);
    setAiResponse(""); // Clear response when making new request

    const context = {
      code,
      problem: problem.statement,
      language,
      failedTests: failedTest || "",
      constraints: problem.constraints || "",
    };

    try {
      const res = await API.post("/ai/assist", { mode, context });
      
      // Check if response has the expected structure
      if (res.data && res.data.result) {
        setAiResponse(res.data.result);
        setAiMode(mode); // Update parent state
        currentModeRef.current = mode; // Update last requested mode
        
        // Handle remaining count
        if (res.data.remaining !== undefined) {
          setRemaining(res.data.remaining);
          setLimitReached(res.data.remaining <= 0);
        }
      } else {
        console.error("Unexpected response structure:", res.data);
        setAiResponse("Unexpected response from AI service.");
      }
    } catch (err) {
      console.error("AI Request Error:", err);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      
      // Handle 429 (rate limit) specifically
      if (err.response?.status === 429) {
        setLimitReached(true);
        setRemaining(0);
        const errorMessage = err.response.data?.error || "Daily AI limit reached. Please try again tomorrow.";
        setAiResponse(errorMessage);
      } else if (err.response?.data?.error) {
        setAiResponse(`Error: ${err.response.data.error}`);
      } else if (err.message) {
        setAiResponse(`Network error: ${err.message}`);
      } else {
        setAiResponse("AI response failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setAiMode(newMode);
  };

  const getButtonClass = (m) => {
    const isActive = mode === m;
    return `
      px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 w-full
      ${isActive
        ? "bg-blue-600 text-white border-blue-600 shadow-md"
        : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500"}
    `;
  };

  // Custom components for ReactMarkdown to handle code blocks properly
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const lang = match ? match[1] : '';
      const codeContent = String(children).replace(/\n$/, '');
      const [copied, setCopied] = useState(false);

      const handleCopy = () => {
        navigator.clipboard.writeText(codeContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      };

      const isShortCode = codeContent.trim().split(/\s+/).length <= 3 &&
        codeContent.trim().split('\n').length === 1 &&
        codeContent.length < 20;

      if (!inline && isShortCode) {
        return (
          <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-blue-600 dark:text-blue-400" {...props}>
            {codeContent}
          </code>
        );
      }

      return !inline ? (
        <div className="relative my-4 group">
          {lang && (
            <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 rounded-t-lg flex justify-between items-center">
              <span>{lang.toUpperCase()}</span>
              <button
                onClick={handleCopy}
                className="text-blue-500 hover:underline text-xs ml-4"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}
          <SyntaxHighlighter
            style={theme === 'dark' ? oneDark : oneLight}
            language={lang || 'text'}
            PreTag="div"
            className={`${lang ? '!mt-0 !rounded-t-none' : ''}`}
            showLineNumbers={lang && !['text', 'plain'].includes(lang.toLowerCase())}
            {...props}
          >
            {codeContent}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono text-blue-600 dark:text-blue-400" {...props}>
          {children}
        </code>
      );
    },
    p: ({ children }) => (
      <p className="mb-3 text-left leading-relaxed">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="list-disc pl-5 mb-3 text-left space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal pl-5 mb-3 text-left space-y-1">{children}</ol>
    ),
    li: ({ children }) => (
      <li className="text-left">{children}</li>
    ),
    h1: ({ children }) => (
      <h1 className="text-xl font-bold mb-3 text-left">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-lg font-semibold mb-2 text-left">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-semibold mb-2 text-left">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 dark:text-gray-300 mb-3 text-left">{children}</blockquote>
    ),
  };

  return (
    <div className="text-sm space-y-4 h-full flex flex-col">
      {/* Mode Selection Buttons */}
      <div className="grid grid-cols-4 gap-2 flex-shrink-0">
        {["hint", "debug", "optimize", "explain"].map((m) => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={getButtonClass(m)}
          >
            {m.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Ask AI Button */}
      <div className="flex justify-center flex-shrink-0">
        <button
          onClick={handleAIRequest}
          disabled={loading || limitReached}
          className={`${limitReached
              ? "bg-gray-300 text-gray-600 border border-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white"
            } font-semibold px-6 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg min-w-[120px]`}
        >
          {loading ? (
            "Thinking..."
          ) : limitReached ? (
            `Limit Reached (${remaining || 0}/5)`
          ) : (
            `🚀 Ask AI (${remaining !== null && remaining !== undefined ? remaining : "loading..."}/5)`
          )}
        </button>
      </div>

      {/* AI Response - Takes remaining space */}
      <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 min-h-[150px] flex-1 overflow-y-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-semibold text-gray-700 dark:text-gray-300">AI Response</span>
          {aiResponse && (
            <button
              onClick={() => setAiResponse("")}
              className="ml-auto text-xs text-gray-500 hover:text-red-500 border border-gray-300 px-2 py-1 rounded"
            >
              Clear
            </button>
          )}
        </div>

        <div className="text-gray-800 dark:text-gray-200 text-left">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-gray-600 dark:text-gray-400">Analyzing your code...</span>
            </div>
          ) : aiResponse ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {aiResponse}
            </ReactMarkdown>
          ) : (
            <div className="text-gray-500 dark:text-gray-400 italic text-center py-8">
              👋 Hi! I'm here to help with your coding problem.
              <br />
              Select a mode above and click "Ask AI" to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;