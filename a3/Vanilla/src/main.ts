import { Model } from "./model";
import { ToolbarView } from "./toolbarView";
import { ListView } from "./listView";
import { StatusView } from "./statusView";
import { EditView } from "./editView";

import "./main.css"

const root = document.querySelector("div#app") as HTMLDivElement;
const model = new Model();

let shiftKeyDown = false;

window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "z" && e.ctrlKey && !e.shiftKey) {
    model.undo();
  }
  if (e.key.toLowerCase() === "z" && e.ctrlKey && e.shiftKey) {
    model.redo();
  }
  if (e.key === "Shift" && !shiftKeyDown) {
    model.multiSelectMode = true;
    shiftKeyDown = true;
  }
})

window.addEventListener("keyup", (e) => {
  if (e.key === "Shift") {
    model.multiSelectMode = false;
    shiftKeyDown = false;
  }
})


// create div to hold left-side views
const left = document.createElement("div");
left.id = "left";

// add views to left (will be stacked vertically)
left.appendChild(new ToolbarView(model).root);
left.appendChild(new ListView(model).root);
left.appendChild(new StatusView(model).root);

// add views to root (will be left and right areas)
root.appendChild(left);


root.appendChild(new EditView(model).root);
