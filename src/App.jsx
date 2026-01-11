import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CodeChecker from './CodeChecker';
import { problems } from './problems';
import { ProgressContext } from './ProgressContext';
import './App.css';

export default function App() {
    const { progress, totalScore, cheatAttempts, totalCheatAttempts } =
        useContext(ProgressContext);
    const [name, setName] = useState('');
    const [nameSet, setNameSet] = useState(false);

    // 🆕 Timer feature
    const [examStartTime, setExamStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    // 🆕 Exam duration (in minutes) - set to 0 for no limit
    const EXAM_DURATION = 180; // 90 minutes exam

    useEffect(() => {
        const savedName = localStorage.getItem('username');
        if (savedName) {
            setName(savedName);
            setNameSet(true);

            // Load or set exam start time
            const savedStartTime = localStorage.getItem('examStartTime');
            if (savedStartTime) {
                setExamStartTime(parseInt(savedStartTime));
            } else {
                const startTime = Date.now();
                localStorage.setItem('examStartTime', startTime.toString());
                setExamStartTime(startTime);
            }
        }
    }, []);

    // 🆕 Timer update
    useEffect(() => {
        if (!examStartTime) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
            setElapsedTime(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [examStartTime]);

    // 🆕 Format time display
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // 🆕 Calculate remaining time
    const remainingSeconds =
        EXAM_DURATION > 0 ? EXAM_DURATION * 60 - elapsedTime : null;
    const isTimeUp = remainingSeconds !== null && remainingSeconds <= 0;

    // 🆕 Export results function
    const exportResults = () => {
        const exportData = {
            studentName: name,
            examDate: new Date().toISOString(),
            timeSpent: formatTime(elapsedTime),
            totalScore: totalScore,
            maxScore: problems.length,
            cheatAttempts: totalCheatAttempts,
            problems: problems.map((p) => ({
                id: p.id,
                title: p.title,
                status:
                    progress[p.id] === 1
                        ? 'Passed'
                        : progress[p.id] === -1
                        ? 'Failed'
                        : 'Not Attempted',
                cheats: cheatAttempts[p.id] || 0,
                code:
                    localStorage.getItem(`code_${p.id}`) || 'No code submitted',
            })),
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${name}_exam_results_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // 🆕 Reset all progress
    const handleResetAll = () => {
        if (
            window.confirm(
                'Are you sure you want to reset ALL progress? This cannot be undone!'
            )
        ) {
            localStorage.clear();
            window.location.reload();
        }
    };

    const handleSetName = () => {
        if (!name.trim()) return;
        localStorage.setItem('username', name);
        setNameSet(true);

        // Set exam start time
        const startTime = Date.now();
        localStorage.setItem('examStartTime', startTime.toString());
        setExamStartTime(startTime);
    };

    const handleResetName = () => {
        localStorage.removeItem('username');
        setName('');
        setNameSet(false);
    };

    // 🔹 Name screen unchanged
    if (!nameSet) {
        return (
            <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6'>
                <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center'>
                    <h1 className='text-2xl font-bold mb-4 text-gray-800'>
                        Welcome 2553 Students!
                    </h1>
                    <p className='mb-2 text-gray-600'>
                        Please enter your name to start:
                    </p>
                    <p className='italic mb-4 text-gray-500'>
                        Make sure this is your real name—it can't be changed.
                    </p>
                    <p className='mb-6 text-red-500 font-semibold'>
                        Friendly reminder, cheaters go to hell!
                    </p>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='border border-gray-300 rounded px-4 py-2 w-full mb-4 font-mono'
                        placeholder='Your name here...'
                    />
                    <button
                        onClick={handleSetName}
                        className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700'
                    >
                        Start
                    </button>
                </div>
            </div>
        );
    }

    // 🆕 Time's up overlay
    if (isTimeUp) {
        return (
            <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6'>
                <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center'>
                    <h1 className='text-3xl font-bold mb-4 text-red-600'>
                        ⏰ Time's Up!
                    </h1>
                    <p className='mb-2 text-gray-700 text-lg'>
                        <b>{name}</b>, your exam time has ended.
                    </p>
                    <p className='mb-4 text-gray-600'>
                        Final Score:{' '}
                        <b>
                            {totalScore}/{problems.length}
                        </b>
                    </p>
                    {totalCheatAttempts > 0 && (
                        <p className='mb-4 text-red-600 font-bold'>
                            ⚠️ Cheat Attempts: {totalCheatAttempts}
                        </p>
                    )}
                    <button
                        onClick={exportResults}
                        className='bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 mb-3'
                    >
                        📥 Export Results
                    </button>
                    <br />
                    <button
                        onClick={handleResetAll}
                        className='text-sm text-blue-600 hover:underline'
                    >
                        Start New Exam
                    </button>
                </div>
            </div>
        );
    }

    // 🔹 Main app
    return (
        <Router>
            <div className='h-lvh overflow-hidden'>
                <header className='mb-6 px-28 pt-5'>
                    <h1 className='text-3xl font-bold text-gray-800'>
                        2553 Programming Midterm Practical Exam
                    </h1>

                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-4 items-center'>
                            <p className='text-gray-700'>
                                Hello, <b>{name}</b>!
                            </p>
                            {/* 🆕 Timer Display */}
                            <div
                                className={`font-mono font-bold ${
                                    remainingSeconds !== null &&
                                    remainingSeconds < 300
                                        ? 'text-red-600 animate-pulse'
                                        : 'text-blue-600'
                                }`}
                            >
                                ⏱️{' '}
                                {remainingSeconds !== null
                                    ? `Time Left: ${formatTime(
                                          remainingSeconds
                                      )}`
                                    : `Time: ${formatTime(elapsedTime)}`}
                            </div>
                        </div>

                        <div className='flex gap-4 items-center'>
                            <p className='text-gray-800 font-bold'>
                                Score: {totalScore} / {problems.length}
                            </p>
                            {totalCheatAttempts > 0 && (
                                <p className='text-red-600 font-bold'>
                                    🚨 Cheats: {totalCheatAttempts}
                                </p>
                            )}
                            {/* 🆕 Export Button */}
                            <button
                                onClick={exportResults}
                                className='bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700'
                                title='Export your results'
                            >
                                📥 Export
                            </button>
                        </div>
                    </div>
                </header>

                <div className='min-h-screen bg-gray-50 p-3 font-mono flex'>
                    <div>
                        <nav className='gap-3 py-2 h-175 px-2 overflow-y-auto'>
                            {problems.map((p) => {
                                const status = progress[p.id] || 0;
                                const cheats = cheatAttempts[p.id] || 0;

                                let bgColor = 'bg-blue-500 hover:bg-blue-600';
                                if (status === 1)
                                    bgColor = 'bg-green-500 hover:bg-green-600';
                                else if (status === -1)
                                    bgColor = 'bg-red-300 hover:bg-red-400';

                                return (
                                    <Link
                                        key={p.id}
                                        to={`/${p.id}`}
                                        className={`${bgColor} block my-2 text-white px-4 py-1 rounded-lg font-medium transition-colors duration-200 whitespace-nowrap shadow-md hover:shadow-lg relative`}
                                    >
                                        <span>{p.title}</span>
                                        {/* 🆕 Cheat badge */}
                                        {cheats > 0 && (
                                            <span className='ml-2 bg-red-700 text-white text-xs px-2 py-0.5 rounded-full'>
                                                🚨 {cheats}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* 🆕 Progress Summary */}
                        <div className='mt-4 px-2'>
                            <div className='bg-white rounded-lg p-3 text-xs'>
                                <p className='font-bold mb-1'>Progress</p>
                                <div className='flex justify-between mb-1'>
                                    <span className='text-green-600'>
                                        ✅ Passed:
                                    </span>
                                    <span className='font-bold'>
                                        {
                                            Object.values(progress).filter(
                                                (v) => v === 1
                                            ).length
                                        }
                                    </span>
                                </div>
                                <div className='flex justify-between mb-1'>
                                    <span className='text-red-600'>
                                        ❌ Failed:
                                    </span>
                                    <span className='font-bold'>
                                        {
                                            Object.values(progress).filter(
                                                (v) => v === -1
                                            ).length
                                        }
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-600'>
                                        ⏳ Pending:
                                    </span>
                                    <span className='font-bold'>
                                        {problems.length -
                                            Object.keys(progress).length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-12/12'>
                        <main className='bg-white shadow rounded-lg p-6 h-175'>
                            <Routes>
                                {problems.map((p) => (
                                    <Route
                                        key={p.id}
                                        path={`/${p.id}`}
                                        element={
                                            <CodeChecker
                                                {...p}
                                                problemId={p.id}
                                            />
                                        }
                                    />
                                ))}
                                <Route
                                    path='/'
                                    element={
                                        <div className='text-center py-10'>
                                            <p className='text-gray-600 text-lg mb-4'>
                                                Select a problem from the left
                                                to begin.
                                            </p>
                                            <p className='text-gray-500 text-sm'>
                                                Good luck! 🍀
                                            </p>
                                        </div>
                                    }
                                />
                            </Routes>
                        </main>
                    </div>
                </div>
            </div>
        </Router>
    );
}
