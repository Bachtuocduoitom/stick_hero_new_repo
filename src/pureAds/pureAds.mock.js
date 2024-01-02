import * as EventEmitter from "events";
import metadata from "../../metadata.json";

export class DebugAdapter extends EventEmitter {
  constructor() {
    super();
  }

  onLoad() {
    console.debug("[KAds Mock - Adapter] OnLoad");
    this.emit("gameLoad", { width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", () => {
      this.emit("resize", { width: window.innerWidth, height: window.innerHeight });
    });

    window.addEventListener("focus", () => {
      this.emit("gameResume");
    });

    window.addEventListener("blur", () => {
      this.emit("gamePause");
    });
  }

  update() {
  }

  onAssetLoaded() {
    console.debug("[KAds Mock - Adapter] OnAssetLoaded");
  }

  onStart() {
    console.debug("[KAds Mock - Adapter] OnStart");
  }

  onInteraction() {
    console.debug("[KAds Mock - Adapter] OnInteraction");
  }

  onWin() {
    console.debug("[KAds Mock - Adapter] OnWin");
  }

  onLose() {
    console.debug("[KAds Mock - Adapter] OnLose");
  }

  onReplay() {
    console.debug("[KAds Mock - Adapter] OnReplay");
  }

  onOneLevelPassed() {
    console.debug("[KAds Mock - Adapter] OnOneLevelPassed");
  }

  onMidwayProgress() {
    console.debug("[KAds Mock - Adapter] onMidwayProgress");
  }

  onSendEvent(type, name) {
    console.debug("[KAds Mock - Adapter] onSendEvent", type, name);
  }

  onCTAClick(url) {
    window.open(url);
    console.log(`[KAds Mock - Adapter] OnCTAClicked: ${ url}`);
  }

  getScreenSize() {
    return { width: window.innerWidth, height: window.innerHeight };
  }
}

export default class KAds extends EventEmitter {
  constructor() {
    super();
    /** @type {AdsAdapter} */
    this.adapter = new DebugAdapter();
    this.adType = "PREVIEW";
    this.platform = this.getPlatform();
    console.log("[KAds Mock] KAds Inited");
  }

  registerEvents(gameObject) {
    if (this.adapter) {
      this.checkHaveFunction(gameObject.load) && this.adapter.addListener("gameLoad", () => gameObject.load());
      this.checkHaveFunction(gameObject.setPause) && this.adapter.addListener("gamePause", () => gameObject.setPause(true));
      this.checkHaveFunction(gameObject.setPause) && this.adapter.addListener("gameResume", () => gameObject.setPause(false));
      this.checkHaveFunction(gameObject.resize) && this.adapter.addListener("resize", (size) => gameObject.resize(size));
    }
    else {
      console.warn("[KAds Mock] Ads Adapter is null");
    }
  }

  checkHaveFunction(objFunc) {
    if (typeof objFunc === "function") {
      return true;
    }
    else if (typeof objFunc === "undefined") {
      console.error("[KAds Mock] The game object was not implemented a function yet");
      return false;
    }
    else {
      console.warn(`[KAds Mock] It's neither undefined nor a function. It's a ${ typeof objFunc}`);
      return false;
    }
  }

  load() {
    this.adapter.onLoad();
  }

  getScreenSize() {
    return this.adapter.getScreenSize();
  }

  onCTAClick() {
    let storeURL = (this.platform === "android") ? metadata.androidStoreURL : metadata.iosStoreURL;
    console.log(`[KAds Mock] onCTAClick: ${ storeURL}`);
    this.adapter.onCTAClick(storeURL);
  }

  getPlatform() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if ((/android|Android/i).test(userAgent)) {
      return "android";
    }
    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if ((/iPad|iPhone|iPod|Macintosh/).test(userAgent) && !window.MSStream) {
      return "ios";
    }
    return "android";
  }
}
