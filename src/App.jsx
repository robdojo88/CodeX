import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CodeChecker from './CodeChecker';
import { problems } from './problems';
import { ProgressContext } from './ProgressContext';
import { supabase } from './supabaseClient';
import './App.css';

export default function App() {
    const {
        progress,
        totalScore,
        cheatAttempts,
        totalCheatAttempts,
        loadStudentData,
        loading,
    } = useContext(ProgressContext);

    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [authLoading, setAuthLoading] = useState(true);
    const [examStartTime, setExamStartTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const EXAM_DURATION = 180; // minutes

    // Check authentication state on mount
    useEffect(() => {
        checkUser();

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                handleAuthenticatedUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const checkUser = async () => {
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                await handleAuthenticatedUser(session.user);
            }
        } catch (error) {
            console.error('Error checking user:', error);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleAuthenticatedUser = async (user) => {
        // Get name from Google account
        const fullName =
            user.user_metadata?.full_name || user.email.split('@')[0];
        setName(fullName);
        // console.log(user.user_metadata?.avatar_url);
        // Check if student record exists
        const { data: existingStudent } = await supabase
            .from('students')
            .select('*')
            .eq('email', user.email)
            .single();

        if (!existingStudent) {
            // Create new student record
            const startTime = Date.now();
            await supabase.from('students').insert({
                email: user.email,
                name: fullName,
                exam_start_time: startTime,
            });
            setExamStartTime(startTime);
        } else {
            setExamStartTime(existingStudent.exam_start_time);
        }

        // Load student data
        await loadStudentData(user.email);
    };

    const signInWithGoogle = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                },
            });

            if (error) throw error;
        } catch (error) {
            console.error('Error signing in with Google:', error);
            alert('Failed to sign in with Google. Please try again.');
        }
    };

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            setUser(null);
            setName('');
            window.location.reload();
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    useEffect(() => {
        if (!examStartTime) return;

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - examStartTime) / 1000);
            setElapsedTime(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [examStartTime]);

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const remainingSeconds =
        EXAM_DURATION > 0 ? EXAM_DURATION * 60 - elapsedTime : null;
    const isTimeUp = remainingSeconds !== null && remainingSeconds <= 0;

    const exportResults = async () => {
        const { data: progressData } = await supabase
            .from('progress')
            .select('*')
            .eq('student_email', user.email);

        const exportData = {
            studentName: name,
            studentEmail: user.email,
            examDate: new Date().toISOString(),
            timeSpent: formatTime(elapsedTime),
            totalScore: totalScore,
            maxScore: problems.length,
            cheatAttempts: totalCheatAttempts,
            problems: problems.map((p) => {
                const problemData = progressData?.find(
                    (pd) => pd.problem_id === p.id
                );
                return {
                    id: p.id,
                    title: p.title,
                    status:
                        progress[p.id] === 1
                            ? 'Passed'
                            : progress[p.id] === -1
                            ? 'Failed'
                            : 'Not Attempted',
                    cheats: cheatAttempts[p.id] || 0,
                    code: problemData?.code || 'No code submitted',
                };
            }),
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

    // Loading state
    if (authLoading || (loading && user)) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-100'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading...</p>
                </div>
            </div>
        );
    }

    // Not signed in - Show Google login
    if (!user) {
        return (
            <div className='min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6'>
                <div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md text-center'>
                    <img
                        className='mx-auto'
                        src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRjuHVzoL7ReFJKDmJDoqDO1wMGGPaEQZGNQ&s'
                        alt=''
                    />
                    <h1 className='text-2xl font-bold mb-4 text-gray-800'>
                        Welcome 2553 Students!
                    </h1>
                    <p className='mb-4 text-gray-600'>
                        Sign in with your Google account to start the exam.
                    </p>
                    <p className='mb-6 text-red-500 font-semibold'>
                        Friendly reminder, cheaters go to hell!
                    </p>

                    <button
                        onClick={signInWithGoogle}
                        className='bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-3 w-full font-medium shadow-sm'
                    >
                        <svg className='w-5 h-5' viewBox='0 0 24 24'>
                            <path
                                fill='#4285F4'
                                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                            />
                            <path
                                fill='#34A853'
                                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                            />
                            <path
                                fill='#FBBC05'
                                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                            />
                            <path
                                fill='#EA4335'
                                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                            />
                        </svg>
                        Sign in with Google
                    </button>

                    <p className='mt-4 text-xs text-gray-500'>
                        Please use your school Google account
                    </p>
                </div>
            </div>
        );
    }

    // Time's up screen
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
                        onClick={signOut}
                        className='text-sm text-blue-600 hover:underline'
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        );
    }

    // Main exam app
    return (
        <Router>
            <div className='h-lvh overflow-y-scroll'>
                <header className='mb-6 px-28 pt-5 flex justify-between'>
                    <div className='space-y-3'>
                        <h1 className='text-3xl font-bold text-gray-800'>
                            2553 Programming Midterm Practical Exam
                        </h1>
                        <div className='flex gap-4 items-center'>
                            <p className='text-gray-700 flex items-center'>
                                <img
                                    className='mr-4 rounded-full h-14'
                                    src={user.user_metadata?.avatar_url}
                                    alt='Profile'
                                />{' '}
                                Hello, &nbsp; <b> {name}</b>!
                            </p>
                            <div
                                className={`font-mono font-extrabold text-2xl ${
                                    remainingSeconds !== null &&
                                    remainingSeconds < 300
                                        ? 'text-red-600 animate-pulse'
                                        : 'text-blue-500'
                                }`}
                            >
                                ⌛{' '}
                                {remainingSeconds !== null
                                    ? `Time Left: ${formatTime(
                                          remainingSeconds
                                      )}`
                                    : `Time: ${formatTime(elapsedTime)}`}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mt-2'>
                        <div className='flex gap-4 items-center'>
                            <div className='mt-4 px-2'>
                                <div className='bg-white rounded-lg p-3 text-[16px] space-x-3 flex '>
                                    {/* <p className='font-bold mb-1'>Progress</p> */}
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
                            <div className='space-x-3'>
                                <p className='text-gray-800 font-bold'>
                                    Score: {totalScore} / {problems.length}
                                </p>
                                {totalCheatAttempts > 0 && (
                                    <p className='text-red-600 font-bold'>
                                        🚨 Cheats: {totalCheatAttempts}
                                    </p>
                                )}
                                <button
                                    onClick={exportResults}
                                    className='bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700'
                                    title='Export your results'
                                >
                                    📥 Export
                                </button>
                                <button
                                    onClick={signOut}
                                    className='bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700'
                                    title='Sign out'
                                >
                                    🚪 Sign Out
                                </button>
                            </div>
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
                                        {cheats > 0 && (
                                            <span className='ml-2 bg-red-700 text-white text-xs px-2 py-0.5 rounded-full'>
                                                🚨 {cheats}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
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
