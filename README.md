# parent-scout
GWD Component that uses Enabler.invokeExternalJsFunction() method to pass parent window info of a non-safe-frame DCS ad.

## How to use
### In GWD Design view
1. Download the component zip file: https://github.com/BOXNYC/parent-scout/raw/master/parent-scout-v0.1.zip
2. Install component by going into the GWD Components panel, click the [+], select the parent-scout-v0.1.zip.
3. Drag the component onto the page outside of the canvas.
• All iFrames in the ad will now recieve messages for each event passed from the parent.
• All iFrame's windows will recieve the same events as trigged to the parent.
• With the <parent-scout/> element selected, go to the Events panel, and click the [+] button. Click [ Parent Scout > Recieved message from parent scout > Custom > Add custom action ] Write your custom function and process the event.data object data in the ad.
