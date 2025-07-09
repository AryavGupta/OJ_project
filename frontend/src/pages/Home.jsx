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

  return (
    <div className="min-h-screen bg-muted text-foreground">
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
          <p>Loading...</p>
        ) : problems.length === 0 ? (
          <p>No problems found.</p>
        ) : (
          <table className='w-full border'>
            <thead>
              <tr className='bg-gray-100'>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Difficulty</th>
                <th className="p-2 border">Tags</th>
                {user?.userType === 'admin' && <th className="p-2 border w-64">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr
                  key={problem._id}
                  className="hover:bg-muted cursor-pointer transition duration-200"
                  onClick={() => navigate(`/problem/${problem._id}`)}
                >
                  <td className="p-2 border text-blue-600 flex items-center gap-2">
                    <span>📘</span> {problem.title}
                  </td>
                  <td className='p-2 border'>{problem.difficulty}</td>
                  <td className='p-2 border'>{problem.tags?.join(', ')}</td>

                  {user?.userType === 'admin' && (
                    <td className="p-2 border">
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
                          className="h-8 px-3 text-xs shadow-red-500/50 shadow-md border border-red-600"
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
        )}
      </div>
    </div>
  );
}

export default Home;