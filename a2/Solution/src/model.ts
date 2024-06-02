import { Subject } from "./observer";
import { random } from "simplekit/utility";

// shape properties
export type Shape = {
  id?: number;
  selected?: boolean;
  props: SquareProps | StarProps;
};

export type SquareProps = {
  type: "square";
  hue?: number;
};

export type StarProps = {
  type: "star";
  r1?: number;
  r2?: number;
  n?: number;
  hue?: number;
};

type ShapeType = "square" | "star";

// unique ID for all shapes
let nextId = 0;

export class Model extends Subject {
/**
* @param n number of initial squares to create
*/
  constructor(n: number = 8) {
    super();
  
    // create initial squares
    for (let i = 0; i < n; i++) {
      this._shapes.push(this.createRandomShape("square"));
    }
  }
  
  private createRandomShape(type: ShapeType): Shape {
    switch (type) {
      case "square":
        return {
          id: nextId++,
          props: {
            type: "square",
            hue: Math.round(random(0, 360)),
          } as SquareProps,
          selected: false,
        };
      case "star":
        return {
          id: nextId++,
          props: {
            type: "star",
            hue: Math.round(random(0, 360)),
            r1: 15,
            r2:Math.round(random(20, 45)),
            n: Math.round(random(3, 10)),
          } as StarProps,
          selected: false,
        };
    }
  }

  addShape(type: "square" | "star") {
    const s = this.createRandomShape(type);
    this._shapes.push(s);
    this.notifyObservers();
  } 
  
  readonly maxShapes = 20;
  readonly minShapes = 0;

  // array of all shapes
  private _shapes: Shape[] = [];
  get shapes(): readonly Shape[] {
    // return a copy of the arrray to prevent mutation
    return [...this._shapes];
  }

  /**
   * deselect all shapes except the one passed in
   * @param shape
   */
  _deSelectAllBut(shape?: Shape) {
    this._shapes
      .filter((s) => s !== shape)
      .forEach((s) => (s.selected = false));
  }

  select(id: number = -1) {
    const shape = this._shapes.find((s) => s.id === id);
    if (!shape) return;
    if (!this.multiSelectMode) this._deSelectAllBut(shape);
    shape.selected = true;
    this.notifyObservers();
  }

  deSelect(id: number = -1) {
    const shape = this._shapes.find((s) => s.id === id);
    if (!shape) return;
    if (!this.multiSelectMode) this._deSelectAllBut(shape);
    shape.selected = false;
    this.notifyObservers();
  }

  deSelectAll() {
    this._deSelectAllBut();
    this.notifyObservers();
  }

  /**
   * Number of selected shapes
   */
  get numSelected() {
    return this._shapes.filter((s) => s.selected).length;
  }

  private _editingId: number | null = null;

  /**
   * Get the shape currently being edited, undefined if not editing
   */
  get editShape() {
    return this._shapes.find((s) => s.id === this._editingId);
  }

  /**
   * Set a shape to be edited
   * @param id shape id to edit, or null to stop editing
   */
  edit(id: number | null = null) {
    this._editingId = id;
    this.notifyObservers();
  }

  /**
   * Set the properties of the shape being edited
   * @param props
   */
  setEditShapeProps(props: SquareProps | StarProps) {
    if (this.editShape) {
      const p = { ...this.editShape.props, ...props };
      this.editShape.props = p;
      this.notifyObservers();
    }
  }

  deleteSelectedShapes() {
    this._shapes = this._shapes.filter((s) => !s.selected);
    this.notifyObservers();
  }

  deleteAllShapes() {
    this._shapes = [];
    this.notifyObservers();
  }

  /**
   * Multi-select mode (e.g. when shift key is held down)
   */
  private __multiSelectMode = false;
  public get multiSelectMode() {
    return this.__multiSelectMode;
  }
  public set multiSelectMode(value) {
    this.__multiSelectMode = value;
    this.notifyObservers();
  }
}




