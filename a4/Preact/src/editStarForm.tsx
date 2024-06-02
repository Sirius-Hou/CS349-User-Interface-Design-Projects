import { useRef, useEffect, useState } from "preact/hooks";
import * as State from "./state";
import * as Validator from "./validator";
import { ShapeProps, StarProps } from "./state";

type EditShapeViewProps = {
  shape: ShapeProps | undefined;
}

export default function EditStarForm({ shape }: EditShapeViewProps) {
  if (!shape) return null;

  const starProps = shape.props as StarProps;
  const hueInputRef = useRef<HTMLInputElement>(null);
  const pointsInputRef = useRef<HTMLInputElement>(null);
  const radiusInputRef = useRef<HTMLInputElement>(null);

  const [hueInputValue, setHueInputValue] = useState(starProps.hue?.toString());
  const [pointsInputValue, setPointsInputValue] = useState(starProps.n?.toString());
  const [radiusInputValue, setRadiusInputValue] = useState(starProps.r2?.toString());

  const [hueInitialValue, setHueInitialValue] = useState(starProps.hue?.toString());
  const [pointsInitialValue, setPointsInitialValue] = useState(starProps.n?.toString());
  const [radiusInitialValue, setRadiusInitialValue] = useState(starProps.r2?.toString());


  useEffect(() => {
    const newStarProps = shape.props as StarProps;
    setHueInputValue(newStarProps.hue?.toString());
    setPointsInputValue(newStarProps.n?.toString());
    setRadiusInputValue(newStarProps.r2?.toString());
  }, [shape]);

  function handleHueInput() {
    const shapeType = State.editingShape.value?.props.type || "star";
    const t = hueInputRef.current?.value || "";
    setHueInputValue(t);

    if (Validator.hueValidator.validate(t)) {
      State.setEditShapeProps({ 
        hue: parseInt(t), 
        type: shapeType,
      });
    }
  }

  function handlePointsInput() {
    const shapeType = State.editingShape.value?.props.type || "star";
    const t = pointsInputRef.current?.value || "";
    setPointsInputValue(t);

    if (Validator.pointsValidator.validate(t)) {
      State.setEditShapeProps({ 
        n: parseInt(t), 
        type: shapeType,
      });
    }
  }

  function handleRadiusInput() {
    const shapeType = State.editingShape.value?.props.type || "star";
    const t = radiusInputRef.current?.value || "";
    setRadiusInputValue(t);

    if (Validator.radiusValidator.validate(t)) {
      State.setEditShapeProps({ 
        r2: parseInt(t), 
        type: shapeType,
      });
    }
  }


  /* onFocus handlers */
  function handleHueOnFocus() {
    const shapeProp = State.editingShape.value?.props as StarProps;
    setHueInitialValue(shapeProp.hue?.toString() || "");
  }

  function handlePointsOnFocus() {
    const shapeProp = State.editingShape.value?.props as StarProps;
    setPointsInitialValue(shapeProp.n?.toString() || "");
  }

  function handleRadiusOnFocus() {
    const shapeProp = State.editingShape.value?.props as StarProps;
    setRadiusInitialValue(shapeProp.r2?.toString() || "");
  }


  /* onChange handlers */
  function handleHueOnChange() {
    const shapeProp = State.editingShape.value?.props as StarProps;
    
    const shapeType = State.editingShape.value?.props.type || "star";
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
            type: shapeProp.type,
          });
        }
      });
    }
    setHueInputValue(t);
  }

  function handlePointsOnChange() {
    const shapeProp = State.editingShape.value?.props as StarProps;
    
    const shapeType = State.editingShape.value?.props.type || "star";
    const t = shapeProp.n?.toString() || "";

    if (t != pointsInitialValue) {
      State.undoManager.execute({
        do: () => {
          State.setEditShapeProps({ 
            n: parseInt(t), 
            type: shapeType,
          });
        },
        undo: () => {
          State.setEditShapeProps({ 
            n: parseInt(pointsInitialValue || ""),
            type: shapeProp.type,
          });
        }
      });
    }
    setPointsInputValue(t);
  }

  function handleRadiusOnChange() {
    const shapeProp = State.editingShape.value?.props as StarProps;
    
    const shapeType = State.editingShape.value?.props.type || "star";
    const t = shapeProp.r2?.toString() || "";

    if (t != radiusInitialValue) {
      State.undoManager.execute({
        do: () => {
          State.setEditShapeProps({ 
            r2: parseInt(t), 
            type: shapeType,
          });
        },
        undo: () => {
          State.setEditShapeProps({ 
            r2: parseInt(radiusInitialValue || ""),
            type: shapeProp.type,
          });
        }
      });
    }
    setRadiusInputValue(t);
  }


  if (!shape || shape.props.type != "star") return null;
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
        <label>Points</label>
        <input 
          ref={pointsInputRef}
          type="number"
          min={3}
          max={10}
          value={pointsInputValue}
          onInput={handlePointsInput}
          onFocus={handlePointsOnFocus}
          onChange={handlePointsOnChange}
          class={Validator.pointsValidator.validate(pointsInputValue || "") ? "" : "invalid"}
        />
      </div>

      <div id="row">
        <label>Radius</label>
        <input 
          ref={radiusInputRef}
          type="number"
          min={20}
          max={45}
          value={radiusInputValue}
          onInput={handleRadiusInput}
          onFocus={handleRadiusOnFocus}
          onChange={handleRadiusOnChange}
          class={Validator.radiusValidator.validate(radiusInputValue || "") ? "" : "invalid"}
        />
      </div>
    </>
  );
}


