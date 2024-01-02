import { Scene } from "../../pureDynamic/PixiWrapper/scene/scene";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameConstant } from "../../gameConstant";
import { GameStateManager, GameState } from "../../pureDynamic/systems/gameStateManager";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureText } from "../../pureDynamic/PixiWrapper/pureText";
import { PureTilingSprite } from "../../pureDynamic/PixiWrapper/pureTilingSprite";
import { Game } from "../../game";
import { Util } from "../../helpers/utils";
import { Container, Graphics, Texture, TilingSprite } from "pixi.js";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { Block } from "../gameObjects/block/block";
import { BlockManager } from "../gameObjects/block/blockManager";
import { AssetSelector } from "../assetSelector";
import { Bridge } from "../gameObjects/bridge/bridge";
import { BridgeManager } from "../gameObjects/bridge/bridgeManager";
import { Hero, HeroSide, HeroState } from "../gameObjects/hero/hero";
import { CherryManager } from "../gameObjects/cherry/cherryManager";
import { BackGround } from "../gameObjects/background/background";
import { PlusOneFx } from "../gameObjects/effect/plusOneFx";
import { PlayScreen } from "../screens/playScreen";
import { UserData } from "../data/userData";
import { DataLocal } from "../data/dataLocal";
import { TutorialScreenEvent, TutorialScreen } from "../screens/tutorialScreen";
import { EndScreen, EndScreenEvent } from "../screens/endScreen";
import { HomeScreen, HomeScreenEvent } from "../screens/homeScreen";
import { ShopScreen, ShopScreenEvent } from "../screens/shopScreen";
import { Tween } from "../../systems/tween/tween";
import { AnimatedTilingSprite } from "../../integrate/animatedTilingSprite";
import { SoundManager } from "../../soundManager";
import { AdsManager, AdsType } from "../../../sdk/adsManager";
import { AdsBlockPopUpScreen, AdsBlockPopUpScreenEvent } from "../screens/adsBlockPopUpScreen";
export class PlayScene extends Scene {
  constructor() {
    super(GameConstant.SCENE_PLAY);
    this.playTime = 0;
    this.timeWaitToShowAds = 0;
    this.score = 0;
    this.checkExtraScore = false;
  }

  create() {
    super.create();
    this.ui.addScreens(
      new HomeScreen(),
      new ShopScreen(),
      new TutorialScreen(),
      new PlayScreen(),
      new EndScreen(),
      new AdsBlockPopUpScreen(),
    );
    this.homeScreen = this.ui.getScreen(GameConstant.SCREEN_HOME);
    this.ui.setScreenActive(GameConstant.SCREEN_HOME);
    this.homeScreen.on(HomeScreenEvent.Play, this._onStart, this);
    this.homeScreen.on(HomeScreenEvent.OpenShop, this._onOpenShop, this);

    this.ShopScreen = this.ui.getScreen(GameConstant.SCREEN_SHOP);
    this.ShopScreen.on(ShopScreenEvent.Close, this._onCloseShop, this);

    this.tutorialScreen = this.ui.getScreen(GameConstant.SCREEN_TUTORIAL);
    this.tutorialScreen.on(TutorialScreenEvent.ON_FADE_OUT, this._turnOffTutorial, this);
    this.playScreen = this.ui.getScreen(GameConstant.SCREEN_PLAY);

    this.endScreen = this.ui.getScreen(GameConstant.SCREEN_LOSE);
    this.endScreen.on(EndScreenEvent.Restart, this._playChangeScreenResetFx, this);
    this.endScreen.on(EndScreenEvent.BackHome, this._playChangeScreenBackHomeFx, this);
    this.endScreen.on(EndScreenEvent.ShowAdsBlockPopUp, this._showAdsBlockPopUp, this);
    this.endScreen.on(EndScreenEvent.ShowAdsInvalidPopUp, this._showAdsInvalidPopUp, this);
    this.endScreen.on(EndScreenEvent.ShowSkipRewardPopUp, this._showSkipRewardPopUp, this);

    this.adsBlockPopUpScreen = this.ui.getScreen(GameConstant.SCREEN_ADS_BLOCK_POPUP);
    this.adsBlockPopUpScreen.on(AdsBlockPopUpScreenEvent.ON_FADE_OUT, this._hideAdsBlockPopUp, this);

    GameStateManager.state = GameState.Home;
    this.loadData();
    this._initGamePlay();
    this.resize();
    GameStateManager.registerOnStateChangedCallback(this._onGameStateChanged.bind(this));
  }

  loadData() {
    
  }

