import React, { useState } from 'react';
import JSZip from 'jszip';
import { Download, Copy, Check, Terminal, FolderTree, ExternalLink, X, Code2, Play } from 'lucide-react';

interface VSCodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCode: string;
  currentStandard?: string;
}

export default function VSCodeExportModal({
  isOpen,
  onClose,
  currentCode,
  currentStandard = 'c++20',
}: VSCodeExportModalProps) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'files' | 'terminal'>('instructions');

  if (!isOpen) return null;

  const stdFlag = `-std=${currentStandard}`;

  const cmakeListsContent = `cmake_minimum_required(VERSION 3.16)
project(CppMasteryLab VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Compiler flags for strict safety and warnings
if(MSVC)
    add_compile_options(/W4 /permissive-)
else()
    add_compile_options(-Wall -Wextra -Wpedantic -O2)
endif()

add_executable(CppLab main.cpp)
`;

  const tasksJsonContent = `{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "shell",
      "label": "C/C++: Build active file (g++)",
      "command": "g++",
      "args": [
        "-fdiagnostics-color=always",
        "-g",
        "${stdFlag}",
        "-Wall",
        "-Wextra",
        "\${file}",
        "-o",
        "\${fileDirname}/\${fileBasenameNoExtension}"
      ],
      "options": {
        "cwd": "\${fileDirname}"
      },
      "problemMatcher": ["$gcc"],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "detail": "Compiler: g++ with ${currentStandard}"
    }
  ]
}`;

  const launchJsonContent = `{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "C/C++: Debug with GDB/LLDB",
      "type": "cppdbg",
      "request": "launch",
      "program": "\${fileDirname}/\${fileBasenameNoExtension}",
      "args": [],
      "stopAtEntry": false,
      "cwd": "\${fileDirname}",
      "environment": [],
      "externalConsole": false,
      "MIMode": "gdb",
      "preLaunchTask": "C/C++: Build active file (g++)"
    }
  ]
}`;

  const propertiesJsonContent = `{
  "configurations": [
    {
      "name": "Default",
      "includePath": ["\${workspaceFolder}/**"],
      "defines": ["_DEBUG", "UNICODE", "_UNICODE"],
      "compilerPath": "/usr/bin/g++",
      "cStandard": "c17",
      "cppStandard": "${currentStandard}",
      "intelliSenseMode": "linux-gcc-x64"
    }
  ],
  "version": 4
}`;

  const readmeContent = `# C++ Mastery Lab - Local Workspace

This workspace is ready to run in **Visual Studio Code**, **CLion**, or via command-line terminals.

## 🚀 Quick Start in VSCode
1. Extract this ZIP file into any folder (e.g. \`cpp-lab\`).
2. Open **VSCode** and choose **File > Open Folder...** -> select the extracted folder.
3. Install the recommended VSCode extension:
   - **C/C++** (by Microsoft)
4. Open \`main.cpp\`.
5. Press **\`Ctrl + Shift + B\`** (Windows/Linux) or **\`Cmd + Shift + B\`** (Mac) to compile!
6. Run the generated binary:
   - Linux/Mac: \`./main\`
   - Windows: \`.\\main.exe\`

## 🛠️ Command-Line Build
### Using GCC / G++:
\`\`\`bash
g++ ${stdFlag} -Wall -Wextra -O2 main.cpp -o main
./main
\`\`\`

### Using Clang:
\`\`\`bash
clang++ ${stdFlag} -Wall -Wextra main.cpp -o main
./main
\`\`\`

### Using CMake:
\`\`\`bash
mkdir build && cd build
cmake ..
cmake --build .
./CppLab
\`\`\`
`;

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const zip = new JSZip();
      zip.file('main.cpp', currentCode || `#include <iostream>\n\nint main() {\n    std::cout << "Hello from local C++ Mastery Lab!\\n";\n    return 0;\n}\n`);
      zip.file('CMakeLists.txt', cmakeListsContent);
      zip.file('README.md', readmeContent);

      const vscodeFolder = zip.folder('.vscode');
      vscodeFolder?.file('tasks.json', tasksJsonContent);
      vscodeFolder?.file('launch.json', launchJsonContent);
      vscodeFolder?.file('c_cpp_properties.json', propertiesJsonContent);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'cpp-mastery-lab-workspace.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create ZIP:', err);
    } finally {
      setDownloading(false);
    }
  };

  const localTerminalCommand = `g++ ${stdFlag} -Wall -Wextra -O2 main.cpp -o main && ./main`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Run in VSCode or Local Machine</h3>
              <p className="text-xs text-slate-400">Export your code with full .vscode configs, CMake, and build tasks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 px-6 pt-3 bg-slate-950/40 border-b border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('instructions')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'instructions'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Setup Guide (VSCode)
          </button>
          <button
            onClick={() => setActiveTab('terminal')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'terminal'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Terminal Commands
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`pb-2.5 px-3 border-b-2 transition ${
              activeTab === 'files'
                ? 'border-cyan-500 text-cyan-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Included Workspace Files
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300">
          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-cyan-950/40 to-blue-950/30 border border-cyan-800/40 p-4 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-cyan-300 mb-1">Download Pre-Configured VSCode Workspace</h4>
                  <p className="text-xs text-slate-300">
                    Includes your current code, <code className="text-cyan-300 font-mono">.vscode/tasks.json</code> for 1-click build, CMakeLists.txt, and debugging profiles.
                  </p>
                </div>
                <button
                  onClick={handleDownloadZip}
                  disabled={downloading}
                  className="shrink-0 flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs px-4 py-2.5 rounded-lg shadow-lg shadow-cyan-900/40 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloading ? 'Packing...' : 'Download .ZIP'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <div className="font-semibold text-cyan-400 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-center leading-5 text-[11px]">1</span>
                    <span>Unpack & Open</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Unzip the folder and open it inside VSCode using <b>File &gt; Open Folder</b>.
                  </p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <div className="font-semibold text-cyan-400 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-center leading-5 text-[11px]">2</span>
                    <span>Install C/C++ Extension</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Install Microsoft's <b>C/C++</b> extension from the VSCode Marketplace for IntelliSense.
                  </p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl space-y-2">
                  <div className="font-semibold text-cyan-400 flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-900/60 text-center leading-5 text-[11px]">3</span>
                    <span>Build & Run</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    Press <kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-700">Ctrl+Shift+B</kbd> to compile your code instantly with <b>{currentStandard}</b>.
                  </p>
                </div>
              </div>

              {/* Requirements box */}
              <div className="p-3.5 bg-slate-950/40 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="font-semibold text-slate-200">Required Local Compilers:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li><b>Windows:</b> Install MinGW-w64 (via MSYS2 or WinLibs) or Visual Studio Community with C++ workload.</li>
                  <li><b>macOS:</b> Run <code className="text-cyan-300">xcode-select --install</code> in terminal.</li>
                  <li><b>Linux (Ubuntu/Debian):</b> Run <code className="text-cyan-300">sudo apt update && sudo apt install build-essential gdb</code>.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'terminal' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  1-Line Compile & Run Command (Bash / PowerShell / zsh):
                </label>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-2.5 space-x-2 font-mono text-xs text-cyan-300">
                  <Terminal className="w-4 h-4 text-cyan-500 shrink-0" />
                  <span className="flex-1 overflow-x-auto whitespace-nowrap">{localTerminalCommand}</span>
                  <button
                    onClick={() => copyToClipboard(localTerminalCommand)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="Copy command"
                  >
                    {copiedScript ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-200">Or using CMake:</div>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 space-y-1">
                  <div className="text-slate-500"># 1. Create build directory & generate build files</div>
                  <div>mkdir build &amp;&amp; cd build</div>
                  <div>cmake ..</div>
                  <div className="text-slate-500 pt-1"># 2. Compile and run executable</div>
                  <div>cmake --build .</div>
                  <div>./CppLab</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <FolderTree className="w-4 h-4 text-cyan-400" />
                <span>The export package generates the following standard directory tree:</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1">
                <div className="text-cyan-400">📁 cpp-mastery-lab-workspace/</div>
                <div className="pl-4">├── 📁 .vscode/</div>
                <div className="pl-8 text-slate-400">├── tasks.json <span className="text-slate-500">(Auto g++ build task)</span></div>
                <div className="pl-8 text-slate-400">├── launch.json <span className="text-slate-500">(GDB / LLDB debugger launch)</span></div>
                <div className="pl-8 text-slate-400">└── c_cpp_properties.json <span className="text-slate-500">(IntelliSense paths)</span></div>
                <div className="pl-4">├── 📄 main.cpp <span className="text-emerald-400">(Your current code)</span></div>
                <div className="pl-4">├── 📄 CMakeLists.txt <span className="text-slate-500">(Cross-platform build file)</span></div>
                <div className="pl-4">└── 📄 README.md <span className="text-slate-500">(Setup instructions)</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950/80 border-t border-slate-800 text-xs">
          <span className="text-slate-400">
            Selected Standard: <span className="font-mono text-cyan-400">{currentStandard}</span>
          </span>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Close
            </button>
            <button
              onClick={handleDownloadZip}
              disabled={downloading}
              className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2 rounded-lg shadow-lg shadow-cyan-900/30 transition"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Packing Workspace...' : 'Download VSCode ZIP'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
