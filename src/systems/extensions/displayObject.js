/* eslint-disable max-depth */
import { DisplayObject } from "pixi.js";
import { ScriptSystem } from "../script/scriptSystem";

const oldDestroy = DisplayObject.prototype.destroy;

DisplayObject.prototype.destroy = function() {
  this.emit("predestroy", this);
  oldDestroy();
};

DisplayObject.prototype.addScript = function(script) {
  if (!this.script) {
    this.script = {};
  }

  if (this.script[script.name]) {
    throw new Error(`Script ${script.name} has been added to this DisplayObject`);
  }

  this.script[script.name] = script;
  script.displayObject = this;

  if (!script._initialized) {
    script.initialize();
    script._initialized = true;
  }

  this.once("predestroy", script.destroy, script);
  script.once("destroy", () => {
    ScriptSystem.emitter.off("update", ScriptSystem.scriptUpdate, script);
    delete this.script[script.name];
    script = undefined;
  });

  this.on("added", () => {
    if (script) {
      if (!script._initialized) {
        script.initialize();
        script._initialized = true;
      }
      script.enable();
      ScriptSystem.emitter.on("update", ScriptSystem.scriptUpdate, script);
    }
  });

  if (this.parent) {
    if (script) {
      if (!script._initialized) {
        script.initialize();
        script._initialized = true;
      }
      script.enable();
      ScriptSystem.emitter.on("update", ScriptSystem.scriptUpdate, script);
    }
  }

  this.on("removed", () => {
    ScriptSystem.emitter.off("update", ScriptSystem.scriptUpdate, script);
    script.disable();
  });

  return script;
};

DisplayObject.prototype.getScript = function(script) {
  if (!this.script) {
    return null;
  }

  return this.script[script.name];
};
