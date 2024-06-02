import { SKContainer, Layout } from "simplekit/imperative-mode";

// local imports
import { Observer } from "./observer";
import { Model } from "./model";
import { SKShape, SKSquare, SKStar } from './shape';

export class ListView extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    this.clearChildren();
    this.model.shapes.forEach((shape) => {
      let shapeWidget: SKShape;
      switch (shape.props.type) {
        case "square":
          shapeWidget = new SKSquare({
            width: 50,
            height: 50,
            id: shape.id,
            fill: `hsl(${shape.props.hue}, 100%, 50%)`,
          });
          break;
        case "star":
          shapeWidget = new SKStar({
            width: 50,
            height: 50,
            id: shape.id,
            fill: `hsl(${shape.props.hue}, 100%, 50%)`,
            r1: shape.props.r1,
            r2: shape.props.r2,
            n: shape.props.n,
          });
          break;
      }

      shapeWidget.isSelected = shape.selected === true;

      // create click event controller for shape
      shapeWidget.addEventListener("click", (_) => {
        if (shape.selected) {
          this.model.deSelect(shape.id);
        } else {
          this.model.select(shape.id);
        }
        // if only one selected, then put it in the editor
        if (this.model.numSelected === 1) {
          const selectedShape = this.model.shapes.find(
            (s) => s.selected
          );
          if (selectedShape) this.model.edit(selectedShape.id);
        } else {
          this.model.edit(null);
        }
        // return true to stop "click" propagation to listView background
        return true;
      });

      this.addChild(shapeWidget);
    });
  }

  //#endregion

  constructor(private model: Model) {
    super();

    // setup the view
    this.id = "list";
    // this.debug= true;

    this.padding = 20;
    this.fill = "white";
    this.fillWidth = 1;
    this.fillHeight = 1;
    this.layoutMethod = Layout.makeWrapRowLayout({ gap: 20 });

    // SKContainer "action" event is triggered by a "click", so
    // it's part of click propagation
    this.addEventListener("action", (_) => {
      this.model.deSelectAll();
      this.model.edit(null);
    });

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}


