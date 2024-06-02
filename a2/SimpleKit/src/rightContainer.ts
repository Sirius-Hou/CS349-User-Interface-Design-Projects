import {
	SKContainer,
	Layout,
	SKLabel,
	SKTextfield,
} from "simplekit/imperative-mode";
import { makeFillColLayout } from "./fillCol";
import { SKSquare } from "./square";
import { SKShape } from "./shape";
import { SKStar } from "./star";
import { Observer } from "./observer";
import { Model } from "./model";

export class RightContainer extends SKContainer implements Observer{
	is_editing: boolean = false;
	curr_hue?: string | undefined;
  curr_radius?: string | undefined;
  curr_points?: string | undefined;
	
	constructor(private model: Model,) {
		super();
		this.id = "rightContainer";
		this.fill = "whitesmoke";
		this.fillWidth = 0.34;
		this.fillHeight = 1;
		this.border = "grey";
		this.margin = 10;
		this.model.addObserver(this);
		this.calculateBasis();
    this.doLayout();
	}

  private createContainer(type: "Hue" | "Radius" | "Points"): SKContainer {
    const container = new SKContainer();
  
    const label = new SKLabel({
      text: type,
      align: "right",
      width: 50,
    });
    label.margin = 5;


    let fieldText: string;
    let editingField: "hue" | "radius" | "points";
    if (type === "Hue") {
      fieldText = this.curr_hue as string;
      editingField = "hue";
    } else if (type === "Radius") {
      fieldText = this.curr_radius as string;
      editingField = "radius";
    } else {
      fieldText = this.curr_points as string;
      editingField = "points";
    }
  
    const field = new SKTextfield({
      text: fieldText,
      width: 50,
    });
    field.focus = (this.model.editing === editingField);
    field.margin = 5;
  
    field.addEventListener("textchanged", () => {
      if (editingField === "hue") {
        this.curr_hue = field.text;
      } else if (editingField === "radius") {
        this.curr_radius = field.text;
      } else {
        this.curr_points = field.text;
      }

      this.model.editing = editingField;
      this.model.changeProp(field.text, editingField);
    });

    container.addChild(label);
    container.addChild(field);
    container.padding = 5;
    container.layoutMethod = Layout.makeFillRowLayout();
    container.height = 35;
  
    return container;
  }


	update(): void {
		this.clearChildren();

    if (this.model.editing === "idle") {
      this.curr_hue = undefined;
      this.curr_radius = undefined;
      this.curr_points = undefined;
    }

		if (this.model.editing !== "hue") {
			this.curr_hue = undefined;
    }

    if (this.model.editing !== "radius") {
      this.curr_radius = undefined;
    }

    if (this.model.editing !== "points") {
      this.curr_points = undefined;
    }

		// If 0 / too many shapes are selected, display a message
		if (this.model.selectedShapes.length !== 1) {
			const statusLabel = new SKLabel();
			if (this.model.selectedShapes.length === 0) {
					statusLabel.text = "Select One";
			} else {
				statusLabel.text = "Too Many Selected";
			}

			statusLabel.width = 100;
			this.addChild(statusLabel);
			this.layoutMethod = Layout.makeCentredLayout();
		}

		// Editing mode (only 1 shape selected)
		else {
      const selectedShape = this.model.selectedShapes[0];

			if (this.curr_hue === undefined) {
				this.curr_hue = selectedShape.hue.toString();
			}

      if (selectedShape instanceof SKStar) {
        if (this.curr_radius === undefined) {
          this.curr_radius = selectedShape.radius.toString();
        }

        if (this.curr_points === undefined) {
          this.curr_points = selectedShape.points.toString();
        }
      }

      // Create a new container for the square display area
      const displayArea = new SKContainer();
			displayArea.fillWidth = 1;
      displayArea.fillHeight = 0.67; // Two-thirds of the vertical space
      this.addChild(displayArea);

			// Create a new container for the editing form
      const form = new SKContainer();
      form.fillWidth = 1;
      form.fillHeight = 0.33; // One-third of the vertical space
      form.border = "1px solid grey";
      form.margin = 10;
      this.addChild(form);

			this.layoutMethod = makeFillColLayout();

      let shape: SKShape;
      // if the selected shape is a SKSquare
      if (selectedShape instanceof SKSquare) {
        // Add the selected square to the display area
        shape = new SKSquare(selectedShape.hue, this.model, true);
      } else {
        // Add the selected star to the display area
        const star = selectedShape as SKStar;
        shape = new SKStar(star.hue, this.model, true, star.radius, star.points);
      }

      shape.margin = 10; // Keep the square 10px away from the borders
      shape.fillWidth = 1;
      displayArea.addChild(shape);

			displayArea.layoutMethod = Layout.makeCentredLayout();

    
			// Form
      const hueContainer = this.createContainer("Hue");
      form.addChild(hueContainer);

      if (selectedShape instanceof SKStar) {
        const radiusContainer = this.createContainer("Radius");
        form.addChild(radiusContainer);

        const pointsContainer = this.createContainer("Points");
        form.addChild(pointsContainer);
      }

			form.padding = 10;
			form.layoutMethod = makeFillColLayout();
    }
	}
}
