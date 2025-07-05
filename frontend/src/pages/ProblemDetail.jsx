import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useReducer, useState } from "react";
import API from "../services/api";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Navbar from "../components/Navbar";
import Editor from '@monaco-editor/react';
import { useTheme } from "next-themes";

const languages = ["cpp", "python", "java"];

function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("// Write your code here");
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await API.get(`/problems/${id}`);
        setProblem(res.data);
      } catch (err) {
        console.error("Error loading problem : ", err);
      }
    };
    fetchProblem();
  }, [id]);

  const handleRun = () => {
    console.log("Run Code:", { language, code });
    // later: send to compiler microservice
  };

  const handleSubmit = () => {
    console.log("Submit Code:", { language, code });
    // later: submit to backend for full evaluation
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
          {/* <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={18}
            className="w-full font-mono p-3 rounded border bg-neutral-900 text-white"
          /> */}

          <div className="flex gap-4">
            <Button onClick={handleRun} className="w-1/2">
              Run
            </Button>
            <Button onClick={handleSubmit} className="w-1/2">
              Submit
            </Button>
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
