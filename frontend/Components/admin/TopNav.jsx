import React from 'react';

const TopNav = () => {
    return (
        <div className="fixed top-0 left-64 right-0 bg-white shadow-md z-10">
            <div className="flex justify-between items-center px-6 py-4">
                <h1 className="text-xl font-semibold text-gray-800">
                    Welcome, Admin 👋
                </h1>
                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <span className="text-xl">🔔</span>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <span className="text-xl">👤</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TopNav;