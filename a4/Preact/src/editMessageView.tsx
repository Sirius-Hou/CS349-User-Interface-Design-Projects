import "./editMessageView.css"
import * as State from "./state";

export default function EditMessageView() {
  const numSelected = State.numSelected.value;

  let message: string;
  if (numSelected < 1) {
    message = "Select One";
  } else if (numSelected > 1) {
    message = "Too Many Selected";
  } else {
    message = "Edit";
  }

  return (
    <div id="editMessageView">
      <label>
        {message}
      </label>
    </div>
  );
}