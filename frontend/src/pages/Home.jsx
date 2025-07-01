import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { fetchProblems, createProblem, deleteProblem } from '../redux/problemSlice';
import { logout } from '../redux/authSlice';
import ThemeToggle from '../components/ThemeToggle';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { problems, loading } = useSelector((state) => state.problems);

  useEffect(() => {
    dispatch(fetchProblems());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      dispatch(deleteProblem(id));
    }
  };
  console.log(user);

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Welcome to Online Judge!</h1>
        <div className='flex items-center gap-4'>

          {user && <h3 className='text-lg'>Hello, {user.username} </h3>}
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={handleLogout} >
            Logout
          </button>
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </div>
      </div>

      <h2 className='text-2xl font-semibold mb-4'>Problem List</h2>
      {user?.userType === 'admin' && (
        <button
          className='mb-4 px-4 py-2 bg-blue-600 text-white rounded'
          onClick={() => navigate('/add-problem')}
        >Add Problem
        </button>
      )}

      {loading ?
        (
          <p>Loading...</p>
        )
        : problems.length === 0 ?
          (
            <p>No problems found.</p>
          )
          : (
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
                  <tr key={problem._id} className='hover:bg-gray-50'>
                    <td className='p-2 border'>{problem.title} </td>
                    <td className='p-2 border'>{problem.difficulty} </td>
                    <td className='p-2 border'>{problem.tags?.join(', ')} </td>
                    {user?.userType === 'admin' && (
                      <td className="p-2 border">
                        <button
                          className="mr-2 px-2 py-1 bg-yellow-400 rounded"
                          onClick={() => navigate(`/edit-problem/${problem._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={() => handleDelete(problem._id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
    </div>
  );
}

export default Home;