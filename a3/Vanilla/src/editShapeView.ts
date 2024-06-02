// local imports
import { Observer } from "./observer";
import { Model } from "./model";
import "./editShapeView.css";

export abstract class EditShapeView
  implements Observer
{
  //#region observer pattern

  // the actual HTML element hosting this view
  protected container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }


  protected shapeDisplay: HTMLDivElement;
  protected form: HTMLDivElement;

  // abstract update(): void;
  abstract update(): void;


  //#endregion

  constructor(protected model: Model) {

    // setup the view
    this.container = document.createElement("div");
    this.container.id = "editShapeView";

    this.shapeDisplay = document.createElement("div");
    this.shapeDisplay.id = "shapeDisplay";

    this.container.appendChild(this.shapeDisplay);

    this.form = this.makeFormContainer();
    this.container.appendChild(this.form);
  }

  makeFormContainer() {
    const form = document.createElement("div");
    form.id = "form";

    return form;
  }



  // create a row with a label and a textfield
  makeFormRow(text: string, textField: HTMLInputElement): HTMLDivElement {
    const row = document.createElement("div");
    row.id = "row";

    const label = document.createElement("label");
    label.textContent = text;
    label.htmlFor = textField.id;

    row.appendChild(label);
    row.appendChild(textField);

    return row;
  }


  makeFormRow2(text: string, textField: HTMLElement): HTMLDivElement {
    const row = document.createElement("div");
    row.id = "row";

    const label = document.createElement("label");
    label.textContent = text;
    label.htmlFor = textField.id;

    row.appendChild(label);
    row.appendChild(textField);

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

