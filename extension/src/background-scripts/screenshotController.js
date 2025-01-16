import { SendCaptureToServer } from "./api";

/**
 * Controller for a page opened in its own tab. Interacts through messages with a content script running on the page
 */
export class ScreenshotController {

    /**
     * Construct a new screenshot controller for scraping the specified page
     * @param {int} tabId - Id of tab to scrape
     * @param {function} callback - callback function to execute once scraping is complete for this page
     * @param {int} remainingDepth - Remaining depth for the crawler
     */
    constructor(tabId, callback, remainingDepth, parentURL = null) {
        this.screenshotCanvas = document.createElement("canvas");
        this.screenshotCanvasContext = this.screenshotCanvas.getContext("2d");
        this.tabId = tabId;
        this.scrollAmount = null;
        this.pageSize = {width: 0, height: 0}
        this.callback = callback;
        this.pgTitle = "";
        this.pgURL = "";
        this.remainingDepth = remainingDepth;
        this.isValidSite = false;
        this.parentURL = parentURL;
        browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (!sender.tab || (sender.tab.id != this.tabId)) return;
            switch (message.type) {
                // When the content script sends the page's information
                case "setPageDetails":
                    this.pageSize = message.data.size;
                    this.scrollAmount = message.data.scrollAmount;

                    this.screenshotCanvas.width = this.pageSize.width;
                    this.screenshotCanvas.height = this.pageSize.height;

                    this.pgTitle = message.data.title;
                    this.pgURL = message.data.url;

                    // Start scrolling capture
                    this.requestScrollTo(0);
                    break;
                // Capture the currently visible part of the page
                case "capturePageSection":
                    this.capturePageSection(message.data.currentYPosition, message.data.isLastCapture);
                    break;
            }
        });
        // Only start capturing once page is loaded
        browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (tabId === this.tabId && changeInfo.status == 'complete') {
                // Tell tab to start (by asking for page info)
                browser.tabs.sendMessage(this.tabId, {
                    "type": "requestPageInfo",
                    "data": {
                        "remainingDepth": this.remainingDepth,
                        "url": changeInfo.url,
                    }
                })
            }
        })
    }

    /**
     * Screenshot what is currently on screen then scroll to the next part, also handle the case of the final capture
     * @param {int} currentYPosition - Current y scroll position of the page
     * @param {boolean} isLastCapture - True if this is the final capture for the page
     */
    capturePageSection(currentYPosition, isLastCapture) {
        console.log("Capturing tab " + this.tabId + ", isLastCapture: " + isLastCapture);
        // Take a screenshot of the visible contents
        browser.tabs.captureTab(
            this.tabId,
            {
                "format": "png",
            }
        ).then((imageURL) => {
            // Add partial screenshot to the composite image
            // TODO Implement error handling (i.e. imageURL is undefined or Promise is rejected)
            let image = new Image();
            image.onload = () => {
                this.screenshotCanvasContext.drawImage(image, 0, currentYPosition);
                if (!isLastCapture) {
                    this.requestScrollTo(currentYPosition + this.scrollAmount);
                }
                else {
                    // Capture is finished, so delete tab and do something with complete image
                    let fullScreenshot = this.screenshotCanvas.toDataURL("image/jpeg");
                    console.log(fullScreenshot);
                    browser.tabs.remove(this.tabId);
                    // TODO Temporary handling of website hostname
                    let websiteURL = new URL(this.pgURL);
                    let websiteHost = websiteURL.protocol + "//" + websiteURL.host;

                    if (this.parentURL != null) {
                        let parentWebsiteURL = new URL(this.parentURL);
                        let parentWebsiteHost = parentWebsiteURL.protocol + "//" + parentWebsiteURL.host;
                        // Send the finished capture to the database
                        SendCaptureToServer(fullScreenshot, this.pgTitle, websiteHost, new URL(this.pgURL).pathname, new URL(this.parentURL).pathname, parentWebsiteHost);
                    } else {
                        // Send the finished capture to the database
                        SendCaptureToServer(fullScreenshot, this.pgTitle, websiteHost, new URL(this.pgURL).pathname);
                    }

                    // For debugging, show the finished capture in a new tab. TODO disable debugging feature
                    // browser.tabs.create({url: "/assets/blank.html"}).then((tab) => {
                    //     browser.tabs.executeScript(tab.id, {
                    //         file: "displayImage.js"
                    //     }).then(() => {
                    //         browser.tabs.sendMessage(tab.id, {
                    //             "type": "loadImage",
                    //             "data": {
                    //                 "image": fullScreenshot
                    //             }
                    //         });
                    //     });
                    // });
                    this.callback();
                }
            };
            image.src = imageURL;
        })
    }

    /**
     * Tell page content script to scroll to a new position
     * @param {int} newYPosition - y position to scroll to
     */
    requestScrollTo(newYPosition) {
        browser.tabs.sendMessage(this.tabId, {
            "type": "scrollTo",
            "data": {
                "newYPosition": newYPosition,
                "size": this.pageSize,
                "scrollAmount": this.scrollAmount
            }
        })
    }
}
