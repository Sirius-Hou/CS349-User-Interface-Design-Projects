import { skTime } from "simplekit/canvas-mode";
// local import
import { Animator } from "./animator";

export * from "./animator";

class AnimationManager {
  protected animations: Animator[] = [];

  add(animation: Animator) {
    this.animations.push(animation);
    animation.start(skTime);
  }

  update(time: number) {
    if (this.animations.length === 0) return;

    // update every animation currently running
    this.animations.forEach((a) => a.update(time));

    // remove any animations that finished
    this.animations = this.animations.filter((a) => a.isRunning);
  }

  terminateLoopingAnimations() {
    this.animations = this.animations.filter((a) => !a.loop);
  }
}

// create the singleton
export const animationManager = new AnimationManager();
