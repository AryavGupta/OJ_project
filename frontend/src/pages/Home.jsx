import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { fetchProblems, deleteProblem } from '../redux/problemSlice';
import Navbar from '../components/Navbar';

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
          <button
            className='mb-4 px-4 py-2 bg-blue-600 text-white rounded'
            onClick={() => navigate('/add-problem')}
          >
            Add Problem
          </button>
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
                {user?.userType === 'admin' && <th className="p-2 border">Actions</th>}
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
                      <button
                        className="mr-2 px-2 py-1 bg-yellow-400 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-problem/${problem._id}`);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(problem._id);
                        }}
                      >
                        ❌ Delete
                      </button>
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
