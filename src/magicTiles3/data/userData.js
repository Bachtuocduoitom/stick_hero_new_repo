import { DataLocal } from "./dataLocal";
export class UserData{
  static init() {
    this.currentSkin = DataLocal.currentSkin;
    this.listHeroSkinUnlock = DataLocal.listHeroSkinUnlock;
    this.cherryNumber = DataLocal.cherryNumber;
    this.bestScore = DataLocal.bestScore;
    this.prevBackground = DataLocal.prevBackground;
  }
}