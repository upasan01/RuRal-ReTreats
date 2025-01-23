document.addEventListener("DOMContentLoaded", () => {
    /* ============================ FILTER FUNCTIONALITY ============================ */
    const locationFilter = document.getElementById("locationFilter");
    const priceFilter = document.getElementById("priceFilter");
    const currentPriceDisplay = document.getElementById("currentPrice");
    const bedroomFilter = document.getElementById("bedroomFilter");
    const ratingFilter = document.getElementById("ratingFilter");
    const availabilityFilter = document.getElementById("availabilityFilter");
    const sortByFilter = document.getElementById("sortBy");
    const applyFiltersButton = document.getElementById("applyFilters");
    const homestayCards = document.querySelectorAll(".homestay-card");

    priceFilter.addEventListener("input", () => {
        currentPriceDisplay.textContent = `₹${priceFilter.value}`;
    });

    applyFiltersButton.addEventListener("click", () => {
        const selectedLocation = locationFilter.value.toLowerCase();
        const selectedPrice = parseInt(priceFilter.value, 10);
        const selectedBedrooms = bedroomFilter.value;
        const selectedRating = parseFloat(ratingFilter.value) || 0;
        const selectedAvailability = availabilityFilter.value.toLowerCase();
        const sortBy = sortByFilter.value;

        const filteredCards = Array.from(homestayCards).filter((card) => {
            const cardLocation = card.getAttribute("data-location").toLowerCase();
            const cardPrice = parseInt(card.getAttribute("data-price"), 10);
            const cardBedrooms = card.getAttribute("data-bedrooms");
            const cardRating = parseFloat(card.getAttribute("data-rating"));
            const cardAvailability = card.getAttribute("data-status").toLowerCase();

            let isVisible = true;

            if (selectedLocation !== "all" && cardLocation !== selectedLocation) isVisible = false;
            if (cardPrice > selectedPrice) isVisible = false;
            if (selectedBedrooms !== "all" && cardBedrooms !== selectedBedrooms) isVisible = false;
            if (selectedRating > 0 && cardRating < selectedRating) isVisible = false;
            if (selectedAvailability !== "all" && cardAvailability !== selectedAvailability) isVisible = false;

            return isVisible;
        });

        homestayCards.forEach((card) => {
            card.style.display = filteredCards.includes(card) ? "" : "none";
        });

        sortCards(sortBy, filteredCards);
    });

    function sortCards(sortBy, cardsToSort) {
        const cardContainer = document.querySelector(".card-container");

        if (sortBy === "priceLowHigh") {
            cardsToSort.sort((a, b) => a.getAttribute("data-price") - b.getAttribute("data-price"));
        } else if (sortBy === "priceHighLow") {
            cardsToSort.sort((a, b) => b.getAttribute("data-price") - a.getAttribute("data-price"));
        } else if (sortBy === "ratingsHighLow") {
            cardsToSort.sort((a, b) => b.getAttribute("data-rating") - a.getAttribute("data-rating"));
        }

        cardsToSort.forEach((card) => cardContainer.appendChild(card));
    }

    /* ============================ PRICE CALCULATOR ============================ */
    const checkInDate = document.getElementById("checkInDate");
    const checkOutDate = document.getElementById("checkOutDate");
    const guestCount = document.getElementById("guestCount");
    const roomType = document.getElementById("roomType");
    const priceDisplay = document.getElementById("priceDisplay");
    const calculatePriceBtn = document.getElementById("calculatePriceBtn");

    calculatePriceBtn.addEventListener("click", () => {
        const checkIn = new Date(checkInDate.value);
        const checkOut = new Date(checkOutDate.value);
        const guests = parseInt(guestCount.value, 10) || 0;
        const room = roomType.value;

        if (!checkIn || !checkOut || !room) {
            alert("Please fill in all required fields to calculate the price.");
            return;
        }

        const days = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
        if (days <= 0) {
            alert("Check-Out date must be later than Check-In date.");
            return;
        }

        const roomPrices = {
            single: 2000,
            double: 3000,
            suite: 5000,
            villa: 8000,
        };

        const basePrice = roomPrices[room] || 0;
        const totalPrice = basePrice * days + guests * 500;

        priceDisplay.textContent = `₹${totalPrice}`;
    });

    /* ============================ GOOGLE MAP RENDERING ============================ */
    const mapLocationFilter = document.getElementById("mapLocationFilter");
    const mapPriceFilter = document.getElementById("mapPriceFilter");
    const mapFilterApply = document.getElementById("mapFilterApply");
    const map = new google.maps.Map(document.getElementById("mapContainer"), {
        center: { lat: 20.5937, lng: 78.9629 },
        zoom: 5,
    });
    const locations = [
        { name: "Traditional Haveli in Rajasthan", lat: 27.0238, lng: 74.2176, price: 2500, location: "Rajasthan" },
        { name: "Cozy Cottage in Kerala", lat: 10.8505, lng: 76.2711, price: 1800, location: "Kerala" },
        { name: "Mountain Retreat in Himachal", lat: 31.1048, lng: 77.1734, price: 2200, location: "Himachal Pradesh" },
        { name: "Spacious Villa in Uttarakhand", lat: 30.0668, lng: 79.0193, price: 3000, location: "Uttarakhand" },
        { name: "Heritage Home in Tamil Nadu", lat: 11.1271, lng: 78.6569, price: 2800, location: "Tamil Nadu" },
        { name: "Charming Cottage in Madhya Pradesh", lat: 22.9734, lng: 78.6569, price: 1500, location: "Madhya Pradesh" },
    ];

    const markers = [];
    const renderMarkers = (filteredLocations) => {
        markers.forEach((marker) => marker.setMap(null));
        markers.length = 0;

        filteredLocations.forEach((loc) => {
            const marker = new google.maps.Marker({
                position: { lat: loc.lat, lng: loc.lng },
                map: map,
                title: loc.name,
            });

            const infoWindow = new google.maps.InfoWindow({
                content: `<h3>${loc.name}</h3><p>Price: ₹${loc.price}/Day</p>`,
            });

            marker.addListener("click", () => infoWindow.open(map, marker));
            markers.push(marker);
        });
    };

    renderMarkers(locations);

    mapFilterApply.addEventListener("click", () => {
        const selectedLocation = mapLocationFilter.value;
        const selectedPrice = mapPriceFilter.value;

        const filteredLocations = locations.filter((loc) => {
            const matchesLocation = selectedLocation === "all" || loc.location === selectedLocation;
            const matchesPrice = selectedPrice === "all" || loc.price <= parseInt(selectedPrice, 10);
            return matchesLocation && matchesPrice;
        });

        renderMarkers(filteredLocations);
    });

    /* ============================ BOOKING CONFIRMATION MODAL ============================ */
    const bookingForm = document.getElementById('bookingForm');
    const bookingConfirmationModal = document.getElementById('bookingConfirmationModal');
    const closeConfirmationModal = document.getElementById('closeConfirmationModal');
    const confirmBookingBtn = document.getElementById('confirmBookingBtn');
    const confirmationMessage = document.getElementById('confirmationMessage');
    const rebookingPrompt = document.getElementById('rebookingPrompt');
    const bookingReferenceNumber = document.getElementById('bookingReferenceNumber');

    bookingForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const checkInDate = document.getElementById('checkInDate').value;
        const checkOutDate = document.getElementById('checkOutDate').value;
        const guestCount = document.getElementById('guestCount').value;
        const roomType = document.getElementById('roomType').value;
        const specialRequests = document.getElementById('specialRequests').value;
        const totalCost = document.getElementById('priceDisplay').textContent;
        const selectedLocation = document.getElementById('selectedLocation').value;

        document.getElementById('confirmselectedLocation').textContent = selectedLocation;
        document.getElementById('confirmCheckInDate').textContent = checkInDate;
        document.getElementById('confirmCheckOutDate').textContent = checkOutDate;
        document.getElementById('confirmGuestCount').textContent = guestCount;
        document.getElementById('confirmRoomType').textContent = roomType;
        document.getElementById('confirmSpecialRequests').textContent = specialRequests;
        document.getElementById('confirmTotalCost').textContent = totalCost;

        bookingConfirmationModal.style.display = 'flex';
    });

    closeConfirmationModal.addEventListener('click', () => {
        bookingConfirmationModal.style.display = 'none';
    });

    confirmBookingBtn.addEventListener('click', () => {
        const referenceNumber = Math.floor(Math.random() * 1000000);
        bookingReferenceNumber.textContent = referenceNumber;

        confirmationMessage.style.display = 'block';

        setTimeout(() => {
            confirmationMessage.style.display = 'none';
            rebookingPrompt.style.display = 'block';
        }, 4000);
    });

    document.getElementById('yesRebookBtn').addEventListener('click', () => {
        bookingConfirmationModal.style.display = 'none';
        bookingForm.reset();
    });

    document.getElementById('noRebookBtn').addEventListener('click', () => {
        rebookingPrompt.style.display = 'none';
    });

    /* ============================ BACK TO TOP BUTTON ============================ */
    const backToTopBtn = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

/* ============================ CHAT BUTTON ============================ */
    const chatButton = document.getElementById("chatButton");
    chatButton.addEventListener("click", () => {
        alert("Chat feature is under construction. Coming soon!");
    });
    
    /* ============================ WISHLIST TOGGLE ============================ */
    document.querySelectorAll(".add-to-wishlist-btn").forEach((button) => {
        button.addEventListener("click", () => {
            button.classList.toggle("active");
            const icon = button.querySelector("i");
            icon.classList.toggle("far");
            icon.classList.toggle("fas");
        });
    });
});

    /* ============================ TESTIMONIAL CAROUSAL SECTION ============================ */

    const testimonials = [
        {
            text: "This was one of the most comfortable stays I've ever had. Highly recommend this homestay!",
            name: "Sohini Sinha",
            rating: "⭐⭐⭐⭐⭐"
        },
        {
            text: "An unforgettable experience! The hospitality was exceptional and the location perfect.",
            name: "Shreyoshi Chatterjee",
            rating: "⭐⭐⭐⭐⭐"
        },
        {
            text: "A home away from home. The amenities were top-notch and the staff was incredibly friendly.",
            name: "Ananya Mondal",
            rating: "⭐⭐⭐⭐⭐"
        },
        {
            text: "I loved every moment of my stay. The views were breathtaking and the service was impeccable.",
            name: "Snigdha Layek",
            rating: "⭐⭐⭐⭐⭐"
        }
    ];
    
    let currentIndex = 0;
    
    function displayTestimonials() {
        const testimonialElements = document.querySelectorAll('.testimonial');
        testimonialElements.forEach((element, index) => {
            element.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
        });
    }
    
    document.querySelector('.next-btn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        displayTestimonials();
    });
    
    document.querySelector('.prev-btn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        displayTestimonials();
    });
    
    document.querySelector('.write-review-btn').addEventListener('click', () => {
        const reviewText = prompt("Please enter your review:");
        const reviewerName = prompt("Please enter your name:");
        const newTestimonial = {
            text: reviewText,
            name: reviewerName,
            rating: "⭐⭐⭐⭐⭐"
        };
        testimonials.push(newTestimonial);
        displayTestimonials();
    });
    