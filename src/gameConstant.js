export const GameConstant = Object.freeze({
  DEBUG_ON          : true,
  DEBUG_FILL_RECTS  : false,
  DEBUG_EXTRA_SCORE : false,
  AUTO_PLAY         : false,
  CHEAT_IMMORTAL    : false,
  SKIP_TUTORIAL     : false,
  CHEAT_ONE_NOTE    : false,
  SHOW_ADS          : true,
  GAME_WIDTH        : 1080,
  GAME_HEIGHT       : 1920,
  BG_COLOR          : 0x000000,
  GAME_LIFE         : 1,
  SOUND_ENABLED     : true,
  SHOW_BUTTON_SOUND : false,
  SHOW_GAME_TAG     : false,
  TEXTURE_GAME_TAG  : "spr_game_title",

  TIME_WAIT_TO_SHOW_ADS : 30,

  ORIENTATION_PORTRAIT   : "portrait",
  ORIENTATION_LANDSCAPES : "landscapes",

  PLATFORM_ANDROID : "Android",
  PLATFORM_IOS     : "iOS",

  SCENE_TUTORIAL    : "Tutorial",
  SCENE_PLAY        : "Play",
  SCENE_PAUSE       : "Pause",
  SCENE_END         : "End",
  SCENE_SELECT_SONG : "SelectSong",
  SCENE_SNOW        : "Snow",
  SCENE_LOADING     : "Loading",
  SCENE_HOME        : "Home",

  SCREEN_HOME               : "HomeScreen",
  SCREEN_LOADING            : "LoadingScreen",
  SCREEN_TUTORIAL           : "TutorialScreen",
  SCREEN_SHOP               : "ShopScreen",
  SCREEN_PLAY               : "PlayScreen",
  SCREEN_LOSE               : "LoseScreen",
  SCREEN_WIN                : "WinScreen",
  SCREEN_ADS_BLOCK_POPUP    : "AdsBlockPopupScreen",
  SCREEN_ADS_INVALID_POPUP  : "AdsInvalidPopupScreen",

  BLOCK_HEIGHT            : 1500,
  BLOCK_DEFAULT_Y         : 400,
  BLOCK_Y_LANDSCAPE_POSION: 350,
  BLOCK_INIT_WIDTH        : 255,
  BLOCK_THIN_MAX_WIDTH    : 65,
  BLOCK_THIN_MIN_WIDTH    : 35,
  BLOCK_MEDIUM_MAX_WIDTH  : 135,
  BLOCK_MEDIUM_MIN_WIDTH  : 90,
  BLOCK_THICK_MAX_WIDTH   : 280,
  BLOCK_THICK_MIN_WIDTH   : 180,
  MIN_DISTANCE_BETWEEN_BLOCKS : 30,
  MAX_DISTANCE_BETWEEN_BLOCKS : 780,

  EXTRA_SCORE_ZONE_WIDTH  : 20,
  EXTRA_SCORE_ZONE_HEIGHT : 9,

  BRIDGE_WIDTH         : 10,
  BRIDGE_DEFAUT_HEIGHT : 0,
  BRIDGE_DEFAULT_X     : -285,
  BRIDGE_DEFAULT_Y     : 400,
  BRIDGE_Y_LANDSCAPE_POSION : 350,

  CHERRY_DEFAULT_Y : 425,
  CHERRY_Y_LANDSACPE_POSION : 375,

  HERO_X_POSITION : -318,
  HERO_Y_POSITION : 400,
  HERO_Y_LANDSCAPE_POSITION : 350,
  HERO_OFFSET     : 33,
  HERO_ANIMATION_IDLE_SPEED   : 0.2,
  HERO_ANIMATION_RUN_SPEED    : 0.3,
  HERO_ANIMATION_DANCE_SPEED  : 0.3,
  HERO_ANIMATION_KICK_SPEED   : 0.1,
  HERO_FALL_TIME              : 1.2,

  TIME_MOVE_CAMERA          : 1,
  TIME_CHERRY_MOVE_TO_GRAVE : 0.8,

  PROGRESS_STARS       : 3,
  GRID_LANDSCAPE_SCALE : 1,
  AUTOPLAY_TOUCH_MIN   : -50,
  AUTOPLAY_TOUCH_MAX   : 50,

  INDEXEDDB_NAME                      : "stick-hero",
  INDEXEDDB_VERSION                   : 2,
  INDEXEDDB_STORE_NAME                : "userData",
  INDEXEDDB_CHERRY_NUMBER_KEY         : "cherryNumber",
  INDEXEDDB_LIST_HERO_SKIN_UNLOCK_KEY : "unlocks",
  INDEXEDDB_INVENTORY_USER_DATA       : "inventory",
  INDEXEDDB_CURRENT_SKIN              : "currentSkin",
  INDEXEDDB_BEST_SCORE                : "bestScore",
  INDEXEDDB_PREV_BACKGROUND_KEY       : "prevBackground",
  PLAYER_DEFAULT_CHERRY_NUMBER        : 0,
  PLAYER_DEFAULT_SKIN                 : "hero_001",
  PLAYER_DEFAUT_BEST_SCORE            : 0,
  DEFAUT_LIST_HERO_SKIN_UNLOCK        : ["hero_001"],
  DEFAULT_BACKGROUND                  : 0,
  SPAWN_OFF_SET_Y                     : 0,
});