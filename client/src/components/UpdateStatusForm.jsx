import React, { useState } from 'react';
import Button from './common/Button';
import Select from './common/Select';

const UpdateStatusForm = ({ task, users, onSubmit, onCancel }) => {
  const [status, setStatus] = useState(task?.status || 'Pending');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ ...task, status });
    setLoading(false);
  };

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case 'Pending':
        return 'bg-orange-50 text-orange-600';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600';
      case 'Completed':
        return 'bg-green-50 text-green-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Banner */}
      <div
        className={`p-3 rounded-2xl flex justify-between items-center ${getStatusColor(task?.status)}`}
      >
        <div>
          <span className="text-sm font-semibold opacity-70 text-black">
            Status
          </span>
        </div>
        <p className="text-base font-bold">{task?.status}</p>
      </div>

      {/* Read-only Details */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-normal text-[#9CA3AF] mb-1">
            Task Title
          </label>
          <p className="text-base font-bold text-black">{task?.title}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-normal text-[#9CA3AF] mb-1">
              Assigned To
            </label>
            <p className="text-base font-bold text-black">
              {users[task?.assignedTo] || 'User'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-normal text-[#9CA3AF] mb-1">
              Task ID
            </label>
            <p className="text-base font-bold text-black">
              #TSK{task?.id?.substring(0, 6).toUpperCase()}
            </p>
          </div>
        </div>
      </div>

      <hr className="border-[#E6E6E6]" />

      {/* Update Status Input */}
      <div>
        <label className="block text-sm font-bold text-black mb-2">
          Update status
        </label>
        <Select
          value={status}
          onChange={(val) => setStatus(val)}
          options={[
            { value: 'Pending', label: 'Pending' },
            { value: 'In Progress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' },
          ]}
        />
        <p className="text-xs text-gray-400 mt-2">
          Changing the status will update it for the assigned user.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" onClick={onCancel} variant="gray">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} variant="blue">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default UpdateStatusForm;
