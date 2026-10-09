document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.getElementById('search-form');
    const resultsArea = document.getElementById('results-area');
    const loadingState = document.getElementById('loading-state');
    const bookingModal = document.getElementById('booking-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const bookingForm = document.getElementById('booking-form');
    const modalSummary = document.getElementById('modal-flight-summary');
    const confirmDetails = document.getElementById('confirm-details');

    if (!searchForm || typeof FLIGHTS === 'undefined') return;

    let selectedFlight = null;
    let selectedFare = null;
    // Which cabin is expanded per flight id (null = collapsed)
    const expandedCabin = {};

    const CABIN_COPY = {
        Economy: {
            title: "Economy",
            description: "Travel comfortably in our Economy cabin with modern seating, complimentary meals and beverages, and the essentials you need for a pleasant journey.",
            image: "./image/cabin-economy.jpg"
        },
        "Premium Economy": {
            title: "Premium Economy",
            description: "Pamper yourself in our spacious Premium Economy cabin, with superior comfort, ample room to stretch out and a greater seat recline. Treat yourself to premium cuisine as well as complimentary wine and spirits, and enjoy access to priority airport services.",
            image: "./image/cabin-premium.jpg"
        },
        Business: {
            title: "Business Class",
            description: "Experience the difference with Business Class. Enjoy priority airport services, exclusive lounge access, exquisite in-flight cuisine, and a seamless, comfortable journey. Arrive feeling ready to take on the world.",
            image: "./image/cabin-business.jpg"
        }
    };

    const params = new URLSearchParams(window.location.search);
    const preselect = params.get('to');
    if (preselect) {
        const destSelect = document.getElementById('destination');
        if (destSelect) destSelect.value = preselect;
    }

    function formatPrice(amount) {
        return 'HK$' + amount.toLocaleString('en-HK');
    }

    function formatDate(dateStr) {
        const d = new Date(dateStr + 'T00:00:00');
        return d.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    function waitFor(ms) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
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
        if (!fare || !copy) return '';

        const benefits = (fare.benefits || [])
            .map(function (b) {
                const icon = b.ok ? '✓' : '–';
                const cls = b.ok ? 'benefit-ok' : 'benefit-fee';
                return (
                    '<li class="' +
                    cls +
                    '"><span class="benefit-icon">' +
                    icon +
                    '</span>' +
                    b.text +
                    '</li>'
                );
            })
            .join('');

        return (
            '<div class="fare-expand">' +
                '<div class="fare-expand-left">' +
                    '<h4>' + copy.title + '</h4>' +
                    '<p>' + copy.description + '</p>' +
                '<div class="fare-expand-image">' +
                    '<img src="' + copy.image + '" alt="' + copy.title + ' cabin">' +
                '</div>' +
            '</div>' +
            '<div class="fare-expand-right">' +
                '<div class="fare-expand-brand">' +
                    '<span class="fare-cabin-label">' + fare.cabin +
                    '</span>' +
                    '<strong>' + fare.brand + '</strong>' +
                    '<div class="fare-detail-price">' +
                        formatPrice(fare.price) +
                    '</div>' +
                '</div>' +
                '<ul class="fare-benefits">' + benefits + '</ul>' +
                '<button type="button" class="btn-select-fare" data-book-flight="' +
                    flight.id + '" data-book-cabin="' + fare.cabin +
                '">Select</button>' +
                '</div>' +
            '</div>'
        );
    }

    function renderClassCell(flight, cabin) {
        const fare = getFare(flight, cabin);
        const isOpen = expandedCabin[flight.id] === cabin;
        if (!fare) {
            return (
                '<div class="class-cell is-unavailable">' +
                    '<span class="class-cell-label">' + cabin +
                    '</span>' +
                    '<span class="class-unavailable">Unavailable</span>' +
                '</div>'
            );
        }
        return (
            '<button type="button" class="class-cell' +
            (isOpen ? ' is-selected' : '') +
            '" data-toggle-cabin="' +
            cabin +
            '" data-flight="' +
            flight.id +
            '">' +
            '<span class="class-cell-label">' +
            cabin +
            '</span>' +
            '<span class="class-cell-price">' +
            formatPrice(fare.price) +
            '</span>' +
            (isOpen ? '<span class="class-cell-hint">Selected</span>' : '<span class="class-cell-hint">View fare</span>') +
            '</button>'
        );
    }

    function renderFlightCard(flight) {
        const openCabin = expandedCabin[flight.id] || null;
        const expandHtml = openCabin ? renderExpandedPanel(flight, openCabin) : '';

        return (
            '<article class="ac-flight-card' +
            (openCabin ? ' is-expanded' : '') +
            '" data-flight-id="' +
            flight.id +
            '">' +
            '<div class="ac-flight-row">' +
            '<div class="ac-route-col">' +
            '<div class="ac-airline-line">' +
            '<strong>' +
            flight.airline +
            '</strong>' +
            '<span class="ac-flight-code">' +
            flight.id +
            '</span>' +
            '</div>' +
            '<div class="ac-timeline">' +
            '<div class="ac-time-col">' +
            '<span class="ac-time">' +
            flight.departTime +
            '</span>' +
            '<span class="ac-code">' +
            flight.from +
            '</span>' +
            '</div>' +
            '<div class="ac-mid">' +
            '<span class="ac-stops">' +
            flight.stops +
            ' · ' +
            flight.duration +
            '</span>' +
            '<div class="ac-line"><span class="ac-dot"></span></div>' +
            '<span class="ac-date-under">' +
            formatDate(flight.departDate) +
            '</span>' +
            '</div>' +
            '<div class="ac-time-col ac-time-end">' +
            '<span class="ac-time">' +
            flight.arriveTime +
            '</span>' +
            '<span class="ac-code">' +
            flight.to +
            '</span>' +
            '</div>' +
            '</div>' +
            '<p class="ac-operated">Operated by ' +
            flight.airline +
            '</p>' +
            '</div>' +
            renderClassCell(flight, 'Economy') +
            renderClassCell(flight, 'Premium Economy') +
            renderClassCell(flight, 'Business') +
            '</div>' +
            (expandHtml
                ? '<div class="ac-expand-wrap">' + expandHtml + '</div>'
                : '') +
            '</article>'
        );
    }

    function renderResults(flights) {
        if (!flights.length) {
            resultsArea.innerHTML =
                '<div class="no-results">' +
                    '<h3>No flights found</h3>' +
                    '<p>Try another date or clear the date filter to see more options.</p>' +
                '</div>';
            return;
        }

        resultsArea.innerHTML =
            '<div class="results-header">' +
                '<h3>' + flights.length + ' flight' + (flights.length > 1 ? 's' : '') + ' found</h3>' +
                '<p>Fares are per person, one way, and include all taxes, fees and charges.</p>' +
            '</div>' +
            '<div class="flight-list-head">' +
                '<span class="head-route">Flight</span>' +
                '<span class="flight-class">Economy</span>' +
                '<span class="flight-class">Premium Economy</span>' +
                '<span class="flight-class">Business</span>' +
                '</div>' +
            '<div class="flight-list">' +
                flights.map(renderFlightCard).join('') +
            '</div>';
    }

    function refreshFlightCard(flightId) {
        const flight = FLIGHTS.find(function (f) {
            return f.id === flightId;
        });
        const card = resultsArea.querySelector('[data-flight-id="' + flightId + '"]');
        if (!flight || !card) return;
        const temp = document.createElement('div');
        temp.innerHTML = renderFlightCard(flight);
        card.replaceWith(temp.firstElementChild);
    }

    searchForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const destination = document.getElementById('destination').value;
        const date = document.getElementById('depart-date').value;

        if (!destination) {
            resultsArea.innerHTML =
                '<p class="results-placeholder">Please select a destination first.</p>';
            return;
        }

        // Reset expanded states on new search
        Object.keys(expandedCabin).forEach(function (k) {
            delete expandedCabin[k];
        });

        resultsArea.innerHTML = '';
        loadingState.classList.remove('hidden');

        // mimic delay for API call
        await waitFor(2000 + Math.floor(Math.random() * 2000));

        const results = searchFlights(destination, date);
        loadingState.classList.add('hidden');
        renderResults(results);
        resultsArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    resultsArea.addEventListener('click', function (e) {
        const cell = e.target.closest('[data-toggle-cabin]');
        if (cell) {
            const flightId = cell.getAttribute('data-flight');
            const cabin = cell.getAttribute('data-toggle-cabin');
            // Toggle: same cabin collapses; different cabin switches
            if (expandedCabin[flightId] === cabin) {
                expandedCabin[flightId] = null;
            } else {
                expandedCabin[flightId] = cabin;
            }
            refreshFlightCard(flightId);
            return;
        }

        const selectBtn = e.target.closest('[data-book-flight]');
        if (!selectBtn) return;

        const flightId = selectBtn.getAttribute('data-book-flight');
        const cabin = selectBtn.getAttribute('data-book-cabin');
        selectedFlight = FLIGHTS.find(function (f) {
            return f.id === flightId;
        });
        selectedFare = selectedFlight ? getFare(selectedFlight, cabin) : null;
        if (!selectedFlight || !selectedFare) return;

        modalSummary.innerHTML =
            '<strong>' +
            selectedFlight.airline +
            '</strong> · ' +
            selectedFlight.id +
            '<br>' +
            selectedFlight.fromCity +
            ' (' +
            selectedFlight.from +
            ') → ' +
            selectedFlight.toCity +
            ' (' +
            selectedFlight.to +
            ')<br>' +
            formatDate(selectedFlight.departDate) +
            ' · ' +
            selectedFlight.departTime +
            ' – ' +
            selectedFlight.arriveTime +
            '<br>' +
            selectedFare.cabin +
            ' · ' +
            selectedFare.brand +
            '<br><span class="price">' +
            formatPrice(selectedFare.price) +
            '</span> / person';

        bookingForm.reset();
        bookingModal.classList.remove('hidden');
        bookingModal.setAttribute('aria-hidden', 'false');
    });

    function closeBookingModal() {
        bookingModal.classList.add('hidden');
        bookingModal.setAttribute('aria-hidden', 'true');
    }

    function closeConfirmModal() {
        confirmModal.classList.add('hidden');
        confirmModal.setAttribute('aria-hidden', 'true');
    }

    bookingModal.querySelectorAll('[data-close-modal]').forEach(function (el) {
        el.addEventListener('click', closeBookingModal);
    });
    confirmModal.querySelectorAll('[data-close-confirm]').forEach(function (el) {
        el.addEventListener('click', closeConfirmModal);
    });

    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!selectedFlight || !selectedFare) return;

        const name = document.getElementById('passenger-name').value.trim();
        const email = document.getElementById('passenger-email').value.trim();
        const pax = Number(document.getElementById('passengers').value) || 1;
        const phone = document.getElementById('passenger-phone').value.trim();
        const total = selectedFare.price * pax;
        const ref = 'WW' + Date.now().toString().slice(-8);

        try {
            const existing = JSON.parse(localStorage.getItem('ww_bookings') || '[]');
            existing.push({
                ref: ref,
                flight: selectedFlight,
                fare: selectedFare,
                name: name,
                email: email,
                phone: phone,
                passengers: pax,
                total: total,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('ww_bookings', JSON.stringify(existing));
        } catch (err) { /* ignore */ }

        closeBookingModal();
        confirmDetails.innerHTML =
            '<p><strong>Reference:</strong> ' +
            ref +
            '</p>' +
            '<p><strong>Passenger:</strong> ' +
            name +
            '</p>' +
            '<p><strong>Email:</strong> ' +
            email +
            '</p>' +
            '<p><strong>Flight:</strong> ' +
            selectedFlight.airline +
            ' ' +
            selectedFlight.id +
            '</p>' +
            '<p><strong>Route:</strong> ' +
            selectedFlight.from +
            ' → ' +
            selectedFlight.to +
            '</p>' +
            '<p><strong>Date:</strong> ' +
            formatDate(selectedFlight.departDate) +
            '</p>' +
            '<p><strong>Cabin:</strong> ' +
            selectedFare.cabin +
            ' · ' +
            selectedFare.brand +
            '</p>' +
            '<p><strong>Passengers:</strong> ' +
            pax +
            '</p>' +
            '<p><strong>Total:</strong> <span class="price">' +
            formatPrice(total) +
            '</span></p>';

        confirmModal.classList.remove('hidden');
        confirmModal.setAttribute('aria-hidden', 'false');
    });
});
