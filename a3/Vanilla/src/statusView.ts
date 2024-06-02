// local imports
import View from "./view";
import { Model } from "./model";

import "./statusView.css";

export class StatusView implements View {
  //#region observer pattern

  update(): void {
    // left side of status about shape numbers
    const shapeNum = this.model.shapes.length;
    this.numShapesMessage.textContent = `${shapeNum} shapes ${
      shapeNum === this.model.maxShapes ? "FULL" : ""
    }`;
    // right side of status about selections
    const selectNum = this.model.numSelected;
    this.numSelectedMessage.textContent = `${this.model.multiSelectMode ? "SHIFT" : ""} ${
      selectNum > 0 ? "selected " + selectNum : ""
    }`;
  }

  //#endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  private numShapesMessage: HTMLDivElement;
  private numSelectedMessage: HTMLDivElement;

  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div");
    this.container.id = "statusView";

    // then setup the widgets in the container

    // number of shapes
    this.numShapesMessage = document.createElement("div");
    this.numShapesMessage.id = "numShapesMessage";
    this.numShapesMessage.textContent = `${this.model.shapes.length} shapes`;

    // number of selected shapes
    this.numSelectedMessage = document.createElement("div");
    this.numSelectedMessage.id = "numSelectedMessage";
    this.numSelectedMessage.textContent = `selected ${this.model.numSelected}`;

    // append the status to the container
    this.container.appendChild(this.numShapesMessage);
    // this.container.appendChild(this.shiftPressedMessage);
    this.container.appendChild(this.numSelectedMessage);
    

    // register with the model
    this.model.addObserver(this);
  }
}
