import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProblems } from "../redux/problemSlice";
import { useNavigate, useParams } from "react-router-dom";
import API from '../services/api'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ThemeToggle from '../components/ThemeToggle';

function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { problems } = useSelector((state) => state.problems);

  const [title, setTitle] = useState('');
  const [statement, setStatement] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [constraints, setConstraints] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [tags, setTags] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await API.get(`/problems/${id}`);
        const data = res.data;

        setTitle(data.title);
        setStatement(data.statement);
        setSampleInput(data.sampleInput);
        setSampleOutput(data.sampleOutput);
        setConstraints(data.constraints);
        setDifficulty(data.difficulty);
        setTags(data.tags?.join(', '));

      } catch (error) {
        console.error('Error fetching problem: ', error);
      }
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim());

    try {
      await API.put(`/problems/${id}`, {
        title, statement,
        sampleInput, sampleOutput,
        constraints, difficulty,
        tags: tagsArray,
      });

      dispatch(fetchProblems());
      navigate('/');

    } catch (error) {
      console.error('Error updating the problem: ', error);
      alert('Update Failed!');
    }
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 relative">

      {/* 🔙 Back Button */}
      <div className="absolute top-4 left-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          ← Back to Home
        </Button>
      </div>

      {/* 🌙 Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* 🎯 Edit Problem Form */}
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Edit Problem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              placeholder="Problem Statement"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              required
            />
            <Input
              placeholder="Sample Input"
              value={sampleInput}
              onChange={(e) => setSampleInput(e.target.value)}
              required
            />
            <Input
              placeholder="Sample Output"
              value={sampleOutput}
              onChange={(e) => setSampleOutput(e.target.value)}
              required
            />
            <Textarea
              placeholder="Constraints"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              required
            />
            <div>
              <label className="block mb-1 font-medium">Difficulty</label>
              <select
                className="w-full border px-3 py-2 rounded-md bg-background"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <Input
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Button type="submit" className="w-full">
              Update Problem
            </Button>
          </form>
        </CardContent>
      </Card>

    </div>
  );

}

export default EditProblem;