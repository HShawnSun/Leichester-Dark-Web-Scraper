// Keep track of the previous scroll value to detect the end of the page
const prevScrollY = {prevY : -1};

// Add listeners to allow screenshotController to control capture
browser.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        // Scroll to the next part of the page
        case "scrollTo":
            window.scrollTo({
                left: 0,
                top: message.data.newYPosition,
                behavior: "instant"
            });
            let isLastCapture = false;
            if (message.data.newYPosition === 0) {
                document.querySelector("body").style.overflow = "hidden";
            }
            if (window.scrollY === this.prevScrollY) {
                isLastCapture = true;
            } else {
                this.prevScrollY = window.scrollY;
            }
            browser.runtime.sendMessage({
                "type": "capturePageSection",
                "data": {
                    "currentYPosition": window.scrollY,
                    "isLastCapture": isLastCapture
                }

            });
            break;
        // Scrape links and start capture. Should be triggered when page is fully loaded
        case "requestPageInfo":
            // Get all the links on the page
            const links = Array.from(document.querySelectorAll('a')).filter((link) => {
                const docURL = new URL(window.location.href);
                const linkURL = new URL(link.href, docURL.origin);
                return docURL.pathname != linkURL.pathname && docURL.origin == linkURL.origin;
            })
            // Send to background script
            if (message.data.remainingDepth > 0)
            {
                browser.runtime.sendMessage({
                    'type': 'processPage',
                    'data': {
                        'links': links.map((link) => {return {
                            link: link.href, 
                            remainingDepth: message.data.remainingDepth,
                            origin: window.location.href
                        }}),
                    }
                });
            }
            // Send page data to screenshot controller to start capture
            console.log("Starting capture");
            browser.runtime.sendMessage({
                "type": "setPageDetails",
                "data": {
                    "size": {
                        "width": Math.max(
                            document.documentElement.clientWidth,
                            document.body.scrollWidth,
                            document.documentElement.scrollWidth,
                            document.body.offsetWidth,
                            document.documentElement.offsetWidth
                        ),
                        "height": Math.max(
                            document.documentElement.clientHeight,
                            document.body.scrollHeight,
                            document.documentElement.scrollHeight,
                            document.body.offsetHeight,
                            document.documentElement.offsetHeight
                        )
                    },
                    "scrollAmount": window.innerHeight,
                    'title': document.title,
                    'url': window.location.href
                }
            });
            break;
    }
}.bind(prevScrollY));

