import { Util } from "../helpers/utils";
import { PureSprite } from "../pureDynamic/PixiWrapper/pureSprite";
import { SoundManager } from "../soundManager";

export class ButtonSound extends PureSprite {
  /**
   * @param {PIXI.Texture} texOn
   * @param {PIXI.Texture} texOff
   * @param {PureTransform} pTransform
   * @param {PureTransform} lTransform
   */
  constructor(texOn, texOff, pTransform, lTransform) {
    super(texOn, pTransform, lTransform);
    this.texOn = texOn;
    this.texOff = texOff;
    Util.registerOnPointerDown(this.displayObject, this._onTouchButtonSound.bind(this));
    this._onMuteCallback = this._onMute.bind(this);
    SoundManager.on("mute", this._onMuteCallback);
    this._updateTexture();
  }

  _onTouchButtonSound() {
    SoundManager.mute(!this.isMute);
  }

  _onMute() {
    this._updateTexture();
  }

  _updateTexture() {
    this.displayObject.texture = this.texture;
  }

  get isMute() {
    return SoundManager.mute();
  }

  get texture() {
    return this.isMute ? this.texOff : this.texOn;
  }
}
