# CS349 A1 Submission README:

- *Name:* Sirius Hou
- *Student ID:* y45hou
- *Student Number:* 20933958


### Declaration:
The code for the assignment is entirely written by myself except:
- used Github Copilot for some minor auto-fill but didn't asked it to generate large paragraphs of code
- used/refered some code from the cs349 public demo source code (such as animator.ts, animationManager.ts, timer.ts, etc.)
- refered & modified answers to https://stackoverflow.com/questions/25837158/how-to-draw-a-star-by-using-canvas-html5 for star drawings


### Game Implementation Assumptions:

* The game initially starts with 1 pair of cards;
* I implemented the bonus "gesture" feature, so only a generally continuously upward dragging gesture will trigger a "gesture" event and peek the cards;



### BONUS Peek Feature:
**Implementation:** 
A state machine is used to track the state of the mouse events. The states include "IDLE", "DOWN", and "GESTURE". The state transitions occur based on the type of mouse event (mousedown, mousemove, mouseup) and the distance moved by the mouse. When a "mousedown" event occurs, the state changes from "IDLE" to "DOWN". If the mouse is moved more than a certain threshold distance while in the "DOWN" state, the state changes to "GESTURE". In the "GESTURE" state, the x-coordinates of the mouse movements are tracked to determine the maximum and minimum x-values along the dragged path (maxX & minX fields). Also, an additional currY field is used to track the last y value during the drag.

A "gesture" event is returned ONLY IF (1) the mouse continuously moves upwards (y is non-decreasing) AND (2) x-values are within a certain threshold.

If at some point:
* this.maxX - this.minX > xDifferenceThreshold (=20) => Not in a generally straight line
* fe.y > this.currY => Not continuously moving upwards
Then, no "gesture" is returned and the state machine is reset to "IDLE" state.

Considering the possible inaccuracy of mouse movements in drawing straight lines, I set the xDifferenceThreshold to be 20xp. If users want to further restrict the straightness of the dragging, they can change the value to be bigger or smaller based on their need.