import { useState, useRef, useEffect } from "preact/hooks";

import * as State from "./state";

import "./toolbarView.css";

export default function ToolbarView() {
  const selectRef = useRef<HTMLSelectElement>(null);
  const [numSelected, setNumSelected] = useState(State.numSelected.value);

  useEffect(() => {
    const updateNumSelected = () => setNumSelected(State.numSelected.value);
    State.numSelected.subscribe(updateNumSelected);
  }, []);

  function handleAdd() {
    const shapeType = selectRef.current?.value;
    if (shapeType === undefined) return;

    State.addShape(shapeType as State.ShapeType);
  }

  function handleDelete() {
    State.deleteSelectedShapes();
  }

  function handleClear() {
    State.deleteAllShapes();
  }

  return (
    <div id="toolbarView">
      <button onClick={handleAdd}
              disabled={State.numShapes.value >= 25}> Add </button>

      <select id="selectMenu" ref={selectRef}>
        <option value="square">Square</option>
        <option value="star">Star</option>
        <option value="bullseye">Bullseye</option>
        <option value="cat">Cat</option>
      </select>

      <button onClick={handleDelete}
              disabled={numSelected <= 0}> Delete </button>

      <button onClick={handleClear}
              disabled={State.numShapes.value <= 0}> Clear </button>
    </div>
  );
}


