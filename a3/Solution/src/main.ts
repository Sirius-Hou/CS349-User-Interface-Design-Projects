import "./style.css";

import { ToolbarView } from "./toolbarView";
import { ListView } from "./listView";
import { EditView } from "./editView";
import { StatusView } from "./statusView";

import "./main.css";

import { Model } from "./model";

console.log("a3-vanilla");

const model = new Model();

// root container (the div already in index.html)
const root = document.querySelector("div#app") as HTMLDivElement;

// create div to hold left-side views
const left = document.createElement("div");
left.id = "left";

// add views to left (will be stacked vertically)
left.appendChild(new ToolbarView(model).root);
left.appendChild(new ListView(model).root);
left.appendChild(new StatusView(model).root);

// add left views to root (to form left side)
root.appendChild(left);
// add edit view to root (will be right side)
root.appendChild(new EditView(model).root);

//#region global keyboard listeners…
let shiftKeyDown = false;

window.addEventListener("keydown", (e) => {
  // if (e.key.toLowerCase() === "z" && e.ctrlKey && !e.shiftKey) {
  //   model.undo();
  // }
  // if (e.key.toLowerCase() === "z" && e.ctrlKey && e.shiftKey) {
  //   model.redo();
  // }
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