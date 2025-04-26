# IngeniumUA Hub - App

This repository contains the Sveltekit/Capacitor project for the IngeniumUA mobile App.

## Development setup

### Prerequisites
- Node v18 or higher
- npm
- (optional) if you want to run the app directly on a mobile device, Android studio for Android devices or xcode for Apple devices. Xcode is only available for macOS.
- python 3.10 for use of kippietools, e.g. for setting the app version
- python rich_click library

### Installation
1. Clone the repository
2. Run `npm install` to install the dependencies

### Linter
You can run `npm run lint` to lint the project.

## Building
### Building and Running
During development, you can run the app on your device using `npm run test:android` for android devices or `npm run test:ios` for ios devices.
<br>
For this to work you will need to change the target in package.json. To get the target id of your device, run `npx cap run [ios/android] --list`.

## Using the kippietools
### Getting the curren app version
run `python kippietools getversion`.

### Setting version number
run `python kippietools setversion -v {version code like 1.1.1}`. Version code should ony contain numbers and periods.

### Setting url of the app to switch between notification testing and release.
run `python kippietools setmode -m {release or notificationtest}`. This only affects the android build of the app.

### Generating release notes and set verion from Version_Notes.txt
run `python kippietools prepare-update`. This is primarily a function for github ci/cd but can be run without issues.

# Releasing to stores
When you alter Version_Notes.txt and push these changes, the app will automatically be released to the stores.
<br>
In Verion_Notes.txt you will need to:
- Specify the build version, this will always need to be changed
- Specify release notes in dutch

## Releasing manually
The app packages for ios and android get uploaded to the release panels automatically through GitHub actions.
<br><br>
To release for ios:
- Go to https://developer.apple.com and log in with the developer account.
- Under Program resources - App Store Connect, go to Apps.
- Go to Ingenium.
- At the upper left, right under Ingenium, click on the plus next to iOS App.
- Enter the version number of the release.
- In the "Previews and Screenshots" section under "What's New in This Version", enter the changes made to the app.
- In the "Build" section, click on "Add Build".
- Select the desired (Normally the only or latest) build.
- In the top right, click on "Save", then click on "Add for Review".
- In the top right, click on "Submit to App Review".

<br>
To release for Android:

- Log in to the webmaster account
- Go to https://play.google.com/console/u/0/developers/5570326729811848624/app-list.
- At the bottom of the page, click on Ingenium
- At the lefthand menu, click on "Testen en releasen" and then on "Productie".
- At the top right, click on "Nieuwe release maken".
- In the "App-bendels" section, click on "Toevoegen vanuit bibliotheek".
- Select the desired (Normally the latest) build.
- In the "Details van release" section, under "Release-opmerkingen" enter the changes made to the app.
- In the bottom right, click on "Volgende".
- In the bottom right, click on "Opslaan".
- In the popup, click on "Ga naar overzicht".
- In the top right, click on "1 wijziging sturen voor beoordeling".
- In the popup, click on "Wijzigingen ter beoordeling sturen".

## Notes
- It takes 2 to 3 days to complete the review process.
- When pushing a version update, it takes about 10min for the GitHub actions to complete.
- The IOS app bundle needs to be processed when it is uploaded. This takes about 5min. Only after the review is completed will you see the app in the "Build" section.
