**Release CheckList.(android)**

The build going to deliver to customer, should always be release build not debug.

Always validate DateCheck before release.

Check Url,It should be live Url not Local Url.

Check Keys:

facebook keys

map keys

server keys

Release and debug keys are different . So whenever build is generated check these parameters.

Don't send build without self testing. Whenever any build is generated.

Logs Should always be under debug check.

No unused resources should be there in the code.(ex,  colors, drawable).

No Extra Permissions should be there.

Keys should always be generated from client's account, not from company's account.

Release CheckList.(code)

Remove unused string, drawable,mipmap,xml & java files

Remove .git folder

Remove .gradle folder

Remove .idea folder

Remove if you are using Debug check, add the static login credentials and some other important details.

Remove build folder app.iml file inside app/ folder

Remove the commented company Base Url if we are using client server (e,g http://web2.toxsl.in/ )

Create one file and add all android studio infromation :

android studio version 2.2.3 or above,minSdkVersion 17,

update the version in .yaml 

create build using folling command according to platform flutter build apk --release or flutter build ios

There is no need of making .aar file of Libraries used in the Projects But Please Delete all hidden files,Builds, .dart_tool...   and .iml files



**Release CheckList.(ios)**

Check Server Url

No Need to add Date Check on app side

Check and remove app icon transparency

Check screenshot, are these android phone or iPhone?

Privay policy links should have validate data

Demo account should be working 

If social integration is avaiable then signin with apple should be mendetory

Dark mode theme should be ON above ios13

Check live keys (Google, ads, payment and etc)

In Application description, android and play store word should be avoided

If more than one app then app icon should be different

If app contains In-App Purchase functionlaty the check plan should not show metadata missing

If Register page contains Birth date, then no need to add validation on it

Check Live push notification working or not with production Pem file