# Bulk Softsub to Hardsub encoding script with ASS/SSA (Advanced Substation Alpha/Substation Alpha) subtitles.

This script looks for every mkv file in the same directory and subfolders, then it creates a script that uses mpv to encode.
للشرح العربي افتح ملف README.ar.md

## Requirements
* [nodejs](https://nodejs.org//).
* [mpv](https://mpv.io).

## How to use

 1. Create a folder.
 2. Put [mpv_encode_mkv_to_mp4.js](https://github.com/Abu3safeer/mpv-bulk-encode-ass/blob/master/mpv_encode_mkv_to_mp4.js) inside it.
 3. Put all videos in the same folder or subfolders.
 4. Execute this command:
```node
node mpv_encode_mkv_to_mp4.js
```
It will prompt you with some options, select what you want, you should see softsub-to-hardsub, just run it and leave it until it finishes encoding them.
# Important notes
 - Video files must be .mkv.
 - Subtitles must be inside the video (not separate file).
 - Fonts must be ether installed in the system or attached to the video.
