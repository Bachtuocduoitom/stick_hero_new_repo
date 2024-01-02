import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Debug } from "../../helpers/debug";
import { DataManager } from "./dataManager";
import { UserData } from "./userData";

export const DataLocalEvent = Object.freeze({
  Initialize: "initialized",
});

export const DataLocalState = Object.freeze({
  Loaded   : "loaded",
  Loading  : "loading",
  Unloaded : "unloaded",
});

export class DataLocal {
  static init() {
    if (!window.indexedDB) {
      Debug.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
      return;
    }
    this.state = DataLocalState.Unloaded;
    this.dbName = GameConstant.INDEXEDDB_NAME;
    this.dbVersion = GameConstant.INDEXEDDB_VERSION;
    this.db = null;
    this.totalLoad = 0;
    this.totalData = 5;
    var request = window.indexedDB.open(this.dbName, this.dbVersion);
    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      if (!this.db.objectStoreNames.contains(GameConstant.INDEXEDDB_STORE_NAME)) {
        this.db.createObjectStore(GameConstant.INDEXEDDB_STORE_NAME);
      }
    };
    this.state = DataLocalState.Loading;
    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.getCherryNumber();
      this.getListHeroSkinUnlock();
      this.getCurrentSkin();
      this.getBestScore();
      this.getPrevBackground();
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static checkLoad() {
    this.totalLoad++;
    if (this.totalLoad >= this.totalData) {
      this.state = DataLocalState.Loaded;
      DataManager.init();
      // Game.emit(DataLocalEvent.Initialize);
    }
  }

  static getListHeroSkinUnlock() {
    this.getData(GameConstant.INDEXEDDB_LIST_HERO_SKIN_UNLOCK_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.listHeroSkinUnlock = GameConstant.DEFAUT_LIST_HERO_SKIN_UNLOCK;
        this.addData(GameConstant.INDEXEDDB_LIST_HERO_SKIN_UNLOCK_KEY, this.listHeroSkinUnlock);
      }
      else {
        this.listHeroSkinUnlock = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getCurrentSkin() {
    this.getData(GameConstant.INDEXEDDB_CURRENT_SKIN).then((value) => {
      if (typeof (value) === "undefined") {
        this.currentSkin = GameConstant.PLAYER_DEFAULT_SKIN;
        this.addData(GameConstant.INDEXEDDB_CURRENT_SKIN, this.currentSkin);
      }
      else {
        this.currentSkin = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getBestScore() {
    this.getData(GameConstant.INDEXEDDB_BEST_SCORE).then((value) => {
      if (typeof (value) === "undefined") {
        this.bestScore = GameConstant.PLAYER_DEFAUT_BEST_SCORE;
        this.addData(GameConstant.INDEXEDDB_BEST_SCORE, this.bestScore);
      }
      else {
        this.bestScore = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getCherryNumber() {
    this.getData(GameConstant.INDEXEDDB_CHERRY_NUMBER_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.cherryNumber = GameConstant.PLAYER_DEFAULT_CHERRY_NUMBER ;
        this.addData(GameConstant.INDEXEDDB_CHERRY_NUMBER_KEY, this.cherryNumber);
      }
      else {
        this.cherryNumber = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getPrevBackground() {
    this.getData(GameConstant.INDEXEDDB_PREV_BACKGROUND_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.prevBackground = GameConstant.DEFAULT_BACKGROUND;
        this.addData(GameConstant.INDEXEDDB_PREV_BACKGROUND_KEY, this.prevBackground);
      }
      else {
        this.prevBackground = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static addData(key, value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.add(value, key);
    request.onsuccess = () => {
      Debug.log("add success");
    };
    request.onerror = (err) => {
      Debug.error("add error", err);
    };
  }

  static getData(key) {
    return new Promise((resolve, reject) => {
      const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
      let request = userData.get(key);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      request.onerror = (event) => {
        reject(event);
      };
    });
  }

  static updateListHeroSkinUnlockData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_LIST_HERO_SKIN_UNLOCK_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_LIST_HERO_SKIN_UNLOCK_KEY);
      requestUpdate.onsuccess = () => {
        UserData.listHeroSkinUnlock = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_LIST_HERO_SKIN_UNLOCK_KEY } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_LIST_HERO_SKIN_UNLOCK_KEY } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateCherryNumberData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_CHERRY_NUMBER_KEY );
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_CHERRY_NUMBER_KEY );
      requestUpdate.onsuccess = () => {
        UserData.cherryNumber = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_CHERRY_NUMBER_KEY  } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_CHERRY_NUMBER_KEY  } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateCurrentSkinData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_CURRENT_SKIN);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_CURRENT_SKIN);
      requestUpdate.onsuccess = () => {
        UserData.currentSkin = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_CURRENT_SKIN } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_CURRENT_SKIN } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateBestScoreData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_BEST_SCORE);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_BEST_SCORE);
      requestUpdate.onsuccess = () => {
        UserData.bestScore = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_BEST_SCORE } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_BEST_SCORE } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updatePrevBackgroundData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_PREV_BACKGROUND_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_PREV_BACKGROUND_KEY);
      requestUpdate.onsuccess = () => {
        UserData.prevBackground = data;
        Debug.log(`update ${ GameConstant.INDEXEDDB_PREV_BACKGROUND_KEY } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ GameConstant.INDEXEDDB_PREV_BACKGROUND_KEY } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }

  static updateDataByKey(key, value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(key);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = parseFloat(value.toFixed(1));
      var requestUpdate = userData.put(data, key);
      requestUpdate.onsuccess = () => {
        Debug.log(`update ${ key } success`);
      };
      requestUpdate.onerror = (err) => {
        Debug.error(`update ${ key } error`, err);
      };
    };
    request.onerror = (event) => {
      Debug.error("error: ", event);
    };
  }
}
