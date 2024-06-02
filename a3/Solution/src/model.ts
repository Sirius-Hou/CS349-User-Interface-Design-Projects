import { Subject } from "./observer";
import { random } from "./utility";

// shape properties
export type Shape = {
  id: number;
  selected?: boolean;
  props: SquareProps | StarProps | BullseyeProps | CatProps;
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

export type BullseyeProps = {
  type: "bullseye";
  rings?: number;
  hue?: number;
  hue2?: number;
};

export type CatProps = {
  type: "cat";
  hue?: number;
  look?: "left" | "right" | "centre";
};

export type ShapeType = "square" | "star" | "bullseye" | "cat";

export type ShapePropsType = 
  | SquareProps
  | StarProps
  | BullseyeProps
  | CatProps;

// unique ID for all shapes
let nextId = 0;

export class Model extends Subject {
  /** 
   * @param n number of initial squares to create
   */
  constructor(n: number = 8) {
    super();

    // create initial squares
    this._shapes = [...Array(n)].map(() =>
      this.createRandomShape("square")
    );
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
            r2: Math.round(random(20, 45)),
            n: Math.round(random(3, 10)),
          } as StarProps,
          selected: false,
        };
      case "bullseye":
        return {
          id: nextId++,
          props: {
            type: "bullseye",
            hue: Math.round(random(0, 360)),
            hue2: Math.round(random(0, 360)),
            rings: Math.round(random(2, 5)),
          } as BullseyeProps,
          selected: false,
        };
      case "cat":
        function randomLook() {
          const r = Math.random();
          if (r < 0.33) return "left";
          if (r < 0.66) return "centre";
          return "right";
        }
        return {
          id: nextId++,
          props: {
            type: "cat",
            hue: Math.round(random(0, 360)),
            look: randomLook(),
          } as CatProps,
          selected: false,
        };
    }
  }

  addShape(type: ShapeType = "square") {
    const s = this.createRandomShape(type);
    this._shapes.push(s);
    this.notifyObservers();
  } 
  
  readonly maxShapes = 25;
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
    this._editingId = this.numSelected === 1 ? shape.id : null;
    this.notifyObservers();
  }

  deSelect(id: number = -1) {
    const shape = this._shapes.find((s) => s.id === id);
    if (!shape) return;
    if (!this.multiSelectMode) this._deSelectAllBut(shape);
    shape.selected = false;
    // if only one shape selected, then set it to be edited
    if (this.numSelected === 1) {
      const editShape = this._shapes.find((s) => s.selected);
      if (editShape) this._editingId = editShape?.id;
    } else {
      this._editingId = null;
    }
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
  setEditShapeProps(props: SquareProps | StarProps | BullseyeProps | CatProps) {
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

















































// // shape properties
// export type ShapeProps = {
//   id?: number;
//   selected?: boolean;
//   props: SquareProps | StarProps | BullseyeProps | CatProps;
// };

// export type SquareProps = {
//   type: "square";
//   hue?: number;
// };

// export type StarProps = {
//   type: "star";
//   r1?: number;
//   r2?: number;
//   n?: number;
//   hue?: number;
// };

// export type BullseyeProps = {
//   type: "bullseye";
//   hue1?: number;
//   hue2?: number;
//   rings?: number;
// };

// export type CatProps = {
//   type: "cat";
//   hue?: number;
//   look?: "left" | "right" | "centre";
// };


// type ShapeType = "square" | "star" | "bullseye" | "cat";



// type ActionType = "add" | "delete" | "edit";

// type Action = {
//   type: ActionType;
//   shapes: ShapeProps[];
// };


// // unique ID for all shapes
// let nextId = 0;

// export class Model extends Subject {
// /**
// * @param n number of initial squares to create
// */

//   // set the generic type ot number
//   private undoManager = new UndoManager();

//   undo() {
//     this.undoManager.undo();
//     this.notifyObservers();
//   }

//   redo() {
//     this.undoManager.redo();
//     this.notifyObservers();
//   }

//   get canUndo() {
//     return this.undoManager.canUndo;
//   }

//   get canRedo() {
//     return this.undoManager.canRedo;
//   }




//   constructor(n: number = 8) {
//     super();
  
//     // create initial squares
//     for (let i = 0; i < n; i++) {
//       this._shapes.push(this.createRandomShape("square"));
//     }
//   }
  
//   private createRandomShape(type: ShapeType): ShapeProps {
//     switch (type) {
//       case "square":
//         return {
//           id: nextId++,
//           props: {
//             type: "square",
//             hue: Math.round(random(0, 360)),
//           } as SquareProps,
//           selected: false,
//         };
//       case "star":
//         return {
//           id: nextId++,
//           props: {
//             type: "star",
//             hue: Math.round(random(0, 360)),
//             r1: 15,
//             r2:Math.round(random(20, 45)),
//             n: Math.round(random(3, 10)),
//           } as StarProps,
//           selected: false,
//         };
//       case "bullseye":
//         return {
//           id: nextId++,
//           props: {
//             type: "bullseye",
//             hue1: Math.round(random(0, 360)),
//             hue2: Math.round(random(0, 360)),
//             rings: Math.round(random(2, 5)),
//           } as BullseyeProps,
//           selected: false,
//         };
//       case "cat":
//         return {
//           id: nextId++,
//           props: {
//             type: "cat",
//             hue: Math.round(random(0, 360)),
//             look: ["left", "right", "centre"][Math.round(random(0, 3))],
//           } as CatProps,
//           selected: false,
//         };
//     }
//   }


//   private _addShapeType: ShapeType = "square";

//   get addShapeType() {
//     return this._addShapeType;
//   }

//   changeAddShapeType(type: ShapeType) {
//     this._addShapeType = type;
//     this.notifyObservers();
//   }

//   addShape() {
//     const s = this.createRandomShape(this._addShapeType);
//     this._shapes.push(s);

//     this.undoManager.execute({
//       do: () => {
//         this._shapes.push({...s, selected: false});
//       },
//       undo: () => {
//         this._shapes = this._shapes.filter((shape) => shape.id !== s.id);
//       },
//     } as Command);
    
//     this.notifyObservers();
//   } 

//   readonly maxShapes = 25;
//   readonly minShapes = 0;

//   // array of all shapes
//   private _shapes: ShapeProps[] = [];
//   get shapes(): readonly ShapeProps[] {
//     // return a copy of the arrray to prevent mutation
//     return [...this._shapes];
//   }

//   /**
//    * deselect all shapes except the one passed in
//    * @param shape
//    */
//   _deSelectAllBut(shape?: ShapeProps) {
//     this._shapes
//       .filter((s) => s !== shape)
//       .forEach((s) => (s.selected = false));
//   }

//   select(id: number = -1) {
//     const shape = this._shapes.find((s) => s.id === id);
//     if (!shape) return;
//     if (!this.multiSelectMode) this._deSelectAllBut(shape);
//     shape.selected = true;
//     this.notifyObservers();
//   }

//   deSelect(id: number = -1) {
//     const shape = this._shapes.find((s) => s.id === id);
//     if (!shape) return;
//     if (!this.multiSelectMode) this._deSelectAllBut(shape);
//     shape.selected = false;
//     this.notifyObservers();
//   }

//   deSelectAll() {
//     this._deSelectAllBut();
//     this.notifyObservers();
//   }

//   /**
//    * Number of selected shapes
//    */
//   get numSelected() {
//     return this._shapes.filter((s) => s.selected).length;
//   }

//   private _editingId: number | null = null;

//   /**
//    * Get the shape currently being edited, undefined if not editing
//    */
//   get editShape() {
//     return this._shapes.find((s) => s.id === this._editingId);
//   }

//   /**
//    * Set a shape to be edited
//    * @param id shape id to edit, or null to stop editing
//    */
//   edit(id: number | null = null) {
//     this._editingId = id;
//     this.notifyObservers();
//   }

//   /**
//    * Set the properties of the shape being edited
//    * @param props
//    */
//   setEditShapeProps(props: SquareProps | StarProps | BullseyeProps | CatProps) {
//     const originalShape = this.editShape;
//       const originalProps = this.editShape!.props;
//       const originalShapeId = this.editShape!.id;
//       //undo update command
//       this.undoManager.execute({
//         do: () => {
//           if (!this.editShape) {
//             if (this._shapes.find((s) => s.id === originalShapeId)) {
//               this._shapes = this._shapes.map((s) =>
//                 s.id === originalShapeId ? { ...s, props } : s
//               );
//             }
//             return;
//           }
//           if (this.editShape.id !== originalShapeId) return;
//           const p = { ...this.editShape?.props, ...props };
//           this.editShape.props = p;
//         },
//         undo: () => {
//           if (!this.editShape) {
//             if (this._shapes.find((s) => s.id === originalShapeId)) {
//               this._shapes = this._shapes.map((s) =>
//                 s.id === originalShapeId ? { ...s, props: originalProps } : s
//               );
//             }
//             return;
//           }
//           if (this.editShape.id !== originalShapeId) return;
//           this.editShape.props = originalProps;
//         },
//       } as Command);
//       const p = { ...this.editShape!.props, ...props };
//       this.editShape!.props = p;
//       this.notifyObservers();




//     // if (this.editShape) {
//     //   const p = { ...this.editShape.props, ...props };
//     //   const editShapeID = this.editShape.id;
//     //   const currEditShapeProps = this._shapes.find((s) => s.id === editShapeID);
//     //   if (!currEditShapeProps) return;

//     //   this.undoManager.execute({
//     //     do: () => {
//     //       this._shapes = this._shapes.map((s) =>
//     //         s.id === editShapeID ? { ...s, props: p } : s
//     //       );
//     //     },


//     //       // this._shapes = this._shapes.map((s) => {
//     //       //   if (s.id === editShapeID) {
//     //       //     return { ...s, props: p };
//     //       //   }
//     //       //   return s;
//     //       // }

//     //     undo: () => {
//     //       this._shapes = this._shapes.map((s) =>
//     //         s.id === editShapeID ? currEditShapeProps : s
//     //       );

//     //       // this._shapes = this._shapes.map((s) => {
//     //       //   if (s.id === editShapeID) {
//     //       //     return { ...s, props: currEditShapeProps };
//     //       //   }
//     //       //   return s;
//     //       // });
          

//     //     },
//     //   } as Command);


//     //   this.editShape.props = p;
//     //   this.notifyObservers();
//     // }
//   }

//   deleteSelectedShapes() {
//     const currShapesCopy = [...this.shapes];
//     const currUnselectedShapesCopy = [...this._shapes.filter((s) => !s.selected)];

//     this.undoManager.execute({
//       do: () => {
//         this._shapes = [...currUnselectedShapesCopy.map((s) => {
//           return { ...s, selected: false };
//         })];
//       },
//       undo: () => {
//         this._shapes = [...currShapesCopy.map((s) => {
//           return { ...s, selected: false };
//         })];
//       },
//     } as Command);

//     this._shapes = currUnselectedShapesCopy;
//     this.notifyObservers();
//   }

//   deleteAllShapes() {
//     const currShapesCopy = [...this.shapes];
//     this.undoManager.execute({
//       do: () => {
//         this._shapes = [];
//       },
//       undo: () => {
//         this._shapes = currShapesCopy.map((s) => {
//           return { ...s, selected: false };
//         });
//       },
//     } as Command);


//     this._shapes = [];
//     this.notifyObservers();
//   }

//   /**
//    * Multi-select mode (e.g. when shift key is held down)
//    */
//   private __multiSelectMode = false;
//   public get multiSelectMode() {
//     return this.__multiSelectMode;
//   }
//   public set multiSelectMode(value) {
//     this.__multiSelectMode = value;
//     this.notifyObservers();
//   }
// }


















