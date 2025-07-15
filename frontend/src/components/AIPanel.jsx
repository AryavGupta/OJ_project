import { useState } from "react";
import API from '../services/api';

const AIPanel = ({ code, problem, language, failedTest }) => {
  const [mode, setMode] = useState("hint");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAIRequest = async () => {
    setLoading(true);
    setAiResponse("");

    const context = {
      code,
      problem: problem.statement,
      language,
      failedTests: failedTest || "",
      constraints: problem.constraints || "",
    };
    try {
      const res = await API.post("/ai/assist", { mode, context });
      setAiResponse(res.data.result);
    } catch (err) {
      setAiResponse("AI response failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-card p-4 rounded-lg border shadow text-sm">
      <div className="flex gap-2 mb-3 flex-wrap">
        {["hint", "debug", "optimize", "explain"].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded ${
              mode === m ? "bg-primary text-white" : "bg-muted"
            }`}
          >
            {m.toUpperCase()}
          </button>
        ))}
        <button
          onClick={handleAIRequest}
          className="ml-auto px-4 py-1 bg-accent rounded font-medium"
        >
          Ask AI
        </button>
      </div>

      <div className="whitespace-pre-wrap min-h-[80px]">
        {loading ? "Thinking..." : aiResponse}
      </div>
    </div>
  );

};

export default AIPanel;