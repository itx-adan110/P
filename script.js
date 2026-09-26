/* ==========================================================================
   SYED MOHIB ABBAS — PORTFOLIO
   Main client-side interactions for the static GitHub Pages build.
   ========================================================================== */

"use strict";

const root = document.documentElement;

/* ==========================================================================
   1. THEME
   ========================================================================== */

const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle?.querySelector(".theme-icon");
const THEME_KEY = "portfolio-theme";

function setTheme(theme) {
  const isLight = theme === "light";

  root.dataset.theme = isLight ? "light" : "dark";

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme"
    );
  }

  if (themeIcon) {
    themeIcon.textContent = isLight ? "☾" : "☼";
  }
}

function toggleTheme() {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";

  if (themeIcon) {
    themeIcon.style.transform = "rotate(180deg) scale(.65)";

    window.setTimeout(() => {
      themeIcon.style.transform = "";
    }, 220);
  }

  setTheme(nextTheme);
  localStorage.setItem(THEME_KEY, nextTheme);

  // Animate both logo variants when the theme changes.
  document.querySelectorAll(".logo-switch").forEach((logo) => {
    logo.classList.remove("is-changing");
    void logo.offsetWidth;
    logo.classList.add("is-changing");

    window.setTimeout(() => {
      logo.classList.remove("is-changing");
    }, 520);
  });
}

const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark");

themeToggle?.addEventListener("click", toggleTheme);

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");
const navLinks = [...document.querySelectorAll(".nav-link")];

function closeMobileMenu() {
  nav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  if (!nav) return;

  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

/* ==========================================================================
   3. ACTIVE SECTION / REVEAL ANIMATIONS
   ========================================================================== */

const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = [...document.querySelectorAll(".reveal")];

if ("IntersectionObserver" in window) {
  // Highlight the navigation item for the section currently in view.
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );

  sections.forEach((section) => navObserver.observe(section));

  // Reveal elements once when they enter the viewport.
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((element) => revealObserver.observe(element));
} else {
  // Older browsers: show everything immediately.
  revealItems.forEach((element) => element.classList.add("visible"));
}

/* ==========================================================================
   4. MODALS
   ========================================================================== */

function openModal(modal) {
  if (!modal) return;

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(modal) {
  if (!modal) return;

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.open")) {
    document.body.classList.remove("modal-open");
  }
}

// Close when the user taps the X or the backdrop.
document.querySelectorAll(".modal-close, .modal-backdrop").forEach((element) => {
  element.addEventListener("click", () => {
    closeModal(element.closest(".modal"));
  });
});

// Escape closes every open modal.
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  document.querySelectorAll(".modal.open").forEach(closeModal);
});

// Hire Me modal.
document.getElementById("hireMeButton")?.addEventListener("click", () => {
  openModal(document.getElementById("hireModal"));
});

/* ==========================================================================
   5. PRESS / TAP FEEDBACK
   ========================================================================== */

const pressableSelector = [
  ".btn",
  ".text-button",
  ".card-link",
  ".filter",
  ".skill-action",
  ".certificate-action",
  ".social",
  ".tool-action",
  ".back-top"
].join(", ");

document.addEventListener("pointerdown", (event) => {
  const target = event.target.closest(pressableSelector);
  target?.classList.add("pressed");
});

function clearPressedState(event) {
  const target = event.target.closest(pressableSelector);
  if (!target) return;

  window.setTimeout(() => target.classList.remove("pressed"), 120);
}

document.addEventListener("pointerup", clearPressedState);
document.addEventListener("pointercancel", (event) => {
  event.target.closest(pressableSelector)?.classList.remove("pressed");
});

/* ==========================================================================
   6. SERVICE FILTERS
   ========================================================================== */

const filters = [...document.querySelectorAll(".filter")];
const serviceCards = [...document.querySelectorAll(".service-card")];

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    const selectedCategory = filter.dataset.filter;

    filters.forEach((item) => {
      item.classList.toggle("active", item === filter);
    });

    serviceCards.forEach((card) => {
      const shouldHide =
        selectedCategory !== "all" &&
        card.dataset.category !== selectedCategory;

      card.classList.toggle("is-hidden", shouldHide);
    });
  });
});

