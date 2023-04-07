# JA3Sentry Extension

Firefox Extension for monitoring TLS Handshake Params

## Installation

Prequisites: you will need the `yarn` or `npm` package manager available on your computer

To setup this extension in Firefox:

1. Go to the extension root folder and run `yarn install` to install all dependencies
2. Run `yarn build` to build the extension files. The build files will end up in a `build.prod` directory
3. Open Firefox and go to `about:debugging` in the browser bar
4. Navigate to the **"This Firefox" tab**
5. Click **"Load Temporary Add-on"**
6. Select the `manifest.json` file from within the `build.prod` directory
7. The extension should now be visible in Firefox
