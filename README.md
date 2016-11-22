![Tubeuler](./brand/tubeuler-logo.png)

### Making youtube-dl a little friendlier with Node and JSON

Huge thanks to [Ben WIley](https://github.com/benwiley4000) who got me started on this project, we pair programmed for the majority of the code in the initial version of this project.

## Prerequisites

* You must have [youtube-dl](https://rg3.github.io/youtube-dl/download.html) installed on your system and have the `youtube-dl` command available from your terminal.

## To run

* Duplicate config.sample.json and name is `config.json`.
* Be sure the `youtubeFolder` is set to where you want to download to (absolute path from the root of your system).
* Duplicate `download-list.sample.json` and name it `download-list.json`.
* Be sure to have at least one video, channel, channelID, or playlist in your `download-list.json` (see Settings in `download-list.json` readme section below)
* From the root directory of this project run `npm start`

## Settings in `config.json`

`youtubeFolder`
Directory on your computer where you wish to store your youtube videos, note this is also where the `downloaded.txt` file will be stored.
example: `"/Volumes/5tb/Youtube"`

`downloadArchive`
This is where you want the `downloaded.txt` file to be created/stored, this file serves as a record of all previously downloaded content so it will not attempt to download it again. The `"default"` option will save this file in the `youtubeFolder` you have set above.

`showWarnings`
Setting this to false will hide all warnings.

`showErrors`
Setting this to false will hide all errors except the final pass/fail of the stream.

`showSignInErrors`
Setting this to false will hide errors about videos which were not downloaded due to them being private.

`showCopyrightErrors`
Setting this to false will hide errors about videos which were not downloaded due to copyright.

## Settings in `download-list.json`

* `type`
The type can be set to:
  * `"video"` - download a single video
  * `"playlist"` - download all videos in a playlist
  * `"channel"` - download all videos by a single user
  * `"channelID"` same as channel but for users with IDs instead of channel names

* `id`
  This is the part of the youtube URL for the video, playlist, channel, or channelID.
  * For videos use this part of the URL: https://www.youtube.com/watch?v=`12345678901`
  * For `playlist` use this part of the URL:
  https://www.youtube.com/playlist?list=`PL1234567890123456`
  * For `channel` use this part of the URL:
  https://www.youtube.com/user/`Username`
  * If a `channel` does not have a username use this part of the URL:
  https://www.youtube.com/channel/`UC123456789012345678901`

* `folder`
  This will create a folder inside of the `youtubeFolder` you set in `config.json`. Example: `"My Folder"`.
  You can also create folder structures multiple levels deep such as `"My Folder/Sub Folder"`


### Optional Settings

`format`
Currently the only special format option is `"mp3"`, the default if this is set to anything else or left out completely is `.mp4` or `.mkv`.
