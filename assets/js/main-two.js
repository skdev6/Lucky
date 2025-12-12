(function ($) {
  "use strict";

  jQuery(function () {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

    // smooth scroll full section
    if ($(".panel-wrapper").length > 0) {
      const panels = gsap.utils.toArray(".panel");
      let currentIndex = 0;
      let animating = false;

      function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);
        panels.forEach((panel) => {
          panel.style.height = `${window.innerHeight}px`;
        });
      }
      setVH();
      window.addEventListener("resize", setVH);
      window.addEventListener("orientationchange", setVH);
      function scrollToPanel(index) {
        if (index < 0) index = 0;
        if (index >= panels.length) index = panels.length - 1;
        animating = true;

        gsap.to(window, {
          scrollTo: { y: index * window.innerHeight },
          duration: 1.5,
          ease: "power2.out",
          onComplete: () => (animating = false),
        });

        currentIndex = index;
      }

      Observer.create({
        target: window,
        type: "touch,wheel",
        wheelSpeed: -1,
        preventDefault: true,
        onWheel: (self) => {
          if (animating) return;
          if (self.deltaY > 0) scrollToPanel(currentIndex - 1);
          else scrollToPanel(currentIndex + 1);
        },
        onChangeY: (self) => {
          if (animating) return;
          if (self.deltaY > 0) scrollToPanel(currentIndex - 1);
          else if (self.deltaY < 0) scrollToPanel(currentIndex + 1);
        },
      });

      gsap.set(window, { scrollTo: 0 });
    }

    // pannel hero
    if ($(".panel-hero").length > 0) {
      const firstTitle = document.querySelector(".first-title");
      const secondTitle = document.querySelector(".second-title");
      let offset =
        window.innerWidth < 992
          ? window.innerHeight * 0.4
          : window.innerHeight * 0.25;
      let targetScale = window.innerWidth < 992 ? 0.5 : 0.2;

      ScrollTrigger.create({
        trigger: ".panel-hero",
        start: `top -${offset}px`,
        endTrigger: ".df",
        end: "top top",
        pin: ".panel-hero .panel__inner",
        pinSpacing: false,
        scrub: 1.5,
        onEnter: () => {
          gsap.to(firstTitle, {
            scale: targetScale,
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });
          gsap.to(secondTitle, {
            scale: 0.2,
            opacity: 0,
            y: "-100%",
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(firstTitle, {
            scale: 1,
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });
          gsap.to(secondTitle, {
            scale: 1,
            opacity: 1,
            y: "0%",
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });
        },
        markers: false,
      });

      document.fonts.ready.then(() => {
        let firstSplit = new SplitText(firstTitle, { type: "words" });
        let secondSplit = new SplitText(secondTitle, { type: "words" });

        gsap.set([firstTitle, secondTitle], {
          opacity: 1,
          visibility: "visible",
        });
        gsap.set([firstSplit.words, secondSplit.words], {
          opacity: 0,
          scale: 1,
        });

        let tl = gsap.timeline({});

        tl.to(firstSplit.words, {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
        }).to(
          secondSplit.words,
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.2,
          },
          "-=0.2"
        );
      });
    }

    if ($(".panel-three").length > 0) {
      const firstTitle = document.querySelector(".stick-top");

      let offset =
        window.innerWidth < 992
          ? window.innerHeight * 0.4
          : window.innerHeight * 0.32;
      let targetScale = window.innerWidth < 992 ? 0.5 : 0.2;

      ScrollTrigger.create({
        trigger: ".panel-three",
        start: `top -${offset}px`,
        endTrigger: ".rcd",
        end: "top top",
        pin: ".panel-three .panel__inner",
        pinSpacing: false,
        scrub: 1.5,
        onEnter: () => {
          gsap.to(firstTitle, {
            scale: targetScale,
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(firstTitle, {
            scale: 1,
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });
        },
        markers: false,
      });
    }

    if ($(".sticky-line").length > 0) {
      document.fonts.ready.then(() => {
        const stickyLines = gsap.utils.toArray(".sticky-line");

        stickyLines.forEach((lineBlock) => {
          const lines = lineBlock.querySelectorAll(".s-line-animation");
          if (lines.length) {
            gsap.set(lines, { opacity: 0, y: 20, visibility: "visible" });

            let tl = gsap.timeline({
              scrollTrigger: {
                trigger: lineBlock,
                start: "top 80%",
                end: "bottom top",
                toggleActions: "play none none none",
                markers: false,
              },
              delay: 0.3,
            });

            lines.forEach((line, index) => {
              tl.to(
                line,
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                index * 0.45
              );
            });
          }
        });
      });
    }

    if ($(".sticky-line-c").length > 0) {
      document.fonts.ready.then(() => {
        const stickyLines = gsap.utils.toArray(".sticky-line-c");

        stickyLines.forEach((lineBlock) => {
          const lines = lineBlock.querySelectorAll(".s-line-animation");
          if (lines.length) {
            gsap.set(lines, { opacity: 0, y: 20, visibility: "visible" });
            let tl = gsap.timeline({
              scrollTrigger: {
                trigger: lineBlock,
                start: "top 92%",
                end: "bottom top",
                toggleActions: "play none none none",
                markers: false,
              },
              delay: 0.3,
            });
            lines.forEach((line, index) => {
              tl.to(
                line,
                { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
                index * 0.45
              );
            });
          }
        });
      });
    }

    // panel six
    if ($(".panel-six").length > 0) {
      ScrollTrigger.create({
        trigger: ".panel-six",
        start: "top center",
        onEnter: () => gsap.to(".drf", { autoAlpha: 0, duration: 3 }),
        onLeaveBack: () => gsap.to(".drf", { autoAlpha: 1, duration: 3 }),
      });

      const drf = document.querySelector(".drf");
      const lastPanel = document.querySelector("#lastPanel");

      drf.addEventListener("click", (e) => {
        e.preventDefault();

        gsap.to(window, {
          scrollTo: lastPanel,
          duration: 3,
          ease: "power3.out",
        });
      });
    }

    // Reset scroll on reload
    $(window).on("beforeunload", function () {
      $(window).scrollTop(0);
    });
  });

  if ($(".shimmer-chars").length > 0) {
    document.addEventListener("DOMContentLoaded", function () {
      const el = document.querySelector(".shimmer-chars");
      const text = el.innerText;

      el.innerHTML = text
        .split("")
        .map((char) =>
          char === " "
            ? `<span class="char space">&nbsp;</span>`
            : `<span class="char">${char}</span>`
        )
        .join("");

      const chars = el.querySelectorAll(".char");

      let index = 0;
      const groupSize = 4;
      const speed = 140;
      const resetDelay = 0;
      let resting = false;

      function shimmerStep() {
        if (resting) return;

        chars.forEach((c) => c.classList.remove("active"));

        for (let i = 0; i < groupSize; i++) {
          chars[(index + i) % chars.length].classList.add("active");
        }

        index++;

        if (index >= chars.length) {
          resting = true;

          setTimeout(() => {
            index = 0;
            resting = false;
          }, resetDelay);
        }
      }

      setInterval(shimmerStep, speed);
    });
  }
})(jQuery);
