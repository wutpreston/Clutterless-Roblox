// Whats the purpose of this?
// Why didn't I just use console.log, console.warn (etc)
// I dont know. I like custom designs :>

function checkDebugState() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["clutterless_debugging"], (settings) => {
            resolve(settings.clutterless_debugging);
        });
    });
}

window.debug = {
    log: function(message) {
        checkDebugState().then((value) => {
            if (value) console.log(`%c▶ ${message}`, "font-size:0.7rem;font-style:italic;color:lightgreen;")
        });
    },

    warn: function(message) {
        checkDebugState().then((value) => {
            if (value) console.log(`%c▶ ${message}`, "font-size:0.7rem;font-style:italic;color:orange;")
        });
    },

    error: function(message) {
        checkDebugState().then((value) => {
            if (value) console.log(`%c▶ ${message}`, "font-size:0.7rem;font-style:italic;color:red;")
        });
    }
}