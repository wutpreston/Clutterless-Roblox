const settings = [
  // Advertisements
  { id: "toggle-sponsored", key: "clutterless_hide_sponsored" },
  { id: "toggle-ads", key: "clutterless_hide_ads" },

  // Home Page
  { id: "toggle-todayspicks", key: "clutterless_hide_todayspicks" },
  { id: "toggle-recommended", key: "clutterless_hide_recommended" },

  // Roblox Pages
  { id: "toggle-oldname-games", key: "clutterless_oldname_games" },
  { id: "toggle-oldname-groups", key: "clutterless_oldname_groups" },
  { id: "toggle-oldname-catalog", key: "clutterless_oldname_catalog"},
  { id: "toggle-oldcss-playbutton", key: "clutterless_oldcss_playbutton" },

  // Games / Experiences
  { id: "toggle-blur-brainrot", key: 'clutterless_blur_brainrot'},

  // Debugging
  { id: "toggle-debugger", key: "clutterless_debugging"},
];

const wait = setInterval(() => {
  debug.log('Wait function has been called. (src/settings.js)')
  const allReady = settings.every(({ id }) => document.getElementById(id));
  const tabsReady = document.querySelectorAll(".sidebar-tab").length > 0;

  if (!allReady || !tabsReady) {
    debug.warn('Elements were not ready to display when requested. (src/settings.js)')
    return
  };
  clearInterval(wait);

  debug.log('Elements are ready to display. (src/settings.js)')

  // Restore toggle states
  debug.log('Interating toggle states. (src/settings.js)')
  settings.forEach(({ id, key }) => {
    const checkbox = document.getElementById(id);
    if (!checkbox) return;

    chrome.storage.sync.get([key], result => {
      checkbox.checked = result[key] === true;
      debug.log(`KEY: ${key} has been set to ${result[key] === true}. (src/settings.js)`)
    });

    debug.log(`Creating an event listener for change on slider. (src/settings.js)`)
    checkbox.addEventListener("change", () => {
      debug.log(`Event listener added for slider. (src/settings.js)`)
      chrome.storage.sync.set({ [key]: checkbox.checked });
    });
  });

  // Handle sidebar tab switching
  const tabs = document.querySelectorAll(".sidebar-tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      // Activate tab
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      // Show corresponding tab content
      contents.forEach(content => {
        content.classList.toggle("active", content.dataset.tab === target);
      });

      // Optional: Save last selected tab
      chrome.storage.local.set({ "clutterless_last_tab": target });
    });
  });

  // Restore last selected tab (optional)
  chrome.storage.local.get("clutterless_last_tab", result => {
    const saved = result["clutterless_last_tab"];
    if (!saved) return;

    const btn = document.querySelector(`.sidebar-tab[data-tab="${saved}"]`);
    if (btn) btn.click(); // simulate tab click
  });

}, 50);


function forceTitle(titleText) {
  debug.log(`Forcing clutterless page to have a custom title: ${titleText}. (src/settings.js)`)
  const tryObserve = () => {
    if (!document.head) {
      requestAnimationFrame(tryObserve); // retry on next frame
      return;
    }

    // Set immediately
    document.title = titleText;

    // Observe <head> for title changes
    debug.log(`Creating title observer. (src/settings.js)`)
    const headObserver = new MutationObserver(() => {
      if (document.title !== titleText) {
        document.title = titleText;
        debug.log(`Updated title due to document title change. (src/settings.js)`)
      }
    });

    headObserver.observe(document.head, { childList: true, subtree: true });
    debug.log(`Title observer created and observing. (src/settings.js)`)
  };

  tryObserve();
}

forceTitle("Roblox - CRS");
