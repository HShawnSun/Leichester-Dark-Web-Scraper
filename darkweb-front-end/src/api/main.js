import axios from "axios";

/**
 * This function get all of the captures from the backend
 * Be careful to use this as it will take a long time
 * @returns all captures
 */
export async function getCaptures() {
  try {
    const response = await axios.get("/api/captures");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * return captures data by its id
 * @param {int} id
 * @returns captures data by its id
 */
export async function getCapturesById(id) {
  try {
    const response = await axios.get("/api/captures/" + id, {headers: {'accept':'application/json'}});
    return response.data;
    // var list = response.data._embedded.captures;
    // for (var i = 0; i < list.length; i++) {
    //   if (list[i].id === id) {
    //     return list[i];
    //   }
    // }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * This function get all of the captures from the backend by its captured time (from timeBefore to timeAfter)
 * @param {Time} timeBefore
 * @param {Time} timeAfter
 * @returns captures in the time range
 */
export async function getCaptureByTimeRange(timeBefore, timeAfter) {
  try {
    const response = await axios.get("/api/captures");
    const list = response.data._embedded.captures;

    const capturesInTimeRange = list.filter((capture) => {
      const capDate = new Date(capture.capDate).getTime();
      return capDate >= timeBefore && capDate <= timeAfter;
    });

    if (list.length === 0) return [];

    return capturesInTimeRange;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * This function gets the number of captures from the backend by its captured time (from timeBefore to timeAfter)
 * @param {Time} timeBefore
 * @param {Time} timeAfter
 * @returns an object where the keys are dates and the values are the number of captures for each date
 */
export async function getCaptureNumByTimeRange(timeBefore, timeAfter) {
  try {
    const response = await axios.get("/api/captures");
    const list = response.data._embedded.captures;

    const capturesInTimeRange = list.filter((capture) => {
      const capDate = new Date(capture.capDate).getTime();
      return capDate >= timeBefore && capDate <= timeAfter;
    });

    const captureCountsByDate = capturesInTimeRange.reduce(
      (counts, capture) => {
        const date = new Date(capture.capDate);
        const dateString = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;

        if (!counts[dateString]) {
          counts[dateString] = 0;
        }

        counts[dateString]++;

        return counts;
      },
      {}
    );

    return captureCountsByDate;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * Get one page by its id
 * @param {int} id
 * @returns page data by its id
 */
export async function getPageNamePromisebyID(id) {
  try {
    const response = await axios.get("/api/captures/" + id + "/page");
    return response.data.pgTitle;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * return all websites name
 * this function is used to get all websites name and display them in the dropdown list
 * @returns all websites name
 */
export async function getAllWebsitesName() {
  try {
    const response = await axios.get("/api/websites");
    const list = response.data._embedded.websites;
    var websiteList = [];
    for (var i = 0; i < list.length; i++) {
      websiteList.push(list[i].webURL);
    }
    return websiteList;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * This function get all of the websites id from the backend
 * @returns all websites id
 */
export async function getAllWebsitesId() {
  try {
    const response = await axios.get("/api/websites");
    const list = response.data._embedded.websites;
    var websiteList = [];
    for (var i = 0; i < list.length; i++) {
      websiteList.push(list[i].id);
    }
    return websiteList;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get all pages by website id
 * @param {int} id
 * @returns pages belong to the website id
 */
export async function getPagesByWebsiteId(id) {
  try {
    const response = await axios.get("/api/websites/" + id + "/pages");
    return response.data._embedded.pages;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get one page title by its id
 * @param {int} id
 * @returns a string of page title
 */
export async function getPageTitleByPageId(id) {
  try {
    const response = await axios.get("/api/pages/" + id);
    return response.data.pgTitle;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get one of the page by its website's id.
 * @param {int} id
 * @returns page
 */
export async function getFirstPageIdByWebsiteId(id) {
  try {
    // const response = await axios.get("/api/websites/" + id + "/pages");
    const response = await axios.get("/api/pages/search/findByWebsite_IdAndParentIsNull?websiteId=" + id);
    if (response.data._embedded.pages.length === 0) {
      return -1;
    }
    return response.data._embedded.pages[0].id;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get the path for a page by its id
 * @param {int} id 
 * @returns page path
 */
export async function getPagePathByPageId(id) {
  try {
    const response = await axios.get("/api/pages/" + id);
    return response.data.pgURL;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get all of the children pages by its parent id. This is used in Tree Search
 * @param {int} id
 * @returns pages
 */
export async function getChildrenPagesByParentId(id) {
  try {
    const response = await axios.get("/api/pages/" + id + "/children");
    return response.data._embedded.pages;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get all of the captures by its page id
 * @param {int} id
 * @returns captures
 */
export async function getCapturesBypageId(id) {
  try {
    const response = await axios.get("/api/pages/" + id + "/captures");
    return response.data._embedded.captures;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get website by its websites id
 * @param {*} id
 * @returns website
 */
export async function getWebsiteNameByWebsiteId(id) {
  try {
    const response = await axios.get("/api/websites/" + id);
    return response.data.webURL;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * update website note by its website id, used in website search
 * @param {string} noteText
 * @param {int} websiteId
 * @returns website
 */
export async function updateWebsiteNoteById(noteText, websiteId) {
  try {
    const response = await axios.patch("/api/websites/" + websiteId, {
      webNotes: noteText,
    });
    console.log(noteText);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get website note by its website id
 * @param {int} websiteId
 * @returns note
 */
export async function getWebsiteNoteByWebsiteId(websiteId) {
  try {
    const response = await axios.get("/api/websites/" + websiteId);
    return response.data.webNotes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get all of the pages by its website url
 * @param {string} url
 * @returns pages
 */
export async function getPagesByURL(url) {
  try {
    const response = await axios.get(
      "/api/pages/search/findByWebsite_WebURL?url=" + url
    );
    return response.data._embedded.pages;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * input url, get all of the captures that contain the url, used in search bar
 * @param {string} url
 * @returns captures
 */
export async function getCapturesByURL(url) {
  try {
    //transfer url=http://localhost:8080/pages/2/captures to /api/pages/2/captures
    const apiUrl = url.replace("http://localhost:8080", "/api");
    const response = await axios.get(apiUrl);
    return response.data._embedded.captures;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * delete capture by its id
 * @param {int} id
 */
export function deleteCapture(id) {
  try {
    axios.delete("/api/captures/" + id);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * input keywords, get all of the captures that contain the keyword, used in search bar
 * @param {string} keyword
 * @returns captures
 */
export async function getCapturesByKeyword(keyword) {
  try {
    const response = await axios.get(
      "/api/captures/search/findByKeyword?keyword=" + keyword
    );
    console.log(response.data._embedded.captures);
    return response.data._embedded.captures;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * add note to a capture by its id
 * @param {int} id
 * @param {string} notes
 */
export async function updateNotesById(id, notes) {
  try {
    console.log("updateNotesById: ", id, notes);
    const res = await axios.patch("/api/captures/" + id, { notes: notes });
    console.log("updateNotesById res: ", res);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * delete capture by its id
 * @param {int} id
 */
export async function deleteById(id) {
  try {
    const res = await axios.delete("/api/captures/" + id);
    console.log("deleteById res: ", res);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

/**
 * get hash value by its capture id
 * @param {int} id
 * @returns hashvalue
 */
export async function getHashValueById(id) {
  try {
    const response = await axios.get("/api/captures/" + id, {headers: {'accept':'application/json'}});
    return response.data.hashValue;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getNoteByCaptureId(id) {
  try {
    const response = await axios.get("/api/captures/" + id, {headers: {'accept':'application/json'}});
    return response.data.notes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
