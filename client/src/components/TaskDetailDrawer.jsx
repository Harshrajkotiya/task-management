import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';
import Button from './common/Button';

const TaskDetailDrawer = ({ task, users, onClose, onUpdateStatus, onEdit, onDelete, isAdmin, currentUser }) => {
  if (!task) return null;

  const isOwner = task.createdBy === currentUser?.id;
  const isAssigned = task.assignedTo === currentUser?.id;
  const canModifyAll = isAdmin || isOwner;
  const canUpdateStatus = isAdmin || isAssigned || isOwner;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-orange-500 bg-orange-50';
      case 'In Progress': return 'text-[#5D5CDE] bg-indigo-50';
      case 'Completed': return 'text-emerald-500 bg-emerald-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  const createdDate = task.createdAt?.seconds 
    ? new Date(task.createdAt.seconds * 1000).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Unknown';

  return (
    <div className="bg-white h-full flex flex-col p-8 border-l border-gray-100 shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors font-bold text-gray-400">✕</button>
      </div>

      <div className={`p-6 rounded-3xl mb-8 flex justify-between items-center ${getStatusColor(task.status)} border border-transparent`}>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 block mb-1">Status</span>
          <span className="text-lg font-bold">{task.status}</span>
        </div>
        {canUpdateStatus && (
          <Button 
            variant="outline" 
            className="!w-auto bg-white !py-2 !px-4 text-xs font-bold border-white/50 hover:bg-white/80"
            onClick={onUpdateStatus}
          >
            Update status
          </Button>
        )}
      </div>

      <div className="space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Task Title</span>
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{task.title}</h3>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Assigned To</span>
            <p className="font-bold text-gray-900">{users[task.assignedTo] || 'User'}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Task ID</span>
            <p className="font-bold text-gray-400">#TSK{task.id?.substring(0, 6).toUpperCase()}</p>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Description</span>
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-6">Activity History</span>
          <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100 before:border-l before:border-dashed">
            <div className="relative">
              <div className="absolute -left-[24px] top-1 w-3 h-3 rounded-full bg-gray-900 border-2 border-white"></div>
              <p className="text-xs font-bold text-gray-900 mb-1">Task created by {users[task.createdBy] || 'Admin'}</p>
              <p className="text-[10px] text-gray-400">{createdDate}</p>
            </div>
            <div className="relative opacity-40">
              <div className="absolute -left-[24px] top-1 w-3 h-3 rounded-full border-2 border-gray-400 bg-white"></div>
              <p className="text-xs font-bold text-gray-400">Task started</p>
            </div>
          </div>
        </div>
      </div>

      {(canModifyAll) && (
        <div className="flex gap-4 pt-8 border-t border-gray-50 mt-auto">
          <Button variant="secondary" className="bg-gray-50 hover:bg-gray-100 text-gray-900" onClick={onDelete}>
            Delete
          </Button>
          <Button onClick={onEdit}>
            Edit Task
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskDetailDrawer;
