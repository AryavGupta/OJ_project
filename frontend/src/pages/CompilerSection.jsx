// CompilerSection.jsx (Updated UI for Submission Results)
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function CompilerSection({
  customInput,
  setCustomInput,
  handleRun,
  handleSubmit,
  loading,
  output,
  showVerdict,
  verdict,
  failedTest,
}) {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <textarea
        placeholder="Optional Input"
        rows={4}
        className="w-full p-2 rounded bg-muted text-foreground border border-border focus:outline-none"
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
      />

      <div className="flex gap-4">
        <Button onClick={handleRun} className="w-1/2" disabled={loading}>
          {loading ? "Running..." : "Run"}
        </Button>
        <Button onClick={handleSubmit} className="w-1/2">
          Submit
        </Button>
      </div>

      {showVerdict && (
        <div className="bg-card text-foreground p-4 rounded shadow-md border border-border">
          <h4 className="font-semibold text-lg mb-2">Verdict:</h4>
          <p
            className={`text-md font-medium mb-4 ${
              verdict === "Accepted" ? "text-green-600" : "text-red-500"
            }`}
          >
            {verdict === "Accepted" ? "✅ All test cases passed!" : "❌ Failed Test Case"}
          </p>

          {verdict !== "Accepted" && failedTest && (
            <div className="text-sm space-y-2">
              <div>
                <span className="font-semibold">Input:</span>
                <pre className="bg-muted p-2 rounded whitespace-pre-wrap">
                  {failedTest.input}
                </pre>
              </div>
              <div>
                <span className="font-semibold">Expected:</span>
                <pre className="bg-muted p-2 rounded whitespace-pre-wrap">
                  {failedTest.expectedOutput}
                </pre>
              </div>
              <div>
                <span className="font-semibold">Got:</span>
                <pre className="bg-muted p-2 rounded whitespace-pre-wrap">
                  {failedTest.actualOutput}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-2 bg-muted p-2 rounded text-sm text-center">
        💡 AI support coming soon...
      </div>
    </div>
  );
}
