# CS349 A2 Submission README:

- *Name:* Sirius Hou
- *Student ID:* y45hou
- *Student Number:* 20933958


### Declaration:
The code for the assignment is entirely written by myself except:
- used Github Copilot for some minor auto-fill but didn't asked it to generate large paragraphs of code.
- used/refered some code from the cs349 public demo source code.
- refered & modified answers to https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5 for star drawings


### Game Implementation Assumptions:
* If multiple shapes are selected when SHIFT key is pressed, after the key is released, if user click on a shape that was one of the multi-selected shapes, it keeps that one selected and deselect all other shapes; However, if the clicked shape was the ONLY previously selected shape, then just deselect it.

* A random hue is picked between 0 and 360 for each new created square in model.ts -> addSquare() -> const hue = Math.floor(Math.random() * 360);
* A random hue, radius, points are picked for each new created star in model.ts -> addStar() (0 <= hue <= 360, 20 <= radius <= 45, 7 <= points <= 9)

