import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CodeChecker from './CodeChecker';
import { problems } from './problems'; // 👈 THIS was missing
import { ProgressContext } from './ProgressContext';

import './App.css';

export default function App() {
    // const { totalScore } = useContext(ProgressContext);
    const { progress, totalScore } = useContext(ProgressContext);

    const [name, setName] = useState('');
    const [nameSet, setNameSet] = useState(false);

    useEffect(() => {
        const savedName = localStorage.getItem('username');
        if (savedName) {
            setName(savedName);
            setNameSet(true);
        }
    }, []);

    const handleSetName = () => {
        if (!name.trim()) return;
        localStorage.setItem('username', name);
        setNameSet(true);
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
                        Make sure this is your real name—it can’t be changed.
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

    // 🔹 Main app
    return (
        <Router>
            <div className='h-lvh overflow-hidden'>
                <header className='mb-6 px-28 pt-5 '>
                    <h1 className='text-3xl font-bold text-gray-800'>
                        2553 Programming Midterm Practical Exam
                    </h1>

                    <div className='flex justify-between items-center mt-2'>
                        <p className='text-gray-700'>
                            Hello, <b>{name}</b>!
                        </p>
                        {/* <button
                        onClick={handleResetName}
                        className='text-sm text-blue-600 hover:underline'
                    >
                        Edit Name
                    </button> */}
                        <p className='text-gray-800 font-bold'>
                            Total Progress Score: {totalScore} /{' '}
                            {problems.length}
                        </p>
                    </div>
                </header>
                <div className='min-h-screen bg-gray-50 p-3 font-mono flex'>
                    <div className=''>
                        <nav className=' gap-3 py-2 h-175 px-2'>
                            {problems.map((p) => {
                                const status = progress[p.id] || 0; // 0 = not attempted, 1 = passed, -1 = wrong
                                let bgColor = 'bg-blue-500 hover:bg-blue-600';
                                if (status === 1)
                                    bgColor = 'bg-green-500 hover:bg-green-600';
                                else if (status === -1)
                                    bgColor = 'bg-red-300 hover:bg-red-400';

                                return (
                                    <Link
                                        key={p.id}
                                        to={`/${p.id}`}
                                        className={`${bgColor} block my-2 text-white px-4 py-1 rounded-lg font-medium transition-colors duration-200  whitespace-nowrap shadow-md hover:shadow-lg`}
                                    >
                                        {p.title}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className='w-12/12 '>
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
                                        <p className='text-gray-600'>
                                            Select a problem above.
                                        </p>
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