  _initGamePlay() {
    this.gameplay = new Container();
    this.gameplay.eventMode = "static";
    this.gameplay.sortableChildren = true;
    this.addChild(this.gameplay);
    this._initBackGround();
    this._initBLockManager();
    this._initBridgeManager();
    this._initCherryManager();
    this._initHero();
    this._initFx();
    this.graphic = new Graphics();
    this.graphic.zIndex = 100;
    this.gameplay.addChild(this.graphic);
    this.gameplay.on("pointerdown", this._onPointerDown.bind(this));
    this.gameplay.on("pointerup", this._onPointerUp.bind(this));

    SoundManager.play("bg_1", 0.5, true, 1);
  }

  _initBackGround() {
    this.updatePrevBackground();
    let bgTexture = null;
    if (UserData.prevBackground == AssetSelector.getBgTexture().length - 1) {
      bgTexture = AssetSelector.getBgTexture()[0];
    } else {
      bgTexture = AssetSelector.getBgTexture()[UserData.prevBackground  + 1];
    };
    this.bg = new BackGround(bgTexture, GameConstant.GAME_WIDTH, GameConstant.GAME_HEIGHT);
    this.bg.zIndex = -100;
    this.gameplay.addChild(this.bg);
  }

  _initBLockManager() {
    this.blockManager = new BlockManager();
    this.gameplay.addChild(this.blockManager);
  }

  _initBridgeManager() {
    this.bridgeManager = new BridgeManager();
    this.gameplay.addChild(this.bridgeManager);
  }  

  _initCherryManager() {
    this.cherryManager = new CherryManager();
    this.gameplay.addChild(this.cherryManager);
  }

  _initHero() {
    this.hero = new Hero(AssetSelector.getHeroIdleTextures());
    this.hero.x = 0;
    this.hero.y = GameConstant.HERO_Y_POSITION;
    this.gameplay.addChild(this.hero);
    this.hero.on("onDead", this._lose, this);
  }

  _initFx() {
    this.fxs = [];
    this.fxContainer = new Container();
    this.fxContainer.zIndex = 100;
    this.gameplay.addChild(this.fxContainer);
    this._addPlusOneFx();
    this._addCherryUpdateFx();
    this._addVibrateScreenFx();
    this._addDelayShowEndScreenFx();
    this._addChangeScreenResetFx();
    this._addChangeScreenBackHomeFx();
  }

  show() {
    super.show();
  }

  hide() {
    super.hide();
  }
 
  update(dt) {
    super.update(dt);
    this.timeWaitToShowAds += dt;
    if (GameStateManager.state === GameState.Playing) {
      this.playTime += dt; 
      this.blockManager.update(dt);
      this.bridgeManager.update(dt);
      this.cherryManager.update(dt);
      this.bg.update(dt);
      this.hero.update(dt);

      //check hero kicked
      if (this.hero.isKicked && this.hero.state === HeroState.KICK) {
        //play kick sound
        SoundManager.play("kick", 1, false, 1);
        this.bridgeManager.onHeroKicked();
        this.hero.isKicked = false;
        if (!this.checkExtraScore) {
          this.checkExtraScore = true;
        }  
      }

      //check event happen
      if (this.bridgeManager.isBridgeStay()) { 
        if (!this.tutorialScreen.isFadeOut) {
          this.tutorialScreen.fadeOut();
        }

        if (this.hero.isReady) {
          //check bridge on block
          if (this.isBridgeOnBlock() || GameConstant.CHEAT_IMMORTAL) {
            this.hero.onRun((this.blockManager.blocks[this.blockManager.blocks.length - 1].getRightCordinate() - GameConstant.HERO_OFFSET - GameResizer.width / 2), false);
            
            //play bridge fall sound
            SoundManager.play("bridge_fall", 1, false, 1);
          } else {
            this.hero.onRun(this.bridgeManager.bridges[this.bridgeManager.bridges.length - 1].getTopCordinate() - GameResizer.width / 2, true);
            
            //play bridge fall sound
            SoundManager.play("bridge_fall", 1, false, 1);
          }
        }

        //check if bridge lie on extra score zone
        if (this.blockManager.currentBlockHasExtraScoreZone()) {
          if (this.isBridgeOnExtraScoreZone() && this.checkExtraScore) {
            this.checkExtraScore = false;

            //play plus one fx
            this._playPlusOneFx(this.blockManager.blocks[this.blockManager.blocks.length - 1].x, this.blockManager.blocks[this.blockManager.blocks.length - 1].y - 50);
            //increase score
            this.updateScore();
            //play bonus score sound
            SoundManager.play("bonus_score", 1, false, 1);
          }
        }

        if (this.hero.state === HeroState.RUN) {
          if (this.hero.side === HeroSide.DOWN) {
            //check hero collide with block
            if (this.isHeroOnBlock()) {
              this.hero.onFall();

              //play hit block sound
              SoundManager.play("face_hit_block", 1, false, 1);
            }
            //check hero collide with cherry
            if (this.isHeroCollideWithCherry()) {
              this._playCherryUpdateFx();
              this.cherryManager.onCollideWithHero();

              //play eat cherry sound
              SoundManager.play("eat_cherry", 1, false, 1);
            }
          }
        }

        if(this.hero.state === HeroState.FALL) {
          if (this.isBridgeShort()) {
            this.bridgeManager.collapseBridge();
          }
        }

        if(this.hero.isEndRun) {
          this.createNewObject();
          this.moveCamera();

          //increase score
          this.updateScore();
          //play score sound
          SoundManager.play("score", 1, false, 1);
        }
      }
      //ve bound
      this.graphic.clear();
      this.graphic.beginFill(0xFFA07A, 1);
      this.graphic.drawRect(this.hero.getBounds().x, this.hero.getBounds().y, this.hero.getBounds().width, this.hero.getBounds().height);
      this.graphic.endFill();
    }
    
  }

  destroy() {
    super.destroy();
    GameStateManager.unregisterOnStateChangedCallback(this._onGameStateChanged.bind(this));
  }

  // pointer event down
  _onPointerDown(e) {
    if (GameStateManager.state != GameState.Playing) {
      return;
    }
    // console.log("pointer down");
    if(this.hero.isReady && this.hero.state === HeroState.STAY) {
      this.bridgeManager.onPointerDown();
      this.hero.onDance();

      //play bridge grow sound
      SoundManager.play("bridge_grow", 0.5, true, 0.9);
    } else if (this.hero.state === HeroState.RUN && !this.isHeroOnBlock()) {
      this.hero.onChangeSide();

      //play change side sound
      SoundManager.play("change_side", 1, false, 1);
    }
  }

  // pointer event up
  _onPointerUp(e) {
    if (GameStateManager.state != GameState.Playing) {
      return;
    }
    // console.log("pointer up");
    if (this.hero.isReady) {
      this.bridgeManager.onPointerUp();
      this.hero.onKickBridge();

      //end bridgegrow sound
      SoundManager.stop("bridge_grow");
    }
  }

  updateScore() {
    this.score += 1;
    this.playScreen.updateScore(this.score);
  }

  isBridgeOnExtraScoreZone() {
    if (GameConstant.DEBUG_EXTRA_SCORE) {
      return true;
    }
    let bridge = this.bridgeManager.bridges[this.bridgeManager.bridges.length - 1];
    let extraScoreZone = this.blockManager.getCurrentExtraScoreZone();
    // console.log(extraScoreZone);
    // console.log(bridge.getTopCordinate());
    // console.log((extraScoreZone.x - extraScoreZone.width/2), (extraScoreZone.x + extraScoreZone.width/2));
    if (bridge.getTopCordinate() >= extraScoreZone.x && bridge.getTopCordinate() <= extraScoreZone.x + extraScoreZone.width) {
      return true;
    }
    return false;
  }

  isBridgeOnBlock() {
    let bridge = this.bridgeManager.bridges[this.bridgeManager.bridges.length - 1];
    let block = this.blockManager.blocks[this.blockManager.blocks.length - 1];
    if (bridge.getTopCordinate() >= block.getLeftCordinate() - 1 && bridge.getTopCordinate() <= block.getRightCordinate() + 1) {
      return true;
    }
    return false;
  }

  isBridgeShort() {
    let bridge = this.bridgeManager.bridges[this.bridgeManager.bridges.length - 1];
    let block = this.blockManager.blocks[this.blockManager.blocks.length - 1];
    if (bridge.getTopCordinate() < block.getLeftCordinate()) {
      return true;
    }
    return false;
  }

  isHeroOnBlock() {
    let block = this.blockManager.blocks[this.blockManager.blocks.length - 1];
    if (this.hero.getRightCordinate() > block.getLeftCordinate()) {
      return true;
    }
    return false;
  }

  isHeroCollideWithCherry() {
    if (this.cherryManager.hasNewCherry) {
      let cherry = this.cherryManager.cherries[this.cherryManager.cherries.length - 1];
      if (this.hero.getRightCordinate() >= cherry.getLeftCordinate() && this.hero.getLeftCordinate() <= cherry.getRightCordinate()) {
        return true;
      } 
    }
    return false;
  }

  createNewObject() {
    this.blockManager.createNewBlock();
    // this.cherryManager.createNewCherry();
  }

  moveCamera() {
    let dis = this.distanceToMoveCamera();
    let randomDistanceBetweenBlocks = this.blockManager.randomDistanceBetweenBlocks();
    // console.log("distance between blocks: " + randomDistanceBetweenBlocks);
    this.blockManager.onMoveCamera(dis, randomDistanceBetweenBlocks);
    this.bridgeManager.onMoveCamera(dis);
    this.cherryManager.onMoveCamera(dis, randomDistanceBetweenBlocks);
    this.hero.onMoveCamera(dis);
    this.bg.onMoveCamera(dis);
  }

  distanceToMoveCamera() {
    return this.hero.x - GameConstant.HERO_X_POSITION;
  }

  updateBestScore() {
    if (this.score <= UserData.bestScore) {
      return;
    } else {
      DataLocal.updateBestScoreData(this.score);
    }
  }

  _addPlusOneFx() {
    this.plusOneFx = new PlusOneFx(0);
    this.fxContainer.addChild(this.plusOneFx);
  }

  _addCherryUpdateFx() {
    this.cherryUpdateFx = Tween.createCountTween({
      duration: GameConstant.TIME_CHERRY_MOVE_TO_GRAVE,
      onComplete: () => {
        UserData.cherryNumber += 1;
        DataLocal.updateCherryNumberData(UserData.cherryNumber);
        this.playScreen.updateCherryNumber(UserData.cherryNumber);
      }
    });
  }

  _addVibrateScreenFx() {
    this.vibrateScreenFx = Tween.createTween(this, { y: this.y - 4 }, {
      duration: 0.08,
      delay: 0.2,
      repeat: 5,
      yoyo: true,
      onComplete: () => {
        if (!(GameConstant.SHOW_ADS && this.timeWaitToShowAds > GameConstant.TIME_WAIT_TO_SHOW_ADS)) {
          this._playDelayShowEndScreenFx();
        } else {
          this.timeWaitToShowAds = 0;
          AdsManager.hasAdblock((hasAdblock) => {
            if (hasAdblock) {
              this._playDelayShowEndScreenFx();
            } else {
              AdsManager.showVideo(
                AdsType.INTERSTITIAL,
                () => {},
                () => {
                  this._playDelayShowEndScreenFx();
                },
                () => {
                  this._playDelayShowEndScreenFx();
                },
              );
            }
          });
        }
      },
    });
  }

  _addDelayShowEndScreenFx() {
    this.delayShowEndScreenFx = Tween.createCountTween({
      duration: 0.5,
      onComplete: () => {
        this.updatePrevBackground();
        this._loadEndCard();
        //play game over sound
        SoundManager.play("game_over", 1, false, 1);
      },
    });
  }

  _addChangeScreenResetFx() {
    this.changeScreenResetThen = Tween.createTween(this, { alpha: 1 }, {
      duration    : 0.3,
      delay       : 0.1,
      onComplete  : () => {
      }
    });

    this.changeScreenResetFx = Tween.createTween(this, { alpha: 0 }, {
      duration    : 0.3,
      onComplete     : () => {
        this.changeScreenResetThen.start();
        this._restartGame();
      },
    });
  }

  _addChangeScreenBackHomeFx() {
    this.changeScreenBackHomeThen = Tween.createTween(this, { alpha: 1 }, {
      duration    : 0.3,
      delay       : 0.1,
      onComplete  : () => {
      }
    });

    this.changeScreenBackHomeFx = Tween.createTween(this, { alpha: 0 }, {
      duration    : 0.3,
      onComplete     : () => {
        this.changeScreenBackHomeThen.start();
        this._onBackHome();
      },
    });
  }

  _playPlusOneFx(x = 0, y = 0) {
    this.plusOneFx.x = x;
    this.plusOneFx.y = y;
    this.plusOneFx.play();
  }

  _playCherryUpdateFx() {
    this.cherryUpdateFx.start();
  }

  _playVibrateScreenFx() {
    this.vibrateScreenFx.start();
  }

  _playDelayShowEndScreenFx() {
    this.delayShowEndScreenFx.start();
  }

  _playChangeScreenResetFx() {
    this.changeScreenResetFx.start();
  }

  _playChangeScreenBackHomeFx() {
    this.changeScreenBackHomeFx.start();
  }

  _showAdsBlockPopUp() {
    if (this.adsBlockPopUpScreen.visible) {
      return;
    }
    this.adsBlockPopUpScreen.typeAdsBlock();
    this.ui.setScreenActive(GameConstant.SCREEN_ADS_BLOCK_POPUP);
  }

  _showAdsInvalidPopUp() {
    if (this.adsBlockPopUpScreen.visible) {
      return;
    }
    this.adsBlockPopUpScreen.typeAdsInvalid();
    this.ui.setScreenActive(GameConstant.SCREEN_ADS_BLOCK_POPUP);
  }

  _showSkipRewardPopUp() {
    if (this.adsBlockPopUpScreen.visible) {
      return;
    }
    this.adsBlockPopUpScreen.typeSkipReward();
    this.ui.setScreenActive(GameConstant.SCREEN_ADS_BLOCK_POPUP);
  }

  _hideAdsBlockPopUp() {
    this.ui.setScreenActive(GameConstant.SCREEN_ADS_BLOCK_POPUP, false);
  }

  _turnOffTutorial() {
    this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL, false);
  }
 
  _onGameStateChanged(state, prevState) {
    if (state === GameState.Playing && prevState === GameState.Tutorial) {
      this._onStart();
    }

    if (state === GameState.Lose) {
      // SoundManager.stop();
    }

    if (state === GameState.Paused && prevState === GameState.Playing) {
      // SoundManager.pause();
    }

    if (state === GameState.Playing && prevState === GameState.Paused) {
      if (this.audioId !== undefined) {
        // SoundManager.resume(this.audioId);
      }
    }
  }

  _onStart() {
    this.hero.onStart();
    this.blockManager.onStart();
    GameStateManager.state = GameState.Playing;
    this.ui.setScreenActive(GameConstant.SCREEN_HOME, false);
    this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
    this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
  }

  _onOpenShop() {
    this.ui.setScreenActive(GameConstant.SCREEN_SHOP);
  }

  _onCloseShop() {
    this.ui.setScreenActive(GameConstant.SCREEN_SHOP, false);
    this.hero.changeSkin();
  }

  _lose() {
    Game.onLose();
    GameStateManager.state = GameState.Lose;
    //play dead sound
    SoundManager.play("dead", 1, false, 1);

    //stop bg sound
    SoundManager.stop("bg_1");

    this.updateBestScore();
    this._playVibrateScreenFx();
  }

  reset() {
    this.playTime = 0;
    this.score = 0;
    this.checkExtraScore = false;
    this.bg.reset();
    this.bridgeManager.reset();
    this.cherryManager.reset();
    this.blockManager.reset(); 
    this.hero.reset();

    //play bg sound
    SoundManager.play("bg_1", 0.5, true, 1)
  }

  reInit() {
    this.playTime = 0;
    this.score = 0;
    this.checkExtraScore = false;
    this.bg.reset();
    this.bridgeManager.reset();
    this.cherryManager.reset();
    this.blockManager.reInit();
    this.hero.reInit();

    //play bg sound
    SoundManager.play("bg_1", 0.5, true, 1)
  }

  _restartGame() {
    this.reset();
    this.resize();
    this.ui.disableAllScreens();
    this.loadData();
    GameStateManager.state = GameState.Playing;
    this.ui.setScreenActive(GameConstant.SCREEN_TUTORIAL);
    this.ui.setScreenActive(GameConstant.SCREEN_PLAY);
  }
  
  _onBackHome() {
    this.reInit();
    this.resize();
    this.ui.disableAllScreens();
    this.loadData();
    GameStateManager.state = GameState.Home;
    this.ui.setScreenActive(GameConstant.SCREEN_HOME);
  }

  _loadEndCard() {
    this.ui.setScreenActive(GameConstant.SCREEN_PLAY, false);
    this.ui.setScreenActive(GameConstant.SCREEN_LOSE);
    this.endScreen.updateScore(this.score);
  }

  updatePrevBackground() {
    if (UserData.prevBackground == AssetSelector.getBgTexture().length - 1) {
      UserData.prevBackground = 0;
    } else {
      UserData.prevBackground += 1;
    }
    DataLocal.updatePrevBackgroundData(UserData.prevBackground);
  }

  resize() {
    super.resize();
    
    this.gameplay.x = GameResizer.width / 2;
    this.gameplay.y = GameResizer.height / 2;

    this.bg.resize();
    this.hero.resize();
    this.bridgeManager.resize();
    this.blockManager.resize();
    this.cherryManager.resize();

    // console.log(this.hero.x, this.hero.y, this.hero.getBounds().x, this.hero.getBounds().y);
  }

  
}
