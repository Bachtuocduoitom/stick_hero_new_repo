import { Sprite, AnimatedSprite, Graphics } from "pixi.js";
import { PureSprite } from "../../../pureDynamic/PixiWrapper/pureSprite";
import { PureTransform } from "../../../pureDynamic/core/pureTransform";
import { Util } from "../../../helpers/utils";
import { Tween } from "../../../systems/tween/tween";
import { GameConstant } from "../../../gameConstant";
import { AssetSelector } from "../../assetSelector";
import { SoundManager } from "../../../soundManager";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";

export class Hero extends AnimatedSprite {
  constructor(textures) {
    super(textures);
    this.state = HeroState.STAY;
    this.isReady = false;
    this.isEndRun = false;
    this.isKicked = false;
    this.checkcurrentFrame = false;
    this.side = HeroSide.UP;
    this.velocity = 500;
    this.anchor.set(0.5, 1);
    this._idleAnimation();
  }

  update(dt) {
    super.update(dt);
    switch (this.state) {
      case HeroState.STAY:    
        break;
      case HeroState.DANCE:
        break;
      case HeroState.KICK:
        if (this.currentFrame === 1 && this.checkcurrentFrame === true) {
          this.isKicked = true;
          this.checkcurrentFrame = false;
        }
        break;
      case HeroState.RUN:
        break;
      case HeroState.FALL:
        break;
    }
  }

  reset() {
    this.state = HeroState.STAY;
    this.isReady = true;
    this.isEndRun = false;
    this.isKicked = false;
    this.side = HeroSide.UP;
    this.x = GameConstant.HERO_X_POSITION;
    this.y = GameConstant.HERO_Y_POSITION;
    this.rotation = 0;
    this.scale.y = 1;
    this._idleAnimation();
  }

  reInit() {
    this.state = HeroState.STAY;
    this.isReady = false;
    this.isEndRun = false;
    this.isKicked = false;
    this.side = HeroSide.UP;
    this.x = 0;
    this.y = GameConstant.HERO_Y_POSITION;
    this.rotation = 0;
    this.scale.y = 1;
    this._idleAnimation();
  }

  onRun(pos, toDead) {
    if (this.state === HeroState.KICK) {
      this._runAnimation();
      this.isReady = false;
      if (toDead) {
        this._runToDie(pos);
      } else {
        this._runToLive(pos);
      }
      this.emit("onRun");
    }
  }

  onDance() {
    if (this.state === HeroState.STAY) {
      this._danceAnimation();
      this.emit("onDance");
    }
  }

  onKickBridge() {
    if (this.state === HeroState.DANCE) {
      this.checkcurrentFrame = true;
      this._kickAnimation();
      this.emit("onKickBridge");
    }
  }

  onFall() {
    if (this.state === HeroState.RUN) {
      this._fallDown();
      this.emit("onFallDown");

      //play scream sound
      SoundManager.play("scream", 1, false, 1);

    }
  }

  onChangeSide() {
    if (this.side === HeroSide.UP) {
      this.side = HeroSide.DOWN;
      //this.anchor.set(0.5, 0);
    } else {
      this.side = HeroSide.UP;
      //this.anchor.set(0.5, 1);
    }
    this.scale.y *= -1;
    //this.rotation += Math.PI;
  }

  getRightCordinate() {
    return this.getBounds().x + this.getBounds().width;
  }

  getLeftCordinate() {
    return this.getBounds().x;
  }

  _runToLive(pos) {
    let dura = (pos - this.x) / this.velocity;
    this.runLiveTween = Tween.createTween(this, { x: pos }, {
      duration: dura,
      onComplete: () => {
        this._idleAnimation();
        this.emit("heroEndRun");
        this.isEndRun = true;
      },
    });

    this.runLiveTween.start();
  }

  _runToDie(pos) {
    let dura = (pos - this.x) / this.velocity;
    this.runDieTween = Tween.createTween(this, { x: pos }, {
      duration: dura,
      onComplete: () => {
        this._fall();
        this.emit("onFall");
      },
    });

    this.runDieTween.start();
  }

