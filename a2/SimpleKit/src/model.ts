import { Subject } from "./observer";
import { SKSquare } from "./square";
import { SKStar } from "./star";
import { SKShape } from "./shape";

export class Model extends Subject {
  // model data
  private _shapes: SKShape[] = [];
	private _selectedShapes: SKShape[] = [];
  private _shift_pressed: boolean = false;

  editing: "hue" | "radius" | "points" | "idle" = "idle";

	get shapes() {
		return this._shapes;
	}

	get selectedShapes() {
		return this._selectedShapes;
	}

  get shift_pressed() {
    return this._shift_pressed;
  }
  
	clearShapes() {
		this._shapes = [];
    this._selectedShapes = [];

    this.editing = "idle";
		this.notifyObservers();
	}

  deselectAllShapes() {
    this._selectedShapes = [];
    this.notifyObservers();
  }

  deleteSelectedShapes() {
    this._shapes = this._shapes.filter(shape => !this._selectedShapes.includes(shape));
    this._selectedShapes = [];
    this.notifyObservers();
  }

  selectShape(shape: SKShape) {
    this.editing = "idle";

    // Check if the shape is already selected
    const index = this.selectedShapes.findIndex(selectedShape => selectedShape === shape);

    if (this._shift_pressed) {
      if (index !== -1) {
        // If the shape is already selected, remove it from the selectedShapes array
        this.selectedShapes.splice(index, 1);
      } else {
        // If the shape is not selected, add it to the selectedShapes array
        this.selectedShapes.push(shape);
      }
    }

    else {
      if (index !== -1) {
        // If multiple shapes have been selected, and current clicked shape is one of them,
        // keep it selected and deselect all other shapes
        if (this.selectedShapes.length > 1) {
          this._selectedShapes = [shape];
        } else {
          // If the clicked shape was the only previously selected shape, then just deselect it
          this._selectedShapes = [];
        }
        
      } else {
        // If the shape is not selected, clear the current selected shapes and select this one
        this._selectedShapes = [shape];
      }
    }

    // Update the selected property of all shapes
    this.shapes.forEach(shape => {
      shape.selected = this.selectedShapes.includes(shape);
    });
	
		this.notifyObservers();
  }

  addSquare() {
    this.editing = "idle";

		const hue = Math.floor(Math.random() * 360); // random hue between 0 and 360
    const square = new SKSquare(hue, this);
    square.width = square.height = 50;
		this._shapes.push(square);

		this.notifyObservers();
  }

  addStar() {
    this.editing = "idle";

		const hue = Math.floor(Math.random() * 360); // random hue between 0 and 360
    const radius = Math.floor(Math.random() * 25) + 20; // random radius between 20 and 45
    const points = Math.floor(Math.random() * 3) + 7; // random number of points between 7 and 
    const star = new SKStar(hue, this, false, radius, points);

    star.width = star.height = 50;
		this._shapes.push(star);

		this.notifyObservers();
  }

  changeProp(new_val: string, prop: "hue" | "radius" | "points") {
    const new_val_num = Number(new_val);
    if (!isNaN(new_val_num) && new_val !== "" && new_val_num >= 0 && new_val_num <= 360) {
      if (this.selectedShapes.length === 1) {
        // Find the index of the selected shape in the shapes array
        const index = this.shapes.findIndex(shape => shape === this.selectedShapes[0]);
        if (index !== -1) {
          if (prop === "hue" &&  new_val_num >= 0 && new_val_num <= 360) {
            this.shapes[index].hue = new_val_num;
            this.shapes[index].color = `hsl(${new_val_num}, 100%, 50%)`;
            this.selectedShapes[0].hue = new_val_num;
          }
          if (prop === "radius" && this.shapes[index] instanceof SKStar && new_val_num >= 20 && new_val_num <= 45) {
            (this.shapes[index] as SKStar).radius = new_val_num;
            (this.selectedShapes[0] as SKStar).radius = new_val_num;
          }
          if (prop === "points" && this.shapes[index] instanceof SKStar && new_val_num >= 3 && new_val_num <= 10) {
            (this.shapes[index] as SKStar).points = new_val_num;
            (this.selectedShapes[0] as SKStar).points = new_val_num;
          }
        }
      }
    }
    this.notifyObservers();
  }

  shiftPressed() {
    this._shift_pressed = true;
    this.notifyObservers();
  }

  shiftReleased() {
    this._shift_pressed = false;
    this.notifyObservers();
  }
}
