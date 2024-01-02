const fs = require("fs");
const datauri = require("datauri/sync");

// create folder named dist if not existing yet
if (!fs.existsSync("./dist")) {
  fs.mkdirSync("./dist");
}

// list all directories in the data directory
const ASSET_DIR = "./assets";
const dirs = fs.readdirSync(ASSET_DIR);
// console.log(dirs);

let assetData = {
  textures : {},
  audios   : {},
  spines   : {},
};

// build texture
const TEXTURE_DIR = "textures";

if (dirs.includes(TEXTURE_DIR)) {
  const textureFiles = fs.readdirSync(`${ASSET_DIR}/${TEXTURE_DIR}`);
  // console.log(textureFiles);
  textureFiles.forEach((tex) => {
    if (tex === ".DS_Store") {
      return;
    }
    // get basename of texture
    const basename = tex.split(".")[0];
    assetData.textures[basename] = datauri(`${ASSET_DIR}/${TEXTURE_DIR}/${tex}`).content;
  });
}

// build audios
const AUDIO_DIR = "audios";

if (dirs.includes(AUDIO_DIR)) {
  const audioFiles = fs.readdirSync(`${ASSET_DIR}/${AUDIO_DIR}`);
  // console.log(audioFiles);
  audioFiles.forEach((audio) => {
    if (audio === ".DS_Store") {
      return;
    }
    const basename = audio.split(".")[0];
    assetData.audios[basename] = datauri(`${ASSET_DIR}/${AUDIO_DIR}/${audio}`).content;
  });
}

// build spines
const SPINE_DIR = "spines";

if (dirs.includes(SPINE_DIR)) {
  const spines = fs.readdirSync(`${ASSET_DIR}/${SPINE_DIR}`);
  // console.log(spines);
  spines.forEach((spine) => {
    // skip DS_Store
    if (spine === ".DS_Store") {
      return;
    }

    let spineData = {
      json : {},
      txt  : "",
      tex  : "",
    };
    spineData.json = JSON.parse(datauri(`${ASSET_DIR}/${SPINE_DIR}/${spine}/${spine}.json`).buffer.toString());
    spineData.txt = datauri(`${ASSET_DIR}/${SPINE_DIR}/${spine}/${spine}.atlas`).buffer.toString();
    spineData.tex = datauri(`${ASSET_DIR}/${SPINE_DIR}/${spine}/${spine}.png`).content;
    assetData.spines[spine] = spineData;
  });
}
// build particles

fs.writeFileSync("./dist/assetData.json", JSON.stringify(assetData, null, 1));
let allTextureSize = 0;
Object.keys(assetData.textures).forEach((key) => {
  allTextureSize += assetData.textures[key].length;
});
console.log(`Total textures: ${allTextureSize / 1024}`);

let allAudioSize = 0;
Object.keys(assetData.audios).forEach((key) => {
  allAudioSize += assetData.audios[key].length;
});
console.log(`Total audios: ${allAudioSize / 1024}`);
