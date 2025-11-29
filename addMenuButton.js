document.addEventListener("click", () => {
  setTimeout(() => {
    const menu = document.querySelector('#settings-popover-menu');
    if (!menu) return;

    // Prevent duplicate
    if (menu.querySelector(".clutterless-menu-item")) {
      debug.warn("Clutterless Settings Button already exists, returning. (src/addMenuButton.js)")
      return;
    }
    // Find the <li> with <a> whose first text node is "Settings"
    const settingsItem = Array.from(menu.querySelectorAll("li")).find((li) => {
      const a = li.querySelector("a");
      if (!a) return false;

      const label = a.firstChild?.nodeValue?.trim().toLowerCase();
      return label === "settings";
    });

    if (!settingsItem) {
      console.warn("[Clutterless] Settings item not found.");
      debug.error(`The settings menu could not be found. (src/addMenuButton.js)`)
      return;
    }

    // Create new item
    const li = document.createElement("li");
    li.className = "clutterless-menu-item";

    const a = document.createElement("a");
    a.textContent = "Clutterless Settings";
    a.href = "/clutterless";
    a.className = "rbx-menu-item";
    a.style.display = "block";

    li.appendChild(a);
    settingsItem.insertAdjacentElement("afterend", li);

    debug.log(`Added button into settings menu, under default settings. (src/addMenuButton.js)`)
  }, 0);
});