  _fall() {
    this.state = HeroState.FALL;

    //play scream sound
    SoundManager.play("scream", 1, false, 1);

    //stop run tween
    this.runDieTween && this.runDieTween.stop();
    this.runLiveTween && this.runLiveTween.stop();

    //start fall tween
    const fallTween = Tween.createTween(this, { x: this.x + 200, y: GameResizer.height + 800}, {
      duration: GameConstant.HERO_FALL_TIME,
      onUpdate: () => {
        this.rotation += 0.1;
      },
      onComplete: () => {
        this.state = HeroState.DEAD;
        this.emit("onDead");
      },
    });

    fallTween.start();
  }

  _fallDown() {
    this.state = HeroState.FALL;

    //stop run tween
    this.runDieTween && this.runDieTween.stop();
    this.runLiveTween && this.runLiveTween.stop();

    //start fall tween
    const fallDownTween = Tween.createTween(this, { y: GameResizer.height + 800 }, {
      duration: GameConstant.HERO_FALL_TIME,
      onComplete: () => {
        this.state = HeroState.DEAD;
        this.emit("onDead");
      },
    });
    fallDownTween.start();
  }

  changeSkin() {
    this._idleAnimation();
  }

  // toDesirePos() {
  //   if (this.x < this.desirePos) {
  //     return true;
  //   } else {
  //     if (this.toDead) {
  //       this._fall();
  //     } else {
  //       this.x = this.desirePos;
  //       this.state = HeroState.STAY;
  //       this.emit("heroEndRun");

  //       this.desirePos = null;
  //     }
  //   }
  //   return false;
  // }

  _idleAnimation() { 
    this.state = HeroState.STAY;
    this.textures = AssetSelector.getHeroIdleTextures();
    this.animationSpeed = GameConstant.HERO_ANIMATION_IDLE_SPEED;
    this.loop = true;
    this.play();
  }

  _runAnimation() {
    this.state = HeroState.RUN;
    this.textures = AssetSelector.getHeroRunTextures();
    this.animationSpeed = GameConstant.HERO_ANIMATION_RUN_SPEED;
    this.loop = true;
    this.play();
  }

  _danceAnimation() {
    this.state = HeroState.DANCE;
    this.textures = AssetSelector.getHeroDanceTextures();
    this.animationSpeed = GameConstant.HERO_ANIMATION_DANCE_SPEED;
    this.loop = true;
    this.play();
  }

  _kickAnimation() {
    this.state = HeroState.KICK;
    this.textures = AssetSelector.getHeroKickTextures();
    this.animationSpeed = GameConstant.HERO_ANIMATION_KICK_SPEED;
    this.loop = false;
    this.play();
  }

  onStart() {
    const startTween = Tween.createTween(this, { x: GameConstant.HERO_X_POSITION}, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
        this.isReady = true;
        this.emit("onStart");
      }
    });
    startTween.start();
  }

  onMoveCamera(dis) {
    this.isEndRun = false; //reset end run state
    const moveCameraTween = Tween.createTween(this, { x: this.x - dis}, {
      duration: GameConstant.TIME_MOVE_CAMERA,
      onComplete: () => {
        this.isReady = true;
        this.emit("backToStart");
      }
    });

    moveCameraTween.start();
  }

  resize() {
    if (this.state === HeroState.DEAD) {
      return;
    }
    if (GameResizer.isPortrait()) {
      this.y = GameConstant.HERO_Y_POSITION;
    } else {
      this.y = GameConstant.HERO_Y_LANDSCAPE_POSITION;
    }
  }
}

export const HeroState = Object.freeze({
    STAY: "stay",
    DANCE: "dance",
    KICK: "kick",
    RUN: "run",
    FALL: "fall",
    DEAD: "dead",
});

export const HeroSide = Object.freeze({
  UP: "up",
  DOWN: "down",
});