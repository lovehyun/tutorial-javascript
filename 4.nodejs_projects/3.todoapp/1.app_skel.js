const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

class TodoApp {
    constructor() {
        this.tasks = [];
    }

    addTask(task) {
        // TODO
    }

    viewTasks() {
        // TODO
    }

    completeTask(index) {
        // TODO
    }

    deleteTask(index) {
        // TODO
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
