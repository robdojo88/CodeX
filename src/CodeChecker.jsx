import React, { useState, useContext, useEffect, useRef } from 'react';
import { ProgressContext } from './ProgressContext';

export default function CodeChecker({
    title,
    description,
    funcName,
    tests,
    problemId,
}) {
    const { updateProgress, recordCheatAttempt, getCheatAttempts } =
        useContext(ProgressContext);

    // 🔹 Load code per problem from localStorage
    const [code, setCode] = useState(() => {
        return (
            localStorage.getItem(`code_${problemId}`) ||
            `// Write your solution here\nfunction ${funcName}() {\n    \n}`
        );
    });

    const [consoleOutput, setConsoleOutput] = useState('');
    const [testResults, setTestResults] = useState('');

    // 🔹 Anti-cheat states
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const textareaRef = useRef(null);

    // Get cheat count from context
    const cheatCount = getCheatAttempts(problemId);

    // Track typing patterns
    const typingTimestamps = useRef([]);
    const lastCodeLength = useRef(code.length);

    // 🔹 Reload code on problem change
    useEffect(() => {
        setCode(
            localStorage.getItem(`code_${problemId}`) ||
                `// Write your solution here\nfunction ${funcName}() {\n    \n}`
        );
        setConsoleOutput('');
        setTestResults('');
        typingTimestamps.current = [];
        lastCodeLength.current = 0;
    }, [problemId, funcName]);

    // 🔹 Detect paste events
    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');

        // Allow small pastes (like variable names)
        if (pastedText.length > 50) {
            e.preventDefault();
            setWarningMessage(
                '⚠️ CHEATING DETECTED: Large paste blocked! Type your code yourself.'
            );
            setShowWarning(true);
            recordCheatAttempt(problemId);

            // Log the attempt
            console.warn(
                `Paste attempt blocked: ${pastedText.length} characters`
            );

            setTimeout(() => setShowWarning(false), 5000);
        }
    };

    // 🔹 Detect copy events (trying to copy problem description or tests)
    const handleCopy = (e) => {
        const selectedText = window.getSelection().toString();

        if (selectedText.length > 100) {
            setWarningMessage(
                '⚠️ WARNING: Copying large amounts of text detected. Are you trying to cheat?'
            );
            setShowWarning(true);
            recordCheatAttempt(problemId);

            setTimeout(() => setShowWarning(false), 4000);
        }
    };

    // 🔹 Detect suspiciously fast typing (likely pasted despite prevention)
    const handleCodeChange = (e) => {
        const newCode = e.target.value;
        const currentTime = Date.now();
        const lengthDiff = Math.abs(newCode.length - lastCodeLength.current);

        // If more than 30 characters added in one change
        if (lengthDiff > 30) {
            typingTimestamps.current.push({
                time: currentTime,
                chars: lengthDiff,
            });

            // Check if too many chars added too quickly
            const recentTyping = typingTimestamps.current.filter(
                (t) => currentTime - t.time < 2000
            );
            const totalChars = recentTyping.reduce(
                (sum, t) => sum + t.chars,
                0
            );

            if (totalChars > 100) {
                setWarningMessage(
                    '🚨 SUSPICIOUS ACTIVITY: Typing too fast! This looks like cheating.'
                );
                setShowWarning(true);
                recordCheatAttempt(problemId);

                setTimeout(() => setShowWarning(false), 5000);
            }
        }

        lastCodeLength.current = newCode.length;
        setCode(newCode);
    };

    // 🔹 Detect when user leaves the tab (might be using ChatGPT)
    useEffect(() => {
        let tabSwitchCount = 0;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                tabSwitchCount++;

                if (tabSwitchCount > 3) {
                    setWarningMessage(
                        '👀 NOTICE: Frequent tab switching detected. Stay focused on your work!'
                    );
                    setShowWarning(true);

                    setTimeout(() => setShowWarning(false), 4000);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
        };
    }, []);

    // 🔹 Prevent right-click context menu in textarea
    const handleContextMenu = (e) => {
        e.preventDefault();
        setWarningMessage('⚠️ Right-click disabled. Type your code manually!');
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 3000);
    };

    const runCode = () => {
        localStorage.setItem(`code_${problemId}`, code);

        // Log cheat attempts with the submission
        if (cheatCount > 0) {
            console.warn(
                `Student had ${cheatCount} cheat attempt(s) on ${problemId}`
            );
        }

        const results = [];
        let passed = 0;
        const consoleLogs = [];

        tests.forEach((t, i) => {
            const tempLogs = [];
            const fakeConsole = {
                log: (...args) => tempLogs.push(args.join(' ')),
            };

            let actual;
            let testPassed = false;

            try {
                // Run user function
                const runner = new Function(
                    'console',
                    `${code}; return ${funcName};`
                );
                const func = runner(fakeConsole);

                actual = func(...t.input);

                // Check if console output exists
                const actualStr = tempLogs.join(' ');
                const expectedStr = Array.isArray(t.expected)
                    ? t.expected.join(' ')
                    : String(t.expected);

                // Compare arrays deeply
                const arraysEqual = (a, b) =>
                    Array.isArray(a) &&
                    Array.isArray(b) &&
                    a.length === b.length &&
                    a.every((v, idx) => v === b[idx]);

                // Determine test result
                if (tempLogs.length > 0) {
                    // Log-based problem
                    testPassed = actualStr === expectedStr;
                    actual = actualStr;
                } else if (Array.isArray(t.expected)) {
                    // Array return problem
                    testPassed = arraysEqual(actual, t.expected);
                } else {
                    // Other return values (number, string)
                    testPassed = actual === t.expected;
                }

                if (testPassed) passed++;
            } catch (err) {
                tempLogs.push('Error: ' + err.message);
                actual = 'Error';
            }

            consoleLogs.push(
                <div key={i} className='mb-1'>
                    <strong>
                        Running {funcName}(
                        {t.input.map((a) => JSON.stringify(a)).join(', ')}):
                    </strong>
                    <div className='ml-2 text-green-400'>
                        {tempLogs.join(' ')}
                    </div>
                    <div className='ml-2'>&gt; {actual}</div>
                </div>
            );

            results.push(
                <div key={i} className='mb-1'>
                    Test {i + 1}: {testPassed ? '✅ Passed' : '❌ Failed'} (
                    expected {JSON.stringify(t.expected)}, got{' '}
                    {JSON.stringify(actual)})
                </div>
            );
        });

        setConsoleOutput(consoleLogs);
        setTestResults(
            <>
                {results}
                <div className='mt-2 font-bold'>
                    Final Score: {passed}/{tests.length}
                </div>
                {cheatCount > 0 && (
                    <div className='mt-2 text-red-600 font-bold'>
                        ⚠️ Cheat attempts detected: {cheatCount}
                    </div>
                )}
            </>
        );

        // Update progress per problem
        if (passed === tests.length) {
            updateProgress(problemId, 1); // correct
        } else {
            updateProgress(problemId, -1); // wrong
        }
    };

    return (
        <div>
            {/* 🔹 Warning Modal - Fixed position at top */}
            {showWarning && (
                <div className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-bounce'>
                    <p className='text-lg font-bold'>{warningMessage}</p>
                    <p className='text-sm mt-1'>
                        Remember: Cheaters go to hell! 🔥
                    </p>
                </div>
            )}

            <div className='flex space-x-5'>
                <div className='w-6/12'>
                    <h2 className='text-xl font-bold mb-2'>{title}</h2>
                    <p className='mb-2'>{description}</p>
                    <p className='mb-2 font-mono'>
                        Function to create: <b>{funcName}()</b>
                    </p>

                    <h3 className='font-semibold mb-1'>Test Cases:</h3>
                    <div className='h-52 overflow-y-scroll border-2'>
                        <table className='table-auto border-collapse border border-gray-400 mb-4 w-full'>
                            <thead>
                                <tr className='bg-gray-200'>
                                    <th className='border border-gray-400 px-2 py-1'>
                                        #
                                    </th>
                                    <th className='border border-gray-400 px-2 py-1'>
                                        Input
                                    </th>
                                    <th className='border border-gray-400 px-2 py-1'>
                                        Expected
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {tests.map((t, i) => (
                                    <tr key={i}>
                                        <td className='border border-gray-400 px-2 py-1'>
                                            {i + 1}
                                        </td>
                                        <td className='border border-gray-400 px-2 py-1'>
                                            {JSON.stringify(t.input)}
                                        </td>
                                        <td className='border border-gray-400 px-2 py-1'>
                                            {JSON.stringify(t.expected)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 🔹 Cheat Counter Display */}
                    {cheatCount > 0 && (
                        <div className='bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2'>
                            <span className='font-bold'>
                                ⚠️ Cheat Attempts: {cheatCount}
                            </span>
                        </div>
                    )}

                    <textarea
                        ref={textareaRef}
                        className='w-full border rounded p-2 mt-5 font-mono'
                        value={code}
                        onChange={handleCodeChange}
                        onPaste={handlePaste}
                        onCopy={handleCopy}
                        onContextMenu={handleContextMenu}
                        rows={9}
                        spellCheck={false}
                    />
                    {/* <p className='text-xs text-gray-500 mt-1'>
                        ⚠️ Anti-cheat active: Copy-paste disabled for large text
                    </p> */}

                    <button
                        className='bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 cursor-pointer'
                        onClick={runCode}
                    >
                        Run
                    </button>
                </div>
                <div className='w-3/12'>
                    <h3 className='font-semibold mb-1'>Console Output</h3>
                    <div className='bg-black text-green-400 h-150 rounded overflow-y-scroll p-5'>
                        {consoleOutput}
                    </div>
                </div>
                <div className='w-3/12 h-96'>
                    <h3 className='font-semibold'>Test Results</h3>
                    <div className='bg-gray-500 h-150 rounded overflow-y-scroll p-5'>
                        {testResults}
                    </div>
                </div>
            </div>
        </div>
    );
}
