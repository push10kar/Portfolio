"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
var gsap_1 = require("gsap");
var SplitText_1 = require("gsap/SplitText");
document.addEventListener("DOMContentLoaded", function () {
  gsap_1.gsap.registerPlugin(SplitText_1.SplitText);
  var container = document.querySelector(".main-container");
  var navToggle = document.querySelector(".nav-menu-toggle");
  var menuOverlay = document.querySelector(".menu-overlay");
  var menuContent = document.querySelector(".menu-content");
  var menuLogo = document.querySelector(".menu-logo");
  var menuLinksWrapper = document.querySelector(".menu-links-wrapper");
  var linkHighlighter = document.querySelector(".link-highlighter");
  var currentX = 0;
  var targetX = 0;
  var lerpFactor = 0.05;
  var currentHighlighterX = 0;
  var targetHighlighterX = 0;
  var currentHighlighterWidth = 0;
  var targetHighlighterWidth = 0;
  var isMenuOpen = false;
  var isMenuAnimating = false;
  var menuLinks = document.querySelectorAll(".menu-link a");
  menuLinks.forEach(function (link) {
    var chars = link.querySelectorAll("span");
    chars.forEach(function (char, charIndex) {
      var split = new SplitText_1.SplitText(char, { type: "chars" });
      split.chars.forEach(function (char) {
        char.classList.add("char");
      });
      if (charIndex === 1) {
        gsap_1.gsap.set(split.chars, { y: "110%" });
      }
    });
  });
  gsap_1.gsap.set(menuContent, { y: "50%", opacity: 0.25 });
  gsap_1.gsap.set(menuLogo, { scale: 0.5, opacity: 0.25 });
  gsap_1.gsap.set(menuLinks, { y: "150%" });
  gsap_1.gsap.set(linkHighlighter, { y: "150%" });
  var defaultLinkText = document.querySelector(".menu-link:first-child a span");
  if (defaultLinkText) {
    var linkWidth = defaultLinkText.offsetWidth;
    linkHighlighter.style.width = linkWidth + "px";
    currentHighlighterWidth = linkWidth;
    targetHighlighterWidth = linkWidth;
    var defaultLinkTextElement = document.querySelector(
      ".menu-link:first-child",
    );
    var linkRect = defaultLinkTextElement.getBoundingClientRect();
    var menuLinksWrapperRect = menuLinksWrapper.getBoundingClientRect();
    var initialX = linkRect.left - menuLinksWrapperRect.left;
    currentHighlighterX = initialX;
    targetHighlighterX = initialX;
  }
  //   Menu toggle: open/close logic
  function toggleMenu() {
    if (isMenuAnimating) return;
    isMenuAnimating = true;
    if (!isMenuOpen) {
      gsap_1.gsap.to(container, {
        y: "-40%",
        opacity: 0.25,
        duration: 1.25,
        ease: "expo.out",
      });
      gsap_1.gsap.to(menuOverlay, {
        clipPath: "polygon(0%, 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: function () {
          gsap_1.gsap.set(container, { y: "40%" });
          gsap_1.gsap.set(".menu-link", {
            overflow: "visible",
          });
          isMenuOpen = true;
          isMenuAnimating = false;
        },
      });
      gsap_1.gsap.to(menuContent, {
        y: "0%",
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
      });
      gsap_1.gsap.to(menuLogo, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
      });
      gsap_1.gsap.to(menuLinks, {
        y: "0%",
        duration: 1.25,
        stagger: 0.1,
        delay: 0.25,
        ease: "expo.out",
      });
      gsap_1.gsap.to(linkHighlighter, {
        y: "0%",
        duration: 1,
        delay: 1,
        ease: "expo.out",
      });
    } else {
      gsap_1.gsap.to(container, {
        y: "0%",
        opacity: 1,
        duration: 1.25,
        ease: "expo.out",
      });
      gsap_1.gsap.to(menuLinks, {
        y: "-220%",
        duration: 1.25,
        ease: "expo.out",
      });
      gsap_1.gsap.to(menuContent, {
        y: "-100%",
        opacity: 0.25,
        duration: 1.25,
        ease: "expo.out",
      });
      gsap_1.gsap.to(menuLinks, {
        y: "-100%",
        opacity: 0.5,
        duration: 1.25,
        ease: "expo.out",
      });
      gsap_1.gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: function () {
          gsap_1.gsap.set(menuOverlay, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          gsap_1.gsap.set(menuLinks, {
            y: "150%",
          });
          gsap_1.gsap.set(linkHighlighter, {
            y: "150%",
          });
          gsap_1.gsap.set(menuContent, {
            y: "50%",
            opacity: 0.25,
          });
          gsap_1.gsap.set(menuLogo, {
            y: "0%",
            opacity: 0.25,
            scale: 0.5,
          });
          gsap_1.gsap.set(".menu-link", {
            overflow: "hidden",
          });
          gsap_1.gsap.set(menuLinksWrapper, { x: 0 });
          currentX = 0;
          targetX = 0;
          isMenuOpen = false;
          isMenuAnimating = false;
        },
      });
    }
  }
  navToggle.addEventListener("click", toggleMenu);
});
