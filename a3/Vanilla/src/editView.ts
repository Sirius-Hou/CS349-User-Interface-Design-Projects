// local imports
import { Model } from "./model";
import View from "./view";

import { Observer } from "./observer";
import { EditMessageView } from "./editMessageView";
import { EditSquareView } from "./editSquareView";
import { EditStarView } from "./editStarView";
import { EditCatView } from "./editCatView";
import { EditBullseyeView } from "./editBullseyeView";

import "./editView.css";


export class EditView implements View, Observer {
  //#region observer pattern
  lastShapeID: number | undefined;

  update(): void {
    const editing = this.model.editShape;

    if (!editing) {
      // remove from observer list
      if (this.childView) this.model.removeObserver(this.childView);

      // remove from view
      this.container.replaceChildren();

      // create new view
      this.container.appendChild(new EditMessageView(this.model).root);

    }

    else if (editing.id !== this.lastShapeID) {
      // remove from observer list
      if (this.childView) this.model.removeObserver(this.childView);

      // remove from view
      this.container.replaceChildren();



      switch (editing.props.type) {
        case "square":
          this.container.appendChild(new EditSquareView(this.model).root);
          break;

        case "star":
          this.container.appendChild(new EditStarView(this.model).root);
          break;

        case "bullseye":
          this.container.appendChild(new EditBullseyeView(this.model).root);
          break;

        case "cat":
          this.container.appendChild(new EditCatView(this.model).root);
          break;
      };



    }

    // save last shape ID so to avoid unnecessary view re-creation
    this.lastShapeID = this.model.editShape?.id;
  }

  //#endregion

  childView: Observer | undefined;

  // the actual HTML element hosting this view
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    // setup the view
    this.container = document.createElement("div");
    this.container.id = "right";

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}
