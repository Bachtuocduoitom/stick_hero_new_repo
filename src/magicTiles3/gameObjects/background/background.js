import { TilingSprite } from "pixi.js";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { Tween } from "../../../systems/tween/tween";
import { GameConstant } from "../../../gameConstant";
import { AssetSelector } from "../../assetSelector";
import { SoundManager } from "../../../soundManager";
import { DataLocal } from "../../data/dataLocal";
import { UserData } from "../../data/userData";

export class BackGround extends TilingSprite {
  constructor(texture, width, height) {
    super(texture, width, height);
    this.isMoveCamera = false;
    this.velocity = 0;
    this.anchor.set(0.5, 0.5);
    this.resize();
    //this.playBackgroundMusic();
  }

  update(dt) {
    this.tilePosition.x -= this.velocity * dt;
  }

  reset() {
    if (UserData.prevBackground == AssetSelector.getBgTexture().length - 1) {
      this.texture = AssetSelector.getBgTexture()[0];
     } else {
      this.texture = AssetSelector.getBgTexture()[UserData.prevBackground + 1];
     };
    this.tilePosition.x = 0;
    this.moveCameraTween && this.moveCameraTween.stop();
    this.isMoveCamera = false;
    this.velocity = 0;
    //this.playBackgroundMusic();
  }

  resize() {
    this.width = GameResizer.width;
    this.height = GameResizer.height;

    let scale = GameResizer.height / this.texture.height;
    if (GameResizer.isPortrait()) {
      this.tileScale.x = scale; 
      this.tileScale.y = scale;
    } else {
      if (GameResizer.width >= this.texture.width * scale) {
        this.tileScale.x = GameResizer.width / this.texture.width;
        this.tileScale.y = GameResizer.height / this.texture.height;
      } else {
        this.tileScale.x = scale;
        this.tileScale.y = scale;
      }
    }
    
  }

  onMoveCamera(dis) {
    this.isMoveCamera = true;
    this.velocity = dis / 10;
    this.moveCameraTween = Tween.createTween(this, { x: this.x }, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
        this.isMoveCamera = false;
        this.velocity = 0;
      },
    });
    this.moveCameraTween.start();
  }

  playBackgroundMusic() {
    switch (this.texture) {
      case "spr_background_1":
        SoundManager.play("bg_1", 1, true, 1);
        break;
      case "spr_background_2":
        SoundManager.play("bg_2", 1, true, 1);
        break;
      case "spr_background_3":
        SoundManager.play("bg_3", 1, true, 1);
        break;
      case "spr_background_4":
        SoundManager.play("bg_4", 1, true, 1);
        break;
    }
  }
}