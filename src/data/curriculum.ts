export interface Challenge {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  starterCode: string;
  expectedOutputSnippet: string;
  hint: string;
  solutionCode: string;
}

export interface Stage {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estMinutes: number;
  overview: string;
  keyTopics: string[];
  deepDive: {
    heading: string;
    body: string;
    codeExample: string;
    commonPitfall: string;
  }[];
  starterCode: string;
  challenge: Challenge;
}

export const CURRICULUM_STAGES: Stage[] = [
  {
    id: 'stage-0',
    stageNumber: 0,
    title: 'C++ Orientation & The Build Model',
    subtitle: 'From Source Code to Machine Assembly',
    level: 'Beginner',
    estMinutes: 25,
    overview: 'Understand why C++ powers high-performance computing, game engines, OS kernels, and finance. Discover the four phases of compilation: Preprocessing, Compiling, Assembly, and Linking.',
    keyTopics: [
      'The C++ Philosophy (Zero-overhead abstractions)',
      'Preprocessing (#include, #define, macros)',
      'Compilers (GCC, Clang, MSVC) and flags (-Wall -O2)',
      'Linker errors vs Compiler errors',
      'C++ Standards timeline: C++11 to C++23',
    ],
    deepDive: [
      {
        heading: '1. The Compilation Pipeline',
        body: 'Unlike interpreted languages like Python or bytecode languages like Java, C++ compiles directly into native machine code. The pipeline operates in 4 distinct stages:\n\n1. **Preprocessor**: Expands `#include` headers, replaces macros, and strips comments.\n2. **Compiler**: Translates C++ into CPU assembly instructions, performing optimizations.\n3. **Assembler**: Converts assembly text into binary object files (`.o` or `.obj`).\n4. **Linker**: Combines multiple object files and external libraries into an executable, resolving memory addresses.',
        codeExample: `// main.cpp
#include <iostream>

#define LAB_VERSION "2.4"

int main() {
    std::cout << "C++ Compilation Pipeline active!\\n";
    std::cout << "Version: " << LAB_VERSION << std::endl;
    return 0; // Return code 0 indicates clean exit to OS
}`,
        commonPitfall: 'Undefined reference linker error: Forgetting to link a library or define a declared function causes the linker (ld) to fail after compilation has already succeeded!',
      },
    ],
    starterCode: `#include <iostream>

// Stage 0: Your first C++ program
int main() {
    std::cout << "Hello, C++ Mastery Lab!" << std::endl;
    std::cout << "Compilation pipeline verified." << std::endl;
    return 0;
}`,
    challenge: {
      id: 'ch-0',
      title: 'Initialize System Diagnostics',
      description: 'Write a program that outputs the system platform name and uses proper newline formatting using std::cout.',
      instructions: [
        'Include the <iostream> header',
        'Print "System: C++20 Core" followed by a newline',
        'Print "Status: Online" followed by std::endl',
        'Return 0 from main',
      ],
      starterCode: `#include <iostream>

int main() {
    // Write your solution here
    
    return 0;
}`,
      expectedOutputSnippet: 'System: C++20 Core\nStatus: Online',
      hint: 'Remember to use `std::cout << "text" << std::endl;` or `\\n` for newlines.',
      solutionCode: `#include <iostream>

int main() {
    std::cout << "System: C++20 Core\\n";
    std::cout << "Status: Online" << std::endl;
    return 0;
}`,
    },
  },
  {
    id: 'stage-1',
    stageNumber: 1,
    title: 'Types, Variables & Modern I/O',
    subtitle: 'Type Safety, Auto Deduction & Formatting',
    level: 'Beginner',
    estMinutes: 35,
    overview: 'C++ is strongly typed with static type checking. Learn fundamental integer, float, bool, and char types, the auto keyword, const correctness, and modern stream I/O.',
    keyTopics: [
      'Fundamental types: int, double, bool, char, size_t',
      'Type deduction with auto and decltype',
      'Const correctness: const int vs constexpr',
      'Standard I/O: std::cin, std::cout, std::cerr',
      'Namespace std and why "using namespace std" is dangerous',
    ],
    deepDive: [
      {
        heading: '1. Constexpr vs Const',
        body: '`const` promises that a variable will not be mutated after initialization. `constexpr` goes further: it forces the value to be computed at compile-time, saving CPU cycles at runtime.',
        codeExample: `#include <iostream>

constexpr int MAX_BUFFER_SIZE = 1024 * 4; // Computed at compile-time!

int main() {
    const double pi = 3.1415926535;
    auto radius = 5.0; // Automatically deduced as double
    
    double area = pi * radius * radius;
    std::cout << "Circle Area: " << area << std::endl;
    return 0;
}`,
        commonPitfall: 'Using `using namespace std;` in header files: This pollutes the global namespace and causes name collisions across libraries!',
      },
    ],
    starterCode: `#include <iostream>

int main() {
    // Experiment with auto and types
    auto intVal = 42;
    auto floatVal = 3.14159;
    const std::string name = "C++ Developer";
    
    std::cout << "Name: " << name << "\\n";
    std::cout << "Integer: " << intVal << " | Float: " << floatVal << std::endl;
    return 0;
}`,
    challenge: {
      id: 'ch-1',
      title: 'Precision Temperature Converter',
      description: 'Build a temperature converter that calculates Celsius from Fahrenheit using precise floating point arithmetic and const variables.',
      instructions: [
        'Declare a const double fahrenheit = 98.6',
        'Calculate celsius = (fahrenheit - 32.0) * (5.0 / 9.0)',
        'Print "Fahrenheit: " << fahrenheit',
        'Print "Celsius: " << celsius',
      ],
      starterCode: `#include <iostream>

int main() {
    // Declare constants and compute
    
    return 0;
}`,
      expectedOutputSnippet: 'Celsius: 37',
      hint: 'Be careful not to do integer division `5 / 9` which equals 0! Use `5.0 / 9.0`.',
      solutionCode: `#include <iostream>

int main() {
    const double fahrenheit = 98.6;
    const double celsius = (fahrenheit - 32.0) * (5.0 / 9.0);
    
    std::cout << "Fahrenheit: " << fahrenheit << std::endl;
    std::cout << "Celsius: " << celsius << std::endl;
    return 0;
}`,
    },
  },
  {
    id: 'stage-2',
    stageNumber: 2,
    title: 'Control Flow, Logic & Loops',
    subtitle: 'Branch Prediction, Switch & Range-based Iteration',
    level: 'Beginner',
    estMinutes: 40,
    overview: 'Master decision-making and repetitive computation. Explore if-else chains, switch statements with [[fallthrough]], and modern C++ range-based for loops.',
    keyTopics: [
      'if, else if, else and if-with-initializer (C++17)',
      'switch statements and enum class integration',
      'while, do-while, and traditional for loops',
      'Range-based for loops: for (const auto& item : collection)',
      'break, continue, and loop invariant reasoning',
    ],
    deepDive: [
      {
        heading: '1. If With Initializer (C++17)',
        body: 'C++17 introduced the ability to declare a variable scoped strictly within an `if` statement, keeping variables out of the enclosing scope.',
        codeExample: `#include <iostream>
#include <string>

int getStatusCode() { return 200; }

int main() {
    // Variable 'status' is scoped ONLY to this if/else block
    if (int status = getStatusCode(); status == 200) {
        std::cout << "Request OK: " << status << std::endl;
    } else {
        std::cout << "Request Failed: " << status << std::endl;
    }
    return 0;
}`,
        commonPitfall: 'Forgetting `break` in a switch statement, causing unintended fallthrough into the next case.',
      },
    ],
    starterCode: `#include <iostream>

int main() {
    std::cout << "=== Control Flow Demo ===\\n";
    for (int i = 1; i <= 5; ++i) {
        if (i % 2 == 0) {
            std::cout << i << " is even\\n";
        } else {
            std::cout << i << " is odd\\n";
        }
    }
    return 0;
}`,
    challenge: {
      id: 'ch-2',
      title: 'FizzBuzz Performance Filter',
      description: 'Implement a loop from 1 to 15. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz", otherwise print the number.',
      instructions: [
        'Iterate from 1 up to 15 inclusive',
        'Check for divisible by 15 first (FizzBuzz)',
        'Check for divisible by 3 (Fizz)',
        'Check for divisible by 5 (Buzz)',
        'Otherwise print the number',
      ],
      starterCode: `#include <iostream>

int main() {
    // Implement FizzBuzz 1 to 15
    
    return 0;
}`,
      expectedOutputSnippet: 'FizzBuzz',
      hint: 'Use the modulo operator `%`. `i % 15 == 0` catches both 3 and 5.',
      solutionCode: `#include <iostream>

int main() {
    for (int i = 1; i <= 15; ++i) {
        if (i % 15 == 0) {
            std::cout << "FizzBuzz\\n";
        } else if (i % 3 == 0) {
            std::cout << "Fizz\\n";
        } else if (i % 5 == 0) {
            std::cout << "Buzz\\n";
        } else {
            std::cout << i << "\\n";
        }
    }
    return 0;
}`,
    },
  },
  {
    id: 'stage-3',
    stageNumber: 3,
    title: 'Functions, Pass-by-Reference & Scopes',
    subtitle: 'Stack Frames, Overloading & Inline Efficiency',
    level: 'Beginner',
    estMinutes: 45,
    overview: 'Learn how functions execute on the call stack. Understand the monumental difference between passing by value (copying) vs passing by reference (&), and when to use const references.',
    keyTopics: [
      'Function declarations vs definitions (header vs source)',
      'Pass-by-value vs pass-by-reference (&)',
      'Pass-by-const-reference for zero-copy efficiency',
      'Function overloading and name mangling',
      'Default arguments and inline functions',
    ],
    deepDive: [
      {
        heading: '1. Pass-by-Reference vs Pass-by-Value',
        body: 'Passing large structures or `std::string` by value creates a duplicate copy on the stack, allocating memory and slowing performance. Passing by `const Type&` passes an alias with zero copy overhead!',
        codeExample: `#include <iostream>
#include <string>

// Modifies original variable in-place
void increment(int& val) {
    val += 1;
}

// Zero-copy read-only access
void printReport(const std::string& message) {
    std::cout << "[REPORT] " << message << std::endl;
}

int main() {
    int counter = 10;
    increment(counter);
    std::cout << "Counter: " << counter << std::endl; // 11
    printReport("System check passed.");
    return 0;
}`,
        commonPitfall: 'Returning a reference to a local stack variable: Once the function returns, the stack frame is destroyed and the reference becomes a dangling reference leading to undefined behavior!',
      },
    ],
    starterCode: `#include <iostream>

void swapNumbers(int& a, int& b) {
    int temp = a;
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    std::cout << "Before swap: x=" << x << ", y=" << y << std::endl;
    swapNumbers(x, y);
    std::cout << "After swap:  x=" << x << ", y=" << y << std::endl;
    return 0;
}`,
    challenge: {
      id: 'ch-3',
      title: 'In-Place MinMax Extractor',
      description: 'Write a function `findMinMax(int a, int b, int& outMin, int& outMax)` that assigns the smallest and largest values to the reference parameters.',
      instructions: [
        'Define `void findMinMax(int a, int b, int& outMin, int& outMax)`',
        'Compare a and b to set outMin and outMax',
        'In main, pass test values 45 and 12',
        'Print "Min: " << minVal << ", Max: " << maxVal',
      ],
      starterCode: `#include <iostream>

// Declare and define findMinMax

int main() {
    int minVal = 0, maxVal = 0;
    // Call findMinMax with 45 and 12
    
    return 0;
}`,
      expectedOutputSnippet: 'Min: 12, Max: 45',
      hint: 'Ensure outMin and outMax are passed as reference `int&` so the caller sees the updated values.',
      solutionCode: `#include <iostream>

void findMinMax(int a, int b, int& outMin, int& outMax) {
    if (a < b) {
        outMin = a;
        outMax = b;
    } else {
        outMin = b;
        outMax = a;
    }
}

int main() {
    int minVal = 0, maxVal = 0;
    findMinMax(45, 12, minVal, maxVal);
    std::cout << "Min: " << minVal << ", Max: " << maxVal << std::endl;
    return 0;
}`,
    },
  },
  {
    id: 'stage-4',
    stageNumber: 4,
    title: 'Vectors, Strings & Modern Containers',
    subtitle: 'Dynamic Arrays, string_view & Capacity Management',
    level: 'Intermediate',
    estMinutes: 45,
    overview: 'Forget risky raw C-style arrays! Master std::vector (the workhorse of C++) and std::string, understand dynamic reallocation, and utilize std::string_view for lightning-fast parsing.',
    keyTopics: [
      'std::vector size vs capacity and reserve()',
      'push_back() vs emplace_back()',
      'Bounds checking: vec[i] vs vec.at(i)',
      'std::string operations, concatenation & substr',
      'C++17 std::string_view: zero-allocation string slicing',
    ],
    deepDive: [
      {
        heading: '1. Vector Memory Growth & Reserve',
        body: 'When a `std::vector` exceeds its capacity, it allocates a new larger buffer (usually 1.5x or 2x size), copies/moves elements over, and frees old memory. If you know the size in advance, calling `vec.reserve(N)` eliminates costly reallocations!',
        codeExample: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> numbers;
    numbers.reserve(100); // Pre-allocates heap space for 100 elements!
    
    for (int i = 1; i <= 5; ++i) {
        numbers.push_back(i * 10);
    }
    
    std::cout << "Size: " << numbers.size() << " | Capacity: " << numbers.capacity() << "\\n";
    for (int n : numbers) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
        commonPitfall: 'Iterator Invalidation: Calling `push_back()` can cause the vector to reallocate its underlying buffer, instantly invalidating any existing pointers or iterators pointing to elements inside it!',
      },
    ],
    starterCode: `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> weapons = {"Buster Sword", "Plasma Gun", "Energy Blade"};
    weapons.push_back("Quantum Bow");

    std::cout << "Armory count: " << weapons.size() << std::endl;
    for (const auto& w : weapons) {
        std::cout << " - " << w << std::endl;
    }
    return 0;
}`,
    challenge: {
      id: 'ch-4',
      title: 'Vector Statistics Engine',
      description: 'Compute the sum, average, and maximum value of elements stored in a std::vector<int>.',
      instructions: [
        'Create a vector with numbers: {15, 42, 8, 99, 23, 67}',
        'Calculate sum and maximum',
        'Calculate average as a double',
        'Print "Sum: " << sum',
        'Print "Max: " << max',
      ],
      starterCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> data = {15, 42, 8, 99, 23, 67};
    // Compute sum and max
    
    return 0;
}`,
      expectedOutputSnippet: 'Sum: 254\nMax: 99',
      hint: 'Initialize max with the first element `data[0]`, then iterate through the vector.',
      solutionCode: `#include <iostream>
#include <vector>

int main() {
    std::vector<int> data = {15, 42, 8, 99, 23, 67};
    int sum = 0;
    int maxVal = data[0];
    
    for (int num : data) {
        sum += num;
        if (num > maxVal) {
            maxVal = num;
        }
    }
    
    std::cout << "Sum: " << sum << std::endl;
    std::cout << "Max: " << maxVal << std::endl;
    return 0;
}`,
    },
  },
  {
    id: 'stage-5',
    stageNumber: 5,
    title: 'Pointers, References & Smart Pointers (RAII)',
    subtitle: 'Memory Safety, Heap Allocation & std::unique_ptr',
    level: 'Intermediate',
    estMinutes: 60,
    overview: 'Demystify C++ memory! Understand stack vs heap addresses, raw pointers (* and &), the danger of memory leaks, and modern RAII smart pointers (unique_ptr, shared_ptr, weak_ptr).',
    keyTopics: [
      'Memory architecture: Code, Data, Stack, and Heap',
      'Address-of (&) and dereference (*) operators',
      'Dangling pointers, double frees, and memory leaks',
      'RAII: Resource Acquisition Is Initialization',
      'std::unique_ptr and std::make_unique (exclusive ownership)',
      'std::shared_ptr and std::weak_ptr (shared ownership)',
    ],
    deepDive: [
      {
        heading: '1. The Golden Rule of Modern C++: No Raw Ownership',
        body: 'In legacy C++, programmers used `new` and `delete`. If an exception occurred before `delete`, memory leaked. In modern C++, wrap heap resources in `std::unique_ptr`. When the pointer goes out of scope, its destructor automatically frees the heap memory!',
        codeExample: `#include <iostream>
#include <memory>

struct Player {
    std::string name;
    int health;
    Player(std::string n, int h) : name(std::move(n)), health(h) {
        std::cout << "[Allocated] Player " << name << "\\n";
    }
    ~Player() {
        std::cout << "[Destroyed] Player " << name << " cleanly freed!\\n";
    }
};

int main() {
    // Unique ownership: automatically deleted when main terminates!
    auto hero = std::make_unique<Player>("Aria", 100);
    std::cout << hero->name << " has HP: " << hero->health << std::endl;
    return 0;
}`,
        commonPitfall: 'Dereferencing a nullptr or wild pointer: Always verify pointers before dereferencing, or better yet, use references or smart pointers!',
      },
    ],
    starterCode: `#include <iostream>
#include <memory>

int main() {
    // Raw pointer demonstration
    int val = 100;
    int* ptr = &val;
    std::cout << "Value: " << *ptr << " at address: " << ptr << std::endl;

    // Modern C++ smart pointer
    auto smartInt = std::make_unique<int>(250);
    std::cout << "Smart pointer value: " << *smartInt << std::endl;
    // Freed automatically with zero memory leaks!
    return 0;
}`,
    challenge: {
      id: 'ch-5',
      title: 'Safe Heap Object with unique_ptr',
      description: 'Create a struct Node holding an integer value and allocate it using std::make_unique<Node>. Modify its value and print it safely.',
      instructions: [
        'Include <memory> and <iostream>',
        'Define struct Node { int data; };',
        'In main, create a std::unique_ptr<Node> using std::make_unique<Node>()',
        'Set node->data = 88',
        'Print "Node data: " << node->data',
      ],
      starterCode: `#include <iostream>
#include <memory>

// Define struct Node

int main() {
    // Allocate and print with make_unique
    
    return 0;
}`,
      expectedOutputSnippet: 'Node data: 88',
      hint: 'Use arrow syntax `ptr->data = 88` to access struct members through a pointer.',
      solutionCode: `#include <iostream>
#include <memory>

struct Node {
    int data;
};

int main() {
    auto node = std::make_unique<Node>();
    node->data = 88;
    std::cout << "Node data: " << node->data << std::endl;
    return 0;
}`,
    },
  },
  {
    id: 'stage-6',
    stageNumber: 6,
    title: 'Object-Oriented C++ & Polymorphism',
    subtitle: 'Constructors, Inheritance, Vtables & Rule of 5',
    level: 'Intermediate',
    estMinutes: 55,
    overview: 'Dive into classes, encapsulation, member initializer lists, virtual functions, abstract classes, virtual destructors, and the canonical Rule of Three and Five.',
    keyTopics: [
      'Classes vs Structs (default access specifiers)',
      'Member initializer lists and explicit constructors',
      'Virtual functions, vtables, and runtime polymorphism',
      'Pure virtual functions and Interfaces (virtual void fn() = 0)',
      'The Rule of 5: Destructor, Copy/Move Constructor, Copy/Move Assignment',
    ],
    deepDive: [
      {
        heading: '1. Virtual Destructors: Critical for Polymorphism',
        body: 'If a class has even one virtual function, its destructor MUST be declared `virtual`. Without a virtual destructor, deleting a derived object through a base pointer causes undefined behavior (derived destructors never run, leaking resources)!',
        codeExample: `#include <iostream>
#include <memory>

class Shape {
public:
    virtual ~Shape() = default; // Critical virtual destructor!
    virtual double area() const = 0; // Pure virtual
    virtual void print() const {
        std::cout << "Shape area: " << area() << "\\n";
    }
};

class Rectangle : public Shape {
    double width, height;
public:
    Rectangle(double w, double h) : width(w), height(h) {}
    double area() const override { return width * height; }
};

int main() {
    std::unique_ptr<Shape> shape = std::make_unique<Rectangle>(5.0, 4.0);
    shape->print();
    return 0;
}`,
        commonPitfall: 'Slicing: Passing a derived object by value to a function expecting a base class slices off the derived members!',
      },
    ],
    starterCode: `#include <iostream>
#include <memory>
#include <string>

class Vehicle {
public:
    virtual ~Vehicle() = default;
    virtual void drive() const {
        std::cout << "Driving generic vehicle\\n";
    }
};

class SportsCar : public Vehicle {
public:
    void drive() const override {
        std::cout << "Accelerating 0-60 in 2.9s!\\n";
    }
};

int main() {
    std::unique_ptr<Vehicle> v = std::make_unique<SportsCar>();
    v->drive();
    return 0;
}`,
    challenge: {
      id: 'ch-6',
      title: 'Polymorphic Bank Account System',
      description: 'Implement a base BankAccount class and a SavingsAccount derived class that adds 5% interest.',
      instructions: [
        'Create class BankAccount with protected double balance and virtual double getFinalBalance() const',
        'Create class SavingsAccount : public BankAccount with interestRate = 0.05',
        'Override getFinalBalance() to return balance * (1.0 + interestRate)',
        'Test with balance 1000.0, output "Final Balance: 1050"',
      ],
      starterCode: `#include <iostream>
#include <memory>

// Define BankAccount and SavingsAccount

int main() {
    // Instantiate SavingsAccount via pointer and print final balance
    
    return 0;
}`,
      expectedOutputSnippet: 'Final Balance: 1050',
      hint: 'Remember to mark virtual ~BankAccount() = default; to ensure safe polymorphism.',
      solutionCode: `#include <iostream>
#include <memory>

class BankAccount {
protected:
    double balance;
public:
    BankAccount(double b) : balance(b) {}
    virtual ~BankAccount() = default;
    virtual double getFinalBalance() const {
        return balance;
    }
};

class SavingsAccount : public BankAccount {
    double interestRate;
public:
    SavingsAccount(double b, double rate = 0.05) : BankAccount(b), interestRate(rate) {}
    double getFinalBalance() const override {
        return balance * (1.0 + interestRate);
    }
};

int main() {
    std::unique_ptr<BankAccount> account = std::make_unique<SavingsAccount>(1000.0);
    std::cout << "Final Balance: " << account->getFinalBalance() << std::endl;
    return 0;
}`,
    },
  },
  {
    id: 'stage-7',
    stageNumber: 7,
    title: 'The Standard Template Library (STL) & Lambdas',
    subtitle: 'Algorithms, Maps, Sets & Modern Functional C++',
    level: 'Advanced',
    estMinutes: 50,
    overview: 'Unlock the peak power of C++. Explore STL algorithms (std::transform, std::sort, std::find_if), associative containers (unordered_map, set), and lambda expressions with captures.',
    keyTopics: [
      'Lambda expression syntax: [capture](params) -> ret { body }',
      'std::sort with custom comparator lambda',
      'std::unordered_map vs std::map (Hash table vs Red-Black Tree)',
      'std::transform, std::accumulate, and std::count_if',
      'C++20 Ranges preview',
    ],
    deepDive: [
      {
        heading: '1. Demystifying Lambda Captures',
        body: 'Lambdas are anonymous function objects. The capture clause controls variable access:\n- `[]` : no captures\n- `[&]` : capture all outer variables by reference\n- `[=]` : capture all outer variables by value (copy)\n- `[x, &y]` : capture x by copy, y by reference.',
        codeExample: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {4, 1, 9, 3, 7};
    
    // Sort descending with lambda
    std::sort(nums.begin(), nums.end(), [](int a, int b) {
        return a > b;
    });
    
    std::cout << "Sorted descending: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << std::endl;
    return 0;
}`,
        commonPitfall: 'Dangling reference in lambda capture: If you capture a local stack variable by reference `[&]` and pass the lambda to an asynchronous thread or return it, that reference dangles when the scope exits!',
      },
    ],
    starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>

