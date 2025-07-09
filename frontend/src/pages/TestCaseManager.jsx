import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from '../services/api';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function TestCaseManager() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [testCases, setTestCases] = useState([]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [accepts, setAccepts] = useState("");
  const [isSample, setIsSample] = useState(false);

  const fetchTestCases = async () => {
    try {
      const res = await API.get(`/testcases/${problemId}`);
      setTestCases(res.data);
    } catch (err) {
      console.error("Error fetching test cases : ", err);
    }
  }

  useEffect(() => {
    fetchTestCases();
  }, [problemId]);

  const handleAdd = async () => {
    try {
      const body = {
        input,
        output,
        accepts: accepts.trim().length > 0
        ? accepts.split(",").map(s => s.trim()) : [],
        isSample,
        problemId,
      };
      await API.post('/testcases', body);
      setInput(""); setOutput(""); setAccepts(""); setIsSample(false);
      await fetchTestCases();
      alert("Test case added successfully!");
    } catch (err) {
      console.error("Error adding testcase : ", err);
      alert("Failed to add test case.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test case?")) return;
    try {
      await API.delete(`/testcases/${id}`);
      await fetchTestCases();
      alert("Test case deleted.");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete test case.");
    }
  };

  return (
    <div className="min-h-screen bg-muted p-6 text-foreground">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Manage Test Cases</h2>
        <Button variant="outline" onClick={() => navigate('/')}>← Back to Home</Button>
      </div>

      <div className="bg-card p-4 rounded shadow space-y-3 mb-6">
        <h3 className="font-semibold text-lg">Add New Test Case</h3>
        <Textarea placeholder="Input" value={input} onChange={(e) => setInput(e.target.value)} />
        <Textarea placeholder="Output" value={output} onChange={(e) => setOutput(e.target.value)} />
        <Input placeholder="Accepts (comma separated)" value={accepts} onChange={(e) => setAccepts(e.target.value)} />
        <label className="flex gap-2 items-center text-sm">
          <input type="checkbox" checked={isSample} onChange={() => setIsSample(!isSample)} />
          Is Sample
        </label>
        <Button onClick={handleAdd}>Add Test Case</Button>
      </div>

      <div className="space-y-4">
        {testCases.map((tc, idx) => (
          <div key={tc._id} className="bg-card border border-border p-5 rounded-md shadow-md text-sm space-y-3">
            <h4 className="text-lg font-semibold text-primary">Test Case #{idx + 1}</h4>
            <div>
              <strong>Input:</strong>
              <pre className="bg-muted p-2 rounded whitespace-pre-wrap text-sm">{tc.input}</pre>
            </div>
            <div>
              <strong>Output:</strong>
              <pre className="bg-muted p-2 rounded whitespace-pre-wrap text-sm">{tc.output}</pre>
            </div>
            <p><strong>Accepts:</strong> {tc.accepts?.join(", ") || "-"} </p>
            <p><strong>Sample:</strong> {tc.isSample ? "Yes" : "No"}</p>

            <div className="flex justify-end gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => alert("Edit coming soon!")}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(tc._id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestCaseManager;

