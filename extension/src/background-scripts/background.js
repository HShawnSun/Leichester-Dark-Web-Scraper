import { Crawler } from "./crawler.js";

let crawler = new Crawler("", -1);

// Add handlers for messages from content script and popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case 'start':
            if (crawler.isPaused()) {
                crawler.unpause();
            } else {
                crawler = new Crawler(message.data.startingUrl, message.data.depthLimit);
                crawler.start();
            }
            break;
        case 'stop':
            crawler.stop();
            break;
        case 'pause':
            crawler.pause();
            break;
        case 'processPage':
            crawler.addLinks(message.data.links).then(() => {
                // SendCaptureToServer(message.data.image, message.data.title, message.data.url, message.data.url);
            });
            break;
        case 'getState':
            sendResponse({
                url: crawler.startingUrl, 
                depth: crawler.depthLimit,
                running: crawler.running,
                paused: crawler.paused,
            });
            break;
    }
});
