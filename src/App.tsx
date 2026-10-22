import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Bot,
  PanelRightClose,
  PanelRightOpen,
  Share2,
  Menu,
  X,
  Award,
  Terminal,
  Laptop,
} from 'lucide-react';
import CodeEditor from './components/CodeEditor';
import AITutorChat from './components/AITutorChat';
import RoadmapView from './components/RoadmapView';
import MemoryVisualizer from './components/MemoryVisualizer';
import ProjectStudioView from './components/ProjectStudioView';
import VSCodeExportModal from './components/VSCodeExportModal';
import { CURRICULUM_STAGES } from './data/curriculum';

const DEFAULT_STARTER_CODE = `#include <iostream>
#include <vector>
#include <memory>
#include <string>

// Welcome to C++ Mastery Lab!
// You can write modern C++ (C++11/14/17/20/23), compile, and chat with your AI Tutor.

class SystemModule {
    std::string name;
    int version;
public:
    SystemModule(std::string n, int v) : name(std::move(n)), version(v) {}
    void status() const {
        std::cout << "Module [" << name << "] v" << version << " online!\\n";
    }
};

int main() {
    std::cout << "=== Welcome to C++ Mastery Lab ===\\n";

    // Modern C++: RAII with std::unique_ptr
    auto coreModule = std::make_unique<SystemModule>("Core-Kernel", 2);
    coreModule->status();

    std::vector<std::string> masteryRoadmap = {
        "Stage 0: Build Model & Preprocessor",
        "Stage 1: Types & Constexpr",
        "Stage 5: Pointers, RAII & Memory",
        "Stage 7: STL Containers & Lambdas",
        "Stage 8: C++20 Concepts & Threads"
    };

    std::cout << "\\nRoadmap milestones:\\n";
    for (const auto& milestone : masteryRoadmap) {
        std::cout << " -> " << milestone << "\\n";
    }

    return 0;
}
`;

