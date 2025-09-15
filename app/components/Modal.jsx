"use client";
import React from "react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-3xl" }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative w-full ${maxWidth} bg-surface rounded-2xl border border-separator shadow-apple-light overflow-hidden`}> 
                <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-separator bg-surface-secondary">
                    <h3 className="text-primary text-base sm:text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-secondary hover:text-primary transition-colors px-2 py-1 rounded-md focus-apple" aria-label="Close">
                        ✕
                    </button>
                </div>
                <div className="max-h-[70vh] overflow-y-auto p-4 sm:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;


