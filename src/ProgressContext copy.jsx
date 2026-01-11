import React, { createContext, useState, useEffect } from 'react';

// Create context
export const ProgressContext = createContext();

// Provider
export const ProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState(() => {
        // Load from localStorage if exists
        const saved = localStorage.getItem('progress');
        return saved ? JSON.parse(saved) : {};
    });

    // Save to localStorage whenever progress changes
    useEffect(() => {
        localStorage.setItem('progress', JSON.stringify(progress));
    }, [progress]);

    // Update progress for a problem
    const updateProgress = (problemId, score) => {
        setProgress((prev) => ({ ...prev, [problemId]: score }));
    };

    // Total score
    const totalScore = Object.values(progress).reduce((a, b) => a + b, 0);

    return (
        <ProgressContext.Provider
            value={{ progress, updateProgress, totalScore }}
        >
            {children}
        </ProgressContext.Provider>
    );
};
