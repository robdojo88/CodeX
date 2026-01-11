import React, { useState, useContext, useEffect } from 'react';
import { ProgressContext } from './ProgressContext';

export default function CodeChecker({
    title,
    description,
    funcName,
    tests,
    problemId,
}) {
    const { updateProgress } = useContext(ProgressContext);

    // 🔹 Load code per problem from localStorage
    const [code, setCode] = useState(() => {
        return (
            localStorage.getItem(`code_${problemId}`) ||
            `// Write your solution here\nfunction ${funcName}() {\n    \n}`
        );
    });

    const [consoleOutput, setConsoleOutput] = useState('');
    const [testResults, setTestResults] = useState('');

    // 🔹 Reload code on problem change
    useEffect(() => {
        setCode(
            localStorage.getItem(`code_${problemId}`) ||
                `// Write your solution here\nfunction ${funcName}() {\n    \n}`
        );
        setConsoleOutput('');
        setTestResults('');
    }, [problemId, funcName]);

    const runCode = () => {
        localStorage.setItem(`code_${problemId}`, code);

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

                <textarea
                    className='w-full border rounded p-2 mt-5 font-mono'
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={9}
                />

                <button
                    className='bg-blue-600 text-white px-4 py-2 rounded mb-4 hover:bg-blue-700 cursor-pointer'
                    onClick={runCode}
                >
                    Run
                </button>
            </div>
            <div className='w-3/12'>
                <h3 className='font-semibold mb-1'>Console Output</h3>
                <div className='bg-black  text-green-400 h-150 rounded overflow-y-scroll p-5'>
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
    );
}
