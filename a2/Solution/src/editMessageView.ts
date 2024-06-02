import {
  SKContainer,
  SKLabel,
  Layout,
} from "simplekit/imperative-mode";

// local imports
import { Observer } from "./observer";
import { Model } from "./model";

export class EditMessageView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    const n = this.model.numSelected;

    if (n < 1) {
      this.message.text = "Select One";
    } else if (n > 1) {
      this.message.text = "Too Many Selected";
    } else {
      this.message.text = "Edit";
    }
  }

  message = new SKLabel({ text: "Select One to Edit" });

  //#endregion

  constructor(private model: Model) {
    super();
    this.layoutMethod = Layout.makeCentredLayout();
    this.addChild(this.message);

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}
