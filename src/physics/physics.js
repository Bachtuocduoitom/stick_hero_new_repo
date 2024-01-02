import { CollisionDetector } from "./aabb/collisionDetector";
import { CollisionTag } from "./aabb/collisionTag";

export class Physics {
  /**
   * @param {PIXI.Application} app
   */
  static init(app) {
    CollisionDetector.instance.init([
      {
        tag         : CollisionTag.Ship,
        collideTags : [CollisionTag.Enemy, CollisionTag.EnemyBullet, CollisionTag.Booster],
      },
      {
        tag         : CollisionTag.ShipBullet,
        collideTags : [CollisionTag.Enemy, CollisionTag.Bounding],
      },
      {
        tag         : CollisionTag.EnemyBullet,
        collideTags : [CollisionTag.Bounding],
      },
    ]);

    app.ticker.add(this.update, this);
  }

  static update() {
    CollisionDetector.instance.update();
  }
}
