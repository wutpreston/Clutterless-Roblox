const brainrot_terms = ["brainrot", "suhur", "sahur"];

const funcs = {
    renameText: function(findName, newName) {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
            acceptNode(node) {
                const tag = node.parentElement?.tagName;
                if (!node.nodeValue.includes(findName)) return NodeFilter.FILTER_SKIP;
                if (["SCRIPT", "STYLE", "NOSCRIPT", "HEAD", "META", "TITLE"].includes(tag)) {
                    debug.log('func renameText: Filter is skipped. Matches an exclusion list. (src/pageActions.js)')
                    return NodeFilter.FILTER_SKIP;
                }
                    debug.log('func renameText: Filter is accepted. (src/pageActions.js)')
                    return NodeFilter.FILTER_ACCEPT;
                }
            }
        );

        let node;
        while ((node = walker.nextNode())) {
            node.nodeValue = node.nodeValue.replaceAll(findName, newName);
        }

        const inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
        inputs.forEach(input => {
            if (input.placeholder.includes(findName)) {
                input.placeholder = input.placeholder.replaceAll(findName, newName);
                debug.log(`func renameText: Replaced ${findName} with ${newName} (src/pageActions.js)`)
            }
        });
    },

    oldSchoolPlayBtn: function(query) {
        const playButton = document.querySelector(query);
        if (playButton) {
            debug.log(`func oldSchoolPlayBtn: Button Found (src/pageActions.js)`)
            playButton.style.background = "#00B170";
            debug.log(`func oldSchoolPlayBtn: Applied new style.background (src/pageActions.js)`)
        }
    },

    removeTodaysPicks: function() {
        const headers = document.querySelectorAll("h2.sort-header span");

        for (const span of headers) {
            const text = span.textContent.trim().toLowerCase();
            if (text === "today's picks") {
            const wrapper = span.closest(".game-sort-wrapper") || span.closest(".game-sort-header-container")?.parentElement;
            if (wrapper) {
                wrapper.remove();
                debug.log(`func removeTodaysPicks: Removed Today's Picks (src/pageActions.js)`)
                return;
            }
            }
        }
    },

    removeRecommended: function() {
        const headers = document.querySelectorAll('[data-testid="home-page-game-grid"] h2');

        for (const h2 of headers) {
            const text = h2.textContent.trim().toLowerCase();
            if (text === "recommended for you") {
            const section = h2.closest('[data-testid="home-page-game-grid"]');
            if (section) {
                section.remove();
                debug.log(`func removeTodaysPicks: Removed RFU. (src/pageActions.js)`)
                return;
            }
            }
        }
    },

    removeSponsored: function() {
        const headers = document.querySelectorAll("h2.sort-header");

        for (const h2 of headers) {
            const a = h2.querySelector("a");
            const text = a?.textContent.trim().toLowerCase();
            if (text === "sponsored") {
            const wrapper = h2.closest(".game-sort-carousel-wrapper");
            if (wrapper) {
                wrapper.remove();
                debug.log(`func removeTodaysPicks: Removed Sponsored. (src/pageActions.js)`)
                return;
            }
            }
        }
    },

    blurBrainrot: function() {
        const cards = document.querySelectorAll('div[data-testid="game-tile"]');

        cards.forEach(card => {
            if (card.classList.contains("clutterless-brainrot")) return;

            const titleEl = card.querySelector('.game-card-name');
            const stats = card.querySelector('[data-testid="game-tile-stats"]');
            const thumb = card.querySelector('.thumbnail-2d-container');
            const link = card.querySelector('a.game-card-link');

            if (!titleEl || !thumb || !link) return;

            const title = titleEl.textContent.trim().toLowerCase();
            if (!brainrot_terms.some(term => title.includes(term))) return;

            card.classList.add("clutterless-brainrot");
            card.style.position = "relative";

            // ✅ Hide text and stats
            titleEl.style.visibility = "hidden";
            titleEl.style.pointerEvents = "none";
            titleEl.style.userSelect = "none";

            if (stats) {
                stats.style.visibility = "hidden";
                stats.style.pointerEvents = "none";
                stats.style.userSelect = "none";
            }

            // ✅ Blur thumbnail
            thumb.style.filter = "blur(8px)";
            thumb.style.transition = "filter 0.3s ease";

            // ✅ Disable click-through
            link.style.pointerEvents = "none";
            link.style.opacity = "0.6"; // Optional: visual indicator it's disabled

            // ✅ Reveal Button
            const revealBtn = document.createElement("button");
            revealBtn.textContent = "Reveal Game";
            Object.assign(revealBtn.style, {
                position: "absolute",
                bottom: "8px",
                top: "auto",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: "1000",
                padding: "4px 10px",
                background: "#444",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                whiteSpace: "nowrap",
                fontSize: "12px",
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)"
            });

            revealBtn.onclick = () => {
            thumb.style.filter = "none";
            titleEl.style.visibility = "visible";
            titleEl.style.pointerEvents = "auto";
            titleEl.style.userSelect = "auto";
            if (stats) {
                stats.style.visibility = "visible";
                stats.style.pointerEvents = "auto";
                stats.style.userSelect = "auto";
            }
            link.style.pointerEvents = "auto";    // ✅ re-enable click
            link.style.opacity = "1";
            debug.log('func blurBrainrot: Blur removed due to reveal. (src/pageActions.js)')
            revealBtn.remove();
            };

            // ✅ Append to card (not inside the link)
            card.appendChild(revealBtn);
            debug.log('func blurBrainrot: Blur applied to brainrot game. (src/pageActions.js)')
        });
    }
}


