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

    const [cheatAttempts, setCheatAttempts] = useState(() => {
        // Load cheat attempts from localStorage
        const saved = localStorage.getItem('cheatAttempts');
        return saved ? JSON.parse(saved) : {};
    });

    // Save to localStorage whenever progress changes
    useEffect(() => {
        localStorage.setItem('progress', JSON.stringify(progress));
    }, [progress]);

    // Save cheat attempts to localStorage
    useEffect(() => {
        localStorage.setItem('cheatAttempts', JSON.stringify(cheatAttempts));
    }, [cheatAttempts]);

    // Update progress for a problem
    const updateProgress = (problemId, score) => {
        setProgress((prev) => ({ ...prev, [problemId]: score }));
    };

    // Record cheat attempt for a problem
    const recordCheatAttempt = (problemId) => {
        setCheatAttempts((prev) => ({
            ...prev,
            [problemId]: (prev[problemId] || 0) + 1,
        }));
    };

    // Get cheat attempts for a problem
    const getCheatAttempts = (problemId) => {
        return cheatAttempts[problemId] || 0;
    };

    // Get total cheat attempts across all problems
    const totalCheatAttempts = Object.values(cheatAttempts).reduce(
        (a, b) => a + b,
        0
    );

    // Total score
    const totalScore = Object.values(progress).filter((v) => v === 1).length;

    return (
        <ProgressContext.Provider
            value={{
                progress,
                updateProgress,
                totalScore,
                recordCheatAttempt,
                getCheatAttempts,
                totalCheatAttempts,
                cheatAttempts,
            }}
        >
            {children}
        </ProgressContext.Provider>
    );
};
