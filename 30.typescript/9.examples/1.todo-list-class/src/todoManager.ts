import { Todo } from './todo';

export class TodoManager {
    private todos: Todo[] = [];

    addTodo(title: string): Todo {
        const newTodo = new Todo(title);
        this.todos.push(newTodo);
        return newTodo;
    }

    listTodos(): Todo[] {
        return this.todos;
    }

    toggleTodo(id: number): boolean {
        const todo = this.todos.find(t => t.id === id);
        if (!todo) return false;
        todo.toggle();
        return true;
    }

    removeTodo(id: number): boolean {
        const index = this.todos.findIndex(t => t.id === id);
        if (index === -1) return false;
        this.todos.splice(index, 1);
        return true;
    }
}
