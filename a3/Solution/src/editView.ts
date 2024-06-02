import { Model } from "./model";
import View from "./view";
import { EditMessageView } from "./editMessageView";
import { EditShapeView } from "./editShapeView";

import "./editView.css";



export class EditView implements View {

  lastShapeType: string | undefined;
  lastShapeID: number | undefined;
    
    
  update(): void {
    const editing = this.model.editShape;
    if (!editing) {
      // *** not editing, so show message view ***
      // remove old child view from this view
      this.container.replaceChildren();
      // remove old child view from observer list
      if (this.childView) this.model.removeObserver(this.childView);
      // create new message view
      this.childView = new EditMessageView(this.model);
      this.container.appendChild(this.childView.root);
    } else if (editing.props.type !== this.lastShapeType) {
      // *** editing a new kind of shape, so create new shape editor view ***
      // remove old child view from this view
      this.container.replaceChildren();
      // remove old child view from observer list
      if (this.childView) this.model.removeObserver(this.childView);
      // create new edit shape view
      this.childView = new EditShapeView(
          this.model,
          editing.props.type
      );
      this.container.appendChild(this.childView.root);
    }
  
    // save last shape ID to avoid unnecessary view re-creation
    // (will be null if not editing)
    this.lastShapeID = this.model.editShape?.id;
    this.lastShapeType = this.model.editShape?.props.type;
  }

  private childView: View | undefined;

  // the view root container
  private container: HTMLDivElement;

  get root(): HTMLDivElement {return this.container;}

  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div")
    this.container.id = "edit";
    // register with the model
    this.model.addObserver(this);
  }
}