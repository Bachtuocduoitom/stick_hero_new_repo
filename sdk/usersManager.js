import { Debug } from "../src/helpers/debug.js";
import { EventEmitter } from "events";

export class UsersManager {
  static init() {
    this.emitter = new EventEmitter();
    this.abiGameSDK = window.AbigamesSdk;
    this.getSystemInformation((data, err) => {
      if (err) {
        Debug.error("UsersManager", err);
      }
      else {
        this.userSystemInfo = data;
      }
    });
  }

  static getUser() {
    const callback = (user, error) => {
      if (error) {
        Debug.error("UsersManager", error);
      }
      else {
        Debug.log("UsersManager", user);
      }
    };

    this.abiGameSDK.user.getUser(callback);
  }

  static getSystemInformation(cb) {
    const callback = (data, error) => {
      if (error) {
        Debug.error("UsersManager", error);
      }
      else {
        Debug.log("UsersManager", data);
      }
      cb && cb(data, error);
    };

    this.abiGameSDK.user.getSystemInfo(callback);
  }

  static pushGameRank(score) {
    const callback = (data, error) => {
      if (error) {
        Debug.error("UsersManager", error);
      }
      else {
        Debug.log("UsersManager", data);
      }
    };
    this.abiGameSDK.user.pushGameRank(score, callback);
  }
}