/* ==========================================================================
   7. EXTERNAL TOOL LINKS
   ========================================================================== */

const toolLinks = {
  Photoshop: "https://www.adobe.com/products/photoshop.html",
  Illustrator: "https://www.adobe.com/products/illustrator.html",
  Canva: "https://www.canva.com/",
  "Premiere Pro": "https://www.adobe.com/products/premiere.html",
  "Meta Ads": "https://www.facebook.com/business/ads",
  "Google Tools": "https://ads.google.com/"
};

document.querySelectorAll(".tool-action").forEach((button) => {
  button.title = "Open official website";

  button.addEventListener("click", () => {
    const url = toolLinks[button.dataset.tool];
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  });
});

/* ==========================================================================
   8. SHARED MODAL CONTENT
   ========================================================================== */

const serviceModal = document.getElementById("serviceModal");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalResources = document.getElementById("modalResources");

const serviceDescriptions = {
  "YouTube Thumbnails":
    "Eye-catching thumbnail designs for YouTube videos and channels.",
  "Logo Design":
    "Professional logo concepts and brand identity work.",
  "Passport Size Photo Editing":
    "Clean, professional and high-quality photo editing.",
  "YouTube Automation":
    "Channel workflow, production support and repeatable content systems.",
  "Social Media Designs":
    "Posts, banners and creative assets for social platforms.",
  "SEO Optimization":
    "On-page SEO, keyword research and search visibility support."
};

function showResourcePlaceholder(title, message) {
  if (!modalResources) return;

  modalResources.innerHTML = `
    <div class="file-placeholder">
      <strong>${escapeHtml(title)}</strong>
      <small>${escapeHtml(message)}</small>
    </div>
  `;
}

function openContentModal(title, description, resourceTitle, resourceMessage) {
  if (!serviceModal) return;

  if (modalTitle) modalTitle.textContent = title;
  if (modalText) modalText.textContent = description;

  showResourcePlaceholder(resourceTitle, resourceMessage);
  openModal(serviceModal);
}

/* ==========================================================================
   9. SERVICE DETAILS
   ========================================================================== */

document.querySelectorAll(".service-card").forEach((card) => {
  const button = card.querySelector(".card-link");

  button?.addEventListener("click", (event) => {
    event.preventDefault();

    const title =
      card.querySelector("h3")?.textContent?.trim() ||
      button.dataset.service ||
      "Service";

    openContentModal(
      title,
      serviceDescriptions[title] ||
        "Portfolio work and information for this service.",
      "ADD YOUR WORK HERE",
      "Add your project image, PDF or portfolio link in this service's HTML block. The card layout will keep the media area at the same size."
    );
  });
});

/* ==========================================================================
   10. SKILL DETAILS
   ========================================================================== */

document.querySelectorAll(".skill-action").forEach((card) => {
  const openSkill = () => {
    const title =
      card.querySelector("h3")?.textContent?.trim() ||
      card.dataset.skill ||
      "Skill";

    openContentModal(
      title,
      card.dataset.skillDescription ||
        "Portfolio samples and links for this skill.",
      "ADD PORTFOLIO LINK / SAMPLE",
      "Add your real portfolio URL or local sample file here later."
    );
  };

  card.addEventListener("click", openSkill);

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openSkill();
  });
});

/* ==========================================================================
   11. FILE VIEWER
   ========================================================================== */

const fileViewerModal = document.getElementById("fileViewerModal");
const fileViewerTitle = document.getElementById("fileViewerTitle");
const fileViewerBody = document.getElementById("fileViewerBody");
const fileOpenExternal = document.getElementById("fileOpenExternal");

function showFilePlaceholder(title, path, kind = "FILE") {
  if (!fileViewerBody) return;

  const icon = kind === "CERTIFICATE" ? "▣" : "FILE";

  fileViewerBody.innerHTML = `
    <div class="file-placeholder">
      <span class="mini-icon">${icon}</span>
      <strong>${escapeHtml(title)}</strong>
      <small>
        Placeholder is ready. Add your real file at:
        <br><b>${escapeHtml(path)}</b>
      </small>
    </div>
  `;

  if (fileOpenExternal) {
    fileOpenExternal.href = path;
    fileOpenExternal.style.display = "inline-flex";
    fileOpenExternal.textContent = "Open original ↗";
  }
}

