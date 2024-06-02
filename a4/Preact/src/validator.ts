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

export const hueValidator = new Validator(0, 360);
export const radiusValidator = new Validator(20, 45);
export const pointsValidator = new Validator(3, 10);
export const ringsValidator = new Validator(1, 5);
