document.addEventListener("DOMContentLoaded", () => {
  const t = (key, vars) => (window.wwT ? window.wwT(key, vars) : key);
  try {
    window.wwApply?.();
  } finally {
    document.documentElement.classList.remove("i18n-pending");
  }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const cleanups = [];
  // Real image requests receive a skeleton; already cached images stay immediate.
  document
    .querySelectorAll("figure > img, .hero-media picture > img")
    .forEach((image) => {
      const shell = document.createElement("div");
      shell.className = "image-shell";
      image.before(shell);
      shell.append(image);
      if (image.complete && image.naturalWidth) return;
      const skeleton = document.createElement("span");
      skeleton.className = "image-skeleton";
      skeleton.setAttribute("aria-hidden", "true");
      shell.append(skeleton);
      shell.classList.add("media-loading");
      const loaded = () => {
        shell.classList.remove("media-loading");
        skeleton.remove();
      };
      const failed = () => {
        shell.classList.remove("media-loading");
        skeleton.className = "media-error";
        skeleton.setAttribute("data-i18n", "media.unavailable");
        skeleton.textContent = t("media.unavailable");
      };
      image.addEventListener("load", loaded, { once: true });
      image.addEventListener("error", failed, { once: true });
      if (image.complete) image.naturalWidth ? loaded() : failed();
    });
  document.querySelectorAll(".video-container").forEach((container) => {
    const poster = container.querySelector(".video-poster");
    const frame = container.querySelector("iframe[data-src]");
    const loader = container.querySelector(".embed-loading");
    if (!poster || !frame || !loader) return;
    let slowTimer;
    const finish = () => {
      clearTimeout(slowTimer);
      loader.hidden = true;
    };
    poster.addEventListener(
      "click",
      () => {
        poster.hidden = true;
        loader.hidden = false;
        frame.hidden = false;
        // Register after activation so the initial about:blank load cannot consume it.
        frame.addEventListener("load", finish, { once: true });
        frame.addEventListener(
          "error",
          () => {
            clearTimeout(slowTimer);
            const message = loader.querySelector("p");
            message.setAttribute("data-i18n", "media.videoError");
            message.textContent = t("media.videoError");
            loader.querySelector(".orb-loader").hidden = true;
            loader.querySelector(".embed-fallback").hidden = false;
          },
          { once: true },
        );
        slowTimer = setTimeout(() => {
          loader.querySelector(".embed-fallback").hidden = false;
        }, 12000);
        frame.src =
          frame.dataset.src +
          (frame.dataset.src.includes("?") ? "&" : "?") +
          "autoplay=1";
      },
      { once: true },
    );
    cleanups.push(() => clearTimeout(slowTimer));
  });
  const themeButton = document.querySelector(".theme-toggle");
  const currentTheme = () =>
    document.documentElement.dataset.theme ||
    (systemDark.matches ? "dark" : "light");
  const updateThemeLabel = () => {
    if (!themeButton) return;
    const theme = currentTheme();
    const label = t(theme === "dark" ? "nav.themeToLight" : "nav.themeToDark");
    themeButton.dataset.theme = theme;
    themeButton.querySelector(".sr-only").textContent = label;
    themeButton.setAttribute("aria-label", label);
    themeButton.setAttribute("title", label);
    themeButton.setAttribute("aria-pressed", String(theme === "dark"));
  };
  updateThemeLabel();
  systemDark.addEventListener("change", updateThemeLabel);
  themeButton?.addEventListener("click", () => {
    document.documentElement.dataset.theme =
      currentTheme() === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("ww_theme", document.documentElement.dataset.theme);
    } catch (_) {}
    updateThemeLabel();
  });

  const navContainer = document.querySelector(".nav-container");
  const menuButton = document.querySelector(".hamburger-btn");
  const menu = document.querySelector(".main-nav");
  const menuBackground = Array.from(
    document.querySelectorAll("main, footer, .back-to-top, .skip-link"),
  );
  const previousInert = new Map();
  const setMenu = (open) => {
    if (!navContainer || !menuButton) return;
    navContainer.classList.toggle("nav-open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? t("nav.close") : t("nav.open"),
    );
    if (open) {
      menuBackground.forEach((element) => {
        previousInert.set(element, element.inert);
        element.inert = true;
      });
    } else {
      previousInert.forEach((inert, element) => {
        element.inert = inert;
      });
      previousInert.clear();
    }
  };
  const closeMenu = () => {
    setMenu(false);
  };
  menuButton?.addEventListener("click", () => {
    const open = !navContainer.classList.contains("nav-open");
    setMenu(open);
    if (open) menu?.querySelector("a")?.focus();
  });
  document.querySelectorAll("[data-set-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      window.wwSetLang?.(button.getAttribute("data-set-lang"));
    });
  });
  document.addEventListener("ww:lang", () => {
    updateThemeLabel();
    if (!menuButton) return;
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-label", open ? t("nav.close") : t("nav.open"));
  });
  document.addEventListener("click", (event) => {
    if (!navContainer?.contains(event.target)) closeMenu();
  });
  menu
    ?.querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (!navContainer?.classList.contains("nav-open")) return;
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    } else if (event.key === "Tab") {
      const targets = Array.from(
        navContainer.querySelectorAll("a, button"),
      ).filter(
        (element) => !element.disabled && element.getClientRects().length,
      );
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  const menuMedia = window.matchMedia("(min-width: 1200px)");
  menuMedia.addEventListener("change", closeMenu);
  const topButton = document.querySelector(".back-to-top");
  const topObserver = new IntersectionObserver(
    (entries) => {
      if (topButton) topButton.hidden = entries[0].isIntersecting;
    },
    { rootMargin: "100px 0px 0px" },
  );
  const hero = document.querySelector(".cinematic-hero, .booking-hero");
  if (hero) topObserver.observe(hero);
  topButton?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduced.matches ? "instant" : "smooth",
    });
    document.querySelector(".logo")?.focus({ preventScroll: true });
  });

  // Galleries work with native scrolling before GSAP enhances desktop displays.
  const galleries = Array.from(document.querySelectorAll("[data-gallery]")).map(
    (section) => {
      const viewport = section.querySelector(".gallery-viewport");
      const track = section.querySelector(".gallery-track");
      const slides = Array.from(section.querySelectorAll(".gallery-slide"));
      const prev = section.querySelector(".gallery-prev");
      const next = section.querySelector(".gallery-next");
      const count = section.querySelector(".gallery-count");
      const state = {
        section,
        viewport,
        track,
        slides,
        index: 0,
        trigger: null,
      };
      const update = (index) => {
        state.index = Math.max(0, Math.min(slides.length - 1, index));
        count.textContent = state.index + 1 + " / " + slides.length;
        prev.disabled = state.index === 0;
        next.disabled = state.index === slides.length - 1;
      };
      state.update = update;
      const go = (index) => {
        index = Math.max(0, Math.min(slides.length - 1, index));
        if (state.trigger) {
          const distance = Math.max(
            1,
            track.scrollWidth - viewport.clientWidth,
          );
          const offset = Math.min(
            distance,
            slides[index].offsetLeft - slides[0].offsetLeft,
          );
          const y =
            state.trigger.start +
            (offset / distance) * (state.trigger.end - state.trigger.start);
          window.scrollTo({ top: y, behavior: "instant" });
        } else {
          viewport.scrollTo({
            left: slides[index].offsetLeft - slides[0].offsetLeft,
            behavior: reduced.matches ? "instant" : "smooth",
          });
        }
        update(index);
      };
      prev.addEventListener("click", () => go(state.index - 1));
      next.addEventListener("click", () => go(state.index + 1));
      viewport.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          go(state.index + (event.key === "ArrowRight" ? 1 : -1));
        }
      });
      const observer = new IntersectionObserver(
        (entries) => {
          if (state.trigger) return;
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          if (visible[0]) update(slides.indexOf(visible[0].target));
        },
        { root: viewport, threshold: [0.5, 0.75] },
      );
      slides.forEach((slide) => observer.observe(slide));
      cleanups.push(() => observer.disconnect());
      update(0);
      return state;
    },
  );

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    const journey = document.querySelector("[data-journey]");
    // The larger camera travel makes the photograph move distinctly behind the title.
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (hero?.classList.contains("attraction-hero")) {
        gsap.fromTo(
          hero.querySelector(".hero-media img"),
          {
            scale: 1.42,
            yPercent: () => (window.innerWidth < 1024 ? -14 : -15),
          },
          {
            scale: () => (window.innerWidth < 1024 ? 1.36 : 1.32),
            yPercent: () => (window.innerWidth < 1024 ? 14 : 13),
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top+=64",
              end: "bottom top",
              scrub: 0.55,
              invalidateOnRefresh: true,
            },
          },
        );
        gsap.from(hero.querySelector(".hero-content"), {
          y: 25,
          duration: 0.85,
          ease: "power2.out",
          clearProps: "transform,opacity",
        });
        gsap.to(hero.querySelector("h1"), {
          y: -48,
          ease: "none",
          scrollTrigger: {
            trigger: hero,
            start: "top top+=64",
            end: "bottom top",
            scrub: 0.55,
          },
        });
      }
      document
        .querySelectorAll(".plan-section > figure, .booking-hero > figure")
        .forEach((frame) => {
          gsap.fromTo(
            frame.querySelector("img"),
            { scale: 1.2, yPercent: 7 },
            {
              scale: 1.2,
              yPercent: -7,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
        });
      const reveals = document.querySelectorAll(
        ".section-intro h2, .travel-notes h2, .plan-copy, .guide-story h2, .gallery-toolbar h2, .more-destinations h2",
      );
      reveals.forEach((element) =>
        gsap.from(element, {
          y: 28,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
          clearProps: "transform,opacity",
        }),
      );
      document
        .querySelectorAll(
          ".guide-story h3, .info-box, .notes-grid > div, .related-list > a",
        )
        .forEach((element) => {
          gsap.from(element, {
            y: 30,
            opacity: 0.4,
            duration: 0.85,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 94%", once: true },
            clearProps: "transform,opacity",
          });
        });
      document.querySelectorAll(".fact-list").forEach((list) => {
        gsap.from(list.children, {
          y: 16,
          opacity: 0.4,
          duration: 0.7,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: list, start: "top 94%", once: true },
        });
      });
    });
    media.add(
      "(max-width: 1023px) and (prefers-reduced-motion: no-preference), (max-height: 699px) and (prefers-reduced-motion: no-preference)",
      () => {
        const progressElements = [];
        document.querySelectorAll(".guide-facts").forEach((facts) => {
          const progress = document.createElement("span");
          progress.className = "reading-progress";
          progress.setAttribute("aria-hidden", "true");
          facts.append(progress);
          gsap.to(progress, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: facts.closest(".guide-layout"),
              start: "top top+=64",
              end: "bottom bottom",
              scrub: 0.3,
            },
          });
          progressElements.push(progress);
        });
        if (hero?.classList.contains("home-hero"))
          gsap.fromTo(
            hero.querySelector(".hero-media img"),
            { scale: 1.24, yPercent: 8 },
            {
              scale: 1.2,
              yPercent: -8,
              ease: "none",
              scrollTrigger: {
                trigger: hero,
                start: "top top",
                end: "bottom top",
                scrub: 0.55,
              },
            },
          );
        journey?.querySelectorAll(".journey-panel").forEach((panel) => {
          const frame = panel.querySelector(".journey-photo");
          gsap.fromTo(
            frame.querySelector("img"),
            { scale: 1.22, yPercent: 9 },
            {
              scale: 1.22,
              yPercent: -9,
              ease: "none",
              scrollTrigger: {
                trigger: frame,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.55,
              },
            },
          );
          gsap.from(panel.querySelector(".journey-copy"), {
            y: 42,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: { trigger: panel, start: "top 88%", once: true },
            clearProps: "transform",
          });
        });
        galleries.forEach(({ section, viewport, slides }) => {
          slides.forEach((slide) => {
            const image = slide.querySelector("img");
            gsap.fromTo(
              image,
              { scale: 1.18, yPercent: 6 },
              {
                scale: 1.18,
                yPercent: -6,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.55,
                },
              },
            );
            gsap.fromTo(
              image,
              { xPercent: 4 },
              {
                xPercent: -4,
                ease: "none",
                scrollTrigger: {
                  trigger: slide,
                  scroller: viewport,
                  horizontal: true,
                  start: "left right",
                  end: "right left",
                  scrub: 0.4,
                },
              },
            );
          });
        });
        return () => progressElements.forEach((progress) => progress.remove());
      },
    );
    // Pin the outer frame; animate only its contents. Small screens remain native.
    media.add(
      "(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
      () => {
        let journeyTimeline;
        const onTab = [];
        if (hero?.classList.contains("home-hero")) {
          hero.classList.add("has-cinema");
          const frame = hero.querySelector(".hero-media");
          const photograph = frame.querySelector("img");
          const copy = hero.querySelector(".hero-content");
          // Start the photo just below the actual copy, rather than leaving a viewport-sized gap.
          const aperture = () => {
            const height = hero.clientHeight;
            const top = Math.min(copy.offsetHeight + 16, height - 240);
            const photoHeight = height - top - 24;
            return {
              scaleX: 0.96,
              scaleY: photoHeight / height,
              y: top + photoHeight / 2 - height / 2,
            };
          };
          const initial = aperture();
          gsap.set(frame, initial);
          gsap.set(photograph, {
            scaleX: 1 / initial.scaleX,
            scaleY: 1 / initial.scaleY,
          });
          // Inverse transforms keep the photograph undistorted as its aperture opens.
          const expansion = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top+=64",
              end: () => "+=" + window.innerHeight * 0.8,
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          expansion
            .fromTo(
              frame,
              {
                scaleX: 0.96,
                scaleY: () => aperture().scaleY,
                y: () => aperture().y,
              },
              {
                scaleX: 1,
                scaleY: 1,
                y: 0,
                duration: 1,
                ease: "none",
                onUpdate: () =>
                  gsap.set(photograph, {
                    scaleX: 1 / Number(gsap.getProperty(frame, "scaleX")),
                    scaleY: 1 / Number(gsap.getProperty(frame, "scaleY")),
                  }),
              },
              0,
            )
            .to(
              copy,
              { y: -65, autoAlpha: 0, duration: 0.3, ease: "none" },
              0.06,
            )
            .to({}, { duration: 0.16 });
        }
        if (journey) {
          const panels = Array.from(journey.querySelectorAll(".journey-panel"));
          const controls = journey.querySelector(".journey-controls");
          const buttons = Array.from(controls.querySelectorAll("button"));
          journey.classList.add("is-pinned");
          controls.hidden = false;
          let active = -1;
          const setActive = (index) => {
            if (active === index) return;
            active = index;
            panels.forEach((panel, i) => {
              panel.inert = i !== index;
              panel.setAttribute("aria-hidden", String(i !== index));
            });
            buttons.forEach((button, i) =>
              button.setAttribute("aria-pressed", String(i === index)),
            );
          };
          gsap.set(panels, { zIndex: (i) => i });
          gsap.set(panels.slice(1), { yPercent: 100 });
          setActive(0);
          journeyTimeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: journey,
              start: "top top",
              end: () => "+=" + window.innerHeight * 2.4,
              pin: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
            onUpdate: () =>
              setActive(
                Math.max(
                  0,
                  Math.min(
                    3,
                    Math.floor((journeyTimeline.time() - 0.15) / 1.35),
                  ),
                ),
              ),
          });
          panels.forEach((panel, i) => {
            if (i === 0) return;
            const position = i * 1.35 - 0.55;
            journeyTimeline
              .to(
                panels[i - 1].querySelector("img"),
                { scale: 1.12, yPercent: -5, duration: 0.8 },
                position,
              )
              .fromTo(
                panel.querySelector(".journey-copy"),
                { y: 60 },
                { y: 0, duration: 0.7 },
                position + 0.15,
              )
              .fromTo(
                panel.querySelector("img"),
                { scale: 1.14 },
                { scale: 1, duration: 1 },
                position,
              )
              .to(
                panel,
                { yPercent: 0, duration: 0.8, ease: "power1.inOut" },
                position,
              );
          });
          // Hold the last destination so its guide link remains comfortable to use.
          journeyTimeline.to({}, { duration: 0.3 });
          buttons.forEach((button, i) => {
            const handler = () => {
              const st = journeyTimeline.scrollTrigger;
              const time = i === 0 ? 0 : i * 1.35 + 0.3;
              window.scrollTo({
                top:
                  st.start +
                  (time / journeyTimeline.duration()) * (st.end - st.start) +
                  1,
                behavior: "instant",
              });
            };
            button.addEventListener("click", handler);
            onTab.push(() => button.removeEventListener("click", handler));
          });
          // Keyboard navigation to a guide follows the panel actually being displayed.
          journey.addEventListener("focusin", focusScene);
          function focusScene(event) {
            const panel = event.target.closest(".journey-panel");
            if (!panel) return;
            const i = panels.indexOf(panel);
            const st = journeyTimeline.scrollTrigger;
            if (i !== active)
              window.scrollTo({
                top:
                  st.start +
                  ((i === 0 ? 0 : i * 1.35 + 0.3) /
                    journeyTimeline.duration()) *
                    (st.end - st.start),
                behavior: "instant",
              });
          }
          onTab.push(() => journey.removeEventListener("focusin", focusScene));
        }

        galleries.forEach((state) => {
          const { section, track, viewport, slides } = state;
          viewport.scrollLeft = 0;
          section.classList.add("is-pinned");
          const cameras = slides.map((slide) => {
            const image = slide.querySelector("img");
            gsap.set(image, { scale: 1.14 });
            return { slide, move: gsap.quickSetter(image, "xPercent") };
          });
          const tween = gsap.to(track, {
            x: () => -(track.scrollWidth - viewport.clientWidth),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top+=64",
              end: () =>
                "+=" +
                Math.max(
                  window.innerHeight * 1.5,
                  (track.scrollWidth - viewport.clientWidth) * 0.65,
                ),
              pin: true,
              scrub: 0.7,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
            onUpdate: () => {
              const x = Math.abs(Number(gsap.getProperty(track, "x")));
              let index = 0;
              for (let i = 0; i < slides.length; i++) {
                const offset = slides[i].offsetLeft - slides[0].offsetLeft;
                if (x + slides[i].clientWidth * 0.45 >= offset) index = i;
              }
              cameras.forEach(({ slide, move }) => {
                const center =
                  slide.offsetLeft -
                  slides[0].offsetLeft +
                  slide.clientWidth / 2 -
                  x;
                move(
                  gsap.utils.clamp(
                    -6,
                    6,
                    ((viewport.clientWidth / 2 - center) / slide.clientWidth) *
                      6,
                  ),
                );
              });
              state.update(index);
            },
          });
          state.trigger = tween.scrollTrigger;
        });
        return () => {
          onTab.forEach((cleanup) => cleanup());
          hero?.classList.remove("has-cinema");
          journey?.classList.remove("is-pinned");
          if (journey) {
            journey.querySelector(".journey-controls").hidden = true;
            journey.querySelectorAll(".journey-panel").forEach((panel) => {
              panel.inert = false;
              panel.removeAttribute("aria-hidden");
            });
          }
          galleries.forEach((state) => {
            state.trigger = null;
            state.section.classList.remove("is-pinned");
            state.viewport.scrollLeft = 0;
            state.update(0);
          });
        };
      },
    );
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });
    // Refreshing retained pages on browser back avoids stale pin measurements.
    window.addEventListener("pageshow", refresh);
    cleanups.push(() => {
      media.revert();
      window.removeEventListener("pageshow", refresh);
    });
  }
  cleanups.push(() => {
    topObserver.disconnect();
    systemDark.removeEventListener("change", updateThemeLabel);
    menuMedia.removeEventListener("change", closeMenu);
    closeMenu();
  });
  window.addEventListener(
    "pagehide",
    (event) => {
      if (!event.persisted) cleanups.forEach((cleanup) => cleanup());
    },
    { once: true },
  );
});
