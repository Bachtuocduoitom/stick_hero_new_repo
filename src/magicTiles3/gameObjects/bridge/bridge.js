import { Sprite } from "pixi.js";
import { Tween } from "../../../systems/tween/tween";
import { Game } from "../../../game";
import { GameConstant } from "../../../gameConstant";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { SpawnerEvent } from "../../../systems/spawners/spawner";

export class Bridge extends Sprite {
  constructor(texture) {
    super(texture);
    this.state = BridgeState.DEFAULT;
    this.isPointerDown = false;
    this.anchor.set(0.5, 1);
  }

  update(dt) {
    if (this.state === BridgeState.BUILDING && this.isPointerDown) {
      if (this.height <= GameConstant.GAME_HEIGHT) {
        this.height += 500 * dt;
      }
    }
  }

  reset() {
    this.state = BridgeState.DEFAULT;
    this.isPointerDown = false;
    this.rotation = 0;
    this.moveCameraTween && this.moveCameraTween.stop();
    // console.log("reset bridge");
    this.removeAllListeners();
  }

  onBuild() {
    if(this.state === BridgeState.DEFAULT) {
      this.state = BridgeState.BUILDING;
      this.isPointerDown = true;
      // console.log("onBuild");
    }
  }

  stopBuild() {
    if (this.state === BridgeState.BUILDING) {
      this.state = BridgeState.BUILDED;
      this.isPointerDown = false;
      this.emit("onBuilded");
    }
  }

  dropDown() {  
    if(this.state === BridgeState.BUILDED) {
      this.state = BridgeState.DROP;
      const dropTween = Tween.createTween(this, { rotation: Math.PI / 2 }, {
        duration: 0.32,
        delay: 0.2,
        onComplete: () => {
          this.state = BridgeState.STAY;
          this.emit("onStay");
        },
        //easing: Tween.Easing.Cubic.In,
      });
      dropTween.start();
    }
  }

  collapse() {
    if(this.state === BridgeState.STAY) {
      this.state = BridgeState.FALLING;
      const collapseTween = Tween.createTween(this, { rotation: Math.PI }, {
        duration: 0.32,
      });
      collapseTween.start();
    }
  }  

  getTopCordinate() {
    return this.getBounds().x + this.getBounds().width;
  }

  onMoveCamera(dis) {
    this.moveCameraTween = Tween.createTween(this, { x: this.x - dis}, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
        //remove bridge when it is out of screen
        if (this.getTopCordinate() < 0) {
          this.emit(SpawnerEvent.Despawn);
        }
      },
    });

    this.moveCameraTween.start();
  }

  resize() {
    if (GameResizer.isPortrait()) {
      this.y = GameConstant.BRIDGE_DEFAULT_Y;
    } else {
      this.y = GameConstant.BRIDGE_Y_LANDSCAPE_POSION;
    }
  }

}

export const BridgeState = Object.freeze({
  DEFAULT: "default",
  BUILDING: "building",
  BUILDED: "builded",
  DROP: "drop",
  STAY: "stay",
  FALLING: "falling"
});