function openFileViewer(url, fileName = "Portfolio file", kind = "FILE") {
  if (!fileViewerModal || !fileViewerBody) return;

  if (fileViewerTitle) {
    fileViewerTitle.textContent = fileName;
  }

  fileViewerBody.innerHTML = "";

  if (!url) {
    showFilePlaceholder(fileName, "Add your file path here", kind);
    openModal(fileViewerModal);
    return;
  }

  if (fileOpenExternal) {
    fileOpenExternal.href = url;
    fileOpenExternal.style.display = "inline-flex";
    fileOpenExternal.textContent = "Open original ↗";
  }

  const lowerUrl = url.toLowerCase();

  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(lowerUrl)) {
    const image = new Image();

    image.className = "file-preview-image";
    image.src = url;
    image.alt = fileName;

    image.onload = () => {
      fileViewerBody.replaceChildren(image);
    };

    image.onerror = () => {
      showFilePlaceholder(fileName, url, kind);
    };

    // Keep a clean loading state until the file is ready.
    fileViewerBody.innerHTML = `
      <div class="file-placeholder">
        <strong>Loading preview…</strong>
        <small>${escapeHtml(fileName)}</small>
      </div>
    `;
  } else if (/\.pdf$/i.test(lowerUrl)) {
    const frame = document.createElement("iframe");

    frame.className = "file-preview-frame";
    frame.src = url;
    frame.title = fileName;

    fileViewerBody.appendChild(frame);
  } else {
    fileViewerBody.innerHTML = `
      <div class="file-placeholder">
        <strong>${escapeHtml(fileName)}</strong>
        <small>Use the Open original button to view this document.</small>
      </div>
    `;
  }

  openModal(fileViewerModal);
}

/* ==========================================================================
   12. CERTIFICATES
   ========================================================================== */

const certificateCards = [
  ...document.querySelectorAll(".certificate-action")
];

certificateCards.forEach((card) => {
  const openCertificate = () => {
    const title =
      card.dataset.certificate ||
      card.querySelector("b")?.textContent?.trim() ||
      "Certificate";

    openFileViewer(card.dataset.file || "", title, "CERTIFICATE");
  };

  card.addEventListener("click", openCertificate);

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openCertificate();
  });
});

document.getElementById("viewCertificates")?.addEventListener("click", () => {
  const modal = document.getElementById("certificateModal");
  const gallery = document.getElementById("certificateGallery");

  if (!modal || !gallery) return;

  gallery.replaceChildren();

  certificateCards.forEach((card) => {
    const title =
      card.dataset.certificate ||
      card.querySelector("b")?.textContent?.trim() ||
      "Certificate";

    const file = card.dataset.file || "";
    const item = document.createElement("button");

    item.type = "button";
    item.className = "certificate-placeholder";

    if (file) {
      const image = document.createElement("img");
      image.className = "certificate-gallery-image";
      image.src = file;
      image.alt = title;
      image.loading = "lazy";
      item.appendChild(image);
    }

    const label = document.createElement("span");
    label.className = "certificate-gallery-title";
    label.textContent = title;

    const hint = document.createElement("small");
    hint.textContent = "Tap to open";

    item.append(label, hint);

    item.addEventListener("click", () => {
      closeModal(modal);
      openFileViewer(file, title, "CERTIFICATE");
    });

    gallery.appendChild(item);
  });

  openModal(modal);
});

/* ==========================================================================
   13. ABOUT / LEARN MORE
   ========================================================================== */

document.getElementById("learnMore")?.addEventListener("click", () => {
  openContentModal(
    "About Me",
    "Graphic design, digital marketing and SEO work focused on practical, clean and useful results.",
    "PORTFOLIO PROFILE",
    "Replace this section with any additional profile document, introduction PDF or portfolio link you want to show."
  );
});

/* ==========================================================================
   14. CV
   ========================================================================== */

document.getElementById("downloadCV")?.addEventListener("click", () => {
  const cvPath = "assets/documents/Syed-Mohib-Abbas-CV.pdf";
  const link = document.createElement("a");

  link.href = cvPath;
  link.download = "Syed-Mohib-Abbas-CV.pdf";
  link.target = "_blank";
  link.rel = "noopener";

  document.body.appendChild(link);
  link.click();
  link.remove();
});

