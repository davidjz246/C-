export interface Project {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estHours: number;
  tags: string[];
  description: string;
  objectives: string[];
  starterCode: string;
  solutionCode: string;
  testChecklist: string[];
}

export const CAPSTONE_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'CLI Scientific Calculator & Unit Converter',
    difficulty: 'Beginner',
    estHours: 3,
    tags: ['Control Flow', 'Functions', 'Input Validation', 'Math'],
    description: 'Build a production-quality command-line calculator that parses arithmetic operations, evaluates power/square root formulas, and converts international units with full error handling for division by zero.',
    objectives: [
      'Parse operator and operands with robust stream validation',
      'Implement add, subtract, multiply, divide, power, and sqrt',
      'Trap zero division and negative square root domain errors',
      'Include a unit conversion mode (Celsius/Fahrenheit, Km/Miles)',
    ],
    starterCode: `#include <iostream>
#include <cmath>
#include <string>

void runCalculator() {
    std::cout << "--- C++ Scientific Calculator ---" << std::endl;
    char op = '+';
    double a = 10, b = 2.5;

    std::cout << "Calculating: " << a << " " << op << " " << b << std::endl;
    
    switch(op) {
        case '+': std::cout << "Result: " << (a + b) << std::endl; break;
        case '-': std::cout << "Result: " << (a - b) << std::endl; break;
        case '*': std::cout << "Result: " << (a * b) << std::endl; break;
        case '/': 
            if (b == 0) std::cout << "Error: Division by zero!" << std::endl;
            else std::cout << "Result: " << (a / b) << std::endl;
            break;
        default: std::cout << "Unknown operator!" << std::endl;
    }
}

int main() {
    runCalculator();
    return 0;
}`,
    solutionCode: `#include <iostream>
#include <cmath>

int main() {
    std::cout << "--- C++ Scientific Calculator ---" << std::endl;
    double a = 12.0, b = 4.0;
    std::cout << "Sum: " << (a + b) << "\\n";
    std::cout << "Diff: " << (a - b) << "\\n";
    std::cout << "Prod: " << (a * b) << "\\n";
    std::cout << "Quot: " << (a / b) << "\\n";
    std::cout << "Pow: " << std::pow(a, 2) << "\\n";
    return 0;
}`,
    testChecklist: [
      'Validates division by zero safely',
      'Proper switch handling for operators',
      'Clear output formatting',
    ],
  },
  {
    id: 'proj-2',
    title: 'Custom Memory-Safe Dynamic Array (MyVector<T>)',
    difficulty: 'Intermediate',
    estHours: 6,
    tags: ['Templates', 'Pointers', 'RAII', 'Rule of 5', 'Memory'],
    description: 'Build your own std::vector from scratch! Implement dynamic buffer growth, raw memory management, copy & move semantics, bracket operator indexing, and bounds-checked .at().',
    objectives: [
      'Manage heap memory manually using new[] and delete[] inside RAII class',
      'Implement double-capacity reallocation upon buffer saturation',
      'Implement Rule of 5: Destructor, Copy Constructor, Copy Assignment, Move Constructor, Move Assignment',
      'Template the container so it works with any datatype MyVector<T>',
    ],
    starterCode: `#include <iostream>
#include <stdexcept>
#include <utility>

template <typename T>
class MyVector {
private:
    T* data = nullptr;
    size_t sz = 0;
    size_t cap = 0;

    void reallocate(size_t newCap) {
        T* newBlock = new T[newCap];
        for (size_t i = 0; i < sz; ++i) {
            newBlock[i] = std::move(data[i]);
        }
        delete[] data;
        data = newBlock;
        cap = newCap;
    }

public:
    MyVector() : data(nullptr), sz(0), cap(0) {}
    ~MyVector() { delete[] data; }

    void push_back(const T& val) {
        if (sz >= cap) {
            reallocate(cap == 0 ? 2 : cap * 2);
        }
        data[sz++] = val;
    }

    size_t size() const { return sz; }
    size_t capacity() const { return cap; }

    T& operator[](size_t index) { return data[index]; }
    const T& operator[](size_t index) const { return data[index]; }
};

int main() {
    MyVector<int> vec;
    for (int i = 1; i <= 5; ++i) {
        vec.push_back(i * 10);
    }

    std::cout << "MyVector size: " << vec.size() << ", capacity: " << vec.capacity() << std::endl;
    for (size_t i = 0; i < vec.size(); ++i) {
        std::cout << vec[i] << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
#include <utility>

template <typename T>
class MyVector {
private:
    T* data = nullptr;
    size_t sz = 0;
    size_t cap = 0;
public:
    MyVector() = default;
    ~MyVector() { delete[] data; }
    void push_back(const T& val) {
        if (sz >= cap) {
            size_t newCap = cap == 0 ? 2 : cap * 2;
            T* newBlock = new T[newCap];
            for (size_t i = 0; i < sz; ++i) newBlock[i] = data[i];
            delete[] data;
            data = newBlock;
            cap = newCap;
        }
        data[sz++] = val;
    }
    size_t size() const { return sz; }
    T& operator[](size_t i) { return data[i]; }
};

int main() {
    MyVector<std::string> words;
    words.push_back("Zero-overhead");
    words.push_back("Memory-safe");
    std::cout << words[0] << " " << words[1] << std::endl;
    return 0;
}`,
    testChecklist: [
      'Grows capacity cleanly without buffer overflow',
      'Frees allocated array in destructor without memory leaks',
      'Supports templated data types',
    ],
  },
  {
    id: 'proj-3',
    title: 'Multi-Threaded Work Dispatcher & Thread Pool',
    difficulty: 'Advanced',
    estHours: 8,
    tags: ['Concurrency', 'C++20', 'std::jthread', 'Mutex', 'Condition Variable'],
    description: 'Construct a lock-synchronized thread pool capable of receiving concurrent work items, queuing tasks, and waking idle worker threads with zero CPU spinning.',
    objectives: [
      'Maintain a thread-safe task queue protected by std::mutex',
      'Use std::condition_variable to signal waiting worker threads',
      'Distribute tasks across std::thread or C++20 std::jthread workers',
      'Implement graceful shutdown ensuring all queued jobs complete',
    ],
    starterCode: `#include <iostream>
#include <vector>
#include <queue>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <functional>

class SimpleThreadPool {
    std::vector<std::thread> workers;
    std::queue<std::function<void()>> tasks;
    std::mutex queueMutex;
    std::condition_variable cv;
    bool stop = false;

public:
    SimpleThreadPool(size_t threads) {
        for (size_t i = 0; i < threads; ++i) {
            workers.emplace_back([this, i] {
                while (true) {
                    std::function<void()> task;
                    {
                        std::unique_lock<std::mutex> lock(this->queueMutex);
                        this->cv.wait(lock, [this] { return this->stop || !this->tasks.empty(); });
                        if (this->stop && this->tasks.empty()) return;
                        task = std::move(this->tasks.front());
                        this->tasks.pop();
                    }
                    task();
                }
            });
        }
    }

    void enqueue(std::function<void()> task) {
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            tasks.push(task);
        }
        cv.notify_one();
    }

    ~SimpleThreadPool() {
        {
            std::unique_lock<std::mutex> lock(queueMutex);
            stop = true;
        }
        cv.notify_all();
        for (std::thread& worker : workers) {
            if (worker.joinable()) worker.join();
        }
    }
};

int main() {
    SimpleThreadPool pool(3);
    for (int i = 1; i <= 5; ++i) {
        pool.enqueue([i] {
            std::cout << "Task " << i << " executing on thread\\n";
        });
    }
    std::this_thread::sleep_for(std::chrono::milliseconds(200));
    std::cout << "All tasks finished cleanly!\\n";
    return 0;
}`,
    solutionCode: `#include <iostream>
#include <vector>
#include <thread>
#include <mutex>

int main() {
    std::mutex printMutex;
    std::vector<std::thread> threads;
    for (int i = 0; i < 4; ++i) {
        threads.emplace_back([i, &printMutex] {
            std::lock_guard<std::mutex> lock(printMutex);
            std::cout << "Worker " << i << " active\\n";
        });
    }
    for (auto& t : threads) t.join();
    std::cout << "All workers joined.\\n";
    return 0;
}`,
    testChecklist: [
      'No data race on task queue access',
      'Worker threads sleep when idle and wake on notify',
      'Clean join on destruction',
    ],
  },
  {
    id: 'proj-4',
    title: 'Text Dungeon RPG Engine with Polymorphic Combat',
    difficulty: 'Intermediate',
    estHours: 5,
    tags: ['OOP', 'Inheritance', 'Smart Pointers', 'Polymorphism', 'Gaming'],
    description: 'Architect a turn-based dungeon crawler game featuring abstract Character base classes, Warriors, Mages, Goblins, inventory management, and virtual battle actions.',
    objectives: [
      'Design abstract Character class with pure virtual attack() and takeDamage()',
      'Implement derived Warrior, Mage, and Monster subclasses',
      'Store combatants in std::vector<std::unique_ptr<Character>>',
      'Execute turn-based combat loop until enemy or player HP reaches 0',
    ],
    starterCode: `#include <iostream>
#include <memory>
#include <vector>
#include <string>

class Entity {
protected:
    std::string name;
    int hp;
public:
    Entity(std::string n, int h) : name(std::move(n)), hp(h) {}
    virtual ~Entity() = default;

    virtual void attack(Entity& target) = 0;
    virtual void takeDamage(int amount) {
        hp -= amount;
        if (hp < 0) hp = 0;
        std::cout << name << " took " << amount << " dmg! (HP: " << hp << ")\\n";
    }

    bool isAlive() const { return hp > 0; }
    const std::string& getName() const { return name; }
};

class Knight : public Entity {
public:
    Knight(std::string n) : Entity(std::move(n), 120) {}
    void attack(Entity& target) override {
        std::cout << name << " swings Excalibur!\\n";
        target.takeDamage(25);
    }
};

class Dragon : public Entity {
public:
    Dragon(std::string n) : Entity(std::move(n), 200) {}
    void attack(Entity& target) override {
        std::cout << name << " breathes Inferno Flame!\\n";
        target.takeDamage(35);
    }
};

int main() {
    auto hero = std::make_unique<Knight>("Sir Arthur");
    auto boss = std::make_unique<Dragon>("Smaug");

    std::cout << "=== BATTLE COMMENCES ===\\n";
    hero->attack(*boss);
    boss->attack(*hero);
    std::cout << "Hero alive: " << (hero->isAlive() ? "YES" : "NO") << std::endl;
    return 0;
}`,
    solutionCode: `#include <iostream>
#include <memory>

class Entity {
public:
    virtual ~Entity() = default;
    virtual void action() const = 0;
};
class Hero : public Entity {
public:
    void action() const override { std::cout << "Hero strikes!\\n"; }
};

int main() {
    std::unique_ptr<Entity> e = std::make_unique<Hero>();
    e->action();
    return 0;
}`,
    testChecklist: [
      'Proper virtual destructor on Entity base class',
      'Smart pointer polymorphism without memory leaks',
      'Correct override annotations',
    ],
  },
];
