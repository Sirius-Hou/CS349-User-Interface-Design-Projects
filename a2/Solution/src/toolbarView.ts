import { SKContainer, Layout } from "simplekit/imperative-mode";
import { MySKButton } from "./myButton";

// local imports
import { Observer } from "./observer";
import { Model } from "./model";

export class ToolbarView extends SKContainer implements Observer {
  // #region observer pattern

  update(): void {
    // local var for model to make code cleaner
    const m = this.model;
    // add buttons enabled only if less than max shapes
    this.addButton.enabled = m.shapes.length < m.maxShapes;
    this.addStarButton.enabled = m.shapes.length < m.maxShapes;
    // delete button enabled only if shapes selected
    this.deleteButton.enabled = m.numSelected > 0;
    // clear button enabled only if there are some shapes
    this.clearButton.enabled = m.shapes.length > m.minShapes;
  }

  //#endregion

  addButton = new MySKButton({ text: "Add", width: 80 });
  addStarButton = new MySKButton({ text: "Add Star", width: 80 });
  deleteButton = new MySKButton({ text: "Delete", width: 80 });
  clearButton = new MySKButton({ text: "Clear", width: 80 });

  constructor(private model: Model) {
    super();

    // setup the view

    // for debugging
    this.id = "toolbar";
    // this.debug = true;

    this.fill = "lightgrey";
    this.padding = 10;
    this.height = 50;
    this.fillWidth = 1;

    // this view's layout method
    this.layoutMethod = Layout.makeFillRowLayout({ gap: 10 });

    // add the buttons
    this.addChild(this.addButton);
    this.addButton.addEventListener("action", () => {
      this.model.addShape("square");
    });

    this.addChild(this.addStarButton);
    this.addStarButton.addEventListener("action", () => {
      this.model.addShape("star");
    });

    // delete button setup
    this.addChild(this.deleteButton);
    this.deleteButton.addEventListener("action", () => {
      this.model.deleteSelectedShapes();
    });

    // clear button setup
    this.addChild(this.clearButton);
    this.clearButton.addEventListener("action", () => {
      this.model.deleteAllShapes();
    });

    // register with the model when we're ready
    this.model.addObserver(this);
  }
  
}