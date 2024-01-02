import { GameConstant } from "../../../gameConstant";
import { SoundManager } from "../../../soundManager";
import { Script } from "../../../systems/script/script";
import { MusicTime, MusicTimeMode } from "./musicTime";

export class SongPlayer extends Script {
  constructor(songManager, songName) {
    super("songPlayer");
    this.songManager = songManager;
    this.songName = songName;
    this.songId = 0;
    this.started = false;
    this.paused = false;
    this.stopped = false;
  }

  reset() {
    this.started = false;
  }

  play() {
    if (!this.started) {
      this.started = true;
      this.songId = SoundManager.play(this.songName, 1, false);
      MusicTime.initMusic(this.songId);
      let time = MusicTime._current - GameConstant.SONG_OFFSET;
      SoundManager.skipToMatchMusicTime(this.songId, time);
      SoundManager.emitter.on("onend", (id) => {
        if (id === this.songId) {
          MusicTime.mode = MusicTimeMode.Auto;
        }
      });
    }
  }

  resume() {
    if (this.started && this.paused && !this.stopped) {
      this.paused = false;
      SoundManager.resume(this.songId);
    }
  }

  pause() {
    if (this.started && !this.paused) {
      this.paused = true;
      SoundManager.pause(this.songId);
    }
  }

  hardResume() {
    if (this.paused && !this.stopped) {
      this.started = true;
      this.paused = false;
      SoundManager.resume(this.songId);
    }
  }

  hardPause() {
    if (this.started && !this.paused) {
      this.paused = true;
      this.started = false;
      SoundManager.pause(this.songId);
    }
  }

  stop() {
    this.stopped = true;
    SoundManager.stop(this.songId);
  }

  skip(time) {
    if (this.started) {
      SoundManager.skip(this.songId, time);
    }
  }
}
