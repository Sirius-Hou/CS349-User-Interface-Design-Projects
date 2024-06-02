import {
  SKContainer,
  Layout,
  SKElement,
} from "simplekit/imperative-mode";

// local imports
import { Observer } from "./observer";
import { Model } from "./model";
import { EditMessageView } from "./editMessageView";
import { EditSquareView } from "./editSquareView";
import { EditStarView } from "./editStarView";

export class EditView extends SKContainer implements Observer {
  //#region observer pattern

  lastShapeID: number | undefined;

  update(): void {
    const editing = this.model.editShape;

    if (!editing) {
      // remove from observer list
      if (this.childView) this.model.removeObserver(this.childView);
      // remove from view
      this.clearChildren();
      // create new view
      this.childView = new EditMessageView(this.model);
      this.addChild(this.childView);
    } else if (editing.id !== this.lastShapeID) {
      // remove from observer list
      if (this.childView) this.model.removeObserver(this.childView);
      // remove from view
      this.clearChildren();
      // create new view
      this.childView =
        editing.props.type === "square"
          ? new EditSquareView(this.model)
          : new EditStarView(this.model);
      this.addChild(this.childView);
    }

    // save last shape ID so to avoid unnecessary view re-creation
    this.lastShapeID = this.model.editShape?.id;
  }

  //#endregion

  childView: (Observer & SKElement) | undefined;

  constructor(private model: Model) {
    super();

    // setup the view

    // for debugging
    this.id = "edit";
    // this.debug= true;

    // look & feel
    this.margin = 10;
    this.fillWidth = 1;
    this.fillHeight = 1;
    this.border = "1px solid black";

    // this view's layout method
    this.layoutMethod = Layout.makeCentredLayout();

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}
