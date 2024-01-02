import { GameConstant } from "../../gameConstant";
import { GameResizer } from "../../pureDynamic/systems/gameResizer";
import { GameSetting } from "../gameSetting";
import { AssetSelector } from "../assetSelector";
import { PureTransform } from "../../pureDynamic/core/pureTransform";
import { Alignment, MaintainAspectRatioType } from "../../pureDynamic/core/pureTransformConfig";
import { PureSprite } from "../../pureDynamic/PixiWrapper/pureSprite";
import { PureObject } from "../../pureDynamic/core/pureObject";

export class GameObjectFactory {
  /**
   * @param {PureObject} container 
   */
  static createBackground(texture, container) {
    let transformPortrait = new PureTransform({
      container: container,
      alignment: Alignment.FULL,
      maintainAspectRatioType: MaintainAspectRatioType.MAX,
    });

    let transformLandscape = new PureTransform({
      container: container,
      alignment: Alignment.HORIZONTAL_TOP,
      maintainAspectRatioType: MaintainAspectRatioType.MAX,
    });
    return new PureSprite(texture, transformPortrait, transformLandscape);
  }

  static createGameIcon(texture, radius, transformPortrait = undefined, transformLandscape = undefined) {
    const icon = new PureSprite(texture, transformPortrait, transformLandscape);

    // const mask = new PIXI.Graphics();
    // const dx = -icon.displayObject.anchor.x * texture.width;
    // const dy = -icon.displayObject.anchor.y * texture.height;
    // if (transformPortrait) console.log(dx, dy);
    // mask.beginFill(0xFFFFFF, 1);
    // mask.drawRoundedRect(dx, dy, texture.width, texture.height, radius);

    // icon.displayObject.addChild(mask);
    // icon.displayObject.mask = mask;
    return icon;
  }
}
