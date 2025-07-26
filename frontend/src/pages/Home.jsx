import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { fetchProblems, deleteProblem } from '../redux/problemSlice';
import Navbar from '../components/Navbar';
import { Button } from "@/components/ui/button";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { problems, loading } = useSelector((state) => state.problems);

  useEffect(() => {
    dispatch(fetchProblems());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      dispatch(deleteProblem(id));
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 dark:text-green-400';
      case 'Medium':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'Hard':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ✅ Navbar at the top */}
      <Navbar />

      <div className='p-8'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Welcome to Online Judge!</h1>
        </div>

        <h2 className='text-2xl font-semibold mb-4'>Problem List</h2>

        {user?.userType === 'admin' && (
          <Button 
            className='mb-4'
            onClick={() => navigate('/add-problem')}
          >
            Add Problem
          </Button>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2">Loading problems...</span>
          </div>
        ) : problems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No problems found.</p>
          </div>
        ) : (
          <div className="bg-background rounded-lg border border-border shadow-sm overflow-hidden">
            <table className='w-full'>
              <thead>
                <tr className='bg-muted/50 border-b border-border'>
                  <th className="p-4 text-left font-semibold text-foreground">Title</th>
                  <th className="p-4 text-left font-semibold text-foreground">Difficulty</th>
                  <th className="p-4 text-left font-semibold text-foreground">Tags</th>
                  {user?.userType === 'admin' && (
                    <th className="p-4 text-left font-semibold text-foreground w-64">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {problems.map((problem, index) => (
                  <tr
                    key={problem._id}
                    className={`
                      border-b border-border hover:bg-muted/30 cursor-pointer transition-colors duration-200
                      ${index % 2 === 0 ? 'bg-background' : 'bg-muted/10'}
                    `}
                    onClick={() => navigate(`/problem/${problem._id}`)}
                  >
                    <td className="p-4 border-r border-border">
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                        <span>📘</span> 
                        <span className="hover:underline">{problem.title}</span>
                      </div>
                    </td>
                    <td className={`p-4 border-r border-border font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </td>
                    <td className='p-4 border-r border-border text-muted-foreground'>
                      {problem.tags?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.map((tag, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-md border"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">No tags</span>
                      )}
                    </td>

                    {user?.userType === 'admin' && (
                      <td className="p-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/edit-problem/${problem._id}`);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-8 px-3 text-xs bg-red-600 hover:bg-red-700 text-white border-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(problem._id);
                            }}
                          >
                            Delete
                          </Button>
                          <Button 
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/manage-testcases/${problem._id}`);
                            }}
                          >
                            Test Cases
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;