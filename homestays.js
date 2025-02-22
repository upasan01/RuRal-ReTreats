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

   
    
     /* faq section */
     document.addEventListener("DOMContentLoaded",function(){
        const faqItems = document.querySelectorAll(".faq-item");

        faqItems.forEach(item => {
            const questions = item.querySelector(".question");
            const arrows = item.querySelector(".arrow");

            questions.addEventListener("click", function(){
                item.classList.toggle("active");
                const ans = item.querySelector(".answer");

                if(ans.style.display === "block")
                {
                    ans.style.display = "none";
                    arrows.innerHTML = "&#9662;";
                }
                else
                {
                    ans.style.display = "block";
                    arrows.innerHTML = "&#9652;";
                }
            });
        });
    });




    document.addEventListener("DOMContentLoaded", function () {

        
    
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
    
        const testimonials = document.querySelectorAll(".testimonial-item");
        let currentIndex = 0;
    
        function showTestimonial(index) {
            testimonials.forEach((testimonial, i) => {
                testimonial.classList.toggle("active", i === index);
            });
        }
    
        function changeTestimonial(direction) {
            currentIndex = (currentIndex + direction + testimonials.length) % testimonials.length;
            showTestimonial(currentIndex);
        }
    
        showTestimonial(currentIndex);
    
        document.querySelector(".button.prev").addEventListener("click", () => changeTestimonial(-1));
        document.querySelector(".button.next").addEventListener("click", () => changeTestimonial(1));
    
        const chatButton = document.getElementById("chatButton");
        const chatModal = document.getElementById("chatModal");
        const sendMessageButton = document.getElementById("sendMessage");
        const chatInput = document.getElementById("chatInput");
        const chatMessages = document.getElementById("chatMessages");
        const closeChatbot = document.querySelector(".close-chatbot");
        const voiceInputButton = document.getElementById("voiceInput");
        const clearChatButton = document.getElementById("clearChat");
        const typingIndicator = document.getElementById("typingIndicator");
    
        const categories = {
            "Website & Services": [
                "What services does this website offer?",
                "How do I register on the website?",
                "How can I contact customer support?"
            ],
            "Bus & Train Tickets": [
                "How do I book a bus or train ticket?",
                "Can I cancel or reschedule my bus/train ticket?",
                "What happens if my bus/train is delayed or canceled?",
                "How do I check my PNR status for train tickets?"
            ],
            "Homestays & Hotels": [
                "How do I find the best hotels/homestays?",
                "Can I book a hotel without advance payment?",
                "Are there any budget-friendly homestays available?",
                "What is the cancellation policy for hotels/homestays?",
                "Do hotels/homestays allow pets?"
            ],
            "Sightseeing & Tour Packages": [
                "What sightseeing packages do you offer?",
                "Can I customize my tour package?",
                "Are guides included in sightseeing packages?",
                "What are the best travel destinations in India?"
            ],
            "Travel Information & Assistance": [
                "What is the best time to visit [specific place]?",
                "Do I need a visa for an international trip?",
                "How can I check the weather at my destination?"
            ],
            "Payments & Pricing": [
                "What payment methods do you accept?",
                "How do I apply a promo code or discount?",
                "How do I get a refund if I cancel a booking?",
                "Are there EMI options available for expensive bookings?"
            ],
            "Car Rentals & Transport": [
                "How do I book a car rental?",
                "Are drivers included in car rentals?",
                "Can I modify my rental booking?"
            ],
            "Ratings & Reviews": [
                "How do I leave a rating or review?",
                "Can I see ratings before booking?"
            ],
            "Offers & Memberships": [
                "Do you offer loyalty programs?",
                "How can I stay updated on deals and offers?"
            ]
        };
        const answers = {
            "What services does this website offer?": "We offer hotel & homestay bookings, bus/train tickets, sightseeing packages, car rentals, and customized tour packages.",
            "How do I register on the website?": "Click Sign Up, enter your details, verify your email/phone, and start booking.",
            "How can I contact customer support?": "You can reach us via live chat, email (support@tourismwebsite.com), or call us at +91-XXXXXXX.",
            "How do I book a bus or train ticket?": "Select your source, destination, date, and transport type, then proceed with payment to confirm your booking.",
            "Can I cancel or reschedule my bus/train ticket?": "Yes! Go to My Bookings, select your ticket, and choose Cancel or Reschedule. Cancellation fees may apply.",
            "What happens if my bus/train is delayed or canceled?": "You’ll get real-time SMS/email updates. If it’s canceled, you can apply for a full refund or reschedule.",
            "How do I check my PNR status for train tickets?": "Enter your PNR number in our Check PNR Status section to see live updates.",
            "How do I book a car rental?": "Choose your pick-up and drop-off location, select a vehicle, and confirm your booking.",
            "Are drivers included in car rentals?": "We offer both self-drive and chauffeur-driven car rental options.",
            "Can I modify my rental booking?": "Yes! Go to My Rentals, select your booking, and modify as needed.",
            "How do I leave a rating or review?": "After your trip, go to My Bookings, select your experience, and submit a review.",
            "Can I see ratings before booking?": "Yes! Each hotel, homestay, and service displays customer ratings and reviews.",
            "Do you offer loyalty programs?": "Yes! Our Travel Rewards Program lets you earn points and redeem them for discounts.",
            "How can I stay updated on deals and offers?": "Subscribe to our newsletter or enable WhatsApp notifications for the latest deals."
        };
    
        chatButton.addEventListener("click", () => {
            chatModal.classList.add("active");
            if (!chatMessages.innerHTML.trim()) {
                appendMessage("bot", "👋 Hi there! How can I assist you today?");
                showCategories();
            }
        });
    
        closeChatbot.addEventListener("click", () => {
            appendMessage("bot", "🙏 Thank you for chatting with us. Have a great day!");
            setTimeout(() => {
                chatModal.classList.remove("active");
            }, 2000);
        });
    
        sendMessageButton.addEventListener("click", sendMessage);
        chatInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") sendMessage();
        });
    
        function sendMessage() {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;
    
            appendMessage("user", userMessage);
            chatInput.value = "";
    
            if (answers[userMessage]) {
                typingIndicator.style.display = "block";
                setTimeout(() => {
                    typingIndicator.style.display = "none";
                    appendMessage("bot", answers[userMessage]);
                }, 1000);
            } else {
                typingIndicator.style.display = "block";
                setTimeout(() => {
                    typingIndicator.style.display = "none";
                    appendMessage("bot", "🤖 Sorry, I don't have an answer for that. Try another question!");
                }, 1000);
            }
        }
    
        function showCategories() {
            const categoriesContainer = document.createElement("div");
            categoriesContainer.classList.add("options-container");
    
            Object.keys(categories).forEach((category) => {
                const button = document.createElement("button");
                button.classList.add("option-button");
                button.innerText = category;
                button.addEventListener("click", () => showQuestions(category));
                categoriesContainer.appendChild(button);
            });
    
            chatMessages.appendChild(categoriesContainer);
            scrollToBottom();
        }
    
        function showQuestions(category) {
            appendMessage("user", category);
    
            const questionsContainer = document.createElement("div");
            questionsContainer.classList.add("options-container");
    
            categories[category].forEach((question) => {
                const button = document.createElement("button");
                button.classList.add("option-button");
                button.innerText = question;
                button.addEventListener("click", () => getAnswer(question));
                questionsContainer.appendChild(button);
            });
    
            chatMessages.appendChild(questionsContainer);
            scrollToBottom();
        }
    
        function getAnswer(question) {
            appendMessage("user", question);
            typingIndicator.style.display = "block";
    
            setTimeout(() => {
                typingIndicator.style.display = "none";
                appendMessage("bot", answers[question] || "🤖 I'm not sure, but I can find out for you!");
            }, 1000);
        }
    
        function appendMessage(sender, message) {
            const messageElement = document.createElement("div");
            messageElement.classList.add("message", sender === "user" ? "user-message" : "bot-message");
            messageElement.innerText = message;
            chatMessages.appendChild(messageElement);
            scrollToBottom();
        }
    
        function scrollToBottom() {
            setTimeout(() => {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 100);
        }
    
        clearChatButton.addEventListener("click", () => {
            chatMessages.innerHTML = "";
            appendMessage("bot", "👋 Hi there! How can I assist you today?");
            showCategories();
        });
    
        voiceInputButton.addEventListener("click", () => {
            if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
                alert("Your browser does not support voice input.");
                return;
            }
    
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = "en-US";
            recognition.start();
    
            recognition.onresult = (event) => {
                const voiceMessage = event.results[0][0].transcript;
                chatInput.value = voiceMessage;
                sendMessage();
            };
    
            recognition.onerror = () => {
                appendMessage("bot", "❌ Sorry, I couldn't understand your voice input.");
            };
        });
    
        appendMessage("bot", "👋 Hi there! How can I assist you today?");
        showCategories();
    
    window.addEventListener("scroll", function () {
        let navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
    
    });
    
    
    
    
    document.addEventListener("DOMContentLoaded", function () {
        const searchArea = document.querySelector(".search-area");
        const searchBtn = document.querySelector(".search-btn");
        const searchBox = document.querySelector(".search-box");
        const searchInput = document.getElementById("search-input");
        const goBtn = document.querySelector(".go-btn");
        const mobileMenu = document.querySelector(".mobile-menu");
    
        function hideSearchBox() {
            searchBox.style.display = "none"; 
            searchBtn.style.display = "inline-flex"; 
            searchInput.value = ""; 
        }
    
        function showSearchBox() {
            searchBox.style.display = "flex"; 
            searchBtn.style.display = "none"; 
            searchInput.focus();
        }
    
        function handleSearch() {
            const query = searchInput.value.trim().toLowerCase();
    
            const pages = {
                "home": "/index.html",
                "about": "/about.html",
                "services": "/services.html",
                "reviews": "/reviews.html",
                "homestays": "/homestays.html",
                "contact": "/contact.html"
            };
    
            if (pages[query]) {
                window.location.href = pages[query];
            } else {
                alert("No results found for: " + query);
            }
    
            hideSearchBox(); 
        }
    
        searchBtn.addEventListener("click", function (event) {
            showSearchBox();
            event.stopPropagation(); 
        });
    
        document.addEventListener("click", function (event) {
            if (!searchArea.contains(event.target)) {
                hideSearchBox();
            }
        });
    
        searchBox.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    
        goBtn.addEventListener("click", handleSearch);
    
        window.toggleMenu = function () {
            mobileMenu.classList.toggle("active");
        };
    });
    
    function subscribeNewsletter() {
        let email = document.getElementById("newsletter-email").value.trim();
    
        if (email === "") {
            alert("⚠️ Please enter a valid email!");
            return;
        }
    
        if (!validateEmail(email)) {
            alert("❌ Invalid Email! Please enter a valid email.");
            return;
        }
    
        alert("✅ Thank you for subscribing!");
        document.getElementById("newsletter-email").value = "";
    }
    
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
    }