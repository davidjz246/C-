import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  Code2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ArrowRightCircle,
  HelpCircle,
  Bug,
  Zap,
  BookOpen,
  Trash2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AITutorChatProps {
  userCode?: string;
  activeTopic?: string;
  compilerOutput?: string;
  onInsertCode?: (codeSnippet: string) => void;
}

export default function AITutorChat({
  userCode = '',
  activeTopic = 'C++ Fundamentals',
  compilerOutput = '',
  onInsertCode,
}: AITutorChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I am your **C++ Mastery Lab AI Tutor**. 

I am here to guide you through:
- **Core C++** (Types, References, Memory model, RAII)
- **Object-Oriented Design & Vtables**
- **Modern C++20/23** (Templates, Concepts, Ranges, \`std::jthread\`)
- **Debugging & Fixing Undefined Behavior (UB)**

You can ask me anything, or use the quick action buttons above to analyze your current code in the editor!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [speechEnabled, setSpeechEnabled] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    // Strip markdown characters for cleaner speech
    const clean = text.replace(/```[\s\S]*?```/g, 'Code block omitted.').replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    const userMessageId = `msg-${Date.now()}`;
    const userMsg: Message = {
      id: userMessageId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          userCode,
          contextTopic: activeTopic,
          userLevel,
          compilerOutput,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to communicate with C++ Tutor server');

      const botReply: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...updatedMessages, botReply]);
      speakText(botReply.content);
    } catch (err: any) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **Tutor Service Notice:** ${err.message || 'Network error'}\n\nPlease try again or verify server status.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...updatedMessages, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const extractCodeBlocks = (markdown: string) => {
    const codeMatch = markdown.match(/```(?:cpp|c\+\+|c)?\n([\s\S]*?)```/);
    return codeMatch ? codeMatch[1].trim() : null;
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'init-cleared',
        role: 'assistant',
        content: 'Conversation history cleared. Ready for your next C++ question!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-100 select-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xs text-slate-100">C++ Mastery AI Tutor</span>
              <span className="flex items-center text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-800/60">
                <Sparkles className="w-2.5 h-2.5 mr-0.5" /> Gemini
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate max-w-[170px]">{activeTopic}</p>
          </div>
        </div>

        {/* Level Selector & Controls */}
        <div className="flex items-center space-x-1.5">
          <select
            value={userLevel}
            onChange={(e) => setUserLevel(e.target.value as any)}
            className="bg-slate-800 text-[11px] text-slate-300 border border-slate-700 rounded-md px-2 py-1 focus:outline-none focus:border-cyan-500 cursor-pointer"
            title="Teaching explanation depth"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <button
            onClick={() => setSpeechEnabled(!speechEnabled)}
            className={`p-1.5 rounded-md border text-xs transition ${
              speechEnabled
                ? 'bg-cyan-950 border-cyan-700 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={speechEnabled ? 'Text-to-speech enabled' : 'Enable voice reading'}
          >
            {speechEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleClearHistory}
            className="p-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-400 hover:text-rose-400 transition"
            title="Clear conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Context Badge */}
      <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center truncate">
          <Code2 className="w-3 h-3 mr-1 text-cyan-400 shrink-0" />
          Synced with editor ({userCode.split('\n').length} lines)
        </span>
        <span className="text-[10px] uppercase font-mono text-cyan-400 bg-cyan-950/50 px-1.5 rounded">
          {userLevel}
        </span>
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="flex gap-1.5 p-2 bg-slate-950/40 border-b border-slate-800 overflow-x-auto text-[11px]">
        <button
          onClick={() => handleSend('Explain what this C++ code does step-by-step and highlight key design concepts.')}
          className="whitespace-nowrap flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md transition border border-slate-700"
        >
          <BookOpen className="w-3 h-3 text-cyan-400" />
          <span>Explain Code</span>
        </button>
        <button
          onClick={() => handleSend('Debug my C++ code: check for memory leaks, undefined behavior, syntax errors, and pointer safety issues.')}
          className="whitespace-nowrap flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md transition border border-slate-700"
        >
          <Bug className="w-3 h-3 text-rose-400" />
          <span>Find Bugs & UB</span>
        </button>
        <button
          onClick={() => handleSend('How can I optimize this code for performance, cache locality, and modern C++ best practices?')}
          className="whitespace-nowrap flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md transition border border-slate-700"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Optimize</span>
        </button>
        <button
          onClick={() => handleSend('Give me a quick multiple choice question or coding micro-challenge to test my knowledge of this topic!')}
          className="whitespace-nowrap flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-md transition border border-slate-700"
        >
          <HelpCircle className="w-3 h-3 text-purple-400" />
          <span>Quiz Me</span>
        </button>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const codeBlock = !isUser ? extractCodeBlocks(msg.content) : null;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                  isUser ? 'bg-cyan-600 text-white' : 'bg-slate-800 border border-slate-700 text-cyan-400'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={`max-w-[88%] rounded-xl p-3 leading-relaxed ${
                  isUser
                    ? 'bg-cyan-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-950/80 text-slate-200 rounded-tl-none border border-slate-800 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                {/* Code Insertion action if bot provided a code block */}
                {codeBlock && onInsertCode && (
                  <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">Contains C++ Snippet</span>
                    <button
                      onClick={() => onInsertCode(codeBlock)}
                      className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 rounded bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-800/60 transition"
                    >
                      <ArrowRightCircle className="w-3 h-3" />
                      <span>Insert into Editor</span>
                    </button>
                  </div>
                )}

                {/* Footer metadata */}
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => copyMessage(msg.content, msg.id)}
                      className="hover:text-slate-200 transition p-1"
                      title="Copy response"
                    >
                      {copiedIndex === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            <span className="font-mono">Tutor is analyzing C++ semantics...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-800 bg-slate-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about pointers, RAII, STL, or debugging..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 placeholder-slate-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white p-2 rounded-lg transition shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
