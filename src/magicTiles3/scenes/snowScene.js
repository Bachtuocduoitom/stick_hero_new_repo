import { Emitter } from "../../particles/exportEmitter";
import { Container, Sprite, Texture } from "pixi.js";
import { GameConstant } from "../../gameConstant";
import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import leafConfig from "../../../assets/particles/leafParticle.json";

export class SnowScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_SNOW);
  }

  create() {
    super.create();
    this._initLeaf();

  }

  _initLeaf() {
    this.leafTexture = Texture.from("spr_leaf");
    this.group = new Container();
    this.addChild(this.group);

    leafConfig.behaviors.push({
      type   : "textureSingle",
      config : {
        texture: Texture.from("spr_leaf2"),
      },
    });
    leafConfig.behaviors.push({
      type   : "spawnShape",
      config : {
        type : "rect",
        data : {
          x : -50,
          y : -300,
          w : GameResizer.width,
          h : 200,
        },
      },
    });
    this.fire = new Emitter(this.group, leafConfig);
    this.fire.autoUpdate = true;
    this.fire.emit = true;
    this.fire.emitNow();
  }

  _onGameResized() {
    this.fire.emit = false;
    this.fire.autoUpdate = false;
    this.fire.destroy();
    this._initLeaf();
  }

  update() {
  }
}