/* ==========================================================================
   15. SERVICE IMAGE AUTO-LOADER
   ========================================================================== */

document
  .querySelectorAll(".service-media[data-image-slot]")
  .forEach((media) => {
    const imagePath = media.dataset.imageSlot;
    if (!imagePath) return;

    const image = new Image();

    image.className = "service-image";
    image.alt = "Portfolio work";
    image.src = imagePath;

    image.onload = () => {
      media.replaceChildren(image);
    };

    // If the file does not exist, the original HTML placeholder remains.
  });

/* ==========================================================================
   16. BACK TO TOP
   ========================================================================== */

const backTop = document.querySelector(".back-top");

function updateBackToTop() {
  backTop?.classList.toggle("show", window.scrollY > 500);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });

backTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ==========================================================================
   17. HERO INTERACTION FEEDBACK
   ========================================================================== */

function replayAnimation(element, className, duration = 760) {
  if (!element) return;

  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);

  window.setTimeout(() => {
    element.classList.remove(className);
  }, duration);
}

document
  .querySelectorAll(
    ".hero-visual .availability-card, .hero-visual .location, .hero-visual .experience"
  )
  .forEach((card) => {
    card.addEventListener("click", () => {
      replayAnimation(card, "hero-pulse");

      const icon = card.querySelector(".mini-icon");
      replayAnimation(icon, "hero-pulse");
    });
  });

document
  .querySelector(".hero-visual .portrait-frame")
  ?.addEventListener("click", function () {
    replayAnimation(this, "hero-pulse");
  });

document.querySelectorAll(".social").forEach((icon) => {
  icon.addEventListener("click", () => {
    // Keep the original social-icon loop effect.
    replayAnimation(icon, "is-looping", 600);

    // Hero icons also receive the shorter pulse effect.
    if (icon.closest(".hero")) {
      replayAnimation(icon, "social-pulse", 600);
    }
  });
});

/* ==========================================================================
   18. ANCHOR SCROLLING
   ========================================================================== */

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;

    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();

    const headerHeight =
      document.querySelector(".site-header")?.offsetHeight || 0;

    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      headerHeight +
      1;

    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", id);
  });
});

/* ==========================================================================
   19. SCROLL PROGRESS / DEPTH EFFECT
   ========================================================================== */

const progressBar = document.querySelector(".scroll-progress");
const depthSections = [
  ...document.querySelectorAll("[data-scroll-depth]")
];

let scrollFramePending = false;

function updateScrollEffects() {
  const maxScroll =
    document.documentElement.scrollHeight - window.innerHeight;

  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;

  if (progressBar) {
    progressBar.style.transform = `scaleX(${progress})`;
  }

  const viewportHeight = window.innerHeight;

  depthSections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > viewportHeight) return;

    const center = rect.top + rect.height / 2;
    const offset = (viewportHeight / 2 - center) * 0.018;
    const clampedOffset = Math.max(-8, Math.min(8, offset));

    section.style.setProperty("--scroll-y", `${clampedOffset}px`);
  });
}

function requestScrollUpdate() {
  if (scrollFramePending) return;

  scrollFramePending = true;

  requestAnimationFrame(() => {
    updateScrollEffects();
    scrollFramePending = false;
  });
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", updateScrollEffects, { passive: true });

updateScrollEffects();

/* ==========================================================================
   20. POINTER GLOW — DESKTOP ONLY
   ========================================================================== */

const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

if (supportsFinePointer) {
  const glow = document.createElement("div");

  glow.className = "pointer-glow";
  document.body.appendChild(glow);

  let currentX = -500;
  let currentY = -500;
  let targetX = currentX;
  let targetY = currentY;

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      document.body.classList.add("pointer-active");
    },
    { passive: true }
  );

  window.addEventListener("pointerleave", () => {
    document.body.classList.remove("pointer-active");
  });

  function animatePointerGlow() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;

    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;

    requestAnimationFrame(animatePointerGlow);
  }

  animatePointerGlow();
} else {
  root.classList.add("touch-device");
}

/* ==========================================================================
   21. HELPERS
   ========================================================================== */

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.body.classList.add("js-ready");
