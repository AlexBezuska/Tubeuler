#!/bin/bash

# Check if directory parameter is provided
if [ -z "$1" ]; then
  save_directory="."
else
  save_directory="$1"
fi

# Read channels from the file
while IFS= read -r channel || [[ -n "$channel" ]]; do
  # Remove '@' from channel name
  folder_name="${channel//@/}"

  # Create folder if it doesn't exist
  if [ ! -d "$save_directory/$folder_name" ]; then
    mkdir "$save_directory/$folder_name"
  fi

  # Move to the channel's folder
  cd "$save_directory/$folder_name"

  # Download video using youtube-dl
  youtube-dl --download-archive download-archive.txt -f best -ciw -o "%(title)s.%(ext)s" -v "https://www.youtube.com/$channel"

  # Move back to the parent directory
  cd "$save_directory"

done < "channels.txt"
