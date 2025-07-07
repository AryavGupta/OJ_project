import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from "../components/Navbar";
import Editor from '@monaco-editor/react';
import { useTheme } from "next-themes";
import API from "../services/api";
import API_COMPILER from "../services/apiCompiler";

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
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    setLoading(true);
    setOutput("");
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

      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          className="px-3 py-1 h-8 text-sm font-medium text-foreground border-foreground hover:bg-accent"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </Button>
      </div>

      <div className="flex p-6 gap-6">
        {/* Left Panel : Problem Description */}
        <div className="w-1/2 bg-background p-6 rounded shadow space-y-4 text-left">
          <h2 className="text-2xl font-bold">{problem.title}</h2>
          <p className="whitespace-pre-line">{problem.statement}</p>

          <div>
            <p className="font-semibold mb-1">📥 Sample Input:</p>
            <pre className="bg-muted p-2 rounded">{problem.sampleInput}</pre>
          </div>

          <div>
            <p className="font-semibold mb-1">📥 Sample Output:</p>
            <pre className="bg-muted p-2 rounded">{problem.sampleOutput}</pre>
          </div>

          <div>
            <p className="font-semibold mb-1">📌 Constraints:</p>
            <pre className="bg-muted p-2 rounded">{problem.constraints}</pre>
          </div>
        </div>

        {/* Right panel : code editor */}
        <div className="w-1/2 bg-background p-4 rounded shadow flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Compiler</h3>
            <select
              className="border px-2 py-1 rounded bg-background text-foreground"
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

          <div className="flex flex-col gap-4 mt-4">
            <textarea
              placeholder="Optional Input"
              rows={4}
              className="w-full p-2 rounded bg-muted text-foreground"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
            />

            <div className="flex gap-4">
              <Button onClick={handleRun} className="w-1/2" disabled={loading}>
                {loading ? "Executing..." : "Run Code"}
              </Button>
              <Button onClick={handleSubmit} className="w-1/2" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
            {output && (
              <div className="bg-card text-foreground p-4 rounded shadow-md border border-border mt-4 space-y-3">
                <h4 className="font-semibold text-lg">Output:</h4>

                {verdict === "Accepted" ? (
                  <p className="text-green-600 font-semibold bg-muted p-2 rounded text-sm">
                    ✅ All test cases passed successfully!
                  </p>
                ) : verdict === "Compilation Error" ? (
                  <div>
                    <p className="text-red-500 font-semibold mb-2">Compilation Error</p>
                    <pre className="bg-muted p-3 rounded whitespace-pre-wrap text-sm border border-destructive">
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
              </div>
            )}

          </div>
          {/* Optional: Future AI Support */}
          <div className="mt-2 bg-muted p-2 rounded text-sm text-center">
            💡 AI support coming soon...
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProblemDetail;