export default function App() {
  const [activeTab, setActiveTab] = useState<'playground' | 'roadmap' | 'memory' | 'projects'>('playground');
  const [currentCode, setCurrentCode] = useState<string>(DEFAULT_STARTER_CODE);
  const [currentTopic, setCurrentTopic] = useState<string>('Stage 0: C++ Orientation');
  const [compilerOutput, setCompilerOutput] = useState<string>('');
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Persistent progress tracking
  const [completedStageIds, setCompletedStageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cpp_completed_stages');
      return saved ? JSON.parse(saved) : ['stage-0'];
    } catch {
      return ['stage-0'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cpp_completed_stages', JSON.stringify(completedStageIds));
    } catch (e) {
      console.warn('Could not save progress to localStorage', e);
    }
  }, [completedStageIds]);

  const handleToggleCompleteStage = (stageId: string) => {
    setCompletedStageIds((prev) => {
      const exists = prev.includes(stageId);
      const updated = exists ? prev.filter((id) => id !== stageId) : [...prev, stageId];
      if (!exists) {
        // Trigger celebration confetti!
        try {
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      }
      return updated;
    });
  };

  const handleSelectStageForPlayground = (code: string, topicTitle: string) => {
    setCurrentCode(code);
    setCurrentTopic(topicTitle);
    setActiveTab('playground');
  };

  const handleAskTutorAboutTopic = (topic: string) => {
    setCurrentTopic(topic);
    setIsTutorOpen(true);
  };

  const handleInsertCodeSnippet = (snippet: string) => {
    setCurrentCode(snippet);
    setActiveTab('playground');
  };

  const handleRunSuccess = () => {
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.7 },
      });
    } catch {}
  };

  const progressPercent = Math.round((completedStageIds.length / CURRICULUM_STAGES.length) * 100);

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Left Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center font-mono font-bold text-white shadow-lg shadow-cyan-600/30">
                C++
              </div>
              <div>
                <h1 className="font-bold text-sm tracking-wide text-slate-100 flex items-center gap-1.5">
                  <span>MASTERY LAB</span>
                </h1>
                <p className="text-[10px] text-cyan-400 font-mono">Modern C++ Platform</p>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 text-xs">
            <button
              onClick={() => {
                setActiveTab('playground');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition ${
                activeTab === 'playground'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Code Playground</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('roadmap');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition ${
                activeTab === 'roadmap'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Curriculum Roadmap</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('memory');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition ${
                activeTab === 'memory'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Memory Visualizer</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('projects');
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium transition ${
                activeTab === 'projects'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Project Studio</span>
            </button>

            <div className="pt-2">
              <button
                onClick={() => {
                  setIsExportModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-cyan-400 hover:bg-cyan-950/40 border border-cyan-800/40 transition"
              >
                <Laptop className="w-4 h-4" />
                <span>Run in VSCode (Export)</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User Progress Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center">
              <Award className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Mastery Progress
            </span>
            <span className="text-cyan-400 font-mono font-semibold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 text-center font-mono">
            {completedStageIds.length} of {CURRICULUM_STAGES.length} Stages Completed
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <section className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-xs sm:text-sm font-semibold text-slate-200">
              {activeTab === 'playground' && `IDE: ${currentTopic}`}
              {activeTab === 'roadmap' && 'Curriculum Roadmap & Interactive Stages'}
              {activeTab === 'memory' && 'C++ Hardware, Stack & Heap Memory Visualizer'}
              {activeTab === 'projects' && 'Capstone Project Studio'}
            </h2>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Quick Export Button */}
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="hidden lg:flex items-center space-x-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              title="Download workspace configured for VSCode and local build"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>VSCode Assistant</span>
            </button>

            {/* Toggle AI Tutor Chat Drawer */}
            <button
              onClick={() => setIsTutorOpen(!isTutorOpen)}
              className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
                isTutorOpen
                  ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-700'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">AI Tutor</span>
              {isTutorOpen ? (
                <PanelRightClose className="w-3.5 h-3.5 hidden sm:inline" />
              ) : (
                <PanelRightOpen className="w-3.5 h-3.5 hidden sm:inline" />
              )}
            </button>
          </div>
        </header>

        {/* Central Stage View */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'playground' && (
            <div className="h-full p-3 sm:p-4 bg-slate-950">
              <CodeEditor
                code={currentCode}
                onCodeChange={setCurrentCode}
                onRunSuccess={handleRunSuccess}
                onCompilerOutputChange={setCompilerOutput}
              />
            </div>
          )}

          {activeTab === 'roadmap' && (
            <RoadmapView
              onSelectStageForPlayground={handleSelectStageForPlayground}
              onAskTutorAboutTopic={handleAskTutorAboutTopic}
              completedStageIds={completedStageIds}
              onToggleCompleteStage={handleToggleCompleteStage}
            />
          )}

          {activeTab === 'memory' && (
            <div className="h-full p-3 sm:p-4 bg-slate-950">
              <MemoryVisualizer />
            </div>
          )}

          {activeTab === 'projects' && (
            <ProjectStudioView
              onLoadProjectCode={(code, title) => {
                setCurrentCode(code);
                setCurrentTopic(`Project: ${title}`);
                setActiveTab('playground');
              }}
              onAskTutorAboutProject={handleAskTutorAboutTopic}
            />
          )}
        </div>
      </section>

      {/* Right AI Tutor Chat Panel */}
      <aside
        className={`w-96 shrink-0 h-full transition-all duration-200 ${
          isTutorOpen ? 'block' : 'hidden'
        }`}
      >
        <AITutorChat
          userCode={currentCode}
          activeTopic={currentTopic}
          compilerOutput={compilerOutput}
          onInsertCode={handleInsertCodeSnippet}
        />
      </aside>

      {/* Global VSCode Export Modal */}
      <VSCodeExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        currentCode={currentCode}
      />
    </div>
  );
}
