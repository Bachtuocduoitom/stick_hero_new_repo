import { Sprite } from "pixi.js";
import { Tween } from "../../../systems/tween/tween";
import TWEEN from "@tweenjs/tween.js";
import { Game } from "../../../game";
import { GameConstant } from "../../../gameConstant";
import { SpawnerEvent } from "../../../systems/spawners/spawner";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";

export class Cherry extends Sprite {
  constructor(texture) {
    super(texture);
    this.state = CherryState.DEFAULT;
    this.anchor.set(0.5, 0);
  }

  update(dt) {

  }

  reset() {
    this.state = CherryState.DEFAULT;
    this.oldMoveCameraTween && this.oldMoveCameraTween.stop();
    this.newMoveCameraTween && this.newMoveCameraTween.stop();
    this.fluctutationTween && this.fluctutationTween.stop();
    // console.log("reset cherry");
    this.removeAllListeners();
  }

  getLeftCordinate() {
    return this.getBounds().x;
  }

  getRightCordinate() {
    return this.getBounds().x + this.getBounds().width;
  }

  fluctutation() {
    this.fluctutationTween = Tween.createTween(this, { y: this.y + 15 }, {
      duration: 1,
      repeat: Infinity,
      yoyo: true,
      onComplete: () => {
      },
    });
    this.fluctutationTween.start();
  }

  oldOnMoveCamera(dis) {
    this.oldMoveCameraTween = Tween.createTween(this, { x: this.x - dis }, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
      },
    });

    this.oldMoveCameraTween.start();
  }

  newOnMoveCamera(newPosition) {
    this.newMoveCameraTween = Tween.createTween(this, { x: newPosition }, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
        this.state = CherryState.STAY;
        this.fluctutation();
      },
    });

    this.newMoveCameraTween.start();
  }

  moveToGrave() {
    this.moveToGraveTween = Tween.createTween(this, { x: GameResizer.width/2 - 90 + this.width/2, y : -GameResizer.height/2 + 80 - this.height/2}, {
      duration: GameConstant.TIME_CHERRY_MOVE_TO_GRAVE,
      easing: TWEEN.Easing.Quadratic.Out,
      onUpdate: () => {
        this.oldMoveCameraTween && this.oldMoveCameraTween.stop();
      },
      onComplete: () => {
        this.emit(SpawnerEvent.Despawn);
      }
    });

    this.moveToGraveTween.start();
  }

  resize() {
    this.fluctutationTween && this.fluctutationTween.stop();
    if (GameResizer.isPortrait()) {
      this.y = GameConstant.CHERRY_DEFAULT_Y;
    } else {
      this.y = GameConstant.CHERRY_Y_LANDSACPE_POSION;
    }
    this.fluctutation();
  }

}

export const CherryState = Object.freeze({
  DEFAULT: "default",
  STAY: "stay",
  EATED: "eated",
});
