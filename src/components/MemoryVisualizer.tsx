import React, { useState } from 'react';
import { Layers, ArrowRight, ShieldCheck, AlertOctagon, RotateCcw, ChevronRight, ChevronLeft, Info, Cpu, HardDrive } from 'lucide-react';

interface Step {
  stepNumber: number;
  codeLine: string;
  explanation: string;
  stackItems: {
    address: string;
    name: string;
    type: string;
    value: string;
    pointsTo?: string; // target address
    isSmartPtr?: boolean;
    isDangling?: boolean;
  }[];
  heapItems: {
    address: string;
    type: string;
    value: string;
    refCount?: number;
    owner?: string;
    isFreed?: boolean;
  }[];
  notes?: string;
}

interface Scenario {
  id: string;
  title: string;
  category: string;
  description: string;
  steps: Step[];
}

const MEMORY_SCENARIOS: Scenario[] = [
  {
    id: 'unique_ptr',
    title: 'std::unique_ptr & RAII Lifetime',
    category: 'Smart Pointers',
    description: 'Watch how std::make_unique allocates an object on the heap, binds it exclusively to a stack handle, and automatically frees memory when exiting scope.',
    steps: [
      {
        stepNumber: 1,
        codeLine: '{ // Entering local scope',
        explanation: 'A new block scope begins. Stack frame is prepared for local variables.',
        stackItems: [],
        heapItems: [],
        notes: 'Stack pointer ESP moves to allocate local stack frame.',
      },
      {
        stepNumber: 2,
        codeLine: '  auto ptr1 = std::make_unique<int>(42);',
        explanation: 'std::make_unique allocates 4 bytes on the Heap at 0x0061fa20. The unique_ptr handle is stored on the Stack at 0x7ffe10.',
        stackItems: [
          { address: '0x7ffe10', name: 'ptr1', type: 'unique_ptr<int>', value: '0x0061fa20', pointsTo: '0x0061fa20', isSmartPtr: true },
        ],
        heapItems: [
          { address: '0x0061fa20', type: 'int', value: '42', owner: 'ptr1' },
        ],
        notes: 'ptr1 owns the heap address exclusively. No copy allowed!',
      },
      {
        stepNumber: 3,
        codeLine: '  auto ptr2 = std::move(ptr1); // Ownership transferred!',
        explanation: 'Ownership is transferred from ptr1 to ptr2 via std::move. ptr1 is zeroed out (nullptr) while ptr2 now points to the heap block.',
        stackItems: [
          { address: '0x7ffe10', name: 'ptr1', type: 'unique_ptr<int>', value: 'nullptr (0x0)' },
          { address: '0x7ffe08', name: 'ptr2', type: 'unique_ptr<int>', value: '0x0061fa20', pointsTo: '0x0061fa20', isSmartPtr: true },
        ],
        heapItems: [
          { address: '0x0061fa20', type: 'int', value: '42', owner: 'ptr2' },
        ],
        notes: 'Zero-overhead abstraction: std::unique_ptr compiles down to the same assembly as a raw pointer.',
      },
      {
        stepNumber: 4,
        codeLine: '} // Exiting scope - RAII Destructor triggers',
        explanation: 'Scope ends! ptr2 destructor automatically calls delete on 0x0061fa20. Heap memory is returned to the OS cleanly without memory leaks.',
        stackItems: [],
        heapItems: [
          { address: '0x0061fa20', type: 'int', value: '[FREED]', isFreed: true },
        ],
        notes: 'RAII ensures deterministic cleanup even if an exception was thrown!',
      },
    ],
  },
  {
    id: 'shared_ptr',
    title: 'std::shared_ptr & Reference Counting',
    category: 'Smart Pointers',
    description: 'Observe how shared_ptr maintains a Control Block with strong reference counts and destroys the object only when the last owner releases it.',
    steps: [
      {
        stepNumber: 1,
        codeLine: 'auto s1 = std::make_shared<double>(3.14);',
        explanation: 'make_shared allocates both the double value and a Control Block (strong_ref = 1) in a single contiguous heap allocation.',
        stackItems: [
          { address: '0x7ffe20', name: 's1', type: 'shared_ptr<double>', value: '0x0084ab00', pointsTo: '0x0084ab00', isSmartPtr: true },
        ],
        heapItems: [
          { address: '0x0084ab00', type: 'double', value: '3.14', refCount: 1, owner: 's1' },
        ],
        notes: 'Control Block tracks ref_count = 1.',
      },
      {
        stepNumber: 2,
        codeLine: 'auto s2 = s1; // Shared copy',
        explanation: 's2 is copy-constructed from s1. The reference count inside the control block is atomically incremented to 2.',
        stackItems: [
          { address: '0x7ffe20', name: 's1', type: 'shared_ptr<double>', value: '0x0084ab00', pointsTo: '0x0084ab00', isSmartPtr: true },
          { address: '0x7ffe10', name: 's2', type: 'shared_ptr<double>', value: '0x0084ab00', pointsTo: '0x0084ab00', isSmartPtr: true },
        ],
        heapItems: [
          { address: '0x0084ab00', type: 'double', value: '3.14', refCount: 2, owner: 's1, s2' },
        ],
        notes: 'Both s1 and s2 share ownership safely across threads.',
      },
      {
        stepNumber: 3,
        codeLine: 's1.reset(); // First owner releases',
        explanation: 's1 drops ownership. Reference count decrements from 2 to 1. The heap object remains intact because s2 still owns it!',
        stackItems: [
          { address: '0x7ffe20', name: 's1', type: 'shared_ptr<double>', value: 'nullptr (0x0)' },
          { address: '0x7ffe10', name: 's2', type: 'shared_ptr<double>', value: '0x0084ab00', pointsTo: '0x0084ab00', isSmartPtr: true },
        ],
        heapItems: [
          { address: '0x0084ab00', type: 'double', value: '3.14', refCount: 1, owner: 's2' },
        ],
        notes: 'Object is not destroyed yet; ref count > 0.',
      },
      {
        stepNumber: 4,
        codeLine: 's2.reset(); // Final owner releases -> DESTRUCTION',
        explanation: 's2 drops ownership. Reference count drops to 0. Destructor triggers and heap memory is freed immediately.',
        stackItems: [
          { address: '0x7ffe20', name: 's1', type: 'shared_ptr<double>', value: 'nullptr (0x0)' },
          { address: '0x7ffe10', name: 's2', type: 'shared_ptr<double>', value: 'nullptr (0x0)' },
        ],
        heapItems: [
          { address: '0x0084ab00', type: 'double', value: '[FREED]', refCount: 0, isFreed: true },
        ],
        notes: 'Ref count reached 0: Heap block deallocated cleanly.',
      },
    ],
  },
  {
    id: 'raw_pointer_leak',
    title: 'Raw Pointer & The Dangling Pointer Risk',
    category: 'Memory Pitfalls',
    description: 'Witness why raw new/delete is dangerous: dangling pointers, double-free vulnerabilities, and undefined behavior.',
    steps: [
      {
        stepNumber: 1,
        codeLine: 'int* rawPtr = new int(100);',
        explanation: 'Raw pointer rawPtr on Stack points to newly allocated int(100) on Heap at 0x005510.',
        stackItems: [
          { address: '0x7ffe40', name: 'rawPtr', type: 'int*', value: '0x005510', pointsTo: '0x005510' },
        ],
        heapItems: [
          { address: '0x005510', type: 'int', value: '100' },
        ],
        notes: 'Programmer is manually responsible for calling delete!',
      },
      {
        stepNumber: 2,
        codeLine: 'delete rawPtr; // Memory deallocated but pointer not cleared!',
        explanation: 'delete frees the heap memory at 0x005510. However, rawPtr on the Stack still holds the address 0x005510! It is now a DANGLING POINTER.',
        stackItems: [
          { address: '0x7ffe40', name: 'rawPtr', type: 'int*', value: '0x005510 (DANGLING)', pointsTo: '0x005510', isDangling: true },
        ],
        heapItems: [
          { address: '0x005510', type: 'int', value: '[DEALLOCATED]', isFreed: true },
        ],
        notes: 'DANGER: Attempting to dereference *rawPtr now causes UNDEFINED BEHAVIOR!',
      },
      {
        stepNumber: 3,
        codeLine: 'rawPtr = nullptr; // Safety defense',
        explanation: 'Setting rawPtr = nullptr nullifies the pointer so subsequent checks if (rawPtr) fail safely instead of crashing or corrupting memory.',
        stackItems: [
          { address: '0x7ffe40', name: 'rawPtr', type: 'int*', value: 'nullptr (0x0)' },
        ],
        heapItems: [
          { address: '0x005510', type: 'int', value: '[DEALLOCATED]', isFreed: true },
        ],
        notes: 'Modern solution: Use std::unique_ptr instead of raw new/delete.',
      },
    ],
  },
  {
    id: 'stack_references',
    title: 'Stack Frame & References (Alias vs Copy)',
    category: 'Fundamentals',
    description: 'Understand how references (T&) do not allocate new storage, but act as syntax aliases directly pointing to the original stack memory address.',
    steps: [
      {
        stepNumber: 1,
        codeLine: 'int originalVal = 50;',
        explanation: 'Allocates integer on stack frame at 0x7ffe30 with value 50.',
        stackItems: [
          { address: '0x7ffe30', name: 'originalVal', type: 'int', value: '50' },
        ],
        heapItems: [],
        notes: 'Variable lives inside the stack frame of the current function.',
      },
      {
        stepNumber: 2,
        codeLine: 'int& ref = originalVal; // Reference alias',
        explanation: 'ref is created as an alias for originalVal. It points directly to address 0x7ffe30 with no copying overhead.',
        stackItems: [
          { address: '0x7ffe30', name: 'originalVal (also: &ref)', type: 'int &', value: '50', pointsTo: '0x7ffe30' },
        ],
        heapItems: [],
        notes: 'ref does not have a separate memory address; it IS originalVal!',
      },
      {
        stepNumber: 3,
        codeLine: 'ref += 25;',
        explanation: 'Modifying ref directly updates the value stored at 0x7ffe30. Both originalVal and ref now evaluate to 75.',
        stackItems: [
          { address: '0x7ffe30', name: 'originalVal (also: &ref)', type: 'int &', value: '75', pointsTo: '0x7ffe30' },
        ],
        heapItems: [],
        notes: 'Pass-by-reference allows functions to modify caller variables with zero copy cost.',
      },
    ],
  },
];

