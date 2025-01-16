export let tabCount =  0;

// NOTE(hrs): This avoids querying the tabs API to get the count of tabs every time we need it by keeping track of the count in a variable.

browser.tabs.onCreated.addListener(() => {
    tabCount++;
});

browser.tabs.onRemoved.addListener(() => {
    tabCount--;
});
