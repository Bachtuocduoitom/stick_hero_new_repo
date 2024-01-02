import { Container, Sprite, Texture } from "pixi.js";
import { Util } from "../../../helpers/utils";
import { Tween } from "../../../systems/tween/tween";
import { Emitter, PropertyNode, upgradeConfig } from "@pixi/particle-emitter";
import { AssetSelector } from "../../assetSelector";

export class PlusOneFx extends Container {
  constructor(delayTime = 0) {
    super();
    this.plusOne = new Sprite(Texture.from("spr_plus_one"));
    this.plusOne.alpha = 0;
    this.plusOne.anchor.set(0.5, 0);
    this.addChild(this.plusOne);

    this.fadeTween = Tween.createTween(this.plusOne, { alpha: 0 }, {
      duration    : 0.6,
      onComplete  : () => {
        this.plusOne.x = 0;
      },
    });

    this.tweenInterval = Tween.createTween(this.plusOne, { y: this.y - 80 }, {
      duration    : 0.7,
      delay       : delayTime,
      onStart     : () => {
        this.plusOne.alpha = 1;
      },
      onComplete  : () => {
        this.fadeTween.start();
      }
    });
  }

  play() {
    this.tweenInterval.start();
  }

  stop() {
    this.tweenInterval.stop();
  }

}