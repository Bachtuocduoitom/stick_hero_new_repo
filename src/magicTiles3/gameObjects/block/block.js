import { Collider } from "../../../physics/aabb/collider";
import { Sprite, Texture } from "pixi.js"
import { PureRect } from "../../../pureDynamic/PixiWrapper/pureRect";
import { PureTransform } from "../../../pureDynamic/core/pureTransform";
import { Util } from "../../../helpers/utils";
import { PureNinePatch } from "../../../pureDynamic/PixiWrapper/pureNinePatch";
import { PureSprite } from "../../../pureDynamic/PixiWrapper/pureSprite";
import { AssetSelector } from "../../assetSelector";
import { Tween } from "../../../systems/tween/tween";
import { GameConstant } from "../../../gameConstant";
import { SpawnerEvent } from "../../../systems/spawners/spawner";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";

export class Block extends Sprite {
  constructor(texture, type) {
    super(texture);
    this.type = type;
    this.state = BlockState.DEFAULT;  
    this.isRecycle = false;
    this.anchor.set(0.5, 0);      
    this.hasExtraScoreZone = Util.randomInt(0, 1) === 0;
  }

  update(dt) {
    switch (this.state) {
      case BlockState.DEFAULT:
        break;
      case BlockState.MOVING:
        break;
      case BlockState.STAY:
        break;
    }
  }

  reset() {
    this.state = BlockState.DEFAULT;  
    this.width = 0;
    this.height = 0;
    this.isRecycle = true;
    this.hasExtraScoreZone = Util.randomInt(0, 1) === 0;
    this.baseMoveCameraTween && this.baseMoveCameraTween.stop();
    this.oldMoveCameraTween && this.oldMoveCameraTween.stop();
    this.newMoveCameraTween && this.newMoveCameraTween.stop();
    // console.log("reset block");
    this.removeAllListeners();
  }

  //init red score zone
  initExtraScoreZone(extra) {
    // console.log("hasExtraScoreZone: " + this.hasExtraScoreZone);
    if(this.hasExtraScoreZone) {
      // this.extraScoreZone = new Sprite(AssetSelector.getScoreZoneTexture());                  
      this.extraScoreZone = extra;                  
      this.extraScoreZone.anchor.set(0.5, 0);
      this.extraScoreZone.x = 0;
      this.extraScoreZone.y = 0;
      this.extraScoreZone.width = GameConstant.EXTRA_SCORE_ZONE_WIDTH * (30 / this.width);
      // console.log(this.extraScoreZone.width);
      this.extraScoreZone.height = GameConstant.EXTRA_SCORE_ZONE_HEIGHT * (80 / this.height);
      this.addChild(this.extraScoreZone);
    }
  }

  getLeftCordinate() {
    return this.getBounds().x;
  }

  getRightCordinate() {
    return this.getBounds().x + this.getBounds().width;
  }

  getTT() {
    return this.x + this.width / 2;
  }

  baseOnMoveCamera(dis) {
    //remove red score zone
    if (this.hasExtraScoreZone) {
      this.extraScoreZone.emit(SpawnerEvent.Despawn);
      this.removeChild(this.extraScoreZone);
      // this.extraScoreZone.destroy();
    }

    this.baseMoveCameraTween = Tween.createTween(this, { x: this.x - dis}, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
      },
    });

    this.baseMoveCameraTween.start();
  }

  oldOnMoveCamera(dis) {
    this.oldMoveCameraTween = Tween.createTween(this, { x: this.x - dis}, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
        //remove block that is out of screen
        if (this.getRightCordinate() < 0) {
          this.emit(SpawnerEvent.Despawn);
        }
      },
    });

    this.oldMoveCameraTween.start();
  }

  newOnMoveCamera(newPosition) {
    this.newMoveCameraTween = Tween.createTween(this, { x: newPosition}, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
      },
    });

    this.newMoveCameraTween.start();
  }

  onStart() {
    let newPosition = this.width / 2 - GameConstant.GAME_WIDTH / 2
    const startTween = Tween.createTween(this, { x: newPosition}, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
        this.emit("onStart");
      }
    });
    startTween.start();
  }

  resize() {
    if (GameResizer.isPortrait()) {
      this.y = GameConstant.BLOCK_DEFAULT_Y;
    } else {
      this.y = GameConstant.BLOCK_Y_LANDSCAPE_POSION;
    }
  }

}

export const BlockState = Object.freeze({
  DEFAULT: "default",
  MOVING: "moving",
  STAY: "stay"
});