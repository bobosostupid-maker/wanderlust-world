document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  const resultsArea = document.getElementById("results-area");
  const loadingState = document.getElementById("loading-state");
  const bookingModal = document.getElementById("booking-modal");
  const confirmModal = document.getElementById("confirm-modal");
  const bookingForm = document.getElementById("booking-form");
  const modalSummary = document.getElementById("modal-flight-summary");
  const confirmDetails = document.getElementById("confirm-details");
  const bookingProgress = document.getElementById("booking-progress");
  const modalTitle = document.getElementById("modal-title");

  if (!searchForm || typeof FLIGHTS === "undefined") return;

  let selectedFlight = null;
  let selectedFare = null;
  let returnFocus = null;
  let bookingAttempt = 0;
  let isBooking = false;
  let lastFlights = null;
  let bookingPhase = "form";
  let progressKey = "booking.creating";
  let loadingStage = null;
  let confirmState = null;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const background = document.querySelectorAll(
    ".site-header, .booking-hero, .booking-panel, footer, .back-to-top",
  );
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[character];
    });
  }
  function t(key, vars) {
    return window.wwT ? window.wwT(key, vars) : key;
  }
  function label(group, value) {
    const key = group + "." + value;
    const translated = t(key);
    return translated === key ? value : translated;
  }
  function durationLabel(value) {
    if (document.documentElement.lang !== "zh-HK") return value;
    return String(value).replace(/(\d+)h\s*(\d+)m/, "$1小時$2分");
  }
  function cabinTitle(cabin) {
    if (cabin === "Business") return label("cabin", "Business Class");
    return label("cabin", cabin);
  }
  function setModalState(modal, open) {
    modal.classList.toggle("hidden", !open);
    modal.setAttribute("aria-hidden", String(!open));
    const anyOpen =
      !bookingModal.classList.contains("hidden") ||
      !confirmModal.classList.contains("hidden");
    background.forEach(function (element) {
      element.inert = anyOpen;
    });
    document.body.classList.toggle("dialog-open", anyOpen);
    if (open) {
      modal.querySelector("input, button").focus();
      animateIn(modal.querySelector(".modal-panel"), { y: 28, scale: 0.97 });
    } else if (!anyOpen && returnFocus && returnFocus.isConnected)
      returnFocus.focus({ preventScroll: true });
  }
  // Which cabin is expanded per flight id (null = collapsed)
  const expandedCabin = {};

  const CABIN_COPY = {
    Economy: {
      title: "Economy",
      description:
        "Travel comfortably in our Economy cabin with modern seating, complimentary meals and beverages, and the essentials you need for a pleasant journey.",
      image: "./image/optimized/cabin-economy.webp",
    },
    "Premium Economy": {
      title: "Premium Economy",
      description:
        "Pamper yourself in our spacious Premium Economy cabin, with superior comfort, ample room to stretch out and a greater seat recline. Treat yourself to premium cuisine as well as complimentary wine and spirits, and enjoy access to priority airport services.",
      image: "./image/optimized/cabin-premium.webp",
    },
    Business: {
      title: "Business Class",
      description:
        "Experience the difference with Business Class. Enjoy priority airport services, exclusive lounge access, exquisite in-flight cuisine, and a seamless, comfortable journey. Arrive feeling ready to take on the world.",
      image: "./image/optimized/cabin-business.webp",
    },
  };

  const params = new URLSearchParams(window.location.search);
  const preselect = params.get("to");
  if (preselect) {
    const destSelect = document.getElementById("destination");
    if (destSelect) destSelect.value = preselect;
  }

  function formatPrice(amount) {
    return "HK$" + amount.toLocaleString("en-HK");
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    const locale = document.documentElement.lang === "zh-HK" ? "zh-HK" : "en-HK";
    return d.toLocaleDateString(locale, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function waitFor(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function animateIn(elements, from = { y: 24 }) {
    if (!window.gsap || reducedMotion.matches) return;
    gsap.fromTo(
      elements,
      { ...from, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.09,
        ease: "power3.out",
        clearProps: "transform,opacity",
        overwrite: true,
      },
    );
  }

  function routeMarkup(flight) {
    return `<div class="itinerary-route">
      <div><strong>${flight.from}</strong><span>${escapeHtml(label("city", flight.fromCity))}</span></div>
      <span class="itinerary-path" aria-hidden="true"><i></i></span>
      <div><strong>${flight.to}</strong><span>${escapeHtml(label("city", flight.toCity))}</span></div>
    </div>`;
  }

  function getFare(flight, cabin) {
    return (flight.fares || []).find(function (f) {
      return f.cabin === cabin;
    });
  }

  function searchFlights(destination, date) {
    return FLIGHTS.filter(function (f) {
      if (destination && f.destination !== destination) return false;
      if (date && f.departDate !== date) return false;
      return true;
    });
  }

  function renderExpandedPanel(flight, cabin) {
    const fare = getFare(flight, cabin);
    const copy = CABIN_COPY[cabin];
    if (!fare || !copy) return "";

    const benefits = (fare.benefits || [])
      .map(function (b) {
        const icon = b.ok ? "✓" : "-";
        const cls = b.ok ? "benefit-ok" : "benefit-fee";
        return (
          '<li class="' +
          cls +
          '"><span class="benefit-icon">' +
          icon +
          "</span>" +
          escapeHtml(label("benefit", b.text)) +
          "</li>"
        );
      })
      .join("");

    return (
      '<div class="fare-expand" id="fare-' +
      flight.id +
      '">' +
      '<div class="fare-expand-left">' +
      "<h4>" +
      escapeHtml(cabinTitle(cabin)) +
      "</h4>" +
      "<p>" +
      escapeHtml(label("cabin.desc", cabin)) +
      "</p>" +
      '<div class="fare-expand-image">' +
      '<img src="' +
      copy.image +
      '" alt="' +
      escapeHtml(t("booking.cabinAlt", { title: cabinTitle(cabin) })) +
      '">' +
      "</div>" +
      "</div>" +
      '<div class="fare-expand-right">' +
      '<div class="fare-expand-brand">' +
      '<span class="fare-cabin-label">' +
      escapeHtml(label("cabin", fare.cabin)) +
      "</span>" +
      "<strong>" +
      fare.brand +
      "</strong>" +
      '<div class="fare-detail-price">' +
      formatPrice(fare.price) +
      "</div>" +
      "</div>" +
      '<ul class="fare-benefits">' +
      benefits +
      "</ul>" +
      '<button type="button" class="btn-select-fare" data-book-flight="' +
      flight.id +
      '" data-book-cabin="' +
      fare.cabin +
      '">' +
      escapeHtml(t("booking.select")) +
      "</button>" +
      "</div>" +
      "</div>"
    );
  }

  function renderClassCell(flight, cabin) {
    const fare = getFare(flight, cabin);
    const isOpen = expandedCabin[flight.id] === cabin;
    if (!fare) {
      return (
        '<div class="class-cell is-unavailable">' +
        '<span class="class-cell-label">' +
        escapeHtml(label("cabin", cabin)) +
        "</span>" +
        '<span class="class-unavailable">' +
        escapeHtml(t("booking.unavailable")) +
        "</span>" +
        "</div>"
      );
    }
    return (
      '<button type="button" class="class-cell' +
      (isOpen ? " is-selected" : "") +
      '" data-toggle-cabin="' +
      cabin +
      '" data-flight="' +
      flight.id +
      '" aria-expanded="' +
      isOpen +
      '"' +
      (isOpen ? ' aria-controls="fare-' + flight.id + '"' : "") +
      ">" +
      '<span class="class-cell-label">' +
      escapeHtml(label("cabin", cabin)) +
      "</span>" +
      '<span class="class-cell-price">' +
      formatPrice(fare.price) +
      "</span>" +
      (isOpen
        ? '<span class="class-cell-hint">' + escapeHtml(t("booking.selected")) + "</span>"
        : '<span class="class-cell-hint">' + escapeHtml(t("booking.viewFare")) + "</span>") +
      "</button>"
    );
  }

  function renderFlightCard(flight) {
    const openCabin = expandedCabin[flight.id] || null;
    const expandHtml = openCabin ? renderExpandedPanel(flight, openCabin) : "";

    return (
      '<article class="ac-flight-card' +
      (openCabin ? " is-expanded" : "") +
      '" data-flight-id="' +
      flight.id +
      '">' +
      '<div class="ac-flight-row">' +
      '<div class="ac-route-col">' +
      '<div class="ac-airline-line">' +
      "<strong>" +
      escapeHtml(label("airline", flight.airline)) +
      "</strong>" +
      '<span class="ac-flight-code">' +
      flight.id +
      "</span>" +
      "</div>" +
      '<div class="ac-timeline">' +
      '<div class="ac-time-col">' +
      '<span class="ac-time">' +
      flight.departTime +
      "</span>" +
      '<span class="ac-code">' +
      flight.from +
      "</span>" +
      "</div>" +
      '<div class="ac-mid">' +
      '<span class="ac-stops">' +
      escapeHtml(label("stops", flight.stops)) +
      " · " +
      escapeHtml(durationLabel(flight.duration)) +
      "</span>" +
      '<div class="ac-line"><span class="ac-dot"></span></div>' +
      '<span class="ac-date-under">' +
      formatDate(flight.departDate) +
      "</span>" +
      "</div>" +
      '<div class="ac-time-col ac-time-end">' +
      '<span class="ac-time">' +
      flight.arriveTime +
      "</span>" +
      '<span class="ac-code">' +
      flight.to +
      "</span>" +
      "</div>" +
      "</div>" +
      '<p class="ac-operated">' +
      escapeHtml(t("booking.operatedBy", { airline: label("airline", flight.airline) })) +
      "</p>" +
      "</div>" +
      renderClassCell(flight, "Economy") +
      renderClassCell(flight, "Premium Economy") +
      renderClassCell(flight, "Business") +
      "</div>" +
      (expandHtml
        ? '<div class="ac-expand-wrap">' + expandHtml + "</div>"
        : "") +
      "</article>"
    );
  }

  function renderResults(flights) {
    if (!flights.length) {
      resultsArea.innerHTML =
        '<div class="no-results">' +
        "<h3>" +
        escapeHtml(t("booking.noneTitle")) +
        "</h3>" +
        "<p>" +
        escapeHtml(t("booking.noneBody")) +
        "</p>" +
        "</div>";
      return;
    }

    resultsArea.innerHTML =
      '<div class="results-header">' +
      "<h3>" +
      escapeHtml(
        t(flights.length > 1 ? "booking.foundMany" : "booking.foundOne", {
          n: flights.length,
        }),
      ) +
      "</h3>" +
      "<p>" +
      escapeHtml(t("booking.faresNote")) +
      "</p>" +
      "</div>" +
      '<div class="flight-list-head">' +
      '<span class="head-route">' +
      escapeHtml(t("booking.flight")) +
      "</span>" +
      '<span class="flight-class">' +
      escapeHtml(label("cabin", "Economy")) +
      "</span>" +
      '<span class="flight-class">' +
      escapeHtml(label("cabin", "Premium Economy")) +
      "</span>" +
      '<span class="flight-class">' +
      escapeHtml(label("cabin", "Business")) +
      "</span>" +
      "</div>" +
      '<div class="flight-list">' +
      flights.map(renderFlightCard).join("") +
      "</div>";
    animateIn(resultsArea.querySelectorAll(".ac-flight-card"));
  }

  function refreshFlightCard(flightId) {
    const flight = FLIGHTS.find(function (f) {
      return f.id === flightId;
    });
    const card = resultsArea.querySelector(
      '[data-flight-id="' + flightId + '"]',
    );
    if (!flight || !card) return;
    const focusCabin = card.contains(document.activeElement)
      ? document.activeElement.getAttribute("data-toggle-cabin")
      : null;
    const temp = document.createElement("div");
    temp.innerHTML = renderFlightCard(flight);
    card.replaceWith(temp.firstElementChild);
    if (focusCabin)
      resultsArea
        .querySelector(
          '[data-flight="' +
            flightId +
            '"][data-toggle-cabin="' +
            focusCabin +
            '"]',
        )
        .focus({ preventScroll: true });
    const expanded = resultsArea.querySelector(
      '[data-flight-id="' + flightId + '"] .fare-expand',
    );
    if (expanded) animateIn(expanded, { y: 16 });
  }

  function fillSummary() {
    if (!selectedFlight || !selectedFare) return;
    const airline = label("airline", selectedFlight.airline);
    modalSummary.innerHTML =
      routeMarkup(selectedFlight) +
      `
      <p class="itinerary-meta">${escapeHtml(airline)} · ${selectedFlight.id}<br>
      ${formatDate(selectedFlight.departDate)} · ${selectedFlight.departTime} - ${selectedFlight.arriveTime}</p>
      <div class="itinerary-cabin"><span>${escapeHtml(label("cabin", selectedFare.cabin))} · ${escapeHtml(selectedFare.brand)}</span>
      <span><strong>${formatPrice(selectedFare.price)}</strong> ${escapeHtml(t("booking.perPerson"))}</span></div>`;
  }

  function renderConfirmation(state) {
    const airline = label("airline", state.flight.airline);
    const who = t(state.pax === 1 ? "booking.traveler" : "booking.travelers");
    confirmDetails.innerHTML =
      routeMarkup(state.flight) +
      `
      <p class="itinerary-meta">${escapeHtml(airline)} · ${state.flight.id}<br>
      ${formatDate(state.flight.departDate)} · ${state.flight.departTime} - ${state.flight.arriveTime}</p>
      <dl class="confirmation-details">
        <div><dt>${escapeHtml(t("booking.passenger"))}</dt><dd>${escapeHtml(state.name)}</dd></div>
        <div><dt>${escapeHtml(t("booking.passengers"))}</dt><dd>${state.pax}</dd></div>
        <div class="confirmation-email"><dt>${escapeHtml(t("booking.email"))}</dt><dd>${escapeHtml(state.email)}</dd></div>
        <div><dt>${escapeHtml(t("booking.cabin"))}</dt><dd>${escapeHtml(label("cabin", state.fare.cabin))}</dd></div>
        <div><dt>${escapeHtml(t("booking.fare"))}</dt><dd>${escapeHtml(state.fare.brand)}</dd></div>
      </dl>
      <div class="confirmation-total"><span>${escapeHtml(t("booking.total", { n: state.pax, who: who }))}</span>
      <strong>${formatPrice(state.total)}</strong></div>
      <div class="confirmation-reference"><span>${escapeHtml(t("booking.reference"))}</span><strong>${escapeHtml(state.ref)}</strong></div>`;
  }

  searchForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const searchButton = searchForm.querySelector('button[type="submit"]');
    if (searchButton.disabled) return;
    const destination = document.getElementById("destination").value;
    const date = document.getElementById("depart-date").value;

    if (!destination) {
      lastFlights = null;
      resultsArea.innerHTML =
        '<p class="results-placeholder" data-i18n="booking.needDestination">' +
        escapeHtml(t("booking.needDestination")) +
        "</p>";
      return;
    }

    // Reset expanded states on new search
    Object.keys(expandedCabin).forEach(function (k) {
      delete expandedCabin[k];
    });

    lastFlights = null;
    resultsArea.innerHTML = "";
    loadingState.classList.remove("hidden");
    searchButton.disabled = true;
    searchButton.textContent = t("booking.searching");
    resultsArea.setAttribute("aria-busy", "true");
    loadingState.scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
      block: "start",
    });

    // Deliberate, visible simulation: no external flight or booking API is called.
    const stages = [
      ["searching", "booking.stage1Title", "booking.stage1Caption"],
      ["connecting", "booking.stage2Title", "booking.stage2Caption"],
      ["solving", "booking.stage3Title", "booking.stage3Caption"],
    ];
    for (const [index, [state, titleKey, captionKey]] of stages.entries()) {
      loadingStage = { title: titleKey, caption: captionKey };
      loadingState.querySelector(".orb-loader").dataset.orbState = state;
      loadingState.querySelector(".loading-title").textContent = t(titleKey);
      loadingState.querySelector(".loading-caption").textContent = t(captionKey);
      loadingState.querySelector(".loading-step").textContent =
        `${index + 1} / ${stages.length}`;
      await waitFor(1600);
    }

    const results = searchFlights(destination, date);
    loadingStage = null;
    loadingState.classList.add("hidden");
    searchButton.disabled = false;
    searchButton.textContent = t("booking.search");
    resultsArea.setAttribute("aria-busy", "false");
    lastFlights = results;
    renderResults(results);
    resultsArea.scrollIntoView({
      behavior: reducedMotion.matches ? "instant" : "smooth",
      block: "start",
    });
  });

  resultsArea.addEventListener("click", function (e) {
    const cell = e.target.closest("[data-toggle-cabin]");
    if (cell) {
      const flightId = cell.getAttribute("data-flight");
      const cabin = cell.getAttribute("data-toggle-cabin");
      // Toggle: same cabin collapses; different cabin switches
      if (expandedCabin[flightId] === cabin) {
        expandedCabin[flightId] = null;
      } else {
        expandedCabin[flightId] = cabin;
      }
      refreshFlightCard(flightId);
      return;
    }

    const selectBtn = e.target.closest("[data-book-flight]");
    if (!selectBtn) return;

    const flightId = selectBtn.getAttribute("data-book-flight");
    const cabin = selectBtn.getAttribute("data-book-cabin");
    selectedFlight = FLIGHTS.find(function (f) {
      return f.id === flightId;
    });
    selectedFare = selectedFlight ? getFare(selectedFlight, cabin) : null;
    if (!selectedFlight || !selectedFare) return;

    bookingPhase = "form";
    fillSummary();

    bookingForm.reset();
    returnFocus = selectBtn;
    setModalState(bookingModal, true);
  });

  function closeBookingModal() {
    bookingAttempt++;
    isBooking = false;
    bookingProgress.classList.add("hidden");
    bookingForm.classList.remove("hidden");
    modalSummary.classList.remove("hidden");
    bookingPhase = "form";
    modalTitle.textContent = t("booking.modalTitle");
    bookingModal.querySelector(".modal-panel").removeAttribute("aria-busy");
    setModalState(bookingModal, false);
  }

  function closeConfirmModal() {
    setModalState(confirmModal, false);
  }

  bookingModal.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", closeBookingModal);
  });
  confirmModal.querySelectorAll("[data-close-confirm]").forEach(function (el) {
    el.addEventListener("click", closeConfirmModal);
  });

  bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!selectedFlight || !selectedFare || isBooking) return;
    isBooking = true;
    const attempt = ++bookingAttempt;
    const flight = selectedFlight;
    const fare = selectedFare;

    const name = document.getElementById("passenger-name").value.trim();
    const email = document.getElementById("passenger-email").value.trim();
    const pax = Number(document.getElementById("passengers").value) || 1;
    const phone = document.getElementById("passenger-phone").value.trim();
    const total = fare.price * pax;
    const ref = "WW" + Date.now().toString().slice(-8);

    bookingForm.classList.add("hidden");
    modalSummary.classList.add("hidden");
    bookingProgress.classList.remove("hidden");
    bookingPhase = "progress";
    modalTitle.textContent = t("booking.preparing");
    bookingModal
      .querySelector(".modal-panel")
      .setAttribute("aria-busy", "true");
    bookingModal.querySelector(".modal-close").focus();
    for (const [state, titleKey] of [
      ["composing", "booking.creating"],
      ["weaving", "booking.savingFlight"],
      ["shaping", "booking.shaping"],
    ]) {
      progressKey = titleKey;
      bookingProgress.querySelector(".orb-loader").dataset.orbState = state;
      bookingProgress.querySelector(".progress-title").textContent = t(titleKey);
      await waitFor(1200);
      // Closing the dialog cancels the pending simulation, including its write.
      if (attempt !== bookingAttempt) return;
    }

    try {
      const existing = JSON.parse(localStorage.getItem("ww_bookings") || "[]");
      existing.push({
        ref: ref,
        flight: flight,
        fare: fare,
        name: name,
        email: email,
        phone: phone,
        passengers: pax,
        total: total,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("ww_bookings", JSON.stringify(existing));
    } catch (err) {
      /* ignore */
    }

    closeBookingModal();
    confirmState = {
      flight: flight,
      fare: fare,
      name: name,
      email: email,
      pax: pax,
      total: total,
      ref: ref,
    };
    renderConfirmation(confirmState);

    setModalState(confirmModal, true);
    animateIn(confirmModal.querySelector(".confirm-icon"), {
      y: 0,
      scale: 0.6,
    });
  });
  document.addEventListener("ww:lang", function () {
    const searchButton = searchForm.querySelector('button[type="submit"]');
    if (searchButton) {
      searchButton.textContent = searchButton.disabled
        ? t("booking.searching")
        : t("booking.search");
    }
    if (loadingStage && !loadingState.classList.contains("hidden")) {
      loadingState.querySelector(".loading-title").textContent = t(loadingStage.title);
      loadingState.querySelector(".loading-caption").textContent = t(loadingStage.caption);
    }
    if (lastFlights) renderResults(lastFlights);
    if (bookingPhase === "progress") {
      modalTitle.textContent = t("booking.preparing");
      const progressTitle = bookingProgress.querySelector(".progress-title");
      if (progressTitle) progressTitle.textContent = t(progressKey);
    }
    if (
      bookingPhase === "form" &&
      selectedFlight &&
      selectedFare &&
      !bookingModal.classList.contains("hidden")
    ) {
      fillSummary();
    }
    if (confirmState && !confirmModal.classList.contains("hidden")) {
      renderConfirmation(confirmState);
    }
  });
  document.addEventListener("keydown", function (event) {
    const modal = !confirmModal.classList.contains("hidden")
      ? confirmModal
      : !bookingModal.classList.contains("hidden")
        ? bookingModal
        : null;
    if (!modal) return;
    if (event.key === "Escape") {
      event.preventDefault();
      modal === bookingModal ? closeBookingModal() : closeConfirmModal();
    }
    if (event.key === "Tab") {
      const controls = Array.from(
        modal.querySelectorAll("button, input, select, a[href]"),
      ).filter(function (element) {
        return !element.disabled && element.offsetParent !== null;
      });
      const first = controls[0],
        last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
});
