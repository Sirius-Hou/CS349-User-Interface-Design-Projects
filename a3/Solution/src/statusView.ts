// local imports
import View from "./view";
import { Model } from "./model";

import "./statusView.css";

export class StatusView implements View {
  //#region observer pattern

  update() {
    // left side of status about shape numbers
    const shapeNum = this.model.shapes.length;
    this.left.innerText =
      `${shapeNum} shapes ` +
      (shapeNum === this.model.maxShapes ? "FULL" : "");
    // right side of status about selections
    const selectNum = this.model.numSelected;
    this.right.innerText =
      (this.model.multiSelectMode ? "SHIFT" : "") +
      ` ${selectNum > 0 ? `selected ${selectNum}` : ""}`;
  }

  //#endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  left = document.createElement("span");
  right = document.createElement("span");

  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div");
    this.container.id = "status";

    // add spans to container
    this.container.appendChild(this.left);
    this.container.appendChild(this.right);

    // register with the model
    this.model.addObserver(this);
  }
}
