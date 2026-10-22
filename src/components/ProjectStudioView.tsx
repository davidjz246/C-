import React, { useState } from 'react';
import { CAPSTONE_PROJECTS, Project } from '../data/projects';
import {
  Cpu,
  Clock,
  Tag,
  CheckSquare,
  Play,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Code,
  ShieldAlert,
} from 'lucide-react';

interface ProjectStudioViewProps {
  onLoadProjectCode: (code: string, projectTitle: string) => void;
  onAskTutorAboutProject: (title: string) => void;
}

export default function ProjectStudioView({
  onLoadProjectCode,
  onAskTutorAboutProject,
}: ProjectStudioViewProps) {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(CAPSTONE_PROJECTS[0].id);
  const [showSolution, setShowSolution] = useState(false);

  const filteredProjects = CAPSTONE_PROJECTS.filter((p) => {
    if (filterDifficulty === 'All') return true;
    return p.difficulty === filterDifficulty;
  });

  const activeProject =
    CAPSTONE_PROJECTS.find((p) => p.id === selectedProjectId) || CAPSTONE_PROJECTS[0];

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-950 text-slate-100">
      {/* Project Selector Sidebar (Left) */}
      <div className="w-full md:w-80 border-r border-slate-800 bg-slate-900/40 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Project Studio</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {CAPSTONE_PROJECTS.length} Capstones
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 text-xs">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((diff) => (
              <button
                key={diff}
                onClick={() => setFilterDifficulty(diff)}
                className={`px-2.5 py-1 rounded-md text-[11px] transition ${
                  filterDifficulty === diff
                    ? 'bg-cyan-600 text-white font-medium'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 space-y-2 flex-1">
          {filteredProjects.map((proj) => {
            const isSelected = proj.id === activeProject.id;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                  setShowSolution(false);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition space-y-2 ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-950/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      proj.difficulty === 'Beginner'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : proj.difficulty === 'Intermediate'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-purple-950 text-purple-300 border border-purple-800'
                    }`}
                  >
                    {proj.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" /> {proj.estHours}h
                  </span>
                </div>
                <div className="text-xs font-semibold leading-snug">{proj.title}</div>
                <div className="flex flex-wrap gap-1">
                  {proj.tags.slice(0, 2).map((t, idx) => (
                    <span key={idx} className="text-[9px] bg-slate-950 px-1.5 py-0.5 rounded text-slate-400 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Project Details Pane (Right) */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Project Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-md font-mono font-bold ${
                  activeProject.difficulty === 'Beginner'
                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                    : activeProject.difficulty === 'Intermediate'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-purple-950 text-purple-300 border border-purple-800'
                }`}
              >
                {activeProject.difficulty} Project
              </span>
              <span className="flex items-center text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 mr-1" /> Estimated: {activeProject.estHours} Hours
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onAskTutorAboutProject(activeProject.title)}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ask AI Mentor</span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-100">{activeProject.title}</h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{activeProject.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {activeProject.tags.map((tag, i) => (
              <span key={i} className="text-xs bg-slate-950 border border-slate-800 text-cyan-300 px-2.5 py-1 rounded-md font-mono">
                #{tag}
              </span>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => onLoadProjectCode(activeProject.starterCode, activeProject.title)}
              className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-900/30 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Load Starter Template into Editor</span>
            </button>

            <button
              onClick={() => setShowSolution(!showSolution)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700 transition"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showSolution ? 'Hide Reference Solution' : 'View Reference Solution'}</span>
            </button>
          </div>
        </div>

        {/* Architecture & Objectives */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engineering Objectives */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>Implementation Milestones</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              {activeProject.objectives.map((obj, i) => (
                <div key={i} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-cyan-400 font-bold">{i + 1}.</span>
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Acceptance Criteria Checklist */}
          <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Testing &amp; Acceptance Criteria</span>
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              {activeProject.testChecklist.map((check, i) => (
                <div key={i} className="flex items-center space-x-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  <span className="text-emerald-400">✓</span>
                  <span>{check}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reference Solution Drawer (if toggled) */}
        {showSolution && (
          <div className="p-5 bg-slate-900 border border-emerald-800/60 rounded-xl space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                <Code className="w-4 h-4" />
                <span>Reference Architecture &amp; Solution (C++20)</span>
              </div>
              <button
                onClick={() => onLoadProjectCode(activeProject.solutionCode, `${activeProject.title} (Solution)`)}
                className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
              >
                Load this into Editor
              </button>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 overflow-x-auto max-h-96">
              <pre>{activeProject.solutionCode}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
