import { GameConstant } from "../gameConstant";

export class Debug {
  static assert(condition, ...data) {
    this.enabled && console.assert(condition, data);
  }

  static log(title, msg, ...optionalParams) {
    this._logConsole("log", title, msg, ...optionalParams);
  }

  static warning(title, msg, ...optionalParams) {
    this._logConsole("warn", title, msg, ...optionalParams);
  }

  static error(title, msg, ...optionalParams) {
    this._logConsole("error", title, msg, ...optionalParams);
  }

  static _logConsole(type, title, msg, ...optionalParams) {
    if (this.enabled && console[type]) {
      console[type](`[${title}] ${msg}`, ...optionalParams);
    }
  }

  static debug(title, msg, ...optionalParams) {
    this._logConsole("debug", title, msg, ...optionalParams);
  }

  static get enabled() {
    return GameConstant.DEBUG_ON;
  }
}