int main() {
    std::unordered_map<std::string, int> scores;
    scores["Alice"] = 95;
    scores["Bob"] = 88;
    scores["Charlie"] = 92;

    for (const auto& [player, score] : scores) {
        std::cout << player << ": " << score << "\\n";
    }
    return 0;
}`,
    challenge: {
      id: 'ch-7',
      title: 'Word Frequency Analyzer',
      description: 'Count frequencies of words in a list using std::unordered_map and find the count for "cpp".',
      instructions: [
        'Initialize vector words = {"cpp", "python", "cpp", "rust", "cpp", "go"}',
        'Use std::unordered_map<std::string, int> to count occurrences',
        'Print "cpp occurrences: " << map["cpp"]',
      ],
      starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>

int main() {
    std::vector<std::string> words = {"cpp", "python", "cpp", "rust", "cpp", "go"};
    // Count frequencies
    
    return 0;
}`,
      expectedOutputSnippet: 'cpp occurrences: 3',
      hint: 'You can increment directly: `freq[w]++`. If the key does not exist, it defaults to 0 and increments to 1.',
      solutionCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>

int main() {
    std::vector<std::string> words = {"cpp", "python", "cpp", "rust", "cpp", "go"};
    std::unordered_map<std::string, int> freq;
    
    for (const auto& w : words) {
        freq[w]++;
    }
    
    std::cout << "cpp occurrences: " << freq["cpp"] << std::endl;
    return 0;
}`,
    },
  },
  {
    id: 'stage-8',
    stageNumber: 8,
    title: 'Modern C++: Templates, Concepts & Concurrency',
    subtitle: 'Generic Metaprogramming & Multi-threading',
    level: 'Advanced',
    estMinutes: 65,
    overview: 'Reach true C++ mastery! Learn generic templates, C++20 Concepts (compile-time constraints), multi-threading with std::jthread, mutexes, and atomic operations.',
    keyTopics: [
      'Function and class templates (template <typename T>)',
      'C++20 Concepts (template <std::integral T>)',
      'std::jthread (auto-joining threads in C++20)',
      'std::mutex and std::lock_guard for thread safety',
      'std::atomic<T> for lock-free concurrency',
    ],
    deepDive: [
      {
        heading: '1. C++20 Concepts: Readable Template Errors',
        body: 'Pre-C++20 templates caused pages of cryptic compiler errors when types did not match expectations. Concepts allow you to restrict templates to types that satisfy specific requirements at compile-time!',
        codeExample: `#include <iostream>
