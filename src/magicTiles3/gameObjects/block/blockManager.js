import { Container, Sprite, Texture } from "pixi.js";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/utils";
import { Spawner, SpawnerEvent } from "../../../systems/spawners/spawner";
import { Block } from "./block";
import { BlockType } from "./blockType";
import { AssetSelector } from "../../assetSelector";
import difficultyData from "../../../../assets/jsons/difficultyData.json";
import { GameResizer } from "../../../pureDynamic/systems/gameResizer";

export class BlockManager extends Container{
  constructor() {
    super();
    this.blocks = [];
    this.numOfBlocks = 0;
    this.difficultyData = difficultyData;
    this.idDifficultyData = 1;
    this.difficulty = this.getDifficultyById(this.idDifficultyData);
    this.blockTexture = AssetSelector.getBlockTexture();
    this.extraScoreZoneTexture = AssetSelector.getScoreZoneTexture();
    this._initBlockSpawner();
    this._initExtraScoreZoneSpawner();
    this._initFirstBlock();
  }

  _initBlockSpawner() {
    this.thinBlockSpawner = new Spawner();
    this.thinBlockSpawner.init(() => {
      return new Block(this.blockTexture, BlockType.THIN);
    }, 10);

    this.mediumBlockSpawner = new Spawner();
    this.mediumBlockSpawner.init(() => {
      return new Block(this.blockTexture, BlockType.MEDIUM);
    }, 10);

    this.thickBlockSpawner = new Spawner(); 
    this.thickBlockSpawner.init(() => {
      return new Block(this.blockTexture, BlockType.THICK);
    }, 10);
  }

  _initExtraScoreZoneSpawner() {
    this.extraScoreZoneSpawner = new Spawner();
    this.extraScoreZoneSpawner.init(() => {
      return new Sprite(this.extraScoreZoneTexture);
    }
    , 2);
  }

  _initFirstBlock() {
    let block1 = this.createThickBlock(true);
    block1.x = 0;
    block1.y = GameConstant.BLOCK_DEFAULT_Y;
  }

  _initFirstTwoBlocks() { 
    //block that hero stand on
    let block1 = this.createThickBlock(true);
    block1.x = block1.width / 2 - GameConstant.GAME_WIDTH / 2;
    block1.y = GameConstant.BLOCK_DEFAULT_Y; 

    //second block
    let block2 = this.createThickBlock(true);
    block2.x = block1.x + block1.width/2 + this.randomDistanceBetweenBlocks() + block2.width/2;
    block2.y = GameConstant.BLOCK_DEFAULT_Y;
    if (block2.hasExtraScoreZone) {
      block2.initExtraScoreZone(this.createScoreZone());
    }
  }

  update(dt) {
    this.blocks.forEach(block => {
      block.update(dt);
    });
  }

  reset() {
    this.blocks.forEach(block => {
      block.reset();
      this.removeChild(block);
    });
    this.blocks = [];
    this.numOfBlocks = 0;
    this.idDifficultyData = 1;
    this.difficulty = this.getDifficultyById(this.idDifficultyData);
    this._initFirstTwoBlocks();
  }

  reInit() {
    this.blocks.forEach(block => {
      block.reset();
      this.removeChild(block);
    });
    this.blocks = [];
    this.numOfBlocks = 0;
    this.idDifficultyData = 1;
    this.difficulty = this.getDifficultyById(this.idDifficultyData);
    this._initFirstBlock();
  }

  createThinBlock() {
    let block = this.thinBlockSpawner.spawn();
    block.width = Util.randomInt(GameConstant.BLOCK_THIN_MIN_WIDTH, GameConstant.BLOCK_THIN_MAX_WIDTH);
    block.height = GameConstant.BLOCK_HEIGHT;
    block.emit(SpawnerEvent.Spawn);
    block.once(SpawnerEvent.Despawn, () => {
      this.blocks.splice(this.blocks.indexOf(block), 1); //remove block from array
      block.reset();
      this.removeChild(block);
      this.thinBlockSpawner.despawn(block);
    });
    this.addChild(block);
    this.blocks.push(block);
    return block;
  }

  createMediumBlock() {
    let block = this.mediumBlockSpawner.spawn();
    block.width = Util.randomInt(GameConstant.BLOCK_MEDIUM_MIN_WIDTH, GameConstant.BLOCK_MEDIUM_MAX_WIDTH);
    block.height = GameConstant.BLOCK_HEIGHT;
    block.emit(SpawnerEvent.Spawn);
    block.once(SpawnerEvent.Despawn, () => {
      this.blocks.splice(this.blocks.indexOf(block), 1); //remove block from array
      block.reset();
      this.removeChild(block);
      this.mediumBlockSpawner.despawn(block);
    });
    this.addChild(block);
    this.blocks.push(block);
    return block;
  }

