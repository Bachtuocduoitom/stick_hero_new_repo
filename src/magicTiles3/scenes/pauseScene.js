import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { GameStateManager, GameState } from "../../pureDynamic/systems/gameStateManager";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment } from "../../pureDynamic/core/pureTransformConfig";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { GameConstant } from "../../gameConstant";
import { Tween } from "../../systems/tween/tween";

export class PauseScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PAUSE);
  }

  create() {
    super.create();
    this._initBackground();
    this._initContinueText();
  }

  _initBackground() {
    this.root.fill(this, 0x000000, 0.5);
    this.root.graphics.eventMode = "dynamic";
    this.root.graphics.on("pointerdown", () => {
      // GameStateManager.state = GameState.Playing;
      // this.visible = false;
    });
  }

  _initContinueText() {
    const transform = new PureTransform({
      container: this.root,
      alignment: Alignment.MIDDLE_CENTER,
      useOriginalSize: true,
    });
    const style = new PIXI.TextStyle({
      fontSize: 40,
      fill: "#FFFFFF",
      align: "center"
    });
    this.txtContinue = new PureText("TAP TO CONTINUE", transform, style);
    this.addChild(this.txtContinue.displayObject);

    const tween = Tween.createTween(this.txtContinue.displayObject);
    // tween.from({
    //   alpha: 1,
    // });
    // tween.to({
    //   alpha: 0.1,
    // });
    // tween.time = 1500;
    // tween.pingPong = true;
    // tween.loop = true;
    tween.start();
    this.txtContinue.tween = tween;
  }
}