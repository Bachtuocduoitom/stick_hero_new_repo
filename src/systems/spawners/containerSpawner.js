import { Spawner } from "./spawner";
export class ContainerSpawner extends Spawner {
  constructor() {
    super();
  }

  spawn(parent = undefined) {
    /** @type {PIXI.Container} */
    let obj = super.spawn();
    obj.visible = true;
    parent?.addChild(obj);
    obj.emit("spawn");
    return obj;
  }

  despawn(obj) {
    super.despawn(obj);
    obj.visible = false;
    obj.parent?.removeChild(obj);
    obj.emit("despawn");
  }
}
