/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';

const ModalBox = ({ show, handleClose, fileContent }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-auto">
                <div className="flex justify-between items-center border-b border-gray-200 p-4">
                    <h2 className="text-xl font-semibold">Make Sure your file is same as example</h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={handleClose}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
                <div
                    className="p-4 max-h-96 overflow-y-auto"
                >
                    <pre className="whitespace-pre-wrap">{fileContent}</pre>
                </div>
                <div className="flex justify-end border-t border-gray-200 p-4">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalBox;
