import { Container, Texture } from "pixi.js";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/utils";
import { Spawner, SpawnerEvent } from "../../../systems/spawners/spawner";
import { AssetSelector } from "../../assetSelector";
import { Cherry, CherryState } from "./cherry";
import { CherryVanishFx } from "../effect/cherryVanishFx";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";

export class CherryManager extends Container {
  constructor() {
    super();
    this.hasNewCherry = false;
    this.cherries = [];
    this.cherryTexture = AssetSelector.getCherryTexture();
    this._initCherrySpawner();
    this._addCherryVanishFx();
  }

  _initCherrySpawner() {
    this.cherrySpawner = new Spawner();
    this.cherrySpawner.init(() => {
      return new Cherry(this.cherryTexture);
    }, 5);
  }

  update(dt) {
    this.cherries.forEach(cherry => {
      cherry.update(dt);
      
      //remove cherry when it is out of screen
      if (cherry.getRightCordinate() < 0) {
        cherry.emit(SpawnerEvent.Despawn);
      }
    });
  }

  reset() {
    this.cherries.forEach(cherry => {
      cherry.reset();
      this.removeChild(cherry);
    });
    this.cherries = [];
    this.hasNewCherry = false;
  }

  _addCherryVanishFx() {
    this.cherryVanishFx = new CherryVanishFx(0);
    this.addChild(this.cherryVanishFx);
  }

  createCherry() {
    let cherry = this.cherrySpawner.spawn();
    cherry.x = GameResizer.width + cherry.width / 2;;
    cherry.y = GameConstant.CHERRY_DEFAULT_Y;
    cherry.resize();
    cherry.emit(SpawnerEvent.Spawn);
    cherry.once(SpawnerEvent.Despawn, () => {
      this.cherries.splice(this.cherries.indexOf(cherry), 1); //remove cherry from array

      //reset cherry
      cherry.reset();
      this.removeChild(cherry);
      this.cherrySpawner.despawn(cherry);
    });
    this.addChild(cherry);
    this.cherries.push(cherry);
  }

  onCollideWithHero() {
    let cherry = this.cherries[this.cherries.length - 1];
    if (cherry.state === CherryState.STAY) {
      cherry.state = CherryState.EATED;
      this.hasNewCherry = false;
      cherry.moveToGrave();
      // console.log("onCollideWithHero");

      //cherry vanish fx
      this.cherryVanishFx.x = cherry.x;
      this.cherryVanishFx.y = cherry.y;
      this.cherryVanishFx.play();
    }
  }

  onMoveCamera(dis, randomDistanceBetweenBlocks) {
    this.hasNewCherry = false; //reset newCherry
    if (randomDistanceBetweenBlocks >= 120 && this.checkHasNewCherry()) {
      this.createCherry();
      let newPosition = 255 + this.randomPosition(randomDistanceBetweenBlocks) - GameConstant.GAME_WIDTH / 2;
      this.cherries[this.cherries.length - 1].newOnMoveCamera(newPosition);
      for (let i = 0; i < this.cherries.length - 1; i++) {
        this.cherries[i].oldOnMoveCamera(dis);
      }
    } else {
      this.cherries.forEach(cherry => {
        cherry.oldOnMoveCamera(dis);
      });
    }
  }

  checkHasNewCherry() { 
    this.hasNewCherry = Util.randomInt(0, 2) === 0 ? true : false;
    // console.log("hasNewCherry: " + this.hasNewCherry);
    return this.hasNewCherry;
  }

  randomPosition(randomDistanceBetweenBlocks) {
    return Util.random(50, randomDistanceBetweenBlocks - 50);
  }

  resize() {
    this.cherries.forEach(cherry => {
      cherry.resize();
    });
  }

}