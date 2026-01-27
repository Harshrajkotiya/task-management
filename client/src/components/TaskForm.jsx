import { useState, useEffect } from 'react';
import Input from './common/Input';
import Button from './common/Button';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';

const TaskForm = ({ onSubmit, initialData = null, isStatusOnly = false }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'Pending',
    assignedTo: initialData?.assignedTo || '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isStatusOnly) {
      fetchUsers();
    }
  }, [isStatusOnly]);

  const fetchUsers = async () => {
    try {
      const data = await taskService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users for assignment');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!isStatusOnly && (
        <>
          <Input 
            label="Task Title" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            placeholder="e.title: Team Building Event"
            required 
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#5D5CDE] transition-all duration-200 placeholder:text-gray-300 resize-none"
              placeholder="Describe the task details..."
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Assign To</label>
            <select
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#5D5CDE] transition-all duration-200 appearance-none bg-[url('https://api.iconify.design/lucide/chevron-down.svg')] bg-[length:20px] bg-[right_1rem_center] bg-no-repeat"
              required
            >
              <option value="">Select a user</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.username} ({u.role})</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">Status</label>
        <div className="grid grid-cols-3 gap-3">
          {['Pending', 'In Progress', 'Completed'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFormData({ ...formData, status: s })}
              className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                formData.status === s 
                  ? 'border-[#5D5CDE] bg-indigo-50 text-[#5D5CDE]' 
                  : 'border-gray-100 text-gray-400 hover:border-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full">
          {initialData ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
