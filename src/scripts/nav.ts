function initNav(): void {
  const menuBtn = document.querySelector<HTMLButtonElement>("#menu-btn");
  const navMenu = document.querySelector("#nav-menu");
  const menuIcon = document.querySelector("#menu-icon");
  const closeIcon = document.querySelector("#close-icon");

  if (!menuBtn || !navMenu || !menuIcon || !closeIcon) return;

  const openLabel = menuBtn.dataset.openLabel || "Open Menu";
  const closeLabel = menuBtn.dataset.closeLabel || "Close Menu";

  menuBtn.addEventListener("click", () => {
    const openMenu = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", openMenu ? "false" : "true");
    menuBtn.setAttribute("aria-label", openMenu ? openLabel : closeLabel);
    navMenu.classList.toggle("hidden");
    menuIcon.classList.toggle("hidden");
    closeIcon.classList.toggle("hidden");
  });
}

document.addEventListener("astro:after-swap", initNav);
initNav();
