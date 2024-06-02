import { useRef, useLayoutEffect } from "preact/hooks";
import * as State from "./state";
import { Square, Star, Cat, Bullseye } from "./shape";
import "./listView.css";

export default function ListView() {
  function handleClick(e: MouseEvent) {
    State.deSelectAll();
    e.stopPropagation();
  }

  return (
    <div id="listView"
         onClick={handleClick}>
      {State.shapes.value.map((s) => (
        <ShapeObject shape={s} />
      ))}
      
    </div>
  );
}

type ShapeProps = {
  shape: State.ShapeProps;
};

export function ShapeObject({shape}: ShapeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleClick(e: Event) {
    if (shape.selected) {
      State.deSelect(shape.id);
    } else {
      State.select(shape.id);
    }
    e.stopPropagation();
  }

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

  return <canvas
          ref={canvasRef}
          width={100}
          height={100}
          className = {shape.selected ? "selected" : ""}
          onClick={handleClick}
          />;
}

