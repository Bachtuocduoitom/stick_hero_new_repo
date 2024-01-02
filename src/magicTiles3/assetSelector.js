import { Util } from "../helpers/utils";
import { Tween } from "../systems/tween/tween";
import { UserData } from "./data/userData";
export class AssetSelector {

  static getBgTexture() {
    let textures = [
      PIXI.Texture.from("spr_background_1"),
      PIXI.Texture.from("spr_background_2"),
      PIXI.Texture.from("spr_background_3"),
      PIXI.Texture.from("spr_background_4"),
      PIXI.Texture.from("spr_background_5"),
      PIXI.Texture.from("spr_background_6"),
      PIXI.Texture.from("spr_background_7")
    ];
    return textures;
  }

  static getBlockTexture() {
    return PIXI.Texture.from("spr_black_block");
  }

  static getScoreZoneTexture() {
    return PIXI.Texture.from("spr_red_square");
  }

  static getBridgeTexture() {
    return PIXI.Texture.from("spr_black_block");
  }

  static getCherryTexture() {
    return PIXI.Texture.from("spr_cherry");
  }

  static getHeroTexture() {
    return PIXI.Texture.from(`spr_${UserData.currentSkin}`);
  }

  static getSparkTexture() {
    return PIXI.Texture.from("spr_spark");
  }

  static getHardCircleTexture() {
    return PIXI.Texture.from("spr_hard_circle");
  }

  //return texture array
  static getHeroIdleTextures() {
    return Util.getTexturesContain(`anim_${UserData.currentSkin}_idle`);
  }

  //return texture array
  static getHeroRunTextures() {
    return Util.getTexturesContain(`anim_${UserData.currentSkin}_run`);
  }

  //return texture array
  static getHeroDanceTextures() {
    return Util.getTexturesContain(`anim_${UserData.currentSkin}_dance`);
  }

  //return texture array
  static getHeroKickTextures() {
    return Util.getTexturesContain(`anim_${UserData.currentSkin}_kick`);
  }

}
