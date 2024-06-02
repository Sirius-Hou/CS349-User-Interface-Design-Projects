import { useRef, useLayoutEffect } from "preact/hooks";
import * as State from "./state";

import { Square, Star, Cat, Bullseye } from "./shape";
import { ShapeProps } from "./state";

import EditSquareForm from "./editSquareForm";
import EditStarForm from "./editStarForm";
import EditBullseyeForm from "./editBullseyeForm";
import EditCatForm from "./editCatForm";

import "./editShapeView.css";

export default function EditShapeView() {
  return (
    <div id="editShapeView">
      <div id="shapeDisplay">
        {handleShapeDisplay({ shape: State.editingShape.value })}
      </div>
      <div id="form">
        {handleForm({ shape: State.editingShape.value })}
      </div>
    </div>
  );
}

type EditShapeViewProps = {
  shape: ShapeProps | undefined;
}

export function handleShapeDisplay({ shape }: EditShapeViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  if (!shape) return null;

  useLayoutEffect(() => {
    const gc = canvasRef.current?.getContext("2d");
    if (gc) {
      switch (shape.props.type) {
        case "square":
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
  }, [State.shapes.value]);


  return (
    <canvas ref={canvasRef} width="100" height="100"/>
  );
}


export function handleForm({ shape }: EditShapeViewProps) {
  if (!shape) return null;

  switch (shape.props.type) {
    case "square":
      return <EditSquareForm shape={shape} />;

    case "star":
      return <EditStarForm shape={shape} />;

    case "bullseye":
      return <EditBullseyeForm shape={shape} />;

    case "cat":
      return <EditCatForm shape={shape} />;
  }
}
