import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  const container = document.querySelector(".main-container");
  const navToggle = document.querySelector(".nav-menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuContent = document.querySelector(".menu-content");
  const menuLogo = document.querySelector(".menu-logo");
  const menuLinksWrapper = document.querySelector(".menu-links-wrapper");
  const linkHighlighter = document.querySelector(".link-highlighter");

  let currentX = 0;
  let targetX = 0;
  const lerpFactor = 0.05;

  let currentHighlighterX = 0;
  let targetHighlighterX = 0;
  let currentHighlighterWidth = 0;
  let targetHighlighterWidth = 0;

  let isMenuOpen = false;
  let isMenuAnimating = false;

  const menuLinks = document.querySelectorAll(`.menu-link a`);
  menuLinks.forEach((link) => {
    const chars = link.querySelectorAll(`span`);
    chars.forEach((char, charIndex) => {
      const split = new SplitText(char, { type: "chars" });
      split.chars.forEach((char) => {
        char.classList.add("char");
      });
      if (charIndex === 1) {
        gsap.set(split.chars, { y: "110%" });
      }
    });
  });
  gsap.set(menuContent, { y: "50%", opacity: 0.25 });
  gsap.set(menuLogo, { scale: 0.5, opacity: 0.25 });
  gsap.set(menuLinks, { y: "150%" });
  gsap.set(linkHighlighter, { y: "150%" });

  const defaultLinkText = document.querySelector(
    `.menu-link:first-child a span`,
  );

  if (defaultLinkText) {
    const linkWidth = defaultLinkText.offsetWidth;
    linkHighlighter.style.width = linkWidth + "px";
    currentHighlighterWidth = linkWidth;
    targetHighlighterWidth = linkWidth;

    const defaultLinkTextElement = document.querySelector(
      ".menu-link:first-child",
    );

    const linkRect = defaultLinkTextElement.getBoundingClientRect();
    const menuLinksWrapperRect = menuLinksWrapper.getBoundingClientRect();
    const initialX = linkRect.left - menuLinksWrapperRect.left;

    currentHighlighterX = initialX;
    targetHighlighterX = initialX;
  }

  //   Menu toggle: open/close logic
  function toggleMenu() {
    if (isMenuAnimating) return;
    isMenuAnimating = true;

    if (!isMenuOpen) {
      gsap.to(container, {
        y: "-40%",
        opacity: 0.25,
        duration: 1.25,
        ease: "expo.out",
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(container, { y: "40%" });
          gsap.set(".menu-link", {
            overflow: "visible",
          });
          isMenuOpen = true;
          isMenuAnimating = false;
        },
      });

      gsap.to(menuContent, {
        y: "0%",
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
      });

      gsap.to(menuLogo, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
      });

      gsap.to(menuLinks, {
        y: "0%",
        duration: 1.25,
        stagger: 0.1,
        delay: 0.25,
        ease: "expo.out",
      });

      gsap.to(linkHighlighter, {
        y: "0%",
        duration: 1,
        delay: 1,
        ease: "expo.out",
      });
    } else {
      gsap.to(container, {
        y: "0%",
        opacity: 1,
        duration: 1.25,
        ease: "expo.out",
      });

      gsap.to(menuContent, {
        y: "-100%",
        opacity: 0.25,
        duration: 1.25,
        ease: "expo.out",
      });

      gsap.to(menuLinks, {
        y: "-150%",
        opacity: 0.5,
        duration: 1.25,
        ease: "expo.out",
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(menuOverlay, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          gsap.set(menuLinks, {
            y: "150%",
          });
          gsap.set(linkHighlighter, {
            y: "150%",
          });
          gsap.set(menuContent, {
            y: "50%",
            opacity: 0.25,
          });
          gsap.set(menuLogo, {
            y: "0%",
            opacity: 0.25,
            scale: 0.5,
          });
          gsap.set(".menu-link", {
            overflow: "hidden",
          });

          gsap.set(menuLinksWrapper, { x: 0 });
          currentX = 0;
          targetX = 0;

          isMenuOpen = false;
          isMenuAnimating = false;
        },
      });
    }
  }

  navToggle.addEventListener("click", toggleMenu);

  menuOverlay.addEventListener("mousemove", (event) => {
    if (window.innerWidth < 1000) return;

    const mouseX = event.clientX;
    const viewPortWidth = window.innerWidth;
    const menuLinksWrapperWidth = menuLinksWrapper.offsetWidth;

    const maxMoveLeft = 0;
    const maxMoveRight = viewPortWidth - menuLinksWrapperWidth;

    const sensitivityRange = viewPortWidth * 0.5;
    const startX = (viewPortWidth - sensitivityRange) / 2;
    const endX = startX + sensitivityRange;

    let mousePercentage;
    if (mouseX <= startX) {
      mousePercentage = 0;
    } else if (mouseX >= endX) {
      mousePercentage = 1;
    } else {
      mousePercentage = (mouseX - startX) / sensitivityRange;
    }

    targetX = maxMoveLeft + mousePercentage * (maxMoveRight - maxMoveLeft);
  });

  function animate() {
    if (isMenuOpen) {
      currentX += (targetX - currentX) * lerpFactor;
      gsap.set(menuLinksWrapper, { x: currentX });
    }

    requestAnimationFrame(animate);
  }

  animate();
});
