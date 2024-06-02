import {
  Layout,
  SKContainer,
  setSKEventListener,
  setSKRoot,
  startSimpleKit,
} from "simplekit/imperative-mode";

// views
import { ToolbarView } from "./toolbarView";
import { ListView } from "./listView";
import { StatusView } from "./statusView";
import { EditView } from "./editView";

// my own layout
import { makeFillColLayout } from "./fillColumn";

// create the model
const model = new Model();

import { Model } from "./model";

// setup the root container
const root = new SKContainer();
root.layoutMethod = Layout.makeFillRowLayout({ gap: 0 });

// the left side
const left = new SKContainer();
left.fillHeight = 1;
left.fillWidth = 2;
left.layoutMethod = makeFillColLayout({ gap: 0 });

// toolbar
left.addChild(new ToolbarView(model));
//list
const list = new ListView(model);
list.fillHeight = 1;
list.fillWidth = 1;
left.addChild(list);
//status
left.addChild(new StatusView(model));
root.addChild(left);

// right side for editing
const edit = new EditView(model);
edit.fillWidth = 1;
edit.fillHeight = 1;
root.addChild(edit);

setSKEventListener((e) =>{
  switch (e.type) {
    // for the Shift click selection
    case "keydown":
      {
        const { key } = e as KeyboardEvent;
        if (key === "Shift") {
          model.multiSelectMode = true;
        }
      }
      break;
    case "keyup":
      {
        const { key } = e as KeyboardEvent;
        if (key === "Shift") {
          model.multiSelectMode = false;
        }
      }
      break;
  }
})

// // Set the app as the root of the UI tree
// setSKRoot(root);

startSimpleKit();

// Set the app as the root of the UI tree
setSKRoot(root);