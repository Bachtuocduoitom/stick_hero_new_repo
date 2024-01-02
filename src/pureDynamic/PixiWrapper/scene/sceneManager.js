import { Debug } from "../../../helpers/debug";

export class SceneManager {
  /**
   * @class SceneManager
   * @param {PIXI.Application} app PIXI application stage
   * @param {Array<Scene>} scenes
   */
  static init(scenes) {
    /** @type {Scene} */
    this.currentScene = undefined;

    /** @type {Array<Scene>} */
    this.additiveScenes = [];

    this.sceneContainer = new PIXI.Container();
    this.scenes = scenes;
    this.scenes.forEach((scene) => {
      scene.hide();
      this.sceneContainer.addChild(scene);
    });
  }

  /**
   * @param {number} dt delta time
   */
  static update(dt) {
    if (this.currentScene) {
      this.currentScene.update(dt);
    }
    this.additiveScenes.forEach((scene) => {
      scene.update(dt);
    });
  }

  /**
   * @param {Scene} scene
   */
  static load(scene) {
    Debug.debug("Load scene", scene.key);
    this.additiveScenes.forEach((s) => s.destroy());
    this.additiveScenes = [];
    let oldScene = this.currentScene;
    this.currentScene = scene;
    this.currentScene.show();
    if (!this.currentScene.isCreated) {
      this.currentScene.create();
    }
    if (oldScene) {
      oldScene.hide();
    }
  }

  /**
   * @param {Scene} scene
   */
  static loadAdditive(scene) {
    Debug.debug(`Load additive scene ${scene.key}`);
    scene.show();
  }

  static getScene(key) {
    return this.scenes.find((s) => s.key === key);
  }

  /**
   * @param {Scene} scene
   */
  static unload(scene) {
    // this.sceneContainer.removeChild(scene);
    scene.hide();
    this.additiveScenes.splice(this.additiveScenes.indexOf(scene), 1);
  }

  static setPause(isPause) {
    if (this.currentScene) {
      this.currentScene.setPause(isPause);
    }

    if (this.additiveScenes) {
      this.additiveScenes.forEach((scene) => scene.setPause(isPause));
    }
  }
}
