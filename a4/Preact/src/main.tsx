import { render } from "preact";
import { useState, useEffect } from "preact/hooks";
import * as State from "./state";
import ToolbarView from "./toolbarView";
import ListView from "./listView";
import StatusView from "./statusView";
import EditView from "./editView";
import "./main.css";

export default function App() {
  const [isShiftDown, setIsShiftDown] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Shift' && !isShiftDown) {
        // Handle shift key down
        setIsShiftDown(true);
      }

      if (event.key.toLowerCase() === 'z' && event.ctrlKey && !event.shiftKey) {
        // Handle undo command
        State.undo();
      }

      if (event.key.toLowerCase() === 'z' && event.ctrlKey && event.shiftKey) {
        // Handle redo command
        State.redo();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Shift' && isShiftDown) {
        // Handle shift key up
        setIsShiftDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    State.multiSelectMode.value = isShiftDown;

    return () => {
      // Clean up the event listeners when the component unmounts
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isShiftDown]);


  return (
    <>
      <div id="left">
        <ToolbarView />
        <ListView />
        <StatusView />
      </div>
      <div id="right">
        <EditView />
      </div>
    </>
  );
}

render(<App />, document.querySelector("div#app") as Element);
