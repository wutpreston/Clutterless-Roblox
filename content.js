console.log("[Clutterless] content.js loaded on", location.href);

let clutterlessHTML = null;

// Step 1: Fetch your custom HTML
fetch(chrome.runtime.getURL("clutterless.html"))
  .then(res => res.text())
  .then(html => {
    clutterlessHTML = html;
    waitForRobloxLayout();
  })
  .catch(err => console.error("[Clutterless] Failed to load HTML:", err));

// Step 2: Wait until nav + layout is ready
function waitForRobloxLayout() {
  const interval = setInterval(() => {
    const nav = document.querySelector("#navigation-container") || document.querySelector(".navbar");
    const container =
      document.querySelector(".container-main") ||
      document.querySelector("#main-content") ||
      document.querySelector(".content");

    if (nav && container) {
      clearInterval(interval);
      console.log("[Clutterless] Roblox layout detected");
      injectClutterless(container);
    }
  }, 50);
}

// Step 3: Inject + observe React to keep your content alive
function injectClutterless(container) {
  console.log("[Clutterless] Injecting content");

  container.innerHTML = clutterlessHTML;
  const observer = new MutationObserver(() => {
    if (!container.innerHTML.includes("Clutterless")) {
      console.log("[Clutterless] React overwrote content — reinjecting");
      container.innerHTML = clutterlessHTML;
      document.title = "Clutterless"
    }
  });
  observer.observe(container, { childList: true, subtree: true });
}

