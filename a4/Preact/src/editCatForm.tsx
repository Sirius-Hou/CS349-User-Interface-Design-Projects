import { useRef, useEffect, useState } from "preact/hooks";
import * as State from "./state";
import * as Validator from "./validator";
import { ShapeProps, CatProps } from "./state";

type EditShapeViewProps = {
  shape: ShapeProps | undefined;
}

export default function EditCatForm({ shape }: EditShapeViewProps) {
  if (!shape) return null;

  const catProps = shape.props as CatProps;
  const hueInputRef = useRef<HTMLInputElement>(null);
  const lookInputRef = useRef<HTMLSelectElement>(null);

  const [hueInputValue, setHueInputValue] = useState(catProps.hue?.toString());

  const [hueInitialValue, setHueInitialValue] = useState(catProps.hue?.toString());
  const [lookLastValue, setLookLastValue] = useState(catProps.look);

  useEffect(() => {
    const newCatProps = shape.props as CatProps;
    setHueInputValue(newCatProps.hue?.toString());
  }, [shape]);

  /* onInput handlers */
  function handleHueInput() {
    const shapeType = State.editingShape.value?.props.type || "cat";
    const t = hueInputRef.current?.value || "";
    setHueInputValue(t);

    if (Validator.hueValidator.validate(t)) {
      State.setEditShapeProps({ 
        hue: parseInt(t), 
        type: shapeType,
      });
    }
  }


  /* onFocus handlers */
  function handleHueOnFocus() {
    const shapeProp = State.editingShape.value?.props as CatProps;
    setHueInitialValue(shapeProp.hue?.toString() || "");
  }

  function handleLookOnFocus() {
    const shapeProp = State.editingShape.value?.props as CatProps;
    setLookLastValue(shapeProp.look);
  }

  /* onChange handlers */
  function handleHueOnChange() {
    const shapeProp = State.editingShape.value?.props as CatProps;
    
    const shapeType = State.editingShape.value?.props.type || "cat";
    const t = shapeProp.hue?.toString() || "";

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
            type: shapeType,
          });
        },
      });
    }
    setHueInputValue(t);
  }



  function handleLookOnChange() {
    const shapeType = State.editingShape.value?.props.type || "cat";
    const t = lookInputRef.current?.value || "left";

    if (t != lookLastValue) {
      State.undoManager.execute({
        do: () => {
          State.setEditShapeProps({ 
            look: t as "left" | "right" | "centre", 
            type: shapeType,
          });
        },
        undo: () => {
          State.setEditShapeProps({ 
            look: lookLastValue as "left" | "right" | "centre", 
            type: shapeType,
          });
        },
      });
      setLookLastValue(t as "left" | "right" | "centre");
    }

    State.setEditShapeProps({ 
      look: t as "left" | "right" | "centre", 
      type: shapeType,
    });
  }


  if (!shape || shape.props.type != "cat") return null;
  return (
    <>
      <div id="row">
        <label>Hue</label>
        <input 
          ref={hueInputRef}
          type="number"
          min={0}
          max={360}
          value={hueInputValue}
          onInput={handleHueInput}
          onFocus={handleHueOnFocus}
          onChange={handleHueOnChange}
          class={Validator.hueValidator.validate(hueInputValue || "") ? "" : "invalid"}
        />
      </div>

      <div id="row">
        <label>Look</label>
        <select
          ref={lookInputRef}
          onChange={handleLookOnChange}
          onFocus={handleLookOnFocus}
          value={(shape.props as CatProps).look}
        >
          <option value="left">left</option>
          <option value="centre">centre</option>
          <option value="right">right</option>
        </select>
      </div>
    </>
  );
}

