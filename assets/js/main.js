(function ($) {
  "use strict";

  jQuery(function () {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

    // smooth scroll full section
    // if ($(".panel-wrapper").length > 0) {
    //   const panels = gsap.utils.toArray(".panel");
    //   let currentIndex = 0;
    //   let animating = false;

    //   function setVH() {
    //     const vh = window.innerHeight * 0.01;
    //     document.documentElement.style.setProperty("--vh", `${vh}px`);
    //     panels.forEach((panel) => {
    //       panel.style.height = `${window.innerHeight}px`;
    //     });
    //   }
    //   setVH();
    //   window.addEventListener("resize", setVH);
    //   window.addEventListener("orientationchange", setVH);
    //   function scrollToPanel(index) {
    //     if (index < 0) index = 0;
    //     if (index >= panels.length) index = panels.length - 1;
    //     animating = true;

    //     gsap.to(window, {
    //       scrollTo: { y: index * window.innerHeight },
    //       duration: 1.5,
    //       ease: "power2.out",
    //       onComplete: () => (animating = false),
    //     });

    //     currentIndex = index;
    //   }

    //   Observer.create({
    //     target: window,
    //     type: "touch,wheel",
    //     wheelSpeed: -1,
    //     preventDefault: true,
    //     onWheel: (self) => {
    //       if (animating) return;
    //       if (self.deltaY > 0) scrollToPanel(currentIndex - 1);
    //       else scrollToPanel(currentIndex + 1);
    //     },
    //     onChangeY: (self) => {
    //       if (animating) return;
    //       if (self.deltaY > 0) scrollToPanel(currentIndex - 1);
    //       else if (self.deltaY < 0) scrollToPanel(currentIndex + 1);
    //     },
    //   });

    //   gsap.set(window, { scrollTo: 0 });
    // }

    if ($(".panel-wrapper").length > 0) {
  const panels = gsap.utils.toArray(".panel");
  let currentIndex = 0;
  let animating = false;
  let modalOpen = false; // track modal globally

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

  // Full-page scroll Observer
  const panelObserver = Observer.create({
    target: window,
    type: "touch,wheel",
    wheelSpeed: -1,
    preventDefault: true,
    onWheel: (self) => {
      if (animating || modalOpen) return; // ✅ block scroll if modal active
      if (self.deltaY > 0) scrollToPanel(currentIndex - 1);
      else scrollToPanel(currentIndex + 1);
    },
    onChangeY: (self) => {
      if (animating || modalOpen) return; // ✅ block scroll if modal active
      if (self.deltaY > 0) scrollToPanel(currentIndex - 1);
      else if (self.deltaY < 0) scrollToPanel(currentIndex + 1);
    },
  });

  gsap.set(window, { scrollTo: 0 });

  // =======================
  // Modal logic
  // =======================
  const $lastPanel = $("#lastPanel");
  const $drf = $(".drf");

  $(".drf img").on("click", function () {
    if (modalOpen) return;

    modalOpen = true;
    $drf.addClass("hidden");
    $lastPanel.addClass("last-panel-active");
    $("body").css("overflow", "hidden"); // disable body scroll

    gsap.fromTo(
      $lastPanel,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  });

  function closeModal() {
    if (!modalOpen) return;

    modalOpen = false;

    gsap.to($lastPanel, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        $lastPanel.removeClass("last-panel-active");
        gsap.set($lastPanel, { opacity: 1 });
        $drf.removeClass("hidden");
        $("body").css("overflow", "visible"); // restore scroll
      },
    });
  }

  // Close modal on scroll/wheel/touchmove
  Observer.create({
    target: window,
    type: "wheel,touch",
    wheelSpeed: -1,
    preventDefault: true,
    onWheel: closeModal,
    onTouchMove: closeModal,
  });
}


    // pannel hero
    if ($(".panel-hero").length > 0) {
      const firstTitle = document.querySelector(".first-title");
      const secondTitle = document.querySelector(".second-title");
      const ftr = document.querySelector(".first-title-wrapper");
      const oc = document.querySelector(".oc");
      let offset =
        window.innerWidth < 992
          ? window.innerHeight * 0.4
          : window.innerHeight * 0.25;
      let targetScale = window.innerWidth < 992 ? 0.7 : 0.2;
      ScrollTrigger.create({
        trigger: ".panel-hero",
        start: `top -${offset}px`,
        endTrigger: ".df",
        end: "top top",
        pin: ".panel-hero .panel__inner",
        pinSpacing: false,
        scrub: 1.5,

        onEnter: () => {
          const rect = firstTitle.getBoundingClientRect();
          const currentTop = rect.top;

          const fixedOffset = window.innerWidth < 992 ? 25 : 25;

          gsap.to(firstTitle, {
            y: fixedOffset - currentTop,
            scale: targetScale,
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });

          gsap.to(secondTitle, {
            scale: 0.2,
            y: "-100%",
            transformOrigin: "top center",
            duration: 2,
            ease: "expo.out",
          });
          gsap.to(oc, {
            y: "-100%",
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });
          gsap.to(ftr, {
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });
        },

        onLeaveBack: () => {
          gsap.to(firstTitle, {
            y: 0,
            scale: 1,
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });
          gsap.to(ftr, {
            scale: 1,
            opacity: 1,
            y: "0%",
            duration: 1.5,
            ease: "expo.out",
            transformOrigin: "top center",
          });
          gsap.to(oc, {
            y: "0%",
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });

          gsap.to(secondTitle, {
            scale: 1,
            opacity: 1,
            y: "0%",
            duration: 1.5,
            ease: "expo.out",
            transformOrigin: "top center",
          });
        },
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

    // panel two
    if ($(".panel-two").length > 0) {
      document.fonts.ready.then(() => {
        const lines = gsap.utils.toArray(".line-animation");
        if (lines.length) {
          gsap.set(lines, { opacity: 0, y: 0, visibility: "visible" });
          let tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".sticky-line-wrapper",
              start: "top 80%",
              end: "bottom top",
              toggleActions: "play none none none",
              markers: false,
            },
            delay: 0.4,
          });
          lines.forEach((line, index) => {
            tl.to(
              line,
              { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
              index * 0.3
            );
          });
        }
      });
    }

    // panel three
    if ($(".cmf").length > 0) {
      const firstTitle = document.querySelector(".stick-top");
      const otherTitles = gsap.utils.toArray(
        ".cmf .text-image-fill:not(.stick-top)"
      );

      let offset =
        window.innerWidth < 992
          ? window.innerHeight * 0.4
          : window.innerHeight * 0.25;
      let targetScale = window.innerWidth < 992 ? 0.8 : 0.28;

      ScrollTrigger.create({
        trigger: ".cmf",
        start: `top -${offset}px`,
        endTrigger: ".rcd",
        end: "top top",
        pin: ".cmf.panel__inner",
        pinSpacing: false,
        scrub: 1.5,

        onEnter: () => {
          const rect = firstTitle.getBoundingClientRect();
          const currentTop = rect.top;
          const fixedOffset = window.innerWidth < 992 ? 60 : 70;

          // Animate stick-top
          gsap.to(firstTitle, {
            y: fixedOffset - currentTop,
            scale: targetScale,
            transformOrigin: "top center",
            opacity: 0.2,
            duration: 1.5,
            ease: "expo.out",
          });

          // Fade out other titles
          gsap.to(otherTitles, {
            opacity: 0,
            y: -80,
            duration: 0.7,
            ease: "expo.out",
          });
        },

        onLeaveBack: () => {
          // Reset stick-top
          gsap.to(firstTitle, {
            y: 0,
            scale: 1,
            opacity: 1,
            transformOrigin: "top center",
            duration: 1.5,
            ease: "expo.out",
          });

          // Reset other titles
          gsap.to(otherTitles, {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "expo.out",
          });
        },
      });
    }

    // panel six
if ($(".panel-six").length > 0) {
  const $lastPanel = $("#lastPanel");
  const $drf = $(".drf");
  let modalOpen = false;

  // Open modal
  $(".drf img").on("click", function () {
    if (modalOpen) return;

    modalOpen = true;
    $drf.addClass("hidden");
    $lastPanel.addClass("last-panel-active");

    // Disable body scroll while modal open
    $("body").css("overflow", "hidden");

    gsap.fromTo(
      $lastPanel,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  });

  // CLOSE MODAL on wheel or touch (mobile)
  Observer.create({
    target: window,
    type: "wheel,touch",
    wheelSpeed: -1,
    preventDefault: true,
    onWheel: closeModal,
    onTouchMove: closeModal,
  });

  function closeModal(self) {
    if (!modalOpen) return;

    modalOpen = false;

    gsap.to($lastPanel, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        $lastPanel.removeClass("last-panel-active");
        gsap.set($lastPanel, { opacity: 1 });
        $drf.removeClass("hidden");

        // Restore body scroll
        $("body").css("overflow", "visible");
      },
    });
  }

  // Keep DRF visibility for last section
  $(window).on("scroll", function () {
    if (modalOpen) return;

    if (isInLastSection()) $drf.addClass("hidden");
    else $drf.removeClass("hidden");
  });

  function isInLastSection() {
    const winTop = $(window).scrollTop();
    const lastTop = $lastPanel.offset().top;
    const lastBottom = lastTop + $lastPanel.outerHeight();
    return winTop >= lastTop - 50 && winTop < lastBottom - 50;
  }
}


    // Reset scroll on reload
    $(window).on("beforeunload", function () {
      $(window).scrollTop(0);
    });
  });
})(jQuery);
