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

### Linter
You can run `npm run lint` to lint the project.


## Building
### First time Building and Running
1. Run `ionic build`
2. Run `ionic cap sync`
3. Run `ionic cap open android` or `ionic cap open ios`
4. Press run on device in android studio or xcode

### Subsequent Building and Running
1. Run `ionic cap sync`
2. Run `ionic cap open android` or `ionic cap open ios`
3. Press run on device in android studio or xcode

### Setting version number
run `python setversion --version {version code like 1.1.1}`. Version code should ony contain numbers and periods.

## Differences in development compared to website frontend
- The use of Routerlink and Router in general is discouraged, use gotoPage from app-functions service instead.
- Every page should implement the hardware back button. Use backButtonClicked from app-functions service.
