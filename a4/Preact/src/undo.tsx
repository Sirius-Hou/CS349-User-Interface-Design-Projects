import { signal } from "@preact/signals";

export interface Command {
  do(): void;
  undo(): void;
}

export class UndoManager {
  private undoStack: Command[] = [];
  private redoStack: Command[] = [];

  public undoNum = signal<number>(0);
  public redoNum = signal<number>(0);

  constructor() {}

  updateUndoRedoNum() {
    this.undoNum.value = this.undoStack.length;
    this.redoNum.value = this.redoStack.length;
  }

  execute(command: Command) {
    this.undoStack.push(command);
    this.redoStack = [];
    this.updateUndoRedoNum();
  }

  undo() {
    const command = this.undoStack.pop();
    if (command) {
      this.redoStack.push(command);
      command.undo();
      this.updateUndoRedoNum();
    }
  }

  redo() {
    const command = this.redoStack.pop();
    if (command) {
      this.undoStack.push(command);
      command.do();
      this.updateUndoRedoNum();
    }
  }

  get canUndo() {
    return this.undoStack.length > 0;
  }

  get canRedo() {
    return this.redoStack.length > 0;
  }

  toString() {
    return `undoStack: ${this.undoStack.length}, redoStack: ${this.redoStack.length}`;
  }
}

