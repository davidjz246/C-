# Complete Open-Ended C++ Expert AI Tutor Upgrade

Upgrade the integrated AI Tutor into a complete, unrestricted C++ expert system that answers any programming query with comprehensive technical depth while actively co-analyzing the live code in the Monaco editor.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been confirmed and will govern the tutor implementation:

- **Tutor Role & Breadth**: **Complete open-ended C++ expert** capable of answering any question across the C++ spectrum (algorithms, syntax, OOP, templates, memory management, low-level architecture, build systems, and libraries) with zero canned or hardcoded responses.
- **Editor Context Integration**: **Always analyze user questions and active editor code together**. The tutor will inspect the exact code currently in the Monaco buffer, diagnose issues, trace logic, and provide contextual code enhancements.
- **Elimination of Static Fallbacks**: The old static boilerplate fallback that recited generic text has been completely eliminated. All responses are generated dynamically by the model with automatic server-side retries.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the in-app AI Chatbot into a full-fidelity C++ engineering mentor. Learners can ask open-ended questions (*"How do I write a custom memory allocator?"*, *"Why is my pointer dereference crashing?"*, *"How does template argument deduction work here?"*), and the tutor responds with tailored technical explanations, executable modern C++ code, and line-specific commentary on their active editor buffer.
- **Target Audience**: Programmers at all skill levels, from beginners learning control flow and functions to advanced developers tackling C++20/23 concepts, move semantics, and lock-free concurrency.
- **Key Value**: Immediate, context-aware feedback directly inside the learning workspace without generic or repetitive responses.

---

## 2. User Experience & Visual Design

- **Context Banner**: The chat header displays a live sync badge showing the current editor file (`main.cpp`), line count, and active stage/topic so the user knows the AI has full visibility into their code.
- **Streaming & Dynamic Rendering**:
  - Live markdown rendering with syntax-highlighted C++ code blocks.
  - "Insert into Editor" button on every generated C++ snippet so users can instantly test tutor code in the Monaco playground.
  - One-click copy button for quick clipboard extraction.
- **Quick Action Triggers**:
  - 🔍 *Explain Active Code*: Deep dive into current editor buffer.
  - 🛠️ *Diagnose Bugs & Undefined Behavior (UB)*: Proactive memory and pointer audit.
  - ⚡ *Optimize for Speed & Cache*: Performance recommendations (`-O2/-O3`, cache alignment, vector reserving).
  - 💡 *Modernize (C++20/23)*: Upgrades legacy raw loops and pointers into ranges, concepts, and smart pointers.
  - ❓ *Interactive Quiz*: Generates targeted knowledge tests.

---

## 3. Key Product Decisions & Trade-Offs

- **Server-Side AI Proxy (`server.ts`)**:
  - *Chosen Approach*: Maintain secure, server-side Gemini generation via `@google/genai` using `gemini-3.8-flash`.
  - *Why*: Protects credentials, centralizes context injection (editor buffer, compiler logs, system prompt), and enables automatic server retries.
  - *Alternatives Considered*: Client-side API calls were discarded as they expose credentials and lack centralized prompt synthesis.

- **Dynamic Dual-Context Prompt Synthesis**:
  - *Chosen Approach*: The server injects the active editor buffer, compiler error logs (if any exist), user skill level, and full conversation history into each turn.
  - *Why*: Satisfies the user's requirement that the chatbot always understands both their direct question and their editor workspace simultaneously.

- **Resilient Error Recovery (Zero Static Fallback)**:
  - *Chosen Approach*: If an API spike occurs, the backend automatically performs an immediate retry with exponential backoff, returning a transparent status rather than dumping a canned script.
  - *Why*: Eliminates the frustrating "repetitive answer" problem completely.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│                   Client Browser                       │
│                                                        │
│  ┌───────────────────────┐   ┌──────────────────────┐  │
│  │   Monaco Code Editor  │   │  C++ AI Tutor Chat   │  │
│  │     (Active Code)     │──>│ (User Query + Context│  │
│  └───────────────────────┘   └──────────┬───────────┘  │
└─────────────────────────────────────────┼──────────────┘
                                          │ POST /api/tutor
                                          ▼
┌────────────────────────────────────────────────────────┐
│               Full-Stack Express Server                │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Context Synthesizer                             │  │
│  │  - Combines: Student Query                       │  │
│  │  - Active Editor Code Buffer                     │  │
│  │  - Compiler Diagnostics (stdout/stderr)          │  │
│  │  - C++ Principal Engineer System Prompt          │  │
│  └──────────────────────────┬───────────────────────┘  │
│                             │                          │
│                             ▼                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  @google/genai SDK (gemini-3.8-flash)            │  │
│  │  - Low latency configuration                     │  │
│  │  - Automatic transient retry                     │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Prompt Synthesis Protocol

Each user message will be structured as:
```text
[SYSTEM: C++ Principal Engineer & Educator]
[USER SKILL LEVEL: <level>]
[ACTIVE WORKSPACE TOPIC: <topic>]

[CURRENT ACTIVE EDITOR CODE]:
```cpp
<active_code_from_monaco>
```

[LAST COMPILER EXECUTION OUTPUT]:
<stdout_and_stderr_if_available>

[CONVERSATION HISTORY]:
<multi_turn_history>

[STUDENT QUESTION]:
<user_current_message>

INSTRUCTION: Analyze both the student's question and their active code above. Answer directly, provide complete working C++ code, point out any memory/lifetime/UB risks, and explain the underlying mechanics clearly.
```
