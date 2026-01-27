import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from './context/AuthContext';
import { Activity } from 'lucide-react';

function App() {
  const { user } = useAuth();
  
  const notify = () => toast.success("Toast is working!");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
            <Activity className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">Task Management Dashboard</h1>
        </div>
        
        <p className="mb-4 text-lg">
          Current User status: <span className="font-semibold">{user ? user.email : 'Not logged in'}</span>
        </p>
        
        <div className="p-6 bg-white shadow rounded-lg mb-6">
          <p className="text-gray-600 mb-4">Tailwind CSS and Lucide Icons are ready.</p>
          <button 
            onClick={notify}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-2"
          >
            Test Toast
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
