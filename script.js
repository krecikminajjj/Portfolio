const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));

function initTabs() {
  if (!tabs.length || !panels.length) {
    return;
  }

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
}

function initImageLightbox() {
  const images = Array.from(
    document.querySelectorAll(".project-page .project-hero img, .project-page .media-grid img")
  );

  if (!images.length) {
    return;
  }

  const lightbox = document.createElement("dialog");
  lightbox.className = "image-lightbox";
  lightbox.setAttribute("aria-label", "Expanded project image");
  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <button class="lightbox-close" type="button" aria-label="Close expanded image">X</button>
      <img alt="">
      <p class="lightbox-caption"></p>
    </div>
  `;
  document.body.append(lightbox);

  const lightboxImage = lightbox.querySelector("img");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const caption = lightbox.querySelector(".lightbox-caption");
  let activeImage = null;

  function closeLightbox() {
    if (lightbox.open) {
      lightbox.close();
    } else {
      lightbox.removeAttribute("open");
      lightbox.dispatchEvent(new Event("close"));
    }
  }

  function openLightbox(image) {
    activeImage = image;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt || "";
    caption.textContent = image.alt || "";
    caption.hidden = !image.alt;
    document.body.classList.add("lightbox-open");

    if (typeof lightbox.showModal === "function") {
      lightbox.showModal();
    } else {
      lightbox.setAttribute("open", "");
    }

    closeButton.focus({ preventScroll: true });
  }

  images.forEach((image) => {
    image.classList.add("expandable-image");
    image.setAttribute("role", "button");
    image.setAttribute("tabindex", "0");
    image.setAttribute("aria-label", image.alt ? `Expand image: ${image.alt}` : "Expand project image");

    image.addEventListener("click", () => openLightbox(image));
    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");

    if (activeImage) {
      activeImage.focus({ preventScroll: true });
    }

    activeImage = null;
  });
}

initTabs();
initImageLightbox();