#include <concepts>

// Constrained template: only accepts numbers!
template <typename T>
requires std::integral<T> || std::floating_point<T>
T add(T a, T b) {
    return a + b;
}

int main() {
    std::cout << "Int sum: " << add(10, 20) << "\\n";
    std::cout << "Float sum: " << add(3.5, 2.5) << "\\n";
    // add("hello", "world"); // Compile error: does not satisfy concept!
    return 0;
}`,
        commonPitfall: 'Data Race: When two threads access the same memory location concurrently and at least one is writing without synchronization, causing catastrophic Undefined Behavior. Always use `std::lock_guard` or `std::atomic`!',
      },
    ],
    starterCode: `#include <iostream>

// Generic Template Function
template <typename T>
T findMax(T a, T b) {
    return (a > b) ? a : b;
}

int main() {
    std::cout << "Max int: " << findMax(10, 42) << std::endl;
    std::cout << "Max double: " << findMax(3.14, 2.71) << std::endl;
    std::cout << "Max string: " << findMax(std::string("alpha"), std::string("omega")) << std::endl;
    return 0;
}`,
    challenge: {
      id: 'ch-8',
      title: 'Generic Clamp Function',
      description: 'Implement a generic template function `clampVal<T>(T val, T minVal, T maxVal)` that ensures val stays within [minVal, maxVal].',
      instructions: [
        'Define `template <typename T> T clampVal(T val, T minVal, T maxVal)`',
        'If val < minVal return minVal, if val > maxVal return maxVal, else return val',
        'Test with val=150, min=0, max=100 -> outputs 100',
        'Print "Clamped: " << clampVal(150, 0, 100)',
      ],
      starterCode: `#include <iostream>

// Define template clampVal

int main() {
    // Call clampVal(150, 0, 100)
    
    return 0;
}`,
      expectedOutputSnippet: 'Clamped: 100',
      hint: 'Ensure all parameters use type `T`.',
      solutionCode: `#include <iostream>

template <typename T>
T clampVal(T val, T minVal, T maxVal) {
    if (val < minVal) return minVal;
    if (val > maxVal) return maxVal;
    return val;
}

int main() {
    std::cout << "Clamped: " << clampVal(150, 0, 100) << std::endl;
    return 0;
}`,
    },
  },
];
