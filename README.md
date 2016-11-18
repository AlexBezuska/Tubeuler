![Tubeuler](./brand/tubeuler-logo.png)

### Making youtube-dl a little friendlier with Node and JSON

## Prerequisites

* You must have (youtube-dl)[https://rg3.github.io/youtube-dl/download.html] installed on your system and have the `youtube-dl` command available from your terminal.

## To run

* Be sure to have at least one video, channel, or playlist in your download-list.json
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
