import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from "../components/Navbar";
import Editor from '@monaco-editor/react';
import ReactMarkdown from "react-markdown";
import { useTheme } from "next-themes";
import API from "../services/api";
import API_COMPILER from "../services/apiCompiler";
import AIPanel from '../components/AIPanel';

const languages = ["cpp", "python", "java"];

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(`// Write your code here\n
#include <bits/stdc++.h>
using namespace std;

int main() {
    cout << "Hello World!";
    return 0;
}`);

  const [sampleTest, setSampleTest] = useState(null);
  const [customInput, setCustomInput] = useState("");
  const [output, setOutput] = useState("")
  const [isRunMode, setIsRunMode] = useState(false);

  const [aiVisible, setAiVisible] = useState(false);
  const [aiDefaultMode, setAiDefaultMode] = useState("hint");
  const [aiPanelWidth, setAiPanelWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);

  // Persistent AI response state
  const [aiResponse, setAiResponse] = useState("");
  const [aiMode, setAiMode] = useState("hint");
  const [remaining, setRemaining] = useState(null);
  const [limitReached, setLimitReached] = useState(false);

  const [verdict, setVerdict] = useState("");
  const [failedTest, setFailedTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await API.get(`/problems/${id}`);
        setProblem(res.data);

        const testRes = await API.get(`/testcases/${id}`);
        const samples = testRes.data.filter(tc => tc.isSample);
        if (samples.length > 0) {
          setSampleTest(samples[0]);
          setCustomInput(samples[0].input);
        }

      } catch (err) {
        console.error("Error loading problem/test cases: ", err);
      }
    };

    const fetchAIUsage = async () => {
      try {
        const res = await API.get('/ai/usage');
        const remainingCount = res.data.remaining;
        setRemaining(remainingCount);
        setLimitReached(remainingCount <= 0);
      } catch (err) {
        console.error("Error fetching AI usage: ", err);
        // Set default values if API call fails
        setRemaining(5);
        setLimitReached(false);
      }
    };

    fetchProblem();
    fetchAIUsage();
  }, [id]);

  // Handle resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      const minWidth = 300;
      const maxWidth = window.innerWidth * 0.8;
      
      setAiPanelWidth(Math.max(minWidth, Math.min(newWidth, maxWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
    setIsRunMode(true);
    try {
      const res = await API_COMPILER.post("/run", {
        language, code, input: customInput,
      });
      if (res.data.output) {
        setOutput(res.data.output);
      }
      else {
        setOutput(res.data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Run error: ", err);
      const errMsg =
        err.response?.data?.error || err.message || "Unknown server error";
      setOutput(errMsg)
    }
    finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput("");
    setVerdict("");
    setFailedTest(null);
    setIsRunMode(false);

    try {
      const res = await API.post('/submissions', {
        code,
        language,
        problemId: id,
      });

      if (res.data.verdict === "Accepted") {
        setOutput("✅ All test cases passed successfully!");
        setVerdict("Accepted");
      }
      else if (res.data.verdict && res.data.testCaseResults) {
        const failedCase = res.data.testCaseResults.find(tc => !tc.passed);
        if (failedCase) {
          setVerdict("Failed");
          setFailedTest(failedCase);
          setAiDefaultMode("debug");
          setAiVisible(true);
          setOutput(
            `Failed Test Case\n\n` +
            `Input:\n${failedCase.input}\n\n` +
            `Expected:\n${failedCase.expectedOutput}\n\n` +
            `Got:\n${failedCase.actualOutput}`
          );
        }
      } else {
        setOutput("Unknown response from server.");
        setVerdict("Unknown");
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || err.message;
      setOutput(`Compilation Error\n\n${errMsg}`);
      setVerdict("Compilation Error");
    } finally {
      setLoading(false);
    }
  };


  if (!problem) return <p>Loading....</p>

  return (
    <div className="min-h-screen bg-muted text-foreground">
      <Navbar />

      <div className="absolute top-2 left-4 z-10">
        <Button
          variant="outline"
          className="px-3 py-1 h-8 text-sm font-medium text-foreground border-foreground hover:bg-accent"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </Button>
      </div>

      <div className="grid grid-cols-1 min-[900px]:grid-cols-2 p-6 gap-6 pt-8">
        {/* Left Panel : Problem Description */}
        <div className="bg-background p-6 rounded shadow space-y-4 text-left overflow-hidden">
          <h2 className="text-2xl font-bold break-words">{problem.title}</h2>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap break-words">{problem.statement}</p>
          </div>
          <div>
            <p className="font-semibold mb-1">📥 Sample Input:</p>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap break-words border">
              {problem.sampleInput}
            </pre>
          </div>

          <div>
            <p className="font-semibold mb-1">📥 Sample Output:</p>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap break-words border">
              {problem.sampleOutput}
            </pre>
          </div>

          <div>
            <p className="font-semibold mb-1">📌 Constraints:</p>
            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto whitespace-pre-wrap break-words border">
              {problem.constraints}
            </pre>
          </div>
        </div>

        {/* Right panel : code editor */}
        <div className="bg-background p-4 rounded shadow flex flex-col gap-4 min-h-0">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Compiler</h3>
            <select
              className="border px-3 py-2 rounded bg-background text-foreground min-w-0 flex-shrink-0"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-h-0 border rounded overflow-hidden">

            <Editor
              height="400px"
              defaultLanguage={language}
              language={language}
              value={code}
              theme={theme === "dark" ? "vs-dark" : "light"}
              onChange={(value) => setCode(value)}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-2">Input:</label>
              <textarea
                placeholder="Enter your input here..."
                rows={Math.min(Math.max(2, customInput.split('\n').length), 4)}
                className="w-full p-3 rounded bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                style={{
                  minHeight: '3rem', // 2 lines minimum
                  maxHeight: '6rem'   // 4 lines maximum
                }}
              />
            </div>
            <div className="flex gap-4">
              <Button onClick={handleRun} className="w-1/2" disabled={loading}>
                {loading ? "Executing..." : "Run Code"}
              </Button>
              <Button onClick={handleSubmit} className="w-1/2" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
            {output && (
              <div className="bg-card text-foreground p-4 rounded shadow-md border border-border space-y-3 max-h-80 overflow-y-auto">
                <h4 className="font-semibold text-lg">Output:</h4>

                {isRunMode ? (
                  <pre className="bg-muted p-3 rounded whitespace-pre-wrap text-sm border">
                    {output}
                  </pre>
                ) : (
                  <>

                    {verdict === "Accepted" ? (
                      <p className="text-green-600 font-semibold bg-muted p-2 rounded text-sm">
                        ✅ All test cases passed successfully!
                      </p>
                    ) : verdict === "Compilation Error" ? (
                      <div>
                        <p className="text-red-500 font-semibold mb-2">Compilation Error</p>
                        <pre className="bg-red-50 dark:bg-red-900/20 p-3 rounded whitespace-pre-wrap text-sm border border-red-200 dark:border-red-800 overflow-x-auto">
                          {output.replace("Compilation Error", "").trim()}
                        </pre>
                      </div>
                    ) : verdict === "Failed" && failedTest ? (
                      <div className="space-y-3 text-sm">
                        <p className="text-red-500 font-semibold">Failed Test Case</p>

                        <div>
                          <p className="font-semibold mb-1">Input:</p>
                          <pre className="bg-muted p-2 rounded whitespace-pre-wrap border">
                            {failedTest.input}
                          </pre>
                        </div>

                        <div>
                          <p className="font-semibold mb-1">Expected Output:</p>
                          <pre className="bg-muted p-2 rounded whitespace-pre-wrap border">
                            {failedTest.expectedOutput}
                          </pre>
                        </div>

                        <div>
                          <p className="font-semibold mb-1">Your Output:</p>
                          <pre className="bg-muted p-2 rounded whitespace-pre-wrap border">
                            {failedTest.actualOutput}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <pre className="bg-muted p-3 rounded whitespace-pre-wrap text-sm border">
                        {output}
                      </pre>
                    )}
                  </>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Fixed Ask AI Button - Better styling and positioning */}
      <div className="fixed right-4 bottom-4 z-40">
        <button
          onClick={() => {
            setAiDefaultMode("hint");
            setAiVisible(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 border-2 border-blue-500"
        >
          🤖 Ask AI
        </button>
      </div>

      {/* AI Panel Sliding Window - Resizable */}
      {aiVisible && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={() => setAiVisible(false)}
          />

          {/* AI Panel */}
          <div
            className="fixed top-0 right-0 h-full bg-background shadow-2xl border-l border-border z-50 flex"
            style={{ width: `${aiPanelWidth}px` }}
          >
            {/* Resize Handle */}
            <div
              className="w-1 bg-gray-300 dark:bg-gray-600 hover:bg-blue-500 cursor-ew-resize flex-shrink-0 transition-colors"
              onMouseDown={() => setIsResizing(true)}
              title="Drag to resize"
            />
            
            {/* Panel Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="sticky top-0 bg-background border-b border-border p-4 flex justify-between items-center flex-shrink-0">
                <h2 className="text-xl font-bold text-foreground">🤖 AI Assistant</h2>
                <button
                  onClick={() => setAiVisible(false)}
                  className="text-red-500 hover:text-red-700 font-semibold px-3 py-1 rounded border border-red-300 hover:bg-red-50 transition-colors"
                >
                  ✕ Close
                </button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto">
                <AIPanel
                  code={code}
                  problem={problem}
                  language={language}
                  failedTest={failedTest?.input || ""}
                  defaultMode={aiDefaultMode}
                  // Pass persistent state props
                  aiResponse={aiResponse}
                  setAiResponse={setAiResponse}
                  aiMode={aiMode}
                  setAiMode={setAiMode}
                  remaining={remaining}
                  setRemaining={setRemaining}
                  limitReached={limitReached}
                  setLimitReached={setLimitReached}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ProblemDetail;