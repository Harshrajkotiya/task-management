import React from 'react';

const PageHeader = ({ title, subtitle }) => {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{title}</h2>
            {subtitle && <span className="text-gray-400 text-sm font-light">{subtitle}</span>}
        </div>
    );
};

export default PageHeader;
