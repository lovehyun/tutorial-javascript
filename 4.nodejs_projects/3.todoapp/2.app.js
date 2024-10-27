const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

class TodoApp {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push({ task, completed: false });
        console.log(`Added: "${task}"`);
    }

    viewTasks() {
        if (this.tasks.length === 0) {
            console.log("No tasks available.");
            return;
        }

        console.log("Todo List:");
        this.tasks.forEach((task, index) => {
            const status = task.completed ? "[Completed]" : "[Pending]";
            console.log(`${index + 1}. ${task.task} ${status}`);
        });
    }

    completeTask(index) {
        if (index < 1 || index > this.tasks.length) {
            console.log("Invalid task number.");
            return;
        }

        this.tasks[index - 1].completed = true;
        console.log(`Task ${index} marked as completed.`);
    }

    deleteTask(index) {
        if (index < 1 || index > this.tasks.length) {
            console.log("Invalid task number.");
            return;
        }

        const deletedTask = this.tasks.splice(index - 1, 1);
        console.log(`Deleted: "${deletedTask[0].task}"`);
    }

    showMenu() {
        console.log("\nChoose an option:");
        console.log("1. Add a task");
        console.log("2. View tasks");
        console.log("3. Complete a task");
        console.log("4. Delete a task");
        console.log("5. Exit");
    }

    handleInput(choice) {
        switch (choice) {
            case '1':
                readline.question("Enter task description: ", (task) => {
                    this.addTask(task);
                    this.showMenu();
                });
                break;
            case '2':
                this.viewTasks();
                this.showMenu();
                break;
            case '3':
                readline.question("Enter task number to complete: ", (num) => {
                    this.completeTask(parseInt(num));
                    this.showMenu();
                });
                break;
            case '4':
                readline.question("Enter task number to delete: ", (num) => {
                    this.deleteTask(parseInt(num));
                    this.showMenu();
                });
                break;
            case '5':
                console.log("Exiting Todo App...");
                readline.close();
                break;
            default:
                console.log("Invalid choice. Please select a valid option.");
                this.showMenu();
        }
    }

    start() {
        this.showMenu();
        readline.on('line', (input) => {
            this.handleInput(input.trim());
        });
    }
}

const app = new TodoApp();
app.start();
