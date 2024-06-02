import "./editView.css"
import * as State from "./state";

import EditMessageView from "./editMessageView";
import EditShapeView from "./editShapeView";

export default function EditView() {
  return (
    <>
      {(State.numSelected.value === 1) ? <EditShapeView /> : <EditMessageView />}
    </>
  );
}
