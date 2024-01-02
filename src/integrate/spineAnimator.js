import { Spine } from "@pixi-spine/loader-uni";

export class SpineAnimator extends Spine {
  constructor(data) {
    super(data);
    this.anims = this.state.data.skeletonData.animations.map((anim) => anim.name);
  }

  pause() {
    this._lastTimeScale = this.state.timeScale;
    this.state.timeScale = 0;
  }

  resume() {
    !this._lastTimeScale && (this._lastTimeScale = 1);
    this.state.timeScale = this._lastTimeScale;
  }

  /**
   * @returns {PIXI.spine.SpineSprite}
   */
  getSprite(name) {
    return this.children.find((child) => child.children[0] && child.children[0].attachment.name === name)?.children[0];
  }

  getAllSpriteName() {
    return this.children.map((child) => child.children[0]?.attachment.name);
  }

  findBones(name) {
    return this.skeleton.bones.filter((bone) => bone.data.name.indexOf(name) !== -1);
  }

  findSlot(name) {
    return this.skeleton.slots.find((slot) => slot.data.boneData.name === name);
  }

  /**
   *
   * @param {PIXI.spine.core.Bone} bone
   */
  disableBone(bone) {
    this.disableSlot(bone.data.name);
    bone.children.forEach((childBone) => this.disableBone(childBone));
  }

  disableSlot(name) {
    let slot = this.findSlot(name);
    if (slot) {
      slot.setAttachment(null);
    }
  }

  hasAnimation(name) {
    return !!this.animations.find((anim) => anim === name);
  }
}
