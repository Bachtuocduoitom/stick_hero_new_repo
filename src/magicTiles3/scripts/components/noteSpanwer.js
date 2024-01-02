import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/utils";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";
import { Script } from "../../../systems/script/script";
import { Time } from "../../../systems/time/time";
import { GameSetting } from "../../gameSetting";

export const NoteSpawnerEvent = Object.freeze({
  SpawnNote  : "spawnNote",
  TileUp     : "tileUp",
  TileDown   : "tileDown",
  TileRemove : "tileRemove",
});

export class NoteSpawnerManager extends Script {
  /**
   * @class NoteSpawnerManager
   * @param {NoteSpawnerManagerConfig} config
   */
  constructor(config = new NoteSpawnerManagerConfig()) {
    super("noteSpawner");
    Util.copyObject(config, this);
    this._curIndex = 0;
    this._curTime = 0;
    this._isPlaying = false;
  }

  start() {
    this._isPlaying = true;
    this.previousTileSpawnIndex = {
      value            : Util.randomInt(0, 3),
      timeAppear       : -1,
      afterDoubleValue : null,
    };
  }

  stop() {
    this._isPlaying = false;
  }

  reset() {
    this._curIndex = 0;
    this._curTime = 0;
    this._isPlaying = false;
    this.previousTileSpawnIndex = {
      value            : Util.randomInt(0, 3),
      timeAppear       : -1,
      afterDoubleValue : null,
    };
  }

  update() {
    if (this.songData === null) {
      return;
    }
    if (this._curIndex >= this.songData.length - 1) {
      return;
    }
    while (parseFloat(this.songData[this._curIndex].t) - this.songOffset <= this._curTime) {
      var isLastNote = false;
      if (this._curIndex >= this.songData.length - 2) {
        isLastNote = true;
      }
      let isDoubleNote = false;
      if (this.songData[this._curIndex + 1]) {
        isDoubleNote = Math.abs(this.songData[this._curIndex + 1].t - this.songData[this._curIndex].t) < GameConstant.DOUBLE_NOTE_RANGE;
        // first note of double note
      }

      this.spawn(this.songData[this._curIndex], isDoubleNote, this._curIndex, isLastNote);
      this._curIndex++;
      if (this._curIndex >= this.songData.length - 1) {
        return;
      }
    }
    if (this._isPlaying) {
      this._curTime += Time.dt;
    }
  }

  spawn(noteData, isDoubleNote, index, isLastNote) {
    const tilePositionData = this.getSpawnPosition(noteData.t, this.previousTileSpawnIndex, isDoubleNote);
    tilePositionData.index = index;
    tilePositionData.duration = noteData.d;
    let nextPos = -this.gameSpeed * Time.dt * (this.songData[index + 1].t - this.songOffset) + this.spawnOffsetY;
    if (tilePositionData.y - nextPos.y === 0) { // double notes
      nextPos = -this.gameSpeed * Time.dt * (this.songData[index + 2].t - this.songOffset) + this.spawnOffsetY;
    }
    this.spawnTile(tilePositionData, nextPos, noteData, isLastNote);
  }

  spawnTile(pos, nextPos, data, isLastNote) {
    let tile;
    let height = (pos.y - nextPos) / Time.dt;
    if (data.d > 0) { // long tile have duration > 0
      tile = this.tileManager.createTileLong(this.noteParent, pos.xIndex, pos.y - height, height, data.d);
      tile.registerOnPointerUpCallback((t, event) => {
        this.emit(NoteSpawnerEvent.TileUp, tile, event);
      });
    }
    else {
      height = GameConstant.NOTE_HEIGHT;
      tile = this.tileManager.createTileShort(this.noteParent, pos.xIndex, pos.y - height, height);
    }
    tile.registerOnPointerDownCallback((t, event) => {
      this.emit(NoteSpawnerEvent.TileDown, tile, event);
    });
    tile.registerOnRemoveCallback((t, event) => {
      this.emit(NoteSpawnerEvent.TileRemove, tile, event);
    });
    tile.noteIndex = pos.index;
    tile.isSecondNoteOfDoubleNotes = pos.isSecondNoteOfDoubleNotes;
    tile.isLastNote = isLastNote;
    this.emit(NoteSpawnerEvent.SpawnNote, tile);
  }

  getSpawnPosition(timeAppear, previousPos, isDoubleNote) {
    let xIndex = 0;
    let isSecondNoteOfDoubleNotes = false;

    if (previousPos.afterDoubleValue !== null) { // this note is placed after a double note
      xIndex = previousPos.afterDoubleValue;
      previousPos.afterDoubleValue = null;
    }
    else {
      if (Math.abs(timeAppear - previousPos.timeAppear) <= GameConstant.DOUBLE_NOTE_RANGE) { // second note of a double note
        isSecondNoteOfDoubleNotes = true;
        switch (previousPos.value) {
        case 0:
          xIndex = 2;
          previousPos.afterDoubleValue = Util.randomFromList([1, 3]);
          break;
        case 1:
          xIndex = 3;
          previousPos.afterDoubleValue = Util.randomFromList([0, 2]);
          break;
        case 2:
          xIndex = 0;
          previousPos.afterDoubleValue = Util.randomFromList([1, 3]);
          break;
        case 3:
          xIndex = 1;
          previousPos.afterDoubleValue = Util.randomFromList([0, 2]);
          break;
        default:
          break;
        }
      }
      else {
        // normal note
        if (isDoubleNote) {
          if (previousPos.value === 0 || previousPos.value === 2) {
            xIndex = Util.randomFromList([1, 3]);
          }
          else {
            xIndex = Util.randomFromList([0, 2]);
          }
        }
        else {
          xIndex = Util.getRandomIntExclude(0, 3, previousPos.value);
        }
      }
    }

    previousPos.value = xIndex;
    previousPos.timeAppear = timeAppear;

    const y = -(this.gameSpeed * Time.dt) * (timeAppear - this.songOffset) + this.spawnOffsetY;
    return { xIndex: xIndex, y, isSecondNoteOfDoubleNotes };
  }

  getSpawnOffset() {
    return GameResizer.height - GameSetting.beatPos.value;
  }
}

export class NoteSpawnerManagerConfig {
  constructor() {
    this.tileManager = null;
    this.songData = [];
    this.gameSpeed = 0;
    this.spawnOffsetY = 0;
    this.songOffset = 0;
    this.noteParent = null;
  }
}
