(function ($) {
  "use strict";

	function initAll(){
		console.log("init");
		
		gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

		function addRotationAni(el){
			gsap.set(el, { transformOrigin: "50% 50%" });

			return gsap.timeline({
				repeat: -1,
				defaults: {
					duration:3,
					ease: "none"
				}
			})
				.to(el, { rotation:"+=90", xPercent:-10, yPercent:-8 })
				.to(el, { rotation:"+=90", xPercent:-2,  yPercent:8 })
				.to(el, { rotation:"+=90", xPercent:10,  yPercent:0 })
				.to(el, { rotation:"+=90", xPercent:0,   yPercent:0 });
		}
		
		
		let rightCircleAni = addRotationAni(".drf img");


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
				if (animating || modalOpen) return; // âœ… block scroll if modal active
				if (self.deltaY > 0) scrollToPanel(currentIndex - 1);
				else scrollToPanel(currentIndex + 1);
			  },
			  onChangeY: (self) => {
				if (animating || modalOpen) return; // âœ… block scroll if modal active
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
			let modalOpened = false;
			let popupArea = null;
			function openModal(){
				modalOpened = true; 
				popupArea = $lastPanel.clone();
				popupArea.removeClass("panel");
				popupArea.addClass("popup-sec");
				$("body").append(popupArea);
				gsap.fromTo(
					popupArea,
					{ opacity: 0 },
					{ opacity: 1, duration: 0.6, ease: "power2.out" }
				);
				rightCircleAni.pause();
			}
			function closeModal() {
				if(!modalOpened) return;
				modalOpened = false; 
				gsap.to(popupArea, {
					opacity: 0,
					duration: 0.3,
					ease: "power2.in",
					onComplete: () => {
						popupArea.remove();
					},
				});
				rightCircleAni.play();
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
			$(".drf img").on("click", function () {
				if(!modalOpened){
					openModal();
				}else{
					closeModal();
				}
			});
		}


		let headerTopLogo = null;
		let heroWrap = $(".panel-hero");
		let textScale = window.innerWidth > 991 ? .2 : .65;
		heroWrap.each(function () {
			var hero = $(this);
			var header = $(this).find(".header__area");
			var titleWrap = $(this).find(".first-title-wrapper");
			var title = $(this).find(".title-animation");
			var title2 = $(this).find(".second-title .title-animation");
			var currentFz = title.css("font-size");
			let oldUni = 0;
			// 	  let {words} = new SplitText(title, { type: "words" });
			gsap.set([...title.toArray(), $(".drf")[0]], {
				opacity:0,y:20
			})
			gsap.to([...title.toArray(), $(".drf")[0]], {
				opacity:1,y:0, stagger:.2
			})
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
						gsap.set([hero[0], $("body")[0]], {
							'--ch': minimize ? title[0].getBoundingClientRect().height + "px" : 0+"px"
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

			if(window.innerWidth > 991){
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
				});
			}else{
				ScrollTrigger.create({
					trigger: hero,
					start: `top -3%`,
					end: "top top",
					onEnter() {
						titleAni(true);
					},
					onEnterBack() {
						titleAni(false);
					}
				})
			}

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
				var scaling = window.innerWidth > 991 ? .31 : .83;
				gsap.to(stickyTop, {
					scale: minimize ? scaling : 1,
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
					rightCircleAni.pause();
				},
				onLeaveBack() {
					rightCircleAni.play();
				}
			})
		})
	}
	
	$(window).on("beforeunload", function () {
		$(window).scrollTop(0);
		$(window).scrollTop(0);
	});
	
	if(window.innerWidth > 991){
		initAll();
	}else{
		setTimeout(initAll, 300);
	}
	
})(jQuery);
