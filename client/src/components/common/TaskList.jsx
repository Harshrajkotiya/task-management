import React, { useState } from 'react';
import Button from './Button';
import Table from './Table';
import Badge from './Badge';

const TaskList = ({
    tasks,
    users,
    isAdmin,
    onCreate,
    onView,
    onUpdateStatus
}) => {
    const [filter, setFilter] = useState('All');

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'All') return true;
        return task.status === filter;
    });

    const columns = [
        {
            header: 'Task ID',
            accessor: (task) => `#TSK${task.id?.substring(0, 6).toUpperCase()}`,
            cellClassName: 'font-bold text-[14px]',
        },
        {
            header: 'Task Title',
            accessor: 'title',
            cellClassName: 'font-bold text-gray-900 text-[14px]',
        },
        // Admin sees who it is assigned TO
        ...(isAdmin
            ? [
                {
                    header: 'Assigned To',
                    accessor: (task) => users[task.assignedTo] || 'User',
                    cellClassName: 'font-bold text-gray-700 text-[14px]',
                },
            ]
            : // User sees who assigned it BY (or if self-assigned, etc. Usually "Assigned By" or "Created By")
            // The original Code in Dashboard for non-admin had "Assigned By" mapped to createdBy
            [
                {
                    header: 'Assigned By',
                    accessor: (task) => users[task.createdBy] || 'Admin',
                    cellClassName: 'font-bold text-gray-600',
                },
            ]),
        {
            header: 'Status',
            accessor: (task) => <Badge variant={task.status} />,
        },
        {
            header: 'Created On',
            accessor: (task) =>
                task.createdAt?.seconds
                    ? new Date(task.createdAt.seconds * 1000).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })
                    : '---',
            cellClassName: 'font-bold text-gray-400 text-[13px]',
        },
        {
            header: 'Actions',
            className: 'text-center',
            cellClassName: 'text-center',
            accessor: (task) => (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="gray"
                        onClick={() => onView(task)}
                        className="!w-auto !px-5 !py-2 text-sm"
                    >
                        View
                    </Button>
                    {!isAdmin && onUpdateStatus && (
                        <Button
                            variant="blue"
                            onClick={() => onUpdateStatus(task)}
                            className="!w-auto !px-4 !py-2 rounded-xl text-xs !font-normal"
                        >
                            Update Status
                        </Button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex justify-between items-end mb-6">
                <div className="flex items-center gap-3">
                    {['All', 'Pending', 'In Progress', 'Completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`px-4 py-1.5 cursor-pointer rounded-xl text-sm transition-all border ${filter === tab
                                ? 'bg-white text-[#5856D6] border-2 border-[#5856D6]'
                                : 'text-[#9CA3AF] border-[#E6E6E6] hover:text-[#9CA3AF] opacity-50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                {isAdmin && onCreate && (
                    <Button
                        variant="blue"
                        onClick={onCreate}
                        className="!w-auto !px-5 !py-2 rounded-xl text-sm !font-normal"
                    >
                        Create Task
                    </Button>
                )}
            </div>

            <Table columns={columns} data={filteredTasks} emptyMessage="No tasks found." />
        </div>
    );
};

export default TaskList;
