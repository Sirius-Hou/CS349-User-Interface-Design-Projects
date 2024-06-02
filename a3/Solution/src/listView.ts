// local imports
import View from "./view";
import { Model } from "./model";

import "./listView.css";
import { drawShape } from "./drawShape";

export class ListView implements View {
  //#region observer pattern

  update() {
    // clear children, we're going to re-build everything
    this.container.replaceChildren();

    this.model.shapes.forEach((shape) => {
      // create canvas
      const shapeCanvas = document.createElement("canvas");
      shapeCanvas.width = 100;
      shapeCanvas.height = 100;
      const gc = shapeCanvas.getContext("2d");

      // should never happen
      if (!gc) {
        console.error("Could not get 2d context for shapeCanvas");
        return;
      }

      // draw shape on canvas
      drawShape(gc, shape.props);

      if (shape.selected) shapeCanvas.classList.add("selected");

      // create click event controller for shape
      shapeCanvas.addEventListener("click", (e) => {
        if (shape.selected) {
          this.model.deSelect(shape.id);
        } else {
          this.model.select(shape.id);
        }
        // stop "click" propagation to listView background
        e.stopPropagation();
      });

      this.root.appendChild(shapeCanvas);
    });
  }

  // #endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div");
    this.container.id = "list";

    // controller on parent div to deselect all shapes
    this.root.addEventListener("click", (_) => {
      this.model.deSelectAll();
      this.model.edit(null);
    });

    // register with the model
    this.model.addObserver(this);
  }
}
