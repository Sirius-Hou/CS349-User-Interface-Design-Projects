import {
  SKContainer,
  startSimpleKit,
  setSKRoot,
  Layout,
  setSKEventListener,
  SKKeyboardEvent,
} from "simplekit/imperative-mode";
import { makeFillColLayout } from "./fillCol";
import { Model } from "./model";
import { ShapeList } from "./shapeList";
import { StatusBar } from "./statusbar";
import { ToolBar } from "./toolbar";
import { RightContainer } from "./rightContainer";

// data
const model = new Model();

// root container
const root = makeContainer("root", "whitesmoke");

setSKEventListener((e) => {
  if (e.type == "keydown") {
    const me = e as SKKeyboardEvent;
    if (me.key === "Shift") {
      console.log("shift pressed");
      model.shiftPressed();
    }
  } else if (e.type == "keyup") {
      const me = e as SKKeyboardEvent;
      if (me.key === "Shift") {
        console.log("shift released");
        model.shiftReleased();
      }
    }
});

//Settings.debug = true;


// Left and right containers
const leftContainer = makeContainer("left", "white");
leftContainer.fillWidth = 0.66;
leftContainer.fillHeight = 1;
const rightContainer = new RightContainer(model);

root.addChild(leftContainer);
root.addChild(rightContainer);
root.layoutMethod = Layout.makeFillRowLayout();

// Toolbar, shape list, and status bar
const toolbar = new ToolBar(model);
const shapeList = new ShapeList(model);
const statusbar = new StatusBar(model);

leftContainer.addChild(toolbar);
leftContainer.addChild(shapeList);
leftContainer.addChild(statusbar);
leftContainer.layoutMethod = makeFillColLayout();



// Start with 8 random squares
for (let i = 0; i < 8; i++) {
  model.addSquare();
}

startSimpleKit();

// Set the app as the root of the UI tree
setSKRoot(root);

// helper function to make a container
function makeContainer(id: string, fill: string): SKContainer {
  const container = new SKContainer();
  container.id = id;
  container.fill = fill;
  return container;
}

