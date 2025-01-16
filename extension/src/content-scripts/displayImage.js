browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
        case "loadImage":
            let image = document.createElement("img");
            image.src = message.data.image;
            document.body.appendChild(image);
            break;
    }
});
