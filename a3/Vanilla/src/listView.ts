// local imports
import View from "./view";
import { Model } from "./model";
import { Square, Star, Cat, Bullseye } from "./shape";
import "./listView.css";

export class ListView implements View {
  //#region observer pattern

  update(): void {
    
    this.container.replaceChildren();

    this.model.shapes.forEach((shape) => {
      // create a new canvas element, save it to gc
      const canvas = document.createElement('canvas');
      canvas.width = 100
      canvas.height = 100;
      this.container.appendChild(canvas);

      if (shape.selected) {
        canvas.classList.add('selected');
      } else {
        canvas.classList.remove('selected');
      }

      canvas.addEventListener("click", () => {
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
        return true;
      });

      const gc = canvas.getContext('2d');

      if (gc){
        switch (shape.props.type) {

          case "square":
            //this.container.innerHTML += `<div id="shape${shape.id}">Square ${shape.id}</div>`;

            const square = new Square(shape.id, gc, `hsl(${shape.props.hue}, 100%, 50%)`);
            square.draw();
            break;
          

          case "star":
            const star = new Star(shape.id, gc, `hsl(${shape.props.hue}, 100%, 50%)`, shape.props.r1, shape.props.r2, shape.props.n);
            star.draw();
            break;


          case "bullseye":
            const bullseye = new Bullseye(shape.id, gc, `hsl(${shape.props.hue1}, 100%, 50%)`,
            `hsl(${shape.props.hue2}, 100%, 50%)`, shape.props.rings);
            bullseye.draw();
            break;
          
          case "cat":
            const cat = new Cat(shape.id, gc, `hsl(${shape.props.hue}, 100%, 50%)`, shape.props.look);
            cat.draw();
            break;

          
        }

      }
    });
  }

  //#endregion

  // the view root container
  private container: HTMLDivElement;
  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    // setup the view root container
    this.container = document.createElement("div");
    this.container.id = "listView";

    this.container.addEventListener("click", (event) => {
      if (event.target === this.container) {
        this.model.deSelectAll();
        this.model.edit(null);
      }
    });

    // register with the model
    this.model.addObserver(this);



  }
}




