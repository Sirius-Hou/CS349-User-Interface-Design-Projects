# CS349 A4 Submission README:

- *Name:* Sirius Hou
- *Student ID:* y45hou
- *Student Number:* 20933958

### Declaration:
The code for the assignment is entirely written by myself except:
- used Github Copilot for some minor auto-fill but didn't asked it to generate large paragraphs of code.
- used/refered some code from the cs349 public demo source code.
- referred & modified answers to https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5 for star drawings
- referred & modified A2/A3 sample solution code posted by professor Daniel Vogel

### Redo & Undo functionalities:
- Implemented undo/redo features that support events such as adding and deleting (clearing) shapes and editing shape properties.
- Support redo/undo on adding / deleting / (multi) selecting / deselecting / clear shapes and shape props changing.
- When changing shape prop values, the undo/redo actions will be pushed to undo/redo stacks AFTER the changing field loses focus (onChange).
- When losing focus (onChange) on an input field with an invalid value (out-of-range or empty), the field value is set as the last valid value during editing.
- If the input field value has not been changed to another valid value since it gained focus (get selected), then no undo/redo actions will be created for it.
(e.g., if select on a square hue prop (originally as 123) and change it to 1234 by adding a number 4 at the end, and lose focus, then the last valid hue value
is still 123, which is the same as the initial hue value, then no undo/redo action will be created for this edition.)
