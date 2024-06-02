// local imports
import View from "./view";
import { Model } from "./model";

import "./toolbarView.css";

export class ToolbarView implements View {
  //#region observer pattern

  update(): void {
    // update the widgets
    this.addButton.disabled = this.model.shapes.length === this.model.maxShapes;
    this.deleteButton.disabled = this.model.numSelected === 0;
    this.clearButton.disabled = this.model.shapes.length === 0;
  }

  //#endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  private addButton: HTMLButtonElement;
  private deleteButton: HTMLButtonElement;
  private clearButton: HTMLButtonElement;
  private selectMenu: HTMLSelectElement;

  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div");
    this.container.id = "toolbar";

    // then setup the widgets in the container


    // add button
    this.addButton = document.createElement("button");
    this.addButton.innerText = "Add";
    this.addButton.addEventListener("click", () => {
      this.model.addShape();
    });
    this.container.appendChild(this.addButton);










    // select menu
    this.selectMenu = document.createElement("select");
    this.selectMenu.id = "selectMenu";

    // create the option elements
    const options = ["Square", "Star", "Bullseye", "Cat"];
    options.forEach(optionValue => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = optionValue;
      if (optionValue === "Square") {
        option.selected = true;
      }
      this.selectMenu.appendChild(option);
    });


    this.selectMenu.addEventListener("change", () => {
      const selectedOption = this.selectMenu.value.toLowerCase() as "square" | "star" | "bullseye" | "cat";

      this.model.changeAddShapeType(selectedOption as "square" | "star" | "bullseye" | "cat");
    });
    this.container.appendChild(this.selectMenu);


    // delete button
    this.deleteButton = document.createElement("button");
    this.deleteButton.innerText = "Delete";
    this.deleteButton.addEventListener("click", () => {
      this.model.deleteSelectedShapes();
    });
    this.container.appendChild(this.deleteButton);


    // clear button
    this.clearButton = document.createElement("button");
    this.clearButton.innerText = "Clear";
    this.clearButton.addEventListener("click", () => {
      this.model.deleteAllShapes();
    });
    this.container.appendChild(this.clearButton);
    

    // register with the model
    this.model.addObserver(this);
  }
}
