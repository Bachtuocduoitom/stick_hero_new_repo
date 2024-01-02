import { AnimatedSprite, Point, Texture } from "pixi.js";
import {TextureCache} from "@pixi/utils"

export class Util {
  static copyObject(src, dst = {}) {
    Object.keys(src).forEach((key) => {
      dst[key] = src[key];
    });
    return dst;
  }

  /**
   * @param {Array<string>} textureKeys
   * @returns {Array<Texture>}
   */
  static getAnimationTextures(textureKeys) {
    let textures = [];
    for (let i = 0; i < textureKeys.length; i++) {
      textures.push(Texture.from(textureKeys[i]));
    }
    return textures;
  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static randomOfList(list) {
    if (list && list.length > 0) {
      const randomIndex = this.getRandomInt(0, list.length - 1);
      return list[randomIndex];
    } else {
      return -1;
    }
  }

  /**
   * @summary Shorthand function for creating AnimatedSprite object
   * @param {Array<string>} textureKeys
   * @param {number} x
   * @param {number} y
   */
  static createAnimatedSprite(textureKeys, animationSpeed, x = 0, y = 0, scale = 1, anchorX = 0, anchorY = 0) {
    let anim = new AnimatedSprite(Util.getAnimationTextures(textureKeys));
    anim.x = x;
    anim.y = y;
    anim.scale.set(scale);
    anim.anchor.set(anchorX, anchorY);
    anim.animationSpeed = animationSpeed;
    anim.play();
    return anim;
  }

  /**
   * @summary function for getting all textures contain text
   * @param {string} textureKeys
   */
  static getTexturesContain(text) {
    let keys = Object.keys(TextureCache).filter((key) => key.indexOf(text) >= 0);
    let textures = keys.map((key) => Texture.from(key));
    //textures.sort((a, b) => a.textureCacheIds[0].localeCompare(b.textureCacheIds[0], undefined, { numeric: true, sensitivity: 'base' }));
    return textures;
  }

  static sign(num) {
    return num < 0 ? -1 : 1;
  }

  static random(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * @summary Return random element from list
   * @param {Array} list
   */
  static randomFromList(list) {
    if (list && list.length > 0) {
      let randomIndex = this.randomInt(0, list.length - 1);
      return list[randomIndex];
    }
    else {
      return null;
    }
  }

  static distanceBetween(a, b) {
    return Math.abs(Math.abs(a) - Math.abs(b));
  }

  static toDegree(radian) {
    return radian * 180 / Math.PI;
  }

  static toRadian(degree) {
    return degree * Math.PI / 180;
  }

  static getRandomIntExclude(min, max, excludeNumber) {
    var rand = Math.floor(Math.random() * (max - min)) + min;
    if (rand === excludeNumber) {
      rand = max;
    }
    return rand;
  }

  static AABBCheck(x1, y1, w1, h1, x2, y2, w2, h2) {
    return ((x1 < x2 + w2) && (x1 + w1 > x2) && (y1 < y2 + h2) && (y1 + h1 > y2));
  }

  static interpolate(a, b, t, easing = Util.linear) {
    return a + (b - a) * easing(t);
  }

  static linear(num) {
    return num;
  }

  static pointOnVector(vector, length, dst = new Point()) {
    let alpha = Math.atan(Math.abs(vector.x) / Math.abs(vector.y));
    dst.x = length * Math.sin(alpha) * this.sign(vector.x);
    dst.y = length * Math.cos(alpha) * this.sign(vector.y);
  }

  static registerOnPointerDown(displayObject, onPointerDown, context) {
    displayObject.eventMode = "static";
    displayObject.on("pointerdown", onPointerDown, context);
  }

  static getSpineAnimations(spine) {
    return spine.state.data.skeletonData.animations.map((a) => a.name);
  }

  static getCashFormat(num) {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1).replace(/\.0$/, "")}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (num >= 10000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return num.toFixed(0);
  }

  static formatCash(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  static lerpColor(colorStart, colorEnd, ratio) {
    const start = PIXI.utils.string2hex(colorStart);
    const end = PIXI.utils.string2hex(colorEnd);
    const r = (1 - ratio) * ((start >> 16) & 0xff) + ratio * ((end >> 16) & 0xff);
    const g = (1 - ratio) * ((start >> 8) & 0xff) + ratio * ((end >> 8) & 0xff);
    const b = (1 - ratio) * (start & 0xff) + ratio * (end & 0xff);
    const rgb = (r << 16) + (g << 8) + b;
    return PIXI.utils.hex2string(rgb);
  }
}
