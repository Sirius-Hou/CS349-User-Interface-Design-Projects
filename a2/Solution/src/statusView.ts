import {
  SKContainer,
  SKLabel,
  Layout,
} from "simplekit/imperative-mode";

// local imports
import { Observer } from "./observer";
import { Model } from "./model";

export class StatusView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    // left side of status about shape numbers
    const shapeNum = this.model.shapes.length;
    this.left.text = `${shapeNum} shapes ${
      shapeNum === this.model.maxShapes ? "FULL" : ""
    }`;
    // right side of status about selections
    const selectNum = this.model.numSelected;
    this.right.text = `${this.model.multiSelectMode ? "SHIFT" : ""} ${
      selectNum > 0 ? "selected " + selectNum : ""
    }`;
  }

  //#endregion

  left = new SKLabel({ text: "?" });
  right = new SKLabel({ text: "selection" });

  constructor(private model: Model) {
    super();

    // setup the view
    this.id = "status";

    this.fill = "lightgray";
    this.height = 50;
    this.padding = 10;
    this.fillWidth = 1;

    // this view's layout method
    this.layoutMethod = Layout.makeFillRowLayout();

    // this.left.debug = true;
    this.left.align = "left";
    this.left.fillWidth = 1;
    this.addChild(this.left);

    // this.right.debug = true;
    this.right.align = "right";
    this.right.fillWidth = 1;
    this.addChild(this.right);

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}