export default function MemoryVisualizer() {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const scenario = MEMORY_SCENARIOS[selectedScenarioIndex];
  const step = scenario.steps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < scenario.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const handleScenarioChange = (idx: number) => {
    setSelectedScenarioIndex(idx);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Visualizer Top Bar */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <span>C++ Memory &amp; Pointer Visualizer</span>
              <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded-full border border-purple-800 font-mono">
                Interactive Architecture
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Visualize Stack frames, Heap allocations, Pointer references, and RAII lifecycles in real time
            </p>
          </div>
        </div>

        {/* Scenario Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400">Scenario:</span>
          <select
            value={selectedScenarioIndex}
            onChange={(e) => handleScenarioChange(Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-purple-500"
          >
            {MEMORY_SCENARIOS.map((sc, i) => (
              <option key={sc.id} value={i}>
                [{sc.category}] {sc.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-y-auto">
        {/* Left Column: Code Stepper & Explanation (4 cols) */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-slate-900/40 space-y-4">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                {scenario.category}
              </span>
              <h4 className="text-base font-bold text-slate-100 mt-0.5">{scenario.title}</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{scenario.description}</p>
            </div>

            {/* Code Highlight Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Code Execution</span>
                <span className="text-purple-400">Step {step.stepNumber} of {scenario.steps.length}</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-emerald-400 shadow-inner">
                {step.codeLine}
              </div>
            </div>

            {/* Step Explanation */}
            <div className="p-3.5 bg-purple-950/20 border border-purple-800/40 rounded-xl space-y-1.5">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-purple-300">
                <Info className="w-3.5 h-3.5" />
                <span>Memory Action:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{step.explanation}</p>
            </div>

            {/* Architecture Note */}
            {step.notes && (
              <div className="p-3 bg-slate-950/50 border border-slate-800/80 rounded-xl text-xs text-slate-400">
                <span className="text-slate-300 font-medium">💡 Hardware/Compiler Insight:</span> {step.notes}
              </div>
            )}
          </div>

          {/* Stepper Controls */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800 transition"
              title="Reset to step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="flex items-center space-x-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleNext}
                disabled={currentStepIndex === scenario.steps.length - 1}
                className="flex items-center space-x-1 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white shadow-lg shadow-purple-900/30 transition"
              >
                <span>Next Step</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Stack & Heap Diagram (8 cols) */}
        <div className="lg:col-span-8 p-6 bg-slate-950 flex flex-col space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            {/* Stack Memory Visualizer */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-cyan-400 font-semibold text-xs">
                  <Cpu className="w-4 h-4" />
                  <span>Call Stack (LIFO Frame)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Grows Downwards ↓</span>
              </div>

              <div className="flex-1 space-y-2.5">
                {step.stackItems.length === 0 ? (
                  <div className="h-36 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                    Stack frame empty or initialized
                  </div>
                ) : (
                  step.stackItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs transition duration-200 ${
                        item.isDangling
                          ? 'bg-rose-950/40 border-rose-700/60 text-rose-200'
                          : item.isSmartPtr
                          ? 'bg-cyan-950/40 border-cyan-700/50 text-cyan-200'
                          : 'bg-slate-950 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1">
                        <span>Addr: <span className="text-slate-300 font-bold">{item.address}</span></span>
                        <span className="text-cyan-400">{item.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{item.name}</span>
                        <span className="font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {item.value}
                        </span>
                      </div>
                      {item.pointsTo && (
                        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-purple-400">
                          <span className="flex items-center">
                            Points to address <ArrowRight className="w-3 h-3 mx-1" />
                          </span>
                          <span className="font-mono font-bold">{item.pointsTo}</span>
                        </div>
                      )}
                      {item.isDangling && (
                        <div className="mt-1.5 flex items-center text-[10px] text-rose-400">
                          <AlertOctagon className="w-3 h-3 mr-1 shrink-0" />
                          <span>Dangling pointer! Memory was freed.</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Heap Memory Visualizer */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-emerald-400 font-semibold text-xs">
                  <HardDrive className="w-4 h-4" />
                  <span>Heap Storage (Dynamic RAM)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Unbounded / Managed</span>
              </div>

              <div className="flex-1 space-y-2.5">
                {step.heapItems.length === 0 ? (
                  <div className="h-36 flex items-center justify-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                    No dynamic heap allocations currently active
                  </div>
                ) : (
                  step.heapItems.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border text-xs transition duration-200 ${
                        item.isFreed
                          ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                          : 'bg-emerald-950/30 border-emerald-700/50 text-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 mb-1">
                        <span>Addr: <span className="text-slate-300 font-bold">{item.address}</span></span>
                        <span className="text-emerald-400">{item.type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Value in RAM:</span>
                        <span className="font-mono font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {item.value}
                        </span>
                      </div>
                      {item.refCount !== undefined && (
                        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-cyan-300">
                          <span>Control Block Ref Count:</span>
                          <span className="font-mono font-bold bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                            {item.refCount}
                          </span>
                        </div>
                      )}
                      {item.owner && (
                        <div className="mt-1 text-[10px] text-slate-400">
                          Owner Handle(s): <span className="font-mono text-slate-300">{item.owner}</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Concept Explainer Footer */}
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <b>Modern C++ Best Practice:</b> Eliminate raw <code className="text-cyan-300 font-mono">new</code> and <code className="text-cyan-300 font-mono">delete</code>. Prefer <code className="text-cyan-300 font-mono">std::make_unique</code> and stack containers.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
