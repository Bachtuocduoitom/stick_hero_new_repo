import { GameConstant } from "../../gameConstant";
import { Script } from "../../systems/script/script";
import { MusicTime } from "./musicTime";

export class SongManager extends Script {
  constructor(songDuration) {
    super("songManager");
    this.songDuration = songDuration;
    this.songOffset = GameConstant.MUSIC_OFFSET;
    this.playTime = 0;
    this.loaded = false;
    this.songStarted = false;
    this.playing = false;
    this.ended = false;
    this.songData = [];
  }

  initialize() {
    this.loadSongData();
  }

  loadSongData(songData) {
    this.songData = songData;
    this.loaded = true;
    this.reset();
  }

  reset() {
    this.playTime = 0;
    this.songStarted = false;
  }

  play() {
    this.playing = true;
  }

  update() {
    if (!this.loaded || !this.playing) {
      return;
    }
    if (!this.ended && this.playTime >= this.songDuration + this.songOffset) {
      this.ended = true;
      this.emit(SongManagerEvent.SongEnd);
      return;
    }

    this.playTime += MusicTime.dt;
    if (this.playTime > this.songOffset) {
      this._onSongStart();
    }
  }

  _onSongStart() {
    if (!this.songStarted) {
      this.emit(SongManagerEvent.SongStart);
      this.songStarted = true;
    }
  }

  skip(time) {
    this.playTime += time;
    if (this.playTime < this.songOffset) {
      this.playing = false;
      this.songStarted = false;
      this.emit(SongManagerEvent.SongReset);
    }
  }
}

export const SongManagerEvent = Object.freeze({
  SongStart  : "songmanager:songstart",
  SongResume : "songmanager:songresume",
  SongEnd    : "songmanager:songend",
  SpawnNote  : "songmanger:spawnnote",
  SongReset  : "songmanager:reset",
});
