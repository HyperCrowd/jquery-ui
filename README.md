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

## Fix video downloader

As seen from this curl command, videos can be downloaded via the ID

curl -X 'GET' \
  'https://androidmonitor.internetwatchdogs.org/v1/download/video/66' \
  -H 'accept: application/json' \
  -H 'x-api-admin-key: OPF11F6BYFz4DErMXFJAZEsjYLRzn4usGstZtJNf'


Keep in mind that you are going to get filebytes as a blob array.

## Login page enhancements

In the original document I specified that the Login page was should be the first accordion UI element. 
Right now it's its own splash screen.

Please move login to the first ui element.

Please then use have two columns so that users can click through the docs backend endpoints sections. Like this:

+-------------------+--------------------------------------------------+
|                   |    Looking for the backend endpoints?            |
|                   |    Go here:                                      |
|      [Login]      |     (href) /docs .                               |
|                   |                                                  |
| email: [_____]    |                                                  |
| Password: [_____] |                                                  |
|                   |                                                  |
|                   |                                                  |
|                   |                                                  |
|                   |                                                  |
|                   |                                                  |
+-------------------+--------------------------------------------------+

Yes, I'm going to ask you to put in the email field now. Just leave it as a no-op and accept any valid email for now. 
This is in response to the demo where the stakeholder wanted to have email/password validation. I told them that it 
will be added in the future. However, a username field is necessary for the password managers to correctly function.

Also, if a password exists in localstorage then do a query to validate that it's still good and if so, then auto-close 
the login accordian element and put in text for the title *logged in*. Or if it's easier, only auto-activate the login 
accordian element if the password is empty or doesn't validate.

The motivation here is that this jquery form that you've created will be the new default page, replacing /docs currently 
serving as the default redirect.

## LocalStorage -> SessionStorage

In the original specifications I mentioned SessionStorage. This is very important because localstorage, like cookies, 
can easily be slurped by malicious actors and I'd like to eliminate this since we are using a global access token for 
this page. Please change localstroage to session storage.

## Styling changes (Optional)

The "Optional" text should be
  * a few shaders whiter than the current grey
  * smaller text
  * italized

Please use the a header graphic. See telegram. Match the background color in the div to that of the image margins so 
that the image can appear to be stretched. Set the height of this image to be 200 pixels.

Use a dark css theme instead of the white background with bright colors, which will be easier on the eyes for operators 
spending significant time evaluating data. Please select appropriate colors from the header image to be the buttons and 
other UI element colors. Select colors for high contrast against the background.