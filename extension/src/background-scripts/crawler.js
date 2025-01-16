import { tabCount } from "./tabCountTracker"
import { ScreenshotController } from "./screenshotController.js";

let sleep = ms => new Promise(r => setTimeout(r, ms));

/**
 * Class to manage the crawling of a website given a starting URL and depth limit
 */
export class Crawler {
    /**
     * Construct a new Crawler which will crawl the given website to the provided depth
     * @param {string} startingUrl URL to start crawling from
     * @param {int} depthLimit Number of levels of navigation that should be completed
     */
    constructor(startingUrl, depthLimit) {
        this.domains = []
        this.urlPool = []
        this.visitedUrlPool = []
        this.running = false
        this.screenshotControllers = {}
        this.paused = false;
        this.startingUrl = startingUrl;
        this.depthLimit = depthLimit;

        console.log("Constructed Crawler")
        if (startingUrl == null || startingUrl.length === 0) {
            console.warn("No starting URL provided. Crawler will not start.")
        } else {
            this.urlPool.push({link: startingUrl, remainingDepth: depthLimit, origin: null})
        }

        // Add listener to check if what is being loaded from a link is actually a website or a file, which can cause issues
        browser.webRequest.onHeadersReceived.addListener(
            (details) => {
                if (details.tabId != -1 && this.screenshotControllers[details.tabId] != null) {
                    for (let header of details.responseHeaders) {
                        if (header.name.toLowerCase() === 'content-type') {
                          const contentType = header.value.toLowerCase();
                          if (contentType.startsWith('text/html')) {
                            this.screenshotControllers[details.tabId].isValidSite = true;
                          } 
                          // If the first response is not HTML, then delete the tab and associated controller
                          else if (!this.screenshotControllers[details.tabId].isValidSite) {
                            browser.tabs.remove(details.tabId);
                            this.screenshotControllers[details.tabId] = null;
                          }
                          break;
                        }
                      }
                }
            },
            {urls: ['<all_urls>']},
            ['responseHeaders']
        )
    }

    /**
     * Add a link to scrape
     * @param {object} linkData Object containing "link" and "remainingDepth" properties
     */
    addLink(linkData) {
        if (!this.visitedUrlPool.includes(linkData.link) && this.running) {
            this.urlPool.push(linkData)
        }
    }

    /**
     * Add multiple links at once
     * @param {Array} links Links to add
     */
    addLinks(links) {
        for (let link of links) {
            this.addLink(link);
        }
    }

    /**
     * Start the crawler loop - iteratively opens links for scraping from the link pool
     */
    async start() {
        console.log("Starting Crawler")
        await sleep(1000)

        if (this.urlPool.length < 1) {
            console.error("No URLs found in URL pool. Was a starting URL provided?")
            this.stop();
        }
        this.sendStateUpdate();

        this.running = true

        // Main loop
        while (this.running) {
            if (this.paused) {
                console.log("Paused");
                await sleep(100);
                continue;
            }
            if (tabCount >= 10) {
                console.log("Tab limit exceeded, waiting for an available slot");
                await sleep(100)
                continue
            }

            if (this.urlPool.length < 1) {
                var finished = true;
                for (var member in this.screenshotControllers) {
                    if (this.screenshotControllers[member] != null) {
                        finished = false;
                        break;
                    }
                }
                if (finished) {
                    console.log("Depth limit reached so stopping crawler");
                    this.stop();
                } else {
                    console.info("No more URLs to crawl. Sleeping for 1000ms");
                    await sleep(1000);
                }
                continue
            }

            await this.crawl(this.urlPool.shift())
            await sleep(1000)
        }
    }

    /**
     * Stop the crawler from running
     */
    async stop() {
        console.log("Stopping Crawler");
        this.running = false;
        this.paused = false;
        this.urlPool = [];
        this.sendStateUpdate();
    }

    /**
     * Inform any listeners (i.e. the extension pop-up) about changes to the crawlers state
     */
    async sendStateUpdate() {
        browser.runtime.sendMessage({
            type: "updateState",
            data: {
                url: this.startingUrl, 
                depth: this.depthLimit,
                running: this.running,
                paused: this.paused,
            }
        }).catch((err)=>console.log(err))
    }

    // crawl2(tabId) {
    //     browser.tabs.executeScript(tabId, {
    //         file: "processPage.js"
    //     }).then(() => {
    //         console.log("Executed processPage.js")
    //     });
    // }

    /**
     * Crawl a website by creating a ScreenshotController for it and opening the page in a new tab
     * @param {object} linkData Link object containing a link and remainingDepth
     */
    crawl(linkData) {
        if (linkData.remainingDepth <= 0) {
            return; // Ignore if depth limit reached
        }
        browser.tabs.create({ url: linkData.link }).then((tab) => {
                this.screenshotControllers[tab.id] = new ScreenshotController(tab.id, function() {
                    this.screenshotControllers[tab.id] = null
                }.bind(this), linkData.remainingDepth-1, linkData.origin);
                browser.tabs.executeScript(tab.id, {
                    file: "processPage.js"
                }).then(() => {
                    console.log("Executed processPage.js")
                })
            });
        this.visitedUrlPool.push(linkData.link);
        // this.urlPool.shift();
    }

    /**
     * Pause the crawler
     */
    pause() {
        this.paused = true;
        this.sendStateUpdate();
    }

    /**
     * Check if crawler is paused
     * @returns Paused boolean
     */
    isPaused() {
        return this.paused;
    }

    /**
     * Unpause the crawler
     */
    unpause() {
        this.paused = false;
        this.sendStateUpdate();
    }
}

