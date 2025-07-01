import { useState } from "react";
import { useDispatch } from 'react-redux';
import { createProblem } from '../redux/problemSlice';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ThemeToggle from "../components/ThemeToggle";

function AddProblem() {
  const [title, setTitle] = useState('');
  const [statement, setStatement] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [constraints, setConstraints] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [tags, setTags] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = tags.split(',').map(tag => tag.trim());

    dispatch(createProblem({
      title,
      statement,
      sampleInput,
      sampleOutput,
      constraints,
      difficulty,
      tags: tagsArray,
    }));

    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4 relative">
      {/* 🔙 Back Button Top Left */}
      <div className="absolute top-4 left-4">
        <Button variant="outline" onClick={() => navigate('/')}>
          ← Back to Home
        </Button>
      </div>
      {/* 🌙 Theme Toggle Top Right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Add New Problem
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
            /><Input
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
              <label className="block mb-1 font-medium">Difficulty Level</label>
              <select
                className="w-full border px-3 py-2 rounded-md bg-background"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                required>
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
              Add Problem
            </Button>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddProblem;