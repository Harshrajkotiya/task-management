import { X } from 'lucide-react';
import Button from './common/Button';
import ActivityHistory from './ActivityHistory';

const TaskDetailPanel = ({
  task,
  users,
  onClose,
  onUpdateStatus,
  onEdit,
  onDelete,
  isAdmin,
  currentUser,
}) => {
  if (!task) return null;

  const isOwner = task.createdBy === currentUser?.id;
  const isAssigned = task.assignedTo === currentUser?.id;
  const canModifyAll = isAdmin || isOwner;
  const canUpdateStatus = isAdmin || isAssigned || isOwner;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'text-[#F59E0B] bg-[#FFFBEB]';
      case 'In Progress':
        return 'text-[#5856D6] bg-[#F5F3FF]';
      case 'Completed':
        return 'text-[#10B981] bg-[#ECFDF5]';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const createdDate = task.createdAt?.seconds
    ? new Date(task.createdAt.seconds * 1000).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unknown';

  return (
    <div className="bg-white border border-[#E6E6E6] rounded-2xl p-5 flex flex-col h-96 overflow-y-auto sticky top-4 animate-in fade-in duration-500 ">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
        <button
          onClick={onClose}
          className="p-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div
        className={`p-2 rounded-2xl mb-4 ${getStatusColor(task.status)} flex justify-between items-center border border-transparent`}
      >
        <div>
          <span className="text-[10px] font-bold opacity-60 block mb-1 uppercase tracking-widest">
            Status
          </span>
          <span className="text-lg font-bold">{task.status}</span>
        </div>
        {canUpdateStatus && (
          <button
            className="px-4 py-2 rounded-xl bg-white/50 border border-white hover:bg-white/80 transition-all font-bold text-xs text-black shadow-sm"
            onClick={onUpdateStatus}
          >
            Update status
          </button>
        )}
      </div>

      <div className="space-y-8 flex-1">
        <div>
          <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest block mb-2">
            Task Title
          </span>
          <h3 className="text-[16px] font-bold text-gray-900 leading-snug">
            {task.title}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest block mb-1">
              Assigned To
            </span>
            <p className="text-[14px] font-bold text-gray-900">
              {users[task.assignedTo] || 'User'}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest block mb-1">
              Task ID
            </span>
            <p className="text-[14px] font-bold text-[#9CA3AF]">
              #TSK{task.id?.substring(0, 6).toUpperCase()}
            </p>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest block mb-2">
            Description
          </span>
          <p className="text-[13px] text-gray-600 leading-relaxed font-medium">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        <ActivityHistory history={task.history} users={users} />
      </div>

      {canModifyAll && (
        <div className="flex gap-4 mt-10 pt-6 border-t border-[#F3F4F6]">
          <Button variant="gray" className="!w-auto flex-1" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="blue" className="!w-auto flex-1" onClick={onEdit}>
            Edit Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailPanel;
