import { useRef, useEffect, useState } from "preact/hooks";
import * as State from "./state";
import * as Validator from "./validator";
import { ShapeProps, BullseyeProps } from "./state";

type EditShapeViewProps = {
  shape: ShapeProps | undefined;
}

export default function EditBullseyeForm({ shape }: EditShapeViewProps) {
  if (!shape) return null;

  const bullseyeProps = shape.props as BullseyeProps;
  const hue1InputRef = useRef<HTMLInputElement>(null);
  const hue2InputRef = useRef<HTMLInputElement>(null);
  const ringsInputRef = useRef<HTMLInputElement>(null);

  const [hue1InputValue, setHue1InputValue] = useState(bullseyeProps.hue1?.toString());
  const [hue2InputValue, setHue2InputValue] = useState(bullseyeProps.hue2?.toString());
  const [ringsInputValue, setRingsInputValue] = useState(bullseyeProps.rings?.toString());

  const [hue1InitialValue, setHue1InitialValue] = useState(bullseyeProps.hue1?.toString());
  const [hue2InitialValue, setHue2InitialValue] = useState(bullseyeProps.hue2?.toString());
  const [ringsInitialValue, setRingsInitialValue] = useState(bullseyeProps.rings?.toString());

  useEffect(() => {
    const newBullseyeProps = shape.props as BullseyeProps;
    setHue1InputValue(newBullseyeProps.hue1?.toString());
    setHue2InputValue(newBullseyeProps.hue2?.toString());
    setRingsInputValue(newBullseyeProps.rings?.toString());
  }, [shape]);

  /* onInput handlers */
  function handleHue1Input() {
    const shapeType = State.editingShape.value?.props.type || "bullseye";
    const t = hue1InputRef.current?.value || "";
    setHue1InputValue(t);

    if (Validator.hueValidator.validate(t)) {
      State.setEditShapeProps({ 
        hue1: parseInt(t), 
        type: shapeType,
      });
    }
  }

  function handleHue2Input() {
    const shapeType = State.editingShape.value?.props.type || "bullseye";
    const t = hue2InputRef.current?.value || "";
    setHue2InputValue(t);

    if (Validator.hueValidator.validate(t)) {
      State.setEditShapeProps({ 
        hue2: parseInt(t), 
        type: shapeType,
      });
    }
  }

  function handleRingsInput() {
    const shapeType = State.editingShape.value?.props.type || "bullseye";
    const t = ringsInputRef.current?.value || "";
    setRingsInputValue(t);

    if (Validator.ringsValidator.validate(t)) {
      State.setEditShapeProps({ 
        rings: parseInt(t), 
        type: shapeType,
      });
    }
  }

  /* onFocus handlers */
  function handleHue1OnFocus() {
    const shapeProp = State.editingShape.value?.props as BullseyeProps;
    setHue1InitialValue(shapeProp.hue1?.toString() || "");
  }

  function handleHue2OnFocus() {
    const shapeProp = State.editingShape.value?.props as BullseyeProps;
    setHue2InitialValue(shapeProp.hue2?.toString() || "");
  }

  function handleRingsOnFocus() {
    const shapeProp = State.editingShape.value?.props as BullseyeProps;
    setRingsInitialValue(shapeProp.rings?.toString() || "");
  }

  /* onChange handlers */
  function handleHue1OnChange() {
    const shapeProp = State.editingShape.value?.props as BullseyeProps;
    
    const shapeType = State.editingShape.value?.props.type || "bullseye";
    const t = shapeProp.hue1?.toString() || "";

    if (t != hue1InitialValue) {
      State.undoManager.execute({
        do: () => {
          State.setEditShapeProps({ 
            hue1: parseInt(t), 
            type: shapeType,
          });
        },
        undo: () => {
          State.setEditShapeProps({ 
            hue1: parseInt(hue1InitialValue || ""),
            type: shapeProp.type,
          });
        }
      });
    }

    setHue1InputValue(t);
  }

  function handleHue2OnChange() {
    const shapeProp = State.editingShape.value?.props as BullseyeProps;
    
    const shapeType = State.editingShape.value?.props.type || "bullseye";
    const t = shapeProp.hue2?.toString() || "";

    if (t != hue2InitialValue) {
      State.undoManager.execute({
        do: () => {
          State.setEditShapeProps({ 
            hue2: parseInt(t), 
            type: shapeType,
          });
        },
        undo: () => {
          State.setEditShapeProps({ 
            hue2: parseInt(hue2InitialValue || ""),
            type: shapeProp.type,
          });
        }
      });
    }
    setHue2InputValue(t);
  }

  function handleRingsOnChange() {
    const shapeProp = State.editingShape.value?.props as BullseyeProps;
    
    const shapeType = State.editingShape.value?.props.type || "bullseye";
    const t = shapeProp.rings?.toString() || "";

    if (t != ringsInitialValue) {
      State.undoManager.execute({
        do: () => {
          State.setEditShapeProps({ 
            rings: parseInt(t), 
            type: shapeType,
          });
        },
        undo: () => {
          State.setEditShapeProps({ 
            rings: parseInt(ringsInitialValue || ""),
            type: shapeProp.type,
          });
        }
      });
    }
    setRingsInputValue(t);
  }



  if (!shape || shape.props.type != "bullseye") return null;
  return (
    <>
      <div id="row">
        <label>Hue1</label>
        <input 
          ref={hue1InputRef}
          type="number"
          min={0}
          max={360}
          value={hue1InputValue}
          onInput={handleHue1Input}
          onFocus={handleHue1OnFocus}
          onChange={handleHue1OnChange}
          class={Validator.hueValidator.validate(hue1InputValue || "") ? "" : "invalid"}
        />
      </div>

      <div id="row">
        <label>Hue2</label>
        <input 
          ref={hue2InputRef}
          type="number"
          min={0}
          max={360}
          value={hue2InputValue}
          onInput={handleHue2Input}
          onFocus={handleHue2OnFocus}
          onChange={handleHue2OnChange}
          class={Validator.hueValidator.validate(hue2InputValue || "") ? "" : "invalid"}
        />
      </div>

      <div id="row">
        <label>Rings</label>
        <input 
          ref={ringsInputRef}
          type="number"
          min={2}
          max={5}
          value={ringsInputValue}
          onInput={handleRingsInput}
          onFocus={handleRingsOnFocus}
          onChange={handleRingsOnChange}
          class={Validator.ringsValidator.validate(ringsInputValue || "") ? "" : "invalid"}
        />
      </div>
    </>
  );
}

