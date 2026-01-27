import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const DeleteModal = ({ isOpen, onClose, onConfirm, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-10 text-center">
          <div className="flex justify-end mb-4 absolute top-6 right-6">
            <button
              onClick={onClose}
              className="p-0.5 rounded-full bg-black text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4 mt-8">
            Delete this task?
          </h2>
          <p className="text-gray-400 text-sm mb-10 px-10">
            This action cannot be undone. The task will be permanently removed.
          </p>

          <div className="flex gap-4">
            <Button variant="gray" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete Task'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
