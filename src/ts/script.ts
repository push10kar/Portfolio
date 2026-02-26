import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(SplitText);

  // Menu Overlay
  const container = document.querySelector(".main-container");
  const navToggle = document.querySelector(".nav-menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuContent = document.querySelector(".menu-content");
  const menuLogo = document.querySelector(".menu-logo");
  const menuLinksWrapper = document.querySelector(".menu-links-wrapper");
  const menuLinkContainer = document.querySelectorAll(".menu-link");
  const linkHighlighter = document.querySelector(".link-highlighter");

  // Scrollbar
  const scrollTrack = document.querySelector(".custom-scrollbar");
  const scrollThumb = document.querySelector(".scrollbar-thumb");

  let currentX = 0;
  let targetX = 0;
  const lerpFactor = 0.1;

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
  gsap.set(menuLinks, { y: "150%", opacity: 1 });
  gsap.set(linkHighlighter, { y: "150%" });

  const defaultLinkText = document.querySelector(
    `.menu-link:first-child a span`,
  );

  if (defaultLinkText) {
    const linkWidth = defaultLinkText.offsetWidth;
    // linkHighlighter.style.width = linkWidth + "px";
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

    gsap.set(linkHighlighter, {
      x: initialX,
      width: linkWidth,
    });
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
        opacity: 1,
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

  menuLinkContainer.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (window.innerWidth < 1000) return;

      const linkRect = link.getBoundingClientRect();
      const menuWrapRectangle = menuLinksWrapper.getBoundingClientRect();

      targetHighlighterX = linkRect.left - menuWrapRectangle.left;

      const linkCopyElement = link.querySelector("a span");
      targetHighlighterWidth = linkCopyElement
        ? linkCopyElement.offsetWidth
        : link.offsetWidth;
    });
  });

  // Tracking active link, default is the first link.
  let activeLink = document.querySelector(".menu-link:first-child");

  menuLinkContainer.forEach((link) => {
    link.addEventListener("click", () => {
      activeLink = link;
      toggleMenu();
      const anchor = link.querySelector("a");
      const target = document.querySelector(anchor.getAttribute("href"));

      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 1250);
      }
    });
  });

  menuLinksWrapper.addEventListener("mouseleave", () => {
    const activeLinkSpan = activeLink.querySelector("a span");

    const linkRect = activeLink.getBoundingClientRect();
    const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();

    targetHighlighterX = linkRect.left - menuWrapperRect.left;
    targetHighlighterWidth = activeLinkSpan.offsetWidth;
  });

  // Animation function:  this will animate everything we calculated above
  function animate() {
    if (isMenuOpen) {
      // Move links container
      currentX += (targetX - currentX) * lerpFactor;
      gsap.set(menuLinksWrapper, {
        x: currentX,
        duration: 0.3,
        ease: "power4.out",
      });

      // Move highlighter X
      currentHighlighterX +=
        (targetHighlighterX - currentHighlighterX) * lerpFactor;

      // Animate highlighter width
      currentHighlighterWidth +=
        (targetHighlighterWidth - currentHighlighterWidth) * lerpFactor;

      gsap.set(linkHighlighter, {
        x: currentHighlighterX,
        width: currentHighlighterWidth,
        duration: 0.3,
        ease: "power4.out",
      });
    }

    requestAnimationFrame(animate);
  }

  // Scrollbar logic
  let scrollTimeout;

  function updateThumb() {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const trackRect = scrollTrack.getBoundingClientRect();
    const trackHeight = trackRect.height;

    const padding = 16; // match your CSS padding (1rem ≈ 16px)

    const thumbHeight = 50;

    const usableHeight = trackHeight - padding * 2 - thumbHeight;

    const scrollProgress = scrollTop / docHeight;

    const thumbTop = padding + scrollProgress * usableHeight;

    scrollThumb.style.height = thumbHeight + "px";
    scrollThumb.style.transform = `translateY(${thumbTop}px)`;

    scrollThumb.style.opacity = "1";

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      scrollThumb.style.opacity = "0";
    }, 800);
  }

  scrollTrack.addEventListener("mouseenter", () => {
    clearTimeout(scrollTimeout);
    scrollThumb.style.width = "6px";
    scrollThumb.style.opacity = "1";
  });

  scrollTrack.addEventListener("mouseleave", () => {
    if (isDragging) return; // ← important

    scrollThumb.style.width = "4px";

    scrollTimeout = setTimeout(() => {
      scrollThumb.style.opacity = "0";
    }, 800);
  });

  let isDragging = false;
  let dragStartY = 0;
  let startThumbTop = 0;

  scrollThumb.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragStartY = e.clientY;

    const transform = scrollThumb.style.transform;
    const match = transform.match(/translateY\((.*)px\)/);
    startThumbTop = match ? parseFloat(match[1]) : 0;

    scrollThumb.style.width = "6px"; // lock wide
    scrollThumb.style.opacity = "1";

    document.body.style.userSelect = "none";
  });

  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const deltaY = e.clientY - dragStartY;

    const trackRect = scrollTrack.getBoundingClientRect();
    const trackHeight = trackRect.height;

    const padding = 16;
    const thumbHeight = 50;

    const usableHeight = trackHeight - padding * 2 - thumbHeight;

    let newThumbTop = startThumbTop + deltaY;

    newThumbTop = Math.max(
      padding,
      Math.min(padding + usableHeight, newThumbTop),
    );

    const scrollProgress = (newThumbTop - padding) / usableHeight;

    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    window.scrollTo(0, scrollProgress * docHeight);
  });

  document.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;
    document.body.style.userSelect = "";

    // Only shrink if not hovering track
    if (!scrollTrack.matches(":hover")) {
      scrollThumb.style.width = "4px";

      scrollTimeout = setTimeout(() => {
        scrollThumb.style.opacity = "0";
      }, 800);
    }
  });

  window.addEventListener("scroll", updateThumb);

  // Jelly Cursor Logic
  // Check if it's a touch device
  const isTouchDevice = "ontouchstart" in window;

  // Function for Mouse Move Scale Change (Jelly Effect)
  function getScale(diffX, diffY) {
    const distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    return Math.min(distance / 100, 0.25);
  }

  // Function For Mouse Movement Angle in Degrees (Jelly Effect)
  function getAngle(diffX, diffY) {
    return (Math.atan2(diffY, diffX) * 180) / Math.PI;
  }

  // Variables
  const elasticCursor = document.getElementById("jelly-cursor");
  const pos = { x: 0, y: 0 };
  const vel = { x: 0, y: 0 };
  let targetPos = { x: 0, y: 0 };
  let isHoveringClickable = false;

  // Use gsap.quickSetter for optimized property setting
  const setX = gsap.quickSetter(elasticCursor, "x", "px");
  const setY = gsap.quickSetter(elasticCursor, "y", "px");
  const setRotation = gsap.quickSetter(elasticCursor, "rotate", "deg");
  const setScaleX = gsap.quickSetter(elasticCursor, "scaleX");
  const setScaleY = gsap.quickSetter(elasticCursor, "scaleY");
  const setOpacity = gsap.quickSetter(elasticCursor, "opacity");

  // Update position and rotation (without affecting the scale)
  function update() {
    const rotation = getAngle(vel.x, vel.y);
    const scale = getScale(vel.x, vel.y);

    // Apply jelly-like effect (position and rotation), keeping scale separate
    setX(pos.x);
    setY(pos.y);
    setRotation(rotation);

    // If not hovering, apply the jelly scale effect
    if (!isHoveringClickable) {
      setScaleX(1 + scale);
      setScaleY(1 - scale);
    }
  }

  // Animation loop
  function animateCursor() {
    const speed = 0.35;

    // Update cursor's position based on targetPos
    pos.x += (targetPos.x - pos.x) * speed;
    pos.y += (targetPos.y - pos.y) * speed;
    vel.x = targetPos.x - pos.x;
    vel.y = targetPos.y - pos.y;

    update();
    requestAnimationFrame(animateCursor);
  }

  // Handle mouse move event
  window.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    targetPos.x = clientX;
    targetPos.y = clientY;

    // Always update position, regardless of hover state
    update();
  });

  // Function to handle scaling when hovering over clickable elements
  function handleCursorHover(isHovering) {
    isHoveringClickable = isHovering; // Set hover state

    // Smoothly apply scaling effect on hover, but don't stop position updating
    gsap.to(elasticCursor, {
      scale: isHovering ? 0.5 : 1, // Adjust this scale for clickable effect
      duration: 0.3,
      ease: "power2.out",
    });
  }

  // Add event listeners for clickable elements (links and buttons)
  document.querySelectorAll(".clickable").forEach((element) => {
    // Scale down cursor on mouse enter
    element.addEventListener("mouseenter", () => handleCursorHover(true));

    // Reset cursor size on mouse leave
    element.addEventListener("mouseleave", () => handleCursorHover(false));
  });

  // Function to hide the cursor
  function hideCursor() {
    gsap.to(elasticCursor, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.out",
    });
  }

  // Function to show the cursor
  function showCursor() {
    gsap.to(elasticCursor, {
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
    });
  }

  // Hiding the cursor when it leaves the viewport
  document.addEventListener("mouseleave", hideCursor);

  // Re-show the cursor when mouse re-enters the viewport
  document.addEventListener("mouseenter", showCursor);

  // Detect when entering and exiting an iframe
  const iframes = document.querySelectorAll("iframe");

  iframes.forEach((iframe) => {
    // Add event listener to hide cursor when entering the iframe
    iframe.addEventListener("mouseenter", hideCursor);

    // Add event listener to show cursor when leaving the iframe
    iframe.addEventListener("mouseleave", showCursor);
  });

  // Function Calls
  animate();
  updateThumb();
  // Only invoke the animation if it's not a touch device
  if (!isTouchDevice) {
    animateCursor();
  }
});
