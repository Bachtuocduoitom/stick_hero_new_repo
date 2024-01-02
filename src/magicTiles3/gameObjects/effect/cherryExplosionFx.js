import { Container, Sprite, Texture } from "pixi.js";
import CherryExplosionConfig from "../../../../assets/jsons/cherryExplosionConfig.json";
import { Util } from "../../../helpers/utils";
import { Tween } from "../../../systems/tween/tween";
import { Emitter, PropertyNode, upgradeConfig } from "@pixi/particle-emitter";
import { AssetSelector } from "../../assetSelector";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { Sound } from "@pixi/sound";
import { SoundManager } from "../../../soundManager";

export class CherryExplosionFx extends Container {
  constructor(delayTime = 0) {
    super();
    let texture1 = AssetSelector.getCherryTexture();

    let container = new Container();
    this.addChild(container);
    this.emitter = new Emitter(container, upgradeConfig(CherryExplosionConfig, [texture1]));
    this.emitter.autoUpdate = true;
    this.emitter.emit = false;

    this.tweenInterval = Tween.createTween({ t: 0 }, { t: 1 }, {
      duration    : 1,
      delay       : delayTime,
      onStart     : () => {
        SoundManager.play("pop_pop", 2, false, 1);
        this.emitter.emit = true;
        this.emitter.playOnce();
      },
      onCompete   : () => {
        SoundManager.stop("pop_pop");
      },
    });
  }

  play() {
    this.tweenInterval.start();
  }

  stop() {
    this.tweenInterval.stop();
    this.emitter.autoUpdate = false;
    this.emitter.emit = false;
  }
}
