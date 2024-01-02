import { Debug } from "../src/helpers/debug.js";
import { EventEmitter } from "events";
import { Game } from "../src/game.js";

export const AdEvent = Object.freeze({
  AD_STARTED: "adStarted",
  AD_COMPLETED: "adCompleted",
  AD_ERROR: "adError",
  AD_INVALID: "adInvalid",
});

export const AdBannerSize = Object.freeze({
  SIZE1: "300x250",
  SIZE2: "320x50",
  SIZE3: "728x90",
  SIZE4: "320x100",
  SIZE5: "468x60",
});

export const AdsType = Object.freeze({
  REWARDED: "rewarded",
  INTERSTITIAL: "interstitial",
});

export class AdsManager {
  static init() {
      this.emitter = new EventEmitter();
      this.abiGameSDK = window.AbigamesSdk;
      this.isAdBlocked = false;
  }

  static showBanner(elementId, bannerSize = AdBannerSize.SIZE4) {
    this.abiGameSDK.ads.displayBannerAds({ size: bannerSize, containerId: elementId }, (err) => {
      if (err) {
        Debug.log("AdsManager", "Error on request banner ads: " + err);
        return;
      }
      Debug.log("AdsManagerz", "Banner ads is shown");
    });
  }

  static hasAdblock(callback) {
    this.abiGameSDK.ads.hasAdblock((isBlock) => {
      this.adBlocked = isBlock;
      callback && callback(isBlock);
      Debug.log("AdsManager", "Adblock is " + (isBlock ? "enabled" : "disabled"));
    });
  }

  static showVideo(adsType, onStart, onFinished, onError) {
    if (this.isAdBlocked) {
      onError && onError();
      this.onAdError();
      return;
    }
    this.abiGameSDK.ads.displayVideoAds(
      adsType,
        {
          adStarted: () => {
            onStart && onStart();
            this.onAdStarted();
          },
          adFinished: () => {
            onFinished && onFinished();
            this.onAdFinished();
          },
          adError: (err) => {
            onError && onError(err);
            this.onAdError(err);
          },
        });
  }

  static onAdStarted() {
    Game.pause();
    this.emitter.emit(AdEvent.AD_STARTED);
  }

  static onAdFinished() {
    Game.resume();
    this.emitter.emit(AdEvent.AD_COMPLETED);
  }

  static onAdError(err) {
    Game.resume();
    console.error("AdsManager", err);
    this.emitter.emit(AdEvent.AD_ERROR, err);
  }

  static onAdsInvalid() {
      this.emitter.emit(AdEvent.AD_INVALID);
  }
}