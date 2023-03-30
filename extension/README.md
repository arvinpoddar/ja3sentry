# JA3Sentry Extension

Chrome Extension for monitoring TLS Handshake Params

## Installation

To setup this extension:

1. Go to the extension root folder and run `yarn install` to install all dependencies
2. Run `yarn build` to build the extension files. The build files will end up in a `build.prod` directory
3. Go to `chrome://extensions/` in the browser and enable **Developer Mode**
4. Within the extensions page, click **Load Unpacked**
5. Select the `src` directory from within `build.prod`
6. The extension should now be visible in Chrome
