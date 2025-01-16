# Dark Web Scraper Browser Extension

## Tor Instructions

To make the extension work on Tor, there are a few things you need to do:

- To install the extension from a file, install verification must be disabled
  - Tor/Firefox normally requires extensions to have been signed by Mozilla, even if installed with an XPI file. Therefore this verification must be disabled to allow the scraper extension to be installed permanently
  - Go to `about:config`
  - Search for "xpinstall.signatures.required" and set to false
  - Search for "xpinstall.whitelist.required" and set to false
  - You can now install the extension from it's XPI file from `about:addons`
- Tor uses the Firefox Private browsing mode by default, so you will need to allow the extension to run in Private windows from `about:addons`
- Tor tries to route `localhost` through the onion layer, so this needs to be disabled. Note: this is usually not recommended since it could be abused by malicious onion sites, but is unfortunately needed to make the extension work. To disable it, do the following:
  - Go to `about:config`
  - Search for "network.proxy.no_proxies_on"
  - Click the edit button for the setting and paste the following (including quotes): `"localhost, 127.0.0.1, 192.168.0.0/24"`
  - Press enter to make the setting take effect
