import { ResponsiveNumber } from "../pureDynamic/core/responsiveNumber";
import { GameConstant } from "../gameConstant";
import { ResponsiveType } from "../pureDynamic/core/responsiveType";

export class GameSetting {
  static init() {
    this.beatPos = new ResponsiveNumber(GameConstant.BEAT_POS, ResponsiveType.Height);
  }
}
