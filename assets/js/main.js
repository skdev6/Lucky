(function ($) {
  "use strict";

  jQuery(function () {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

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


    let headerTopLogo = null;
    let heroWrap = $(".panel-hero");
    let textScale = .3;
    heroWrap.each(function () {
      var hero = $(this);
      var header = $(this).find(".header__area");
      var titleWrap = $(this).find(".first-title-wrapper");
      var title = $(this).find(".title-animation");
      var title2 = $(this).find(".second-title .title-animation");
      var currentFz = title.css("font-size");

      function titleAni(minimize = true) {
        if (minimize) {
          hero.addClass("sticky-header");
        } else {
          hero.removeClass("sticky-header");
        }
        gsap.to(titleWrap, {
          scale: minimize ? textScale : 1,
          ease: "expo.out",
          transformOrigin: "top 50%",
          duration: 1,
          onComplete() {
            gsap.set(hero, {
              '--ch': title[0].getBoundingClientRect().height + "px"
            });
            headerTopLogo = title[0];
          }
        })
        gsap.to(title2, {
          height: minimize ? 0 : "auto",
          ease: "expo.out",
          duration: 1
        }, "<");
      }

      ScrollTrigger.create({
        trigger: header,
        start: `top +=${header.position().top - 50}`,
        end: "top top",
        onEnter() {
          titleAni(true);
        },
        onEnterBack() {
          titleAni(false);
        }
      })

      ScrollTrigger.create({
        trigger: header,
        start: `top top`,
        end: `+=${$(".page-wrapper").height()}`,
        pin: true,
        pinSpacing: false
      })
    });
    let missionTOpTitle = null;
    $(".join-sec-wrap").each(function () {
      var panelWrap = $(this);
      var panel1 = $(this).find(".join-sec-panel1");
      var panel2 = $(this).find(".join-sec-panel2");
      var fadeOnScroll = panelWrap.find(".fade-on-scroll");
      var stickyTop = panelWrap.find(".stick-top");
      missionTOpTitle = stickyTop;
      function titleAni(minimize = true) {

        var hTOpClient = headerTopLogo.getBoundingClientRect();
        var StickyTopClient = stickyTop[0].getBoundingClientRect();

        gsap.to(stickyTop, {
          scale: minimize ? .4 : 1,
          ease: "expo.out",
          y: minimize ? (hTOpClient.y - StickyTopClient.y) + hTOpClient.height : 0,
          transformOrigin: "top 50%",
          opacity: minimize ? .5 : 1,
          duration: 1,
          onComplete() {
            gsap.set(heroWrap, {
              '--ch2': minimize ? stickyTop[0].getBoundingClientRect().height + "px" : 0
            })
          }
        });
      }
      ScrollTrigger.create({
        trigger: panel2,
        start: "top -2%",
        end: "bottom top",
        markers:true,
        onEnter() {
          titleAni(true);
          gsap.set(panelWrap, {
            "pointer-events": "none"
          })
        },
        onLeaveBack() {
          titleAni(false);
          gsap.set(panelWrap, {
            "pointer-events": ""
          })
        }
      })
      gsap.to(fadeOnScroll, {
        opacity: 0,
        scrollTrigger: {
          trigger: panel1,
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      })
      ScrollTrigger.create({
        trigger: panel1,
        start: `top top`,
        end: `+=${$(".page-wrapper").height()}`,
        pin: true,
        pinSpacing: false
      })
    })

    $(".end-mission").each(function () {
      var hero = $(this);
      function titleAni(minimize = true) {
        gsap.to(missionTOpTitle, {
          opacity: minimize ? 0 : .5
        });
        gsap.set(heroWrap, {
          '--ch2': minimize ? 0 : missionTOpTitle[0].getBoundingClientRect().height + "px"
        })
      }
      ScrollTrigger.create({
        trigger: hero,
        start: `top -5%`,
        end: "top top",
        onEnter() {
          titleAni(true);
        },
        onEnterBack() {
          titleAni(false);
        }
      })
    })
    $(".last-panel").each(function () {  
      var hero = $(this);
      function titleAni(minimize = true) {
        gsap.to(".fixed-star",
          {
            x: minimize ? "300%" : "0%",
            ease: "back.Out"
          }
        )
      }
      ScrollTrigger.create({
        trigger: hero,
        start: `top 80%`,
        end: "top top",
        onEnter() {
          titleAni(true);
        },
        onLeaveBack() {
          titleAni(false);
        }
      })
    })
    

    $(window).on("beforeunload", function () {
      $(window).scrollTop(0);
    });
  });
})(jQuery);
