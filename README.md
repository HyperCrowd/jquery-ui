# jquery-ui

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/web-platform-zy67tu)

issues:

The video fetching scheme is not correct. Although we are given a uri for each video, I do not want to expose the
s3 bucket that the video is contained in. Please use the video id (upload.id) and then use that against
"/v1/download/video/{vid_id}". Assume that this will be either a FileResonse, a StreamingRespose or a redirect to an
actual file.

Bug:
Often, the page only shows a blank page like it's waiting for something to load. Please go to the main page
and hit refresh to reproduce. It happens quite often
