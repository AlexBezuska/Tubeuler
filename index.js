var path = require("path");
var fs = require("fs");

var config = require("./config.json");
var sources = require("./download-list.json");

var downloadArchive = path.join(config.youtubeFolder, config.downloadArchiveName);
if (!config.downloadArchiveLocation === "default"){
  downloadArchive = path.join(config.downloadArchiveLocation, config.downloadArchiveName);
}

var streamcount = 0;

if (!fs.existsSync(config.youtubeFolder)){
  fs.mkdirSync(config.youtubeFolder);
}

function getDataArg(source) {
  switch(source.type){
    case "video":
      return "https://www.youtube.com/watch?v=" + source.data;
    case "playlist":
      return "https://www.youtube.com/playlist?list=" + source.data;
    case "channel":
      return "ytuser:" + source.data;
    case "channelId":
      return "https://www.youtube.com/channel/" + source.data + "/videos";
  }
}

var spawn = require('child_process').spawn;

for (var i = 0; i < sources.length; i++) {

  var source = sources[i];
    console.log("Starting stream for adding media to:", source.folder, "...");
    streamcount++;
    console.log("Streams Open:", streamcount);
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
    //console.log(buffer.toString())
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
    if (code === 0) {
      console.log(streamName, 'stream closed - Finished successfully!');
    } else {
      console.log(streamName, 'stream closed - There was an error...');
    }
    streamcount--;
    console.log("Streams Open:", streamcount);
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
