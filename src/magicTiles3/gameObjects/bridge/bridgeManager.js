import { Container, Texture } from "pixi.js";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/utils";
import { Spawner, SpawnerEvent } from "../../../systems/spawners/spawner";
import { AssetSelector } from "../../assetSelector";
import { Bridge, BridgeState } from "./bridge";

export class BridgeManager extends Container {
  constructor() {
    super();
    this.bridges = [];
    this.bridgeTexture = AssetSelector.getBridgeTexture();
    this._initBridgeSpawner();
    this._initFirstBridge();
  }

  _initBridgeSpawner() {
    this.bridgeSpawner = new Spawner();
    this.bridgeSpawner.init(() => {
      return new Bridge(this.bridgeTexture);
    }, 5);
  }

  update(dt) {
    this.bridges.forEach(bridge => {
      bridge.update(dt);
    });
  }

  reset() {
    this.bridges.forEach(bridge => {
      bridge.reset();
      this.removeChild(bridge);
    });
    this.bridges = [];
    this._initFirstBridge();
  }

  _initFirstBridge() {
    this.createBridge();
  }

  onPointerDown() {
    this.bridges[this.bridges.length - 1].onBuild();
  }

  onPointerUp() {
    let bridge = this.bridges[this.bridges.length - 1];
    bridge.stopBuild();
    bridge.on("onStay", () => {
      this.emit("onBridgeStay");
    });
  }

  onHeroKicked() {
    let bridge = this.bridges[this.bridges.length - 1];
    bridge.dropDown();
  }

  createBridge() {
    let bridge = this.bridgeSpawner.spawn();
    bridge.x = GameConstant.BRIDGE_DEFAULT_X;
    bridge.y = GameConstant.BRIDGE_DEFAULT_Y;
    bridge.width = GameConstant.BRIDGE_WIDTH;
    bridge.height = GameConstant.BRIDGE_DEFAUT_HEIGHT;
    bridge.resize();
    bridge.emit(SpawnerEvent.Spawn);
    bridge.once(SpawnerEvent.Despawn, () => {
      this.bridges.splice(this.bridges.indexOf(bridge), 1); //remove bridge from array
      bridge.reset();
      this.removeChild(bridge);
      this.bridgeSpawner.despawn(bridge);
    });
    this.addChild(bridge);
    this.bridges.push(bridge);
    //return bridge;
  }

  isBridgeStay() {
    return this.bridges[this.bridges.length - 1] && this.bridges[this.bridges.length - 1].state === BridgeState.STAY;
  }

  collapseBridge() {
    let bridge = this.bridges[this.bridges.length - 1];
    bridge.collapse();
  }

  onMoveCamera(dis) {
    this.bridges.forEach(bridge => {
      bridge.onMoveCamera(dis);
    });

    //create new bridge for the next action
    this.createBridge();
  }

  resize() {
    this.bridges.forEach(bridge => {
      bridge.resize();
    });
  }
  
}