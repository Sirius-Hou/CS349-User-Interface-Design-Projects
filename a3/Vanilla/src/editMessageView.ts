// local imports
import View from "./view";
import { Model } from "./model";

import { Observer } from "./observer";

import "./editMessageView.css";

export class EditMessageView implements View, Observer {
  //#region observer pattern

  update(): void {
    const n = this.model.numSelected;

    if (n < 1) {
      this.message.textContent = "Select One";
    } else if (n > 1) {
      this.message.textContent = "Too Many Selected";
    } else {
      this.message.textContent = "Edit";
    }
  }

  message: HTMLDivElement = document.createElement('div');

  //#endregion

  // the actual HTML element hosting this view
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    // setup the view
    this.container = document.createElement("div");
    this.container.id = "editMessageView";

    // set initial text for the message
    this.message.textContent = "Select One";
    this.message.id = "editMessage";

    // append the message to the container
    this.container.appendChild(this.message);

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}