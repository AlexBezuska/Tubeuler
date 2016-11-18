var path = require("path");
var fs = require("fs");

var config = require("./config.json");
var sources = require("./download-list.json");

var downloadArchive = path.join(config.youtubeFolder, config.downloadArchiveName);
if (!config.downloadArchiveLocation === "default"){
  downloadArchive = path.join(config.downloadArchiveLocation, config.downloadArchiveName);
}

var streamCount = 0;
var videoCount = 0;

if (!fs.existsSync(config.youtubeFolder)){
  fs.mkdirSync(config.youtubeFolder);
}

function getDataArg(source) {
  switch(source.type){
    case "video":
      return "https://www.youtube.com/watch?v=" + source.id;
    case "playlist":
      return "https://www.youtube.com/playlist?list=" + source.id;
    case "channel":
      return "ytuser:" + source.id;
    case "channelId":
      return "https://www.youtube.com/channel/" + source.id + "/videos";
  }
}

var spawn = require('child_process').spawn;

for (var i = 0; i < sources.length; i++) {

  var source = sources[i];
  streamCount++;
  console.log("Starting stream[" + streamCount + "] for adding media to:", source.folder, "...");
  var sourceFolder = path.join(config.youtubeFolder, source.folder);

  var args = [
    "-o",
    path.join(config.youtubeFolder, source.folder, "%(title)s-%(id)s.%(ext)s").split(" ").join("\ "),
    "--download-archive",
    downloadArchive,
    "--no-post-overwrites",
    "--add-metadata",
    "-ci",
    getDataArg(source),
  ];

  if (source.matchTitle) {
    args.unshift(source.matchTitle);
    args.unshift("--match-title");
  }

  if (source.format === "mp3") {
    args.unshift("mp3");
    args.unshift("--audio-format");
    args.unshift("--extract-audio");
  } else {
    args.unshift("-ci");
  }
  //console.log (args);
  var youtubeDl = spawn('youtube-dl', args);
  youtubeDl.stdout.on('data', function (buffer) {
    var bufferString = buffer.toString();
    if (bufferString.indexOf("[download] Downloading video ") > -1) {
      //console.log(bufferString);
    } else if (bufferString.indexOf("Merging formats") > -1) {
      videoCount++;
      console.log("New content saved!\n ", bufferString.split("\"")[1].split(config.youtubeFolder)[1]);
      //console.log(bufferString);
    }
    //console.log(bufferString);

  });
  youtubeDl.stderr.on('data', function (buffer) {
    var bufferString = buffer.toString();

    if (bufferString.indexOf("WARNING:") > -1) {
      if(config.showWarnings) {
        console.error(bufferString);
      }
    }
    if (bufferString.indexOf("ERROR:") > -1) {
      if(config.showErrors) {
        if (bufferString.indexOf("Please sign in") > -1){
          if (config.showSignInErrors){
            console.error(bufferString);
          }
        }
        else if (bufferString.indexOf("This video contains content from") > -1){
          if (config.showCopyrightErrors){
              console.error(bufferString);
          }
        }else{
          console.error(bufferString);
        }
      }
    }
  });
  youtubeDl.on('close', function (code) {
    var streamName = filter(this.spawnargs, '/')[0].split("/%")[0].replace(config.youtubeFolder + "/", "");
    streamCount--;
    if (code === 0) {
      console.log(streamName, 'stream[' + streamCount + '] closed - Synced with YouTube!');
    } else {
      console.log(streamName, 'stream[' + streamCount + '] closed - There was an error...');
    }
  });

}



function filter(myArray, letter) {
  var results = [];
  var len = myArray.length;
  for (var i = 0; i < len; i++) {
    if (myArray[i].indexOf(letter) == 0) results.push(myArray[i]);
  }
  return results;
}
