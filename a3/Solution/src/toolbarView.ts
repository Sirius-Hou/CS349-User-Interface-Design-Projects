import html from "html-template-tag";

// local imports
import View from "./view";
import { Model } from "./model";

import "./toolbarView.css";

export class ToolbarView implements View {
  //#region observer pattern

  update(): void {
    // local var for model to make code cleaner
    const m = this.model;
    // add button enabled only if less than max shapes
    this.addButton.disabled = m.shapes.length >= m.maxShapes;
    // delete button enabled only if shapes selected
    this.deleteButton.disabled = m.numSelected === 0;
    // clear button enabled only if there are some shapes
    this.clearButton.disabled = m.shapes.length <= m.minShapes;
  }

  //#endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  private addButton = document.createElement("button");
  private deleteButton = document.createElement("button");
  private clearButton = document.createElement("button");

  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div");
    this.container.id = "toolbar";

    // add button
    this.container.appendChild(this.addButton);
    this.addButton.innerText = "Add";
    this.addButton.addEventListener("click", () => {
      const select = this.container.querySelector(
        "select"
      ) as HTMLSelectElement;
      const shapeType = select.value as
        | "square"
        | "star"
        | "bullseye"
        | "cat";
      this.model.addShape(shapeType);
    });

    // select element (we don't need a ref, just create it)
    this.container.insertAdjacentHTML(
      "beforeend",
      html`
      <select name="" id="shapeType">
        <option value="square">Square</option>
        <option value="star">Star</option>
        <option value="bullseye">Bullseye</option>
        <option value="cat">Cat</option>
      </select>
      `
    );
    // delete button
    this.container.appendChild(this.deleteButton);
    this.deleteButton.innerText = "Delete";
    this.deleteButton.addEventListener("click", () => {
      this.model.deleteSelectedShapes();
    });

    // clear button
    this.container.appendChild(this.clearButton);
    this.clearButton.innerText = "Clear";
    this.clearButton.addEventListener("click", () => {
      this.model.deleteAllShapes();
    });

    // initial update
    this.update();
  }
}