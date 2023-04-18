# jquery-ui

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/web-platform-zy67tu)

issues:

apiKey "test" is hardwired in to the script. User "logs in" by entering a password/apikey which is tested against 
"/v1/logged_in/operator" and then stashed in a session variable and then re-used for all subsequent calls.


List users has too big of a font. Shrink font and then add horizontal white space so that the UID and the created 
fields have some space. Shift all timezones to california time

list uploads should have a smaller font. The timezones should be normalized to california time. More horizontal 
white space. The datetimes should be broken up into date and time with at least one horizontal bar of white space. 
When a date is put in, the time should be auto populated (start should be 00:00:00 and end should be 23:59:59)

All optional fields should have light grey text that says "optional" that disappears as soon as the user clicks on it

The video fetching scheme is not correct. Although we are given a uri for each video, I do not want to expose the 
s3 bucket that the video is contained in. Please use the video id (upload.id) and then use that against 
"/v1/download/video/{vid_id}". Assume that this will be either a FileResonse, a StreamingRespose or a redirect to an actual file.


Bug:
  Often, the page only shows a blank page like it's waiting for something to load. Please go to the main page 
  and hit refresh to reproduce. It happens quite often