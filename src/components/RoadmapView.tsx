import React, { useState } from 'react';
import { CURRICULUM_STAGES, Stage } from '../data/curriculum';
import {
  BookOpen,
  CheckCircle,
  Play,
  Lock,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  Award,
  Clock,
  Code2,
} from 'lucide-react';

interface RoadmapViewProps {
  onSelectStageForPlayground: (code: string, topicTitle: string) => void;
  onAskTutorAboutTopic: (topic: string) => void;
  completedStageIds: string[];
  onToggleCompleteStage: (stageId: string) => void;
}

export default function RoadmapView({
  onSelectStageForPlayground,
  onAskTutorAboutTopic,
  completedStageIds,
  onToggleCompleteStage,
}: RoadmapViewProps) {
  const [activeStageId, setActiveStageId] = useState<string>(CURRICULUM_STAGES[0].id);

  const activeStage = CURRICULUM_STAGES.find((s) => s.id === activeStageId) || CURRICULUM_STAGES[0];
  const isCompleted = completedStageIds.includes(activeStage.id);

  return (
    <div className="h-full flex flex-col md:flex-row overflow-hidden bg-slate-950 text-slate-100">
      {/* Stages Navigation List (Left column on desktop, 320px) */}
      <div className="w-full md:w-80 border-r border-slate-800 bg-slate-900/40 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-sm text-slate-100">Curriculum Roadmap</h3>
            <span className="text-xs font-mono text-cyan-400">
              {completedStageIds.length} / {CURRICULUM_STAGES.length} Done
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full transition-all duration-300"
              style={{
                width: `${(completedStageIds.length / CURRICULUM_STAGES.length) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="p-3 space-y-1.5 flex-1">
          {CURRICULUM_STAGES.map((st) => {
            const done = completedStageIds.includes(st.id);
            const isSelected = st.id === activeStageId;

            return (
              <button
                key={st.id}
                onClick={() => setActiveStageId(st.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500/70 shadow-lg shadow-cyan-950/40 text-white'
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                }`}
              >
                <div className="flex items-center space-x-3 truncate">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                      done
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : isSelected
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {done ? '✓' : st.stageNumber}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate">{st.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                      <span>{st.level}</span>
                      <span>•</span>
                      <span>{st.estMinutes}m</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Stage Details & Deep Dive Pane (Right, scrollable) */}
      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Stage Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 px-2.5 py-1 rounded border border-cyan-800">
                Stage {activeStage.stageNumber}
              </span>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full border ${
                  activeStage.level === 'Beginner'
                    ? 'bg-blue-950/60 text-blue-300 border-blue-800'
                    : activeStage.level === 'Intermediate'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                    : 'bg-purple-950/60 text-purple-300 border-purple-800'
                }`}
              >
                {activeStage.level}
              </span>
              <span className="flex items-center text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 mr-1" /> {activeStage.estMinutes} mins
              </span>
            </div>

            {/* Complete stage button */}
            <button
              onClick={() => onToggleCompleteStage(activeStage.id)}
              className={`flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-lg border transition ${
                isCompleted
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <CheckCircle className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>{isCompleted ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-100">{activeStage.title}</h2>
            <p className="text-sm text-cyan-400 font-mono mt-0.5">{activeStage.subtitle}</p>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">{activeStage.overview}</p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectStageForPlayground(activeStage.starterCode, activeStage.title)}
              className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-900/30 transition"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Open in Code Playground</span>
            </button>

            <button
              onClick={() => onSelectStageForPlayground(activeStage.challenge.starterCode, `Challenge: ${activeStage.challenge.title}`)}
              className="flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/30 transition"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Start Stage Challenge</span>
            </button>

            <button
              onClick={() => onAskTutorAboutTopic(activeStage.title)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Key Topics List */}
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
          <h4 className="text-sm font-semibold text-slate-200 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Key Competencies Mastered</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
            {activeStage.keyTopics.map((topic, i) => (
              <div key={i} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deep Dive Section */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Deep Dive & Architectural Principles</span>
          </h3>

          {activeStage.deepDive.map((section, idx) => (
            <div key={idx} className="p-5 bg-slate-900/40 border border-slate-800 rounded-xl space-y-3">
              <h4 className="font-semibold text-sm text-cyan-300">{section.heading}</h4>
              <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{section.body}</div>

              {section.codeExample && (
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-200 overflow-x-auto">
                  <pre>{section.codeExample}</pre>
                </div>
              )}

              {section.commonPitfall && (
                <div className="p-3 bg-rose-950/30 border border-rose-800/40 rounded-lg flex items-start space-x-2.5 text-xs text-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-rose-300">Common Pitfall / UB Alert: </span>
                    {section.commonPitfall}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interactive Challenge Card */}
        <div className="p-5 bg-gradient-to-br from-emerald-950/20 to-slate-900 border border-emerald-800/40 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-sm">
              <Award className="w-4 h-4" />
              <span>Interactive Challenge: {activeStage.challenge.title}</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              Auto-Graded
            </span>
          </div>

          <p className="text-xs text-slate-300">{activeStage.challenge.description}</p>

          <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs text-slate-300">
            <div className="font-semibold text-slate-200">Instructions:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              {activeStage.challenge.instructions.map((inst, i) => (
                <li key={i}>{inst}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400 italic">💡 Hint: {activeStage.challenge.hint}</span>
            <button
              onClick={() => onSelectStageForPlayground(activeStage.challenge.starterCode, `Challenge: ${activeStage.challenge.title}`)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              Solve in Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
