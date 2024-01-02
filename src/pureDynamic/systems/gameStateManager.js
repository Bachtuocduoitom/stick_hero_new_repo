
export class GameStateManager {
  static get state() { return this._state ? this._state : GameState.Tutorial }
  static set state(state) {
    this.prevState = this.state;
    this._state = state;
    this.emitter?.emit("changed", this.state, this.prevState);
  }

  static isState(...state) {
    for (var i = 0; i < state.length; i++) {
      if (state[i] === this.state) {
        return true;
      }
    }
    return false;
  }

  static registerOnStateChangedCallback(fn, context) {
    if (!this.emitter) {
      this.emitter = new PIXI.utils.EventEmitter();
    }
    this.emitter.on("changed", fn, context);
  }

  static unregisterOnStateChangedCallback(fn, context) {
    this.emitter?.off("changed", fn, context);
  }
}

export const GameState = {
  Tutorial: "tutorial",
  Playing: "playing",
  Paused: "paused",
  Revive: "revive",
  GameOver: "gameover",
  Lose: "lose",
  Win: "win",
  Home: "Home",
}
