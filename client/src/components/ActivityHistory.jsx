import React from 'react';

const ActivityHistory = ({ history = [], users = {} }) => {
  const formatDate = (dateValue) => {
    if (!dateValue) return '---';

    let date;
    // Handle Firestore timestamp {seconds: ..., nanoseconds: ...} or {_seconds: ..., _nanoseconds: ...}
    const seconds = dateValue?.seconds || dateValue?._seconds;
    if (seconds) {
      date = new Date(seconds * 1000);
    }
    // Handle string or numeric timestamp
    else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
      date = new Date(dateValue);
    }
    // Handle Date object
    else if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      return '---';
    }

    if (isNaN(date.getTime())) return '---';

    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 mt-4">
      <span className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest block mb-2">
        Activity History
      </span>
      <div className="relative pl-6 space-y-8">
        {/* Vertical Line */}
        {history.length > 1 && (
          <div className="absolute left-[7px] top-2 bottom-2 w-[1.5px] bg-[#E6E6E6] border-l border-dashed"></div>
        )}

        {history.length > 0 ? (
          history.map((item, index) => {
            const isLast = index === history.length - 1;

            // Handle both action/timestamp and status_change/updatedAt structures
            const activityDate = item.timestamp || item.updatedAt;
            const formattedDate = formatDate(activityDate);

            let displayAction = item.action;
            if (!displayAction && item.type === 'status_change') {
              displayAction = `Status updated to ${item.status} (from ${item.previousStatus || 'Pending'})`;
            } else if (!displayAction && item.status) {
              displayAction = `Status updated to ${item.status}`;
            }

            return (
              <div key={index} className="relative group">
                {/* Connector Dot */}
                <div
                  className={`absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${isLast ? 'bg-black' : 'bg-[#9CA3AF]'}`}
                ></div>

                <p
                  className={`text-[13px] font-bold mb-0.5 ${isLast ? 'text-gray-900' : 'text-[#9CA3AF]'}`}
                >
                  {displayAction || 'Activity recorded'}
                </p>
                <p className="text-[10px] text-[#9CA3AF]">{formattedDate}</p>
              </div>
            );
          })
        ) : (
          <div className="relative">
            <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-[#9CA3AF]"></div>
            <p className="text-[13px] font-bold text-[#9CA3AF]">
              No activity recorded
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityHistory;
