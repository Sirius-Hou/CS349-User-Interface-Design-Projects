import { useRef, useEffect, useState } from "preact/hooks";
import * as State from "./state";
import * as Validator from "./validator";
import { ShapeProps, SquareProps } from "./state";


type EditShapeViewProps = {
  shape: ShapeProps | undefined;
}

export default function EditSquareForm({ shape }: EditShapeViewProps) {
  if (!shape) return null;

  const squareProps = shape.props as SquareProps;
  const hueInputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(squareProps.hue?.toString());

  const [hueInitialValue, setHueInitialValue] = useState(squareProps.hue?.toString());

  useEffect(() => {
    const newSquareProps = shape.props as SquareProps;
    setInputValue(newSquareProps.hue?.toString());
  }, [shape]);

  function handleHueInput() {
    const shapeType = State.editingShape.value?.props.type || "square";
    const t = hueInputRef.current?.value || "";
    setInputValue(t);

    if (Validator.hueValidator.validate(t)) {
      State.setEditShapeProps({ 
        hue: parseInt(t), 
        type: shapeType,
      });
    }
  }

  // when the hue input firstly gained focus, store the initial value
  function handleHueOnFocus() {
    const shapeProp = State.editingShape.value?.props as SquareProps;
    setHueInitialValue(shapeProp.hue?.toString() || "");
  }

  // when the hue input changes (loses focus), store the initial value and execute the undo/redo
  function handleHueOnChange() {
    const shapeProp = State.editingShape.value?.props as SquareProps;
    
    const shapeType = State.editingShape.value?.props.type || "square";
    // const t2 = hueInputRef.current?.value || "";
    const t = shapeProp.hue?.toString() || "";

    // if the input value changed since it first gained focus, execute undo/redo
    if (t != hueInitialValue) {
      State.undoManager.execute({
        do: () => {
          State.setEditShapeProps({ 
            hue: parseInt(t), 
            type: shapeType,
          });
        },
        undo: () => {
          State.setEditShapeProps({ 
            hue: parseInt(hueInitialValue || ""),
            type: shapeProp.type,
          });
        }
      });
    }

    setInputValue(t);

  }

  if (!shape || shape.props.type != "square") return null;
  return (
    <>
      <div id="row">
        <label>Hue</label>
        <input 
          ref={hueInputRef}
          type="number"
          min={0}
          max={360}
          value={inputValue}
          onInput={handleHueInput}
          onFocus={handleHueOnFocus}
          onChange={handleHueOnChange}
          class={Validator.hueValidator.validate(inputValue || "") ? "" : "invalid"}
        />
      </div>
    </>
  );
}




