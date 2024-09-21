/* eslint-disable no-undef */
const todoList = require('../todo');

const { all, markAsComplete, add, overdue, dueToday, dueLater} = todoList();

describe("Todolist Test Suite", () => {
    beforeAll(() => {
        // Clear the list to ensure a clean slate before each test run

        // Adding initial todos for testing
        add({
            title: "Test todo 1",
            completed: false,
            dueDate: new Date().toISOString().slice(0, 10), // Due today
        });

        add({
            title: "Overdue todo",
            completed: false,
            dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().slice(0, 10), // Overdue
        });

        add({
            title: "Due later todo",
            completed: false,
            dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10), // Due later
        });
    });

    // Test 1: Should add a new todo
    test("Should add new todo", () => {
        const todoItemCount = all.length;
        add({
            title: "New Test todo",
            completed: false,
            dueDate: new Date().toISOString().slice(0, 10), // Due today
        });
        expect(all.length).toBe(todoItemCount + 1);
    });

    // Test 2: Should mark a todo as complete
    test("Should mark a todo as complete", () => {
        expect(all[0].completed).toBe(false);
        markAsComplete(0);
        expect(all[0].completed).toBe(true);
    });

    // Test 3: Should retrieve overdue items
    test("Should retrieve overdue items", () => {
        const overdueItems = overdue();
        expect(overdueItems.length).toBe(1); // Only one item is overdue
        expect(overdueItems[0].title).toBe("Overdue todo");
    });

    // Test 4: Should retrieve due today items
    test("Should retrieve due today items", () => {
        const dueTodayItems = dueToday();
        expect(dueTodayItems.length).toBe(2); // Two items are due today
        expect(dueTodayItems[0].title).toBe("Test todo 1");
    });

    // Test 5: Should retrieve due later items
    test("Should retrieve due later items", () => {
        const dueLaterItems = dueLater();
        expect(dueLaterItems.length).toBe(1); // Only one item is due later
        expect(dueLaterItems[0].title).toBe("Due later todo");
    });

});
