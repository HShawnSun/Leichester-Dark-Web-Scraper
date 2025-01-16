// AMENDED: Changed reference to toggle switch
let startBtn = document.getElementById('toggle-switch');

// ADDED by Aashira: Added new reference to end button
let endButton = document.querySelector('.button-container');

let currentSiteLabel = document.getElementById('current-site-label');
let currentDepthLimtLabel = document.getElementById('current-depth-limit-label');
let toggleLabel = document.querySelector('.toggle-label');

// AMENDED: Changed event to 'change' instead of 'click'
// AMENDED by Aashira: Changed 'toggleScraper' to function that changes label
// and displays end button when switch is toggled
startBtn.addEventListener('change', function () { 
    if (this.checked) {
        start().then(b => {
            if (b) {
                endButton.style.display = "flex";
                toggleLabel.textContent = "SCRAPER ON";
            } else {
                startBtn.checked = false;
            }
        })
            
    } else {
        toggleLabel.textContent = "SCRAPER PAUSED"
        pause();
    }
});

// ADDED by Aashira:
// Adding event listener to end button to reset toggle after it is pressed
endButton.addEventListener('click', function() {
    this.style.display = "none";
    startBtn.checked = false;
    toggleLabel.textContent = "SCRAPER OFF";
    stopScraper();
});

// ADDED by Aashira:
// Function to handle tab switching
/*
function openTab(evt, tabName) {
    let tabContent = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    let tabLinks = document.getElementsByClassName("tabs")[0].getElementsByTagName("button")
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    document.getElementById(tabName).style.display = "flex";
    evt.currentTarget.classList.add("active");
}*/

/**
 * The default depth limit
 * @default 1
 */
var defaultDepthLimit = 1;
/**
 * The currently set depth limit
 * @default defaultDepthLimit
 */
var depthLimit = defaultDepthLimit;
/**
 * The currently set starting URL
 * @default ""
 */
var startingURL = "";

// Adding event listener to 'Save' button
document.getElementById('saveSettings').addEventListener('click', function() {
    // Function to capture user input from the settings form fields
    var depthLimitInput = document.getElementById('depthLimit').value;
    var startingURLInput = document.getElementById('startingUrl').value;
    // var domains = document.getElementById('domains').value;
    
    // Check if depthLimitInput is not empty, then validate, else use default
    console.log(Number.isInteger(depthLimitInput));
    if (!Number.isInteger(Number(depthLimitInput)) || Number(depthLimitInput) <= 0) {
        alert("Depth limit must be a positive integer. Value left unchanged");
    }
    else {
        depthLimit = Number(depthLimitInput);
        currentDepthLimtLabel.innerText = `Current depth limit: ${depthLimit}`;
    }
    // depthLimit = depthLimitInput ? Number(depthLimitInput) : defaultDepthLimit;

    // Validation checks

    // Non-empty check for starting URL
    if (startingURLInput.trim().length === 0) {
        alert("Starting URL cannot be empty.");
    } else {  
        // Validation for startingURL as a Tor Browser URL
        var onionUrlPattern = new RegExp('^http(s)?:\/\/([a-z1-9]+\.)?([a-z2-7]{16}|[a-z2-7]{56})\.onion\/', 'i');
        if (!onionUrlPattern.test(startingURLInput)) {
            alert("Starting URL is not a valid Tor URL.");
        }
        else {
            startingURL = startingURLInput;
            currentSiteLabel.innerText = `Ready to scrape: ${startingURL}`;
        }
    }
 
    // Non-empty check for domains
    // if (domains.trim().length === 0) {
    //     alert("Domains cannot be empty.");
    //     return; // Stop further execution if validation fails
    // } else {
    //     // Validation for Tor domain names
    //     var domainsPattern = new RegExp('^([a-z2-7]{56} )*([a-z2-7]{56})$');
    //     if (!domainsPattern.test(domains)) {
    //         alert("Invalid domains.");
    //         return; // Stop further execution if validation fails
    //     }        
    // }
});

// AMENDED: Function to start the scraper
/**
 * Instruct the background script to start/unpause crawling (if the current config is valid)
 * @returns Boolean representing whether the start was successful or not
 */
async function start() {
    // let domainList = domains.value.split('\n');
    // let url = domainList[0];
    // let url = document.getElementById("startingUrl").value;
    if (startingURL == "") {
        alert("Cannot start scraper: Missing valid URL")
        return false;
    }
    // domainList.shift();

    // startBtn.innerHTML = 'Stop'
    // startBtn.removeEventListener('click', start)
    // startBtn.addEventListener('click', stop)

    let data = {
        type: 'start',
        data: {
            startingUrl: startingURL,
            depthLimit: depthLimit,
        }
        // domains: domainList
    }

    currentSiteLabel.innerText = `Scraping: ${startingURL}`

    console.log('started crawler')
    browser.runtime.sendMessage(data)
        .then(res => console.log(res))
        .catch(err => console.log(err))
    return true;
}

// AMENDED: Function to stop the scraper
/**
 * Instruct the background script to stop scraping
 */
async function stopScraper() {
    console.log('stopped crawler')
    startBtn.innerHTML = 'Start'
    startBtn.removeEventListener('click', stop)
    startBtn.addEventListener('click', start)

    console.log('stopped crawler')
    browser.runtime.sendMessage({ type: 'stop' })
        .then(res => console.log(res))
        .catch(err => console.log(err))
}

/**
 * Instruct the background script to pause the crawler
 */
async function pause() {
    console.log('paused crawler')
    browser.runtime.sendMessage({
        type: 'pause',
    }).then(res => console.log(res))
    .catch(err => console.log(err));
}

/**
 * Update the visual state of the popup according to the given message
 * @param {object} message - The object containing data about the current state of the crawler
 */
function updateState(message) {
    if (message.url && message.url != "") {
        startingURL = message.url;
        currentSiteLabel.innerText = `Scraping: ${startingURL}`;
    }
    if (message.depth != -1) {
        depthLimit = message.depth;
        currentDepthLimtLabel.innerText = `Current depth limit: ${depthLimit}`;
    }
    if (message.running == true) {
        endButton.style.display = "flex";
        toggleLabel.textContent = "SCRAPER ON";
    } else {
        endButton.style.display = "none";
        toggleLabel.textContent = "SCRAPER OFF";
        startBtn.checked = false;
    }
    if (message.paused == true) {
        startBtn.checked = false;
        endButton.style.display = "flex";
        toggleLabel.textContent = "SCRAPER PAUSED";
    } else if (message.running == true) {
        startBtn.checked = true;
    }
}

// Load current state from background script
browser.runtime.sendMessage({
    type: 'getState',
}).then((message) => updateState(message))

// Attach message listener so that state can be updated
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type == "updateState") {
        updateState(message.data);
    }
})
