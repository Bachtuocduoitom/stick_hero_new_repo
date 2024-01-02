import { GameConstant } from "./gameConstant";
import { PlayScene } from "./magicTiles3/scenes/playScene";
import { AssetManager } from "./assetManager";
import { Debug } from "./helpers/debug";
import { GameSetting } from "./magicTiles3/gameSetting";
import { GameState, GameStateManager } from "./pureDynamic/systems/gameStateManager";
import { PauseScene } from "./magicTiles3/scenes/pauseScene";
import { EndScreen } from "./magicTiles3/screens/endScreen";
import { Tween } from "./systems/tween/tween";
import { SoundManager } from "./soundManager";
import { GameResizer, Orientation } from "./pureDynamic/systems/gameResizer";
import { SceneManager } from "./pureDynamic/PixiWrapper/scene/sceneManager";
import "./systems/extensions/index";
import { ScriptSystem } from "./systems/script/scriptSystem";
import { DataLocal } from "./magicTiles3/data/dataLocal";
import { LoadingScene, LoadingSceneEvent } from "./magicTiles3/scenes/loadingScene";
import { Time } from "./systems/time/time";
import { SdkEvent, SdkManager } from "../sdk/sdkManager";
import { AdBannerSize, AdsManager } from "../sdk/adsManager";
import { UsersManager } from "../sdk/usersManager";

export class Game {
  static init() {
    this.gameCreated = false;
    this.started = false;
    this.life = GameConstant.GAME_LIFE;
    this.isMute = false;
    this.load();
  }

  static load() {
    Debug.log("Creative", "Load");
    this.app = new PIXI.Application({
      width           : GameConstant.GAME_WIDTH,
      height          : GameConstant.GAME_HEIGHT,
      backgroundColor : GameConstant.BG_COLOR,
    });

    document.body.appendChild(this.app.view);
    const viewStyle = this.app.view.style;
    viewStyle.position = "absolute";
    viewStyle.display = "block";
    viewStyle.padding = "0px 0px 0px 0px";

    ScriptSystem.init(this.app);
    Tween.init(this.app);
    Time.init(this.app);
    GameResizer.init(this.app);
    GameSetting.init();
    AssetManager.load(this._onAssetLoaded.bind(this));
    DataLocal.init();
    /*
     * this.on(DataLocalEvent.Initialize, () => {
     *   DataManager.init();
     * });
     */
  }