chrome.storage.sync.get([
    // Advertisements
    "clutterless_hide_sponsored",
    "clutterless_hide_ads",

    // Home Page
    "clutterless_hide_todayspicks",
    "clutterless_hide_recommended",

    // Roblox Pages
    "clutterless_oldname_games",
    "clutterless_oldname_groups",
    "clutterless_oldcss_playbutton",
    "clutterless_oldname_catalog",

    // Games / Experiences
    "clutterless_blur_brainrot",

    // Debugging
    "clutterless_debugging"
], (settings) => {
    const applyAll = () => {
        if (settings.clutterless_debugging) {
            window.clutterless_debugging = true;
        }

        if (settings.clutterless_blur_brainrot) {
            funcs.blurBrainrot()
        }

        if (settings.clutterless_hide_sponsored) {
            funcs.removeSponsored();
        }

        if (settings.clutterless_hide_ads) {
            
        }

        if (settings.clutterless_hide_todayspicks) {
            funcs.removeTodaysPicks();
        }

        if (settings.clutterless_hide_recommended) {
            funcs.removeRecommended();
        }

        if (settings.clutterless_oldname_games) {
            funcs.renameText("Charts", "Games");
            funcs.renameText("charts", "games");

            funcs.renameText("Experience", "Game")
            funcs.renameText("experience", "game")

            funcs.renameText("Experiences", "Games")
            funcs.renameText("experiences", "games")
        }

        if (settings.clutterless_oldname_groups) {
            funcs.renameText("Communities", "Groups");
            funcs.renameText("communities", "groups");

            funcs.renameText("Community", "Group");
            funcs.renameText("community", "group");
        }

        if (settings.clutterless_oldname_catalog) {
            funcs.renameText('Marketplace', "Catalog");
            funcs.renameText('marketplace', 'catalog')
        }

        if (settings.clutterless_oldcss_playbutton) {
            funcs.oldSchoolPlayBtn('[data-testid="play-button"]');
            funcs.oldSchoolPlayBtn(".play-button")
            funcs.oldSchoolPlayBtn(".btn-growth-sm")
        }
    };

    applyAll();

    // Observer listens for DOM changes and will re-apply.
    const observer = new MutationObserver(() => {
        debug.log('Observer has detected a DOM change. Running applyAll(); (src/pageActions.js)')
        applyAll();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    debug.log('Observer for DOM changes is now observing. (src/pageActions.js)')
});