  createThickBlock(isInitial = false) {
    let block = this.thickBlockSpawner.spawn();
    if(isInitial) {
      block.width = GameConstant.BLOCK_INIT_WIDTH;
    } else {
      block.width = Util.randomInt(GameConstant.BLOCK_THICK_MIN_WIDTH, GameConstant.BLOCK_THICK_MAX_WIDTH);
    }
    block.height = GameConstant.BLOCK_HEIGHT;
    block.emit(SpawnerEvent.Spawn);
    block.once(SpawnerEvent.Despawn, () => {
      this.blocks.splice(this.blocks.indexOf(block), 1); //remove block from array
      block.reset();
      this.removeChild(block);
      this.thickBlockSpawner.despawn(block);
    });
    this.addChild(block);
    this.blocks.push(block);
    return block;
  }

  createNewBlock() {
    //increase number of blocks
    this.numOfBlocks++;
    // console.log("numOfBlocks: " + this.numOfBlocks);

    //create new block
    let block = this.createBlockByScore();
    block.x = GameResizer.width + block.width / 2;
    block.y = GameConstant.BLOCK_DEFAULT_Y;
    block.resize();

    if (block.hasExtraScoreZone) {
      block.initExtraScoreZone(this.createScoreZone());
    }
  }

  createRandomBlock() {
    let typeBlock = Util.randomInt(0, 5);
    switch(typeBlock) {
      case 0:
        return this.createThinBlock();
      case 1:
      case 2:
        return this.createMediumBlock();
      case 3:
      case 4:
      case 5:
        return this.createThickBlock();
    }
  } 

  /**
   * @var {object} difficulty
   */
  createBlockByScore() {
    let typeBlock = Util.randomInt(0, 9);
    if (this.numOfBlocks > this.difficulty.maxNumOfBlocks) {
      this.idDifficultyData++;
      this.difficulty = this.getDifficultyById(this.idDifficultyData);
    }
    // console.log("difficulty: " + this.difficulty.id);
    if (typeBlock >= this.difficulty.minThickBlock) {
      return this.createThickBlock();
    } else if (typeBlock >= this.difficulty.minMediumBlock) {
      return this.createMediumBlock();
    } else {
      return this.createThinBlock();
    }
  } 

  createScoreZone() {
    let scoreZone = this.extraScoreZoneSpawner.spawn();
    scoreZone.emit(SpawnerEvent.Spawn);
    scoreZone.once(SpawnerEvent.Despawn, () => {
      scoreZone.removeAllListeners();
      this.extraScoreZoneSpawner.despawn(scoreZone);
    });
    return scoreZone;
  }

  getDifficultyById(id) {
    return this.difficultyData.find(difficulty => difficulty.id === id);
  }

  getCurrentExtraScoreZone() {
    return this.blocks[this.blocks.length - 1].extraScoreZone.getBounds();
  }

  currentBlockHasExtraScoreZone() {
    return this.blocks[this.blocks.length - 1].hasExtraScoreZone;
  }

  onStart() {
    this.createNewBlock();

    let newPosition = 255 + this.randomDistanceBetweenBlocks() + this.blocks[this.blocks.length - 1].width/2 - GameConstant.GAME_WIDTH / 2;
    this.blocks[this.blocks.length - 1].newOnMoveCamera(newPosition);
    this.blocks[this.blocks.length - 2].onStart();
  }

  onMoveCamera(dis, randomDistanceBetweenBlocks) {
    let newPosition = 255 + randomDistanceBetweenBlocks + this.blocks[this.blocks.length - 1].width/2 - GameConstant.GAME_WIDTH / 2;
    this.blocks[this.blocks.length - 1].newOnMoveCamera(newPosition);
    this.blocks[this.blocks.length - 2].baseOnMoveCamera(dis);
    for(let i = 0; i < this.blocks.length - 2; i++) {
      this.blocks[i].oldOnMoveCamera(dis);
    }
  }

  //random khoang cach giua canh phai cua block truoc va canh trai cua block sau
  randomDistanceBetweenBlocks() {
    return Util.randomInt(GameConstant.MIN_DISTANCE_BETWEEN_BLOCKS, GameConstant.MAX_DISTANCE_BETWEEN_BLOCKS - this.blocks[this.blocks.length - 1].width);
  }

  resize() {
    this.blocks.forEach(block => {
      block.resize();
    });
  }
}