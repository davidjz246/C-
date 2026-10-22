import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  RotateCcw,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Download,
  Settings,
  Code2,
  Share2,
  FileCode,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import VSCodeExportModal from './VSCodeExportModal';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
  onRunSuccess?: () => void;
  onCompilerOutputChange?: (diagnostics: string) => void;
}

export default function CodeEditor({
  code,
  onCodeChange,
  onRunSuccess,
  onCompilerOutputChange,
}: CodeEditorProps) {
  const [output, setOutput] = useState<string>('Click "Run Code" (or press Ctrl+Enter) to compile and execute.');
  const [compilerOutput, setCompilerOutput] = useState<string>('');
  const [stdinInput, setStdinInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'stdout' | 'compiler' | 'stdin'>('stdout');
  
  // Compiler settings
  const [standard, setStandard] = useState<string>('c++20');
  const [compiler, setCompiler] = useState<string>('gcc-head');
  const [optLevel, setOptLevel] = useState<string>('-O2');
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [execEngine, setExecEngine] = useState<string>('GCC (C++20)');
  const [executionTimeMs, setExecutionTimeMs] = useState<number | null>(null);

  // VSCode Export Modal
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    setExitCode(null);
    setActiveConsoleTab('stdout');
    setOutput(`[Compiling with ${compiler} ${optLevel} -std=${standard}...]\nWaiting for execution...`);

    const startTime = performance.now();

    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          standard,
          compiler,
          stdin: stdinInput,
          flags: `${optLevel} -Wall -Wextra`,
        }),
      });

      const elapsed = Math.round(performance.now() - startTime);
      setExecutionTimeMs(elapsed);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Compilation failed');

      setExitCode(data.exitCode ?? (data.success ? 0 : 1));
      setExecEngine(data.executionEngine || `${compiler} (${standard})`);
      const compDiag = data.compilerOutput || '[No warnings or errors reported]';
      setCompilerOutput(compDiag);
      if (onCompilerOutputChange) {
        onCompilerOutputChange(compDiag + (data.stderr ? `\nErrors:\n${data.stderr}` : ''));
      }

      if (data.success) {
        setOutput(data.stdout || '[Program executed cleanly with no stdout]');
        if (onRunSuccess) onRunSuccess();
      } else {
        setOutput(
          (data.stdout ? `${data.stdout}\n` : '') +
          (data.stderr ? `[Runtime/Compile Error]:\n${data.stderr}` : '[Process terminated with non-zero exit code]')
        );
        // If there are compiler errors, switch to compiler tab automatically
        if (data.compilerOutput && !data.stdout) {
          setActiveConsoleTab('compiler');
        }
      }
    } catch (err: any) {
      setOutput(`Error connecting to compiler backend: ${err.message}`);
      setExitCode(1);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadSource = () => {
    const blob = new Blob([code], { type: 'text/x-c++src' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'main.cpp';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Top IDE Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 gap-2">
        {/* Left: Tab & Options */}
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5 text-xs font-mono bg-slate-950 text-cyan-400 px-2.5 py-1 rounded-md border border-slate-800">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>main.cpp</span>
          </div>

          {/* Standard Selector */}
          <div className="flex items-center space-x-1">
            <select
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="c++11">C++11</option>
              <option value="c++14">C++14</option>
              <option value="c++17">C++17</option>
              <option value="c++20">C++20</option>
              <option value="c++23">C++23</option>
            </select>

            {/* Compiler Selector */}
            <select
              value={compiler}
              onChange={(e) => setCompiler(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-500 font-mono hidden sm:inline-block"
            >
              <option value="gcc-head">GCC 14+</option>
              <option value="clang-head">Clang 18+</option>
            </select>

            {/* Optimization */}
            <select
              value={optLevel}
              onChange={(e) => setOptLevel(e.target.value)}
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-cyan-500 font-mono hidden md:inline-block"
            >
              <option value="-O0">-O0 (Debug)</option>
              <option value="-O2">-O2 (Fast)</option>
              <option value="-O3">-O3 (Max)</option>
            </select>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Export to VSCode Modal Trigger */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center space-x-1.5 text-xs text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 px-2.5 py-1.5 rounded-lg transition"
            title="Download full project configured for VSCode and local build"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export to VSCode</span>
          </button>

          {/* Download main.cpp */}
          <button
            onClick={handleDownloadSource}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Download main.cpp"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Run Code Button */}
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center space-x-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-3.5 py-1.5 rounded-lg transition shadow-lg shadow-emerald-900/30"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
            <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
          </button>
        </div>
      </div>

      {/* Editor & Console Split */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-hidden">
        {/* Monaco Editor Pane (7 cols on large screens) */}
        <div className="lg:col-span-7 h-full min-h-[350px] relative w-full overflow-hidden">
          <Editor
            height="100%"
            width="100%"
            defaultLanguage="cpp"
            theme="vs-dark"
            value={code}
            onChange={(val) => onCodeChange(val || '')}
            options={{
              fontSize: 13.5,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 4,
              renderLineHighlight: 'all',
              lineNumbersMinChars: 3,
            }}
          />
        </div>

        {/* Console / Output Pane (5 cols on large screens) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-950 font-mono text-xs overflow-hidden">
          {/* Console Tab Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveConsoleTab('stdout')}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  activeConsoleTab === 'stdout'
                    ? 'bg-slate-800 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Output (stdout)
              </button>
              <button
                onClick={() => setActiveConsoleTab('compiler')}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  activeConsoleTab === 'compiler'
                    ? 'bg-slate-800 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Compiler Log
              </button>
              <button
                onClick={() => setActiveConsoleTab('stdin')}
                className={`px-2.5 py-1 rounded text-xs transition ${
                  activeConsoleTab === 'stdin'
                    ? 'bg-slate-800 text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Stdin (cin)
              </button>
            </div>

            {/* Status Indicator */}
            {exitCode !== null && (
              <span
                className={`flex items-center text-[10px] px-2 py-0.5 rounded-full ${
                  exitCode === 0
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                    : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                }`}
              >
                {exitCode === 0 ? (
                  <>
                    <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> Exited: 0
                  </>
                ) : (
                  <>
                    <XCircle className="w-2.5 h-2.5 mr-1" /> Exit: {exitCode}
                  </>
                )}
              </span>
            )}
          </div>

          {/* Console Body */}
          <div className="flex-1 p-3 overflow-y-auto whitespace-pre-wrap text-slate-300 select-text leading-relaxed">
            {activeConsoleTab === 'stdout' && (
              <div>{output}</div>
            )}

            {activeConsoleTab === 'compiler' && (
              <div className="text-slate-400">
                {compilerOutput || '[No compiler logs yet. Click Run Code to build.]'}
              </div>
            )}

            {activeConsoleTab === 'stdin' && (
              <div className="h-full flex flex-col space-y-2">
                <span className="text-[11px] text-slate-400">
                  Values entered here will be passed to standard input (std::cin):
                </span>
                <textarea
                  value={stdinInput}
                  onChange={(e) => setStdinInput(e.target.value)}
                  placeholder="Enter inputs separated by newlines..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono resize-none"
                />
              </div>
            )}
          </div>

          {/* Console Footer */}
          <div className="px-3 py-1.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center truncate">
              <Terminal className="w-3 h-3 mr-1 text-cyan-400 shrink-0" />
              {execEngine}
            </span>
            {executionTimeMs !== null && (
              <span className="flex items-center text-slate-400 shrink-0 ml-2">
                <Clock className="w-3 h-3 mr-1" /> {executionTimeMs}ms
              </span>
            )}
          </div>
        </div>
      </div>

      {/* VSCode Export Assistant Modal */}
      <VSCodeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentCode={code}
        currentStandard={standard}
      />
    </div>
  );
}
