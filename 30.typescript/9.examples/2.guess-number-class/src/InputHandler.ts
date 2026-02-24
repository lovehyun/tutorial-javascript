// InputHandler.ts
import readline from 'readline';

export class InputHandler {
    private rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    ask(question: string): Promise<string> {
        return new Promise(resolve => {
            this.rl.question(question, resolve);
        });
    }

    close() {
        this.rl.close();
    }
}
