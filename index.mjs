import api from "get-window-by-name";
import RPC from "discord-rich-presence";

const regex = /Watch\s(.*)\sonline\sfree\son\s9anime\s-\s(.*)/; // This regex may not work for all browsers, unfortunately season details aren't in the title

// List of browser executable names
const browserNames = [
    "msedge.exe" // Microsoft Edge
]

// Time to check for title change
const interval = 5000;

// ProcessOptionsArray
let window = null;

let id = "1031669791318089768";
let client = RPC(id);

// For every browser executable name in the array above try get process options array
for (const name of browserNames) {
    let windowOptions = api.getWindowText(name);
    if (!windowOptions || !windowOptions[0] || !regex.test(windowOptions[0].processTitle)) continue;
    window = windowOptions;
    break;
}

// If window is null, no valid browser processes were found
if (!window) {
    console.log("No window found with the regex provided, exiting...");
    process.exit(0);
}

// Title of the anime!
const title = window[0].processTitle;

// Variable to store the last title
const [, anime, browser] = title.match(regex);

// Update presence on start
updatePresence(anime, browser);

// Check for title change every interval
setInterval(() => {

    // Try get process options array of the previously found window
    const windowOptions = api.getWindowText(window[0].processName);


    // If not exists, or empty OR doesn't match regex, disconnect presence if not null and return
    if (!windowOptions || !windowOptions[0] || !regex.test(windowOptions[0].processTitle)) {

        if (client !== null) {
            client.disconnect();
            client = null;
        }

        console.log("Not watching anime anymore, continuing until next check...");
        return;
    }

    // Title of the anime! (new)
    const [, anime_, browser_] = windowOptions[0].processTitle.match(regex);

    // check if old title is different from new title and update presence if so
    if (anime !== anime_) updatePresence(anime_, browser_);

}, interval);


// Update presence function so don't have to repeat code
function updatePresence(title, browser) {

    // if no client or disconnected, connect
    if (!client || client === null) client = RPC(id);

    // double check it actually connected
    if (client) {

        // update presence
        client.updatePresence({
            details: title,
            state: browser,
            largeImageKey: "large_play",
            largeImageText: "9anime",
            smallImageKey: "small_play",
            instance: true
        });

        // log it has been updated
        console.log("Updated presence!");
    }
}
