import { computed, signal } from "@preact/signals";
import { random } from "./utility";
import { Command, UndoManager } from "./undo";

export const undoManager = new UndoManager();

export const undo = () => {
  undoManager.undo();
}

export const redo = () => {
  undoManager.redo();
}

export const canUndo = () =>{
  return undoManager.canUndo;
}

export const canRedo = () => {
  return undoManager.canRedo;
}


// shape properties
export type ShapeProps = {
  id?: number;
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
  hue1?: number;
  hue2?: number;
  rings?: number;
};

export type CatProps = {
  type: "cat";
  hue?: number;
  look?: "left" | "right" | "centre";
};


export type ShapeType = "square" | "star" | "bullseye" | "cat";

// unique ID for all shapes
let nextId = 0;

export const maxShapes = 25;
export const minShapes = 0;

export const shapes = signal<ShapeProps[]>([]);
export const numShapes = computed(() => shapes.value.length);
export const numSelected = computed(() => shapes.value.filter((s) => s.selected).length);

export const editingId = signal<number | null>(null);
export const editingShape = computed(() => {
  return shapes.value.find((s) => s.selected);
});

export const multiSelectMode = signal<boolean>(false);

function createRandomShape(type: ShapeType) {
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
    case "bullseye":
      return {
        id: nextId++,
        props: {
          type: "bullseye",
          hue1: Math.round(random(0, 360)),
          hue2: Math.round(random(0, 360)),
          rings: Math.round(random(2, 5)),
        } as BullseyeProps,
        selected: false,
      };
    case "cat":
      return {
        id: nextId++,
        props: {
          type: "cat",
          hue: Math.round(random(0, 360)),
          look: ["left", "right", "centre"][Math.round(random(0, 3))],
        } as CatProps,
        selected: false,
      };
  }
}

export const addShape = (type: ShapeType) => {
  const shape = createRandomShape(type);

  undoManager.execute({
    do: () => {
      shapes.value = [...shapes.value, shape];
    },
    undo: () => {
      shapes.value = shapes.value.slice(0, -1);
    },
  } as Command);

  shapes.value = [...shapes.value, shape];
}


for (let i = 0; i < 8; i++) {
  const shape = createRandomShape("square");
  shapes.value = [...shapes.value, shape];
}




export const deSelectAllBut = (shape?: ShapeProps) => {
  shapes.value = shapes.value.map(s => 
    s !== shape ? { ...s, selected: false } : s
  );
}



export const select = (id: number = -1) => {
  const index = shapes.value.findIndex((s) => s.id === id);
  if (index === -1) return;

  // save the old shapes
  const oldShapesCopy = [...shapes.value];

  if (!multiSelectMode.value) deSelectAllBut(shapes.value[index]);

  // Create a new array where the selected shape is replaced with a new object
  shapes.value = shapes.value.map((shape, i) => 
    i === index ? { ...shape, selected: true } : shape
  );

  // save the new shapes
  const newShapesCopy = [...shapes.value];

  undoManager.execute({
    do: () => {
      shapes.value = newShapesCopy;
    },
    undo: () => {
      shapes.value = oldShapesCopy;
    },
  } as Command);
  
  if (numSelected.value === 1) {
    editingId.value = shapes.value[index].id ?? null;
  }
}

export const deSelect = (id: number = -1) => {
  const index = shapes.value.findIndex((s) => s.id === id);
  if (index === -1) return;

  // Save the old shapes
  const oldShapesCopy = [...shapes.value];

  // Create a new array where the deselected shape is replaced with a new object
  shapes.value = shapes.value.map((shape, i) => 
    i === index ? { ...shape, selected: false } : shape
  );

  // Save the new shapes
  const newShapesCopy = [...shapes.value];

  undoManager.execute({
    do: () => {
      shapes.value = newShapesCopy;
    },
    undo: () => {
      shapes.value = oldShapesCopy;
    },
  } as Command);
};



export const deSelectAll = () => {
  // Save the old shapes
  const oldShapesCopy = [...shapes.value];

  deSelectAllBut();

  // Save the new shapes
  const newShapesCopy = [...shapes.value];

  undoManager.execute({
    do: () => {
      shapes.value = newShapesCopy;
    },
    undo: () => {
      shapes.value = oldShapesCopy;
    },
  } as Command);
};


export const edit = (id: number | null = null) => {
  editingId.value = id;
}

export const setEditShapeProps = (props: SquareProps | StarProps | BullseyeProps | CatProps) => {
  let shape = editingShape.value;
  if (shape) {
    const p = { ...shape.props, ...props };
    shapes.value = shapes.value.map((s) =>
      s.id === shape?.id ? { ...s, props: p } : s
    );
  }
}


export const deleteSelectedShapes = () => {
  const oldShapesCopy = [...shapes.value];
  const currUnselectedShapesCopy = [...shapes.value.filter((s) => !s.selected)];

  shapes.value = [...currUnselectedShapesCopy.map((s) => {
    return { ...s, selected: false };
  })];
  const newShapesCopy = [...shapes.value];

  undoManager.execute({
    do: () => {
      shapes.value = newShapesCopy;
    },
    undo: () => {
      shapes.value = oldShapesCopy;
    },
  } as Command);
}


export const deleteAllShapes = () => {
  const currShapesCopy = [...shapes.value];

  undoManager.execute({
    do: () => {
      shapes.value = [];
    },
    undo: () => {
      shapes.value = currShapesCopy.map((s) => {
        return { ...s, selected: false };
      });
    },
  } as Command);

  shapes.value = [];
}

