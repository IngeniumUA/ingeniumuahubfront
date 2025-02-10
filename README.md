# IngeniumUA Hub - App

This repository contains the Ionic project for the IngeniumUA mobile App.

## Development setup

### Prerequisites
- Node v18 or higher
- npm
- Ionic cli
- (optional) if you want to run the app directly on a mobile device, Android studio for Android devices or xcode for Apple devices. Xcode is only available for macOS.
- python 3.10 for setting the app version
- python rich_click library

### Installation
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Copy the `src/environments/environment.app_development.ts.example` to `src/environments.app_development.ts` and fill in the necessary values. This file is in a `.gitignore` so it won't (and shouldn't) be commited to the repository.

### Linter
You can run `npm run lint` to lint the project.

### Running app live on device
During development, you can run the app on your device using `ionic cap run android -l --external` for android devices or `ionic cap run ios -l --external` for ios devices.
<br>
For this to work you will need to copy the environment example and remove .example from the end of the file name. This will use the development api and production keycloak.
<br>
If you want to run the app with live reload using the production environment, add ` --prod` to the end of the command.

### Alternative for ios testing without mac (not ideal so discouraged)
The GitHub release action is able to build an ipa file of the app. With https://www.installonair.com/# you can upload the ipa file to your phone. This device will need to be added in the Apple developer console (https://developer.apple.com/account/resources/devices/list). The device will also need to be set up to allow ipa files to be installed.
<br><br>
Normally the uploading of the artifact is disabled as it is not needed. When testing using this method, uncomment the "Upload release bundle" task and comment out the "Validate and Upload to apple connect" task. Be sure to reverse this when releasing the app.

## Building
### Building and Running
1. Run `npm run build`
2. Run `ionic cap sync`
3. Run `ionic cap open android` or `ionic cap open ios`
4. Press run on device in android studio or xcode


## Using the kippietools
### Getting the curren app version
run `python kippietools getversion`.

### Setting version number
run `python kippietools setversion -v {version code like 1.1.1}`. Version code should ony contain numbers and periods.

### Setting url of the app to switch between notification testing and release.
run `python kippietools setmode -m {release or notificationtest}`. This only affects the android build of the app.

## Differences in development compared to website frontend
- The use of Routerlink and Router in general is discouraged, use gotoPage from app-functions service instead.
- Every page should implement the hardware back button. Use backButtonClicked from app-functions service.

# Releasing to stores
The app packages for ios and android get uploaded to the release panels automatically through GitHub actions.
<br><br>
To release for ios:
- Go to https://developer.apple.com and log in with the developer account.
- Under Program resources - App Store Connect, go to Apps.
- Go to Ingenium.
- At the upper left, right under Ingenium, click on the plus next to iOS App.
- Enter the version number of the release.
- In the "Previews and Screenshots" section under "What's New in This Version", enter the changes made to the app.
- In the "Build" section, select the desired (Normally the only or latest) build.
- In the top right, click on "Add for Review".

<br>
To release for Android:

- Log in to the webmaster account
- Go to https://play.google.com/console/u/0/developers/5570326729811848624/app-list.
- At the bottom of the page, click on Ingenium
- At the lefthand menu, click on "Testen en releasen" and then on "Productie".
- At the top right, click on "Nieuwe release maken".
- In the "App-bendels" section, click on "Toevoegen vanuit bibliotheek".
- Select the desired (Normally the latest) build.
- In the "Details van release" section, under "Releasenaam" enter the version number and under "Release-opmerkingen" enter the changes made to the app.
- In the bottom right, click on "Volgende".
- In the bottom right, click on "Opslaan".