  static getScreenSize() {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  static _create() {
    this.gameCreated = true;
    let screenSize = this.getScreenSize();
    Debug.log("Creative", "Create", screenSize);

    this.resize(screenSize);

    SceneManager.init([
      new PlayScene(this.app),
      new PauseScene(),
      new LoadingScene(),
    ]);
    this.app.stage.addChild(SceneManager.sceneContainer);

    let playScene = SceneManager.getScene(GameConstant.SCENE_PLAY);
    // SceneManager.load(playScene);

    let loadingScene = SceneManager.getScene(GameConstant.SCENE_LOADING);
    SceneManager.load(loadingScene);
    loadingScene.on(LoadingSceneEvent.LoadCompleted, () => {
      SceneManager.load(playScene);
    });

    let pauseScene = SceneManager.getScene(GameConstant.SCENE_PAUSE);
    SceneManager.loadAdditive(pauseScene);
    pauseScene.visible = false;
    this.app.ticker.add(this._update.bind(this));
  }

  static _update() {
    this.dt = this.app.ticker.deltaMS / 1000;
    SceneManager.update(Time.dt);
  }

  static resize(screenSize) {
    if (this.gameCreated) {
      GameResizer.resize(screenSize.width, screenSize.height);
      this.onResizeBannerAds();
    }
    else {
      Debug.warning("Creative", "Game resize called before game loading");
    }
  }

  static setPause(isPause) {
    if (isPause) {
      this.pause();
    }
    else {
      this.resume();
    }
  }

  static pause() {
    Debug.log("Creative", "Pause");
    if (!this.gameCreated) {
      Debug.warning("Creative", "Pause before game creation!");
      return;
    }

    if (GameStateManager.state !== GameState.Paused) {
      if (!this.isMute) {
        SoundManager.muteAll();
      }
      GameStateManager.state = GameState.Paused;
      SceneManager.setPause(true);
      Time.scale = 0;
    }
  }

  static resume() {
    Debug.log("Creative", "Resume");

    if (!this.gameCreated) {
      Debug.warning("Creative", "Resume before game creation!");
      return;
    }

    if (GameStateManager.state === GameState.Paused) {
      if (!this.isMute) {
        SoundManager.unMuteAll();
      }
      GameStateManager.state = GameStateManager.prevState;
      SceneManager.setPause(false);
      Time.scale = 1;
    }
  }

  static _onAssetLoaded() {
    if (!this.gameCreated) {
      this._create();
    }
    this.initAbigamesSdk();
  }

  static onVisible() {
    this.started = true;
    if (AssetManager.loaded && !this.gameCreated) {
      this._create();
    }
  }

  static onStart() {
  }

  static onWin() {
  }

  static onLose() {
  }

  static onOneLevelPassed() {
  }

  static onMidwayProgress() {
  }

  static sendEvent(type, name) {
  }

  static onCTAClick(elementName) {
    this.sendEvent("end_choice", elementName);
  }

  static get revivable() {
    return this.life > 1;
  }

  static initAbigamesSdk() {
    SdkManager.init();
    SdkManager.emitter.on(SdkEvent.SDK_INIT_COMPLETED, () => {
      this.initBannerAds();
      this.initAbiUsers();
    });
    SdkManager.emitter.on(SdkEvent.SDK_INIT_ERROR, () => {
      this.initBannerAds();
      this.initAbiUsers();
    });
  }

  static initBannerAds() {
    AdsManager.init();
    let id = "banner-ads";
    this.bannerAdsElement = document.createElement("div");
    this.bannerAdsElement.id = id;
    this.bannerAdsStyle = this.bannerAdsElement.style;
    document.body.appendChild(this.bannerAdsElement);

    this.showBannerAds();
  }

  static showBannerAds() {
    AdsManager.hasAdblock((res) => {
      if (res || GameStateManager.prevState === GameState.Playing) {
        return;
      }

      let bannerSize = null;
      // bannerSize in screen portrait like landscape
      this.bannerAdsStyle.transformOrigin = "center bottom";
      if (GameResizer.orientation === Orientation.Portrait) {
        this.bannerAdsStyle.width = "100%";
        this.bannerAdsStyle.height = "50px";
        this.bannerAdsStyle.position = "absolute";
        this.bannerAdsStyle.bottom = "0px";
        this.bannerAdsStyle.left = "0px";
        bannerSize = AdBannerSize.SIZE2;
      }
      else {
        this.bannerAdsStyle.width = "100%";
        this.bannerAdsStyle.height = "50px";
        this.bannerAdsStyle.position = "absolute";
        this.bannerAdsStyle.bottom = "0px";
        this.bannerAdsStyle.left = "0px";
        bannerSize = AdBannerSize.SIZE2;
      }

      AdsManager.showBanner(this.bannerAdsElement.id, bannerSize);
      this.onResizeBannerAds();
    });
  }

  static disableBannerAds() {
    this.bannerAdsElement.style.display = "none";
  }

  static enableBannerAds() {
    this.bannerAdsElement.style.display = "flex";
  }

  static onResizeBannerAds() {
    if (!this.bannerAdsElement) {
      return;
    }
    UsersManager.getSystemInformation((data, err) => {
      if (err) {
        this.bannerAdsStyle.transform = "scale(1)";
        return;
      }
      else {
        let platform = data.platform;
        if (platform.type === "mobile") {
          if (GameResizer.isLandScape()) {
            this.bannerAdsStyle.transform = "scale(0.5)";
          }
          else {
            this.bannerAdsStyle.transform = "scale(1)";
          }
        }
        else if (platform.type === "desktop") {
          if (GameResizer.isLandScape()) {
            this.bannerAdsStyle.transform = "scale(0.75)";
          }
          else {
            this.bannerAdsStyle.transform = "scale(1)";
          }
        }
      }
    });
  }

  static initAbiUsers() {
    UsersManager.init();
  }
}

window.onload = function() {
  Game.init();
};

window.onresize = function() {
  Game.resize(Game.getScreenSize());
};

window.onblur = function() {
  Game.setPause(true);
};
window.onfocus = function() {
  Game.setPause(false);
};
