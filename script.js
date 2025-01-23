let currentSlide = 0; 
function showSlide(index) {
    const slides = document.querySelectorAll('.destination-card');
    if (index >= slides.length) {
        currentSlide = 0; 
    } else if (index < 0) {
        currentSlide = slides.length - 1; 
    } else {
        currentSlide = index; 
    }
    const offset = -currentSlide * 100; 
    document.querySelector('.carousel-container').style.transform = `translateX(${offset}%)`; 
    slides.forEach((slide, i) => {
        slide.classList.remove('active'); 
        if (i === currentSlide) {
            slide.classList.add('active'); 
        }
    });
}
function moveSlide(direction) {
    showSlide(currentSlide + direction); 
}
showSlide(currentSlide);



let testimonialsIndex = 0;
function moveTestimonials(direction) {
    const items = document.querySelectorAll('.testimonial-item');
    testimonialsIndex = (testimonialsIndex + direction + items.length) % items.length;
    const offset = -testimonialsIndex * 100; 
    document.querySelector('.testimonials-container').style.transform = `translateX(${offset}%)`;
}



document.getElementById("bus-ticket-form").addEventListener("submit", function (e) {
    e.preventDefault(); 
    const departure = document.getElementById("departure").value.trim();
    const arrival = document.getElementById("arrival").value.trim();
    const travelDate = document.getElementById("travel-date").value.trim();
    const tickets = document.getElementById("tickets").value.trim();
    const busType = document.getElementById("bus-type").value;
    if (!departure || !arrival || !travelDate || !tickets || !busType) {
        alert("Please fill in all fields before booking.");
        return;
    }
    alert(`Bus ticket successfully booked!\n\nDetails:\nDeparture: ${departure}\nArrival: ${arrival}\nDate: ${travelDate}\nTickets: ${tickets}\nBus Type: ${busType}`);
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