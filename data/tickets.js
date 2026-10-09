// Flight ticket data — each flight offers one fare brand per cabin class
const FLIGHTS = [
    // Paris
    {
        id: "AF-8801",
        airline: "Air France",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "CDG",
        toCity: "Paris",
        destination: "eiffel-tower",
        departDate: "2026-11-12",
        departTime: "23:50",
        arriveTime: "06:15",
        duration: "13h 25m",
        stops: "Non-stop",
        seats: 8,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 4580,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 6890,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 15200,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    {
        id: "CX-261",
        airline: "Cathay Pacific",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "CDG",
        toCity: "Paris",
        destination: "eiffel-tower",
        departDate: "2026-11-12",
        departTime: "12:40",
        arriveTime: "19:05",
        duration: "13h 25m",
        stops: "Non-stop",
        seats: 5,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 5120,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 7450,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 16890,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    {
        id: "AF-8803",
        airline: "Air France",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "CDG",
        toCity: "Paris",
        destination: "eiffel-tower",
        departDate: "2026-11-18",
        departTime: "23:50",
        arriveTime: "06:15",
        duration: "13h 25m",
        stops: "Non-stop",
        seats: 14,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 4390,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 6620,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 14950,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    // Rome
    {
        id: "AZ-792",
        airline: "ITA Airways",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "FCO",
        toCity: "Rome",
        destination: "colosseum",
        departDate: "2026-11-14",
        departTime: "22:30",
        arriveTime: "05:50",
        duration: "13h 20m",
        stops: "1 stop",
        seats: 11,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 3980,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 5980,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 13200,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    {
        id: "CX-739",
        airline: "Cathay Pacific",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "FCO",
        toCity: "Rome",
        destination: "colosseum",
        departDate: "2026-11-14",
        departTime: "14:20",
        arriveTime: "21:10",
        duration: "13h 50m",
        stops: "1 stop",
        seats: 7,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 4450,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 6780,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 14100,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    {
        id: "AZ-794",
        airline: "ITA Airways",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "FCO",
        toCity: "Rome",
        destination: "colosseum",
        departDate: "2026-11-20",
        departTime: "22:30",
        arriveTime: "05:50",
        duration: "13h 20m",
        stops: "1 stop",
        seats: 16,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 3750,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 5650,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 12800,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    // Lima
    {
        id: "LA-800",
        airline: "LATAM",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "LIM",
        toCity: "Lima",
        destination: "machu-picchu",
        departDate: "2026-11-15",
        departTime: "18:00",
        arriveTime: "22:40",
        duration: "22h 40m",
        stops: "1 stop",
        seats: 9,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 6200,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 8900,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 18600,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    {
        id: "CX-846",
        airline: "Cathay Pacific",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "LIM",
        toCity: "Lima",
        destination: "machu-picchu",
        departDate: "2026-11-15",
        departTime: "01:30",
        arriveTime: "08:15",
        duration: "24h 45m",
        stops: "2 stops",
        seats: 6,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 5890,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 8600,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 17900,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    {
        id: "LA-802",
        airline: "LATAM",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "LIM",
        toCity: "Lima",
        destination: "machu-picchu",
        departDate: "2026-11-22",
        departTime: "18:00",
        arriveTime: "22:40",
        duration: "22h 40m",
        stops: "1 stop",
        seats: 10,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 6450,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 9200,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 19200,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    // Delhi
    {
        id: "AI-315",
        airline: "Air India",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "DEL",
        toCity: "New Delhi",
        destination: "taj-mahal",
        departDate: "2026-11-13",
        departTime: "20:10",
        arriveTime: "00:05",
        duration: "6h 25m",
        stops: "Non-stop",
        seats: 18,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 2680,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 4200,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 9800,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    {
        id: "CX-695",
        airline: "Cathay Pacific",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "DEL",
        toCity: "New Delhi",
        destination: "taj-mahal",
        departDate: "2026-11-13",
        departTime: "08:45",
        arriveTime: "12:30",
        duration: "6h 15m",
        stops: "Non-stop",
        seats: 12,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 2950,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 4680,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 10500,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    },
    {
        id: "AI-317",
        airline: "Air India",
        from: "HKG",
        fromCity: "Hong Kong",
        to: "DEL",
        toCity: "New Delhi",
        destination: "taj-mahal",
        departDate: "2026-11-19",
        departTime: "20:10",
        arriveTime: "00:05",
        duration: "6h 25m",
        stops: "Non-stop",
        seats: 20,
        fares: [
            {
                cabin: "Economy",
                brand: "Comfort",
                price: 2490,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Standard seat" }
                ]
            },
            {
                cabin: "Premium Economy",
                brand: "Standard",
                price: 3990,
                benefits: [
                    { ok: false, text: "Changes for a fee" },
                    { ok: false, text: "Refundable for a fee" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            },
            {
                cabin: "Business",
                brand: "Latitude",
                price: 9200,
                benefits: [
                    { ok: true, text: "No change fee" },
                    { ok: true, text: "Refundable" },
                    { ok: true, text: "2 checked bags included" },
                    { ok: true, text: "Seat selection included" },
                    { ok: true, text: "Lounge access" },
                    { ok: true, text: "Priority Airport Services" }
                ]
            }
        ]
    }
];

const DESTINATIONS = {
    "eiffel-tower": { name: "Eiffel Tower", city: "Paris", airport: "CDG", country: "France" },
    "colosseum": { name: "Colosseum", city: "Rome", airport: "FCO", country: "Italy" },
    "machu-picchu": { name: "Machu Picchu", city: "Lima", airport: "LIM", country: "Peru" },
    "taj-mahal": { name: "Taj Mahal", city: "New Delhi", airport: "DEL", country: "India" }
};

const CABIN_ORDER = ["Economy", "Premium Economy", "Business"];
