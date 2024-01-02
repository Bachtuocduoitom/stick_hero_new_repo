import { Container, Sprite, Texture } from "pixi.js";
import CherryVanishConfig from "../../../../assets/jsons/cherryVanishConfig.json";
import { Util } from "../../../helpers/utils";
import { Tween } from "../../../systems/tween/tween";
import { Emitter, PropertyNode, upgradeConfig } from "@pixi/particle-emitter";
import { AssetSelector } from "../../assetSelector";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";

export class CherryVanishFx extends Container {
  constructor(delayTime = 0) {
    super();
    let texture1 = AssetSelector.getSparkTexture();
    let texture2 = AssetSelector.getHardCircleTexture();

    let container = new Container();
    this.addChild(container);
    this.emitter = new Emitter(container, upgradeConfig(CherryVanishConfig, [texture1, texture2]));
    this.emitter.autoUpdate = true;
    this.emitter.emit = false;

    this.tweenInterval = Tween.createTween({ t: 0 }, { t: 1 }, {
      duration    : 1,
      delay       : delayTime,
      onStart     : () => {
        this.emitter.emit = true;
        this.emitter.playOnce();
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
