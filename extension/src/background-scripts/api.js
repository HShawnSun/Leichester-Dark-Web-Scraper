// NOTE(hrs): API Specification: https://uniofnottm-my.sharepoint.com/:w:/g/personal/psymb19_nottingham_ac_uk/EfXwtDcUP5VHhNJa4F1l_9UBHSI58cwb1XgOOgnyC721Iw?e=Drbjjt

const {sha256} = require("js-sha256");

/**
 * IP address of backend database server
 */
export let serverHost = "127.0.0.1";
/**
 * Port number the server is listening on
 */
export let serverPort = "8080";

/**
 * 
 * @param {dataURL} image - The scraped image to send encoded as a data URL (i.e. base64) 
 * @param {string} title - Page title 
 * @param {string} website - Website url, e.g. "https://google.com"
 * @param {string} path - Path of the page from the website root, e.g. "/about"
 */
export async function SendCaptureToServer(image, title, website, path, parentPagePath=null, parentPageWebsite=null) {
    let websiteId = -1;
    let pgId = -1;
    // Attempt to add capture, if an error occurs assume there is a problem with server communication
    try {
        // Try finding the website if it exists, if not create a new one
        const websiteData = await FindWebsite(website);
        if (websiteData === -1) {
            // TODO get the user-inputted website name from the UI
            let newWebsite = await RegisterWebsite(website, website, "", "").then((response) => {
                console.log("Response: ", response);
                return response.json();
            });
            websiteId = newWebsite.id;
        } else websiteId = websiteData.id;

        // Try finding the page if it exists, if not create a new one
        const pageData = await FindPage(websiteId, path);
        if (pageData === -1) {
            // Page doesn't exist, so create it
            // Try finding parent page if provided. TODO Create page/website if they don't exist?
            let parentId = null;
            if (parentPagePath && parentPageWebsite) {
                const websiteResult = await FindWebsite(parentPageWebsite);
                if (websiteResult !== -1) {
                    const pageResult = await FindPage(websiteResult.id, parentPagePath);
                    if (pageResult !== -1) {
                        parentId = pageResult.id;
                    }
                }
            }
            // Create the page
            let newPage = await RegisterPage(title, path, websiteId, parentId).then((response) => response.json());
            pgId = newPage.id;
        } else {
            pgId = pageData.id;
            // Check if this page currently has an associated parent. If not, add the parent
            if (!pageData.parent && parentPagePath && parentPageWebsite) {
                const websiteResult = await FindWebsite(parentPageWebsite);
                if (websiteResult !== -1) {
                    const pageResult = await FindPage(websiteResult.id, parentPagePath);
                    if (pageResult !== -1) {
                        UpdatePage(pageData.id, null, null, null, pageResult.id);
                    }
                }
            }
        }

        // Create the capture
        await RegisterCapture(pgId, image);

    } catch (error) {
        // TODO Report error to user and allow retry
        console.error(`Unable to connect to server: ${error.message}`);
    }
}

/**
 * Find a website entry in the database
 * Equivalent to 'GET host:port/websites/search/findByWebURL?url={url}'
 * @param {string} url - URL of website 
 * @param {string} host - Address or hostname of database server 
 * @param {string} port - Port number of database server
 * @returns Website object if found, else -1
 */
