import {
  SKContainer,
  SKLabel,
  SKTextfield,
  Layout,
} from "simplekit/imperative-mode";

// local imports
import { Observer } from "./observer";
import { Model } from "./model";
import { makeFillColLayout } from "./fillColumn";

export abstract class EditShapeView
  extends SKContainer
  implements Observer
{
  //#region observer pattern

  abstract update(): void;

  //#endregion

  constructor(protected model: Model) {
    super();

    // setup the view
    // debugging
    this.id = "edit";
    // this.debug = true;

    this.fill = "whitesmoke";
    this.border = "gray";

    this.padding = 10;
    this.height = 40;
    this.fillWidth = 1;
    this.fillHeight = 1;

    this.layoutMethod = makeFillColLayout({ gap: 10 });
  }

  makeFormContainer() {
    const form = new SKContainer();
    form.border = "gray";
    form.padding = 10;
    form.fillWidth = 1;
    form.fillHeight = 1;

    form.layoutMethod = makeFillColLayout({ gap: 0 });

    return form;
  }
  
  // create a row with a label and a textfield
  makeFormRow(text: string, textField: SKTextfield): SKContainer {
    const row = new SKContainer();
    row.fillWidth = 1;
    row.height = 40;
    row.layoutMethod = Layout.makeFillRowLayout({ gap: 5 });

    const label = new SKLabel({ text });
    label.width = 60;
    label.align = "right";

    textField.width = 50;

    row.addChild(label);
    row.addChild(textField);

    return row;
  }
}

/** 
 * simple validator for numeric textfield
 */
export class Validator {
  constructor(private min: number, private max: number) {}

  validate(t: string): boolean {
    const v = Number(t);
    this.isValid =
      t !== "" && !isNaN(v) && v >= this.min && v <= this.max;
    return this.isValid;
  }

  isValid = true;
}

