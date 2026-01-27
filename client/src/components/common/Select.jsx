import React, { useState, useRef, useEffect } from 'react';

const Select = ({ value, onChange, options = [], className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={`relative ${className}`} ref={selectRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 text-gray-900 font-bold bg-white focus:outline-none flex justify-between items-center transition-all hover:border-[#5D5CDE]"
            >
                <span>{selectedOption ? selectedOption.label : 'Select...'}</span>
                <svg
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-fade-in-up">
                    <ul className="max-h-60 overflow-auto custom-scrollbar">
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={`px-4 py-3 text-sm font-bold cursor-pointer transition-colors ${value === option.value
                                    ? 'bg-[#5D5CDE]/10 text-[#5D5CDE]'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#5D5CDE]'
                                    }`}
                            >
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Select;