export function FindWebsite(url, host=serverHost, port=serverPort) {
    let server = "http://" + host + ":" + port + `/api/websites/search/findByWebURL?url=${url}`;
    let request = fetch(server, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    return request.then((response) => {
        if (!response.ok) return -1;
        return response.json();
    })
}

/**
 * Register a website with the server (create website)
 * Equivalent to 'POST host:port/websites'
 * E.g. {"webName":"Ebay","webURL":"https://ebay.co.uk","webCategory":"Marketplace","webNotes":"Online marketplace"}
 * @param {string} name - Name of the website
 * @param {string} url - URL of the website, containing only the domain name and protocol
 * @param {string} category - Category of the website, e.g. 'Marketplace'. If null or "" then server will use a default value
 * @param {string} notes - Any associated notes provided by the user
 * @param {string} host - Address or hostname of database server
 * @param {string} port - Port number of database server
 * @returns Promise containing an HTTP Response object
 */
export function RegisterWebsite(name, url, category, notes, host=serverHost, port=serverPort) {
    let server = "http://" + host + ":" + port + "/api/websites";
    let data = {
        "webName": name,
        "webURL": url,
        "webCategory": category,
        "webNotes": notes
    };
    return fetch(server, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
}

/**
 * Update an existing Website record in the database
 * @param {(string|int)} websiteId - Id of the website to update
 * @param {string} [name] - New website name
 * @param {string} [url] - New website URL 
 * @param {string} [category] - New website category
 * @param {string} [notes] - New website notes
 * @param {string} host - Address or hostname of the database server
 * @param {string} port - Port number of database server
 * @returns Promise containing an HTTP Response object
 * @throws Error if website does not exist
 */
export function UpdateWebsite(websiteId, name=null, url=null, category=null, notes=null, host=serverHost, port=serverPort) {
    let server = "http://" + host + ":" + port + `/api/websites/${websiteId}`;
    let body = {};
    if (name) body["webName"] = name;
    if (url) body["webURL"] = url;
    if (category) body["webCategory"] = category;
    if (notes) body["webNotes"] = notes;
    let request = fetch(server, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
    return request.then((response) => {
        if (response.ok) return response;
        else throw Error(`PATCH Update failed with error code ${response.status}`);
    })
}

/**
 * Find a page entry in the database
 * Equivalent to 'GET host:port/pages/search/findByPgURLAndWebsite_Id?url={path}&websiteId={websiteId}'
 * @param {(string|int)} websiteId - Id of the associated website
 * @param {string} path - Path of the page from the root 
 * @param {string} host - Address or hostname of the database server
 * @param {string} port - Port number of the database server
 * @returns Page object if found, else -1
 */
export function FindPage(websiteId, path, host=serverHost, port=serverPort) {
    let server = "http://" + host + ":" + port + `/api/pages/search/findByPgURLAndWebsite_Id?url=${path}&websiteId=${websiteId}`;
    let request = fetch(server, {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    });
    return request.then((response) => {
        if (!response.ok) return -1;
        return response.json();
    })
}

/**
 * Register a page with the server (create page)
 * Equivalent to 'POST host:port/pages'
 * E.g. {"pgTitle":"Ebay", "pgURL":"/deals", "website":"/website/1"}
 * @param {string} title - Title of the web page
 * @param {string} url - Path section of the URL, e.g. '/about
 * @param {(string|int)} websiteId - Id number of the website associated with this page
 * @param {(string|int)} [parentId] - Id number of the parent page
 * @param {string} host - Address or hostname of the database server
 * @param {string} port - Port number of the database server
 * @returns Promise containing an HTTP Response object
 */
export function RegisterPage(title, url, websiteId, parentId=null, host=serverHost, port=serverPort) {
    let server = "http://" + host + ":" + port + "/api/pages";
    let data = {
        "pgTitle": title,
        "pgURL": url,
        "website": `/api/websites/${websiteId}`
    };
    if (parentId) data["parent"] = `api/pages/${parentId}`;
    return fetch(server, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

}

/**
 * Update an existing Page record in the database
 * @param {(string|int)} pageId - Id of the page to update
 * @param {string} [title] - New page title
 * @param {string} [path] - New page path 
 * @param {string} [websiteId] - Id of associated website
 * @param {string} [parentId] - Id of parent page
 * @param {string} host - Address or hostname of the database server
 * @param {string} port - Port number of database server
 * @returns Promise containing HTTP Response object
 * @throws Error if page doesn't exist
 */
export function UpdatePage(pageId, title=null, path=null, websiteId=null, parentId=null, host=serverHost, port=serverPort) {
    let server = "http://" + host + ":" + port + `/api/pages/${pageId}`;
    let body = {};
    if (title) body["pgTitle"] = title;
    if (path) body["pgURL"] = path;
    if (websiteId) body["website"] = `/api/websites/${websiteId}`;
    if (parentId) body["parent"] = `/api/pages/${parentId}`;
    let request = fetch(server, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    })
    return request.then((response) => {
        if (response.ok) return response;
        else throw Error(`PATCH Update failed with error code ${response.status}`);
    })
}

/**
 * Register a capture with the server (create capture)
 * Equivalent to 'POST host:port/captures' followed by 'PUT host:port/captures/{id}/content' with 'Content-Type:image/jpeg'
 * @param {(string|int)} pgId - Id of the page associated with this capture
 * @param {dataURL} imData - Image data encoded as a data URL (i.e. base64)
 * @param {string} host - Address or hostname of database server
 * @param {string} port - Port number of database server
 */
export async function RegisterCapture(pgId, imData, host=serverHost, port=serverPort) {
    let server = "http://" + host + ":" + port + "/api/captures";
    // Convert data URL to binary data
    const binaryImage = await fetch(imData).then((response) => response.blob());
    // Calculate hash of the binary image for integrity
    const contentHash = sha256(await binaryImage.arrayBuffer());
    // First create capture entry (without image)
    fetch(server, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "page": `/api/pages/${pgId}`,
            "contentHash": contentHash
        })
    }).then((response) => {
        // Now edit the new entry to upload the actual capture image
        if (!response.ok) throw new Error(`Failed to create capture: ${response.stringify}`)
        else return response.json().then((data) => fetch(
            server+"/"+data.id+"/content", {
                method: "PUT",
                headers: {
                    "Content-Type": "image/json"
                },
                body: binaryImage
            }
        ))
    })
}

