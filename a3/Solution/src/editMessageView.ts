// local imports
import View from "./view";
import { Model } from "./model";

import "./editMessageView.css";

export class EditMessageView implements View {
  // #region observer pattern

  update() {
    const n = this.model.numSelected;
    
    if (n < 1) {
        this.message.innerText = "Select One";
    } else if (n === 1) {
        // should never happen, but good for testing
        this.message.innerText = "Edit";
    } else {
        this.message.innerText = "Too Many Selected";
    }
  }

  // #endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  private message = document.createElement("p");

  constructor(private model: Model) {
      // setup the view root container
      this.container = document.createElement("div");
      this.container.id = "edit-msg";

      // add message to container
      this.container.appendChild(this.message);

      // register with the model
      this.model.addObserver(this);
  }
}
