import { useState, useEffect } from 'react';
import Input from './common/Input';
import Button from './common/Button';
import taskService from '../services/taskService';
import { toast } from 'react-toastify';
import { ChevronDown } from 'lucide-react';

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

  if (isStatusOnly) {
    return (
      <form onSubmit={handleSubmit} className="space-y-10 mt-4">
        <div className="bg-orange-50/50 p-6 rounded-3xl flex justify-between items-center mb-8 border border-orange-100">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Status
            </span>
            <span className="text-lg font-bold text-orange-400 ">
              {formData.status}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="text-xs font-bold text-gray-400 block mb-2 uppercase tracking-widest">
              Task Title
            </span>
            <p className="font-bold text-gray-900">{formData.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <span className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-widest">
                Assigned To
              </span>
              <p className="font-bold text-gray-900">
                {users.find((u) => u.id === formData.assignedTo)?.username ||
                  'User'}
              </p>
            </div>
            <div>
              <span className="text-xs font-bold text-gray-400 block mb-1 uppercase tracking-widest">
                Task ID
              </span>
              <p className="font-bold text-gray-400">
                #TSK{initialData?.id?.substring(0, 6).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-900">
            Update status
          </label>
          <div className="relative group">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-2xl bg-[#F0F2F5] border-transparent focus:bg-white focus:border-[#5D5CDE] transition-all appearance-none font-bold text-gray-700 outline-none"
              required
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <p className="text-[11px] text-gray-400 font-medium">
            Changing the status will update it for the assigned user.
          </p>
        </div>

        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="secondary"
            className="flex-1 bg-gray-100 py-4 hover:bg-gray-200 text-gray-900"
            onClick={() => window.location.reload()}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-[#5D5CDE] py-4">
            Save Changes
          </Button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mt-3">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900 px-1">
          Task title
        </label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter the task title"
          className="w-full px-3 py-2 rounded-2xl bg-[#F0F2F5] border-transparent focus:bg-white focus:border-[#5D5CDE] transition-all font-medium text-gray-700 outline-none placeholder:text-gray-300 border focus:shadow-sm"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900 px-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 rounded-2xl bg-[#F0F2F5] border-transparent focus:bg-white focus:border-[#5D5CDE] transition-all font-medium text-gray-700 outline-none placeholder:text-gray-300 border focus:shadow-sm resize-none"
          placeholder="Briefly describe what needs to be done"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-900 px-1">
          Assigned User Dropdown
        </label>
        <div className="relative group">
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-2xl bg-[#F0F2F5] border-transparent focus:bg-white focus:border-[#5D5CDE] transition-all appearance-none text-gray-400 group-focus-within:text-gray-700 outline-none border focus:shadow-sm"
            required
          >
            <option value="">Assign to</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="gray"
          onClick={() => window.location.reload()}
        >
          Cancel
        </Button>
        <Button type="submit" variant="blue">
          {initialData ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
