import * as State from "./state";
import "./statusView.css";

export default function StatusView() {
  return (
    <div id="statusView">
      <label id="numShapesMessage"> {State.numShapes} shapes</label>
      <div>
        <button onClick={State.undo}
                disabled={!State.undoManager.undoNum.value}>Undo</button>
        <button onClick={State.redo}
                disabled={!State.undoManager.redoNum.value}>Redo</button>
      </div>
      <label id="numSelectedMessage">
        {State.multiSelectMode.value ? "SHIFT " : ""} {State.numSelected.value > 0 ? "selected " + State.numSelected.value : ""}
      </label>
    </div>
  );
}

