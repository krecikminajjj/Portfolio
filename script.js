const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

function activateTab(panelId, updateHash = true) {
  const nextPanel = panels.find((panel) => panel.id === panelId) || panels[0];

  panels.forEach((panel) => {
    panel.hidden = panel !== nextPanel;
  });

  tabs.forEach((tab) => {
    const isSelected = tab.getAttribute("aria-controls") === nextPanel.id;
    tab.setAttribute("aria-selected", String(isSelected));
  });

  if (updateHash) {
    history.replaceState(null, "", `#${nextPanel.id}`);
  }
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    activateTab(tab.getAttribute("aria-controls"));
  });
});

window.addEventListener("hashchange", () => {
  activateTab(window.location.hash.replace("#", ""), false);
});

activateTab(window.location.hash.replace("#", "") || "about", false);
