import { Debug } from "../src/helpers/debug";
import { EventEmitter } from "events";

export const SdkEvent = Object.freeze({
    SDK_INIT_STARTED    : "adInitStarted",
    SDK_INIT_COMPLETED  : "adInitCompleted",
    SDK_INIT_ERROR      : "adInitError",
});

export const SdkState = Object.freeze({
    INIT    : "init",
    LOADING : "loading",
    LOADED  : "loaded",
});

export class SdkManager {
  static init() {
    this.emitter = new EventEmitter();
    this.state = SdkState.INIT;
    if (!window.AbigamesSdk) {
      Debug.error("SdkManager", "AbigamesSdk is not defined");
      return;
    }
    this.abiGameSDK = window.AbigamesSdk;
    this.abiGameSDK.init({
      gameId: '65125933bb2ae988433c513b',
      onStart: () => {
          Debug.log("SdkManager", "Sdk is started");
          this.state = SdkState.LOADING;
          this.emitter.emit(SdkEvent.SDK_INIT_STARTED);
      }
    }).then(() => {
      Debug.log("SdkManager", "Sdk is initialized");
      this.state = SdkState.LOADED;
      this.emitter.emit(SdkEvent.SDK_INIT_COMPLETED);
    }).catch((err) => {
      Debug.error("SdkManager", err);
      this.emitter.emit(SdkEvent.SDK_INIT_ERROR);  
    });
  }
}