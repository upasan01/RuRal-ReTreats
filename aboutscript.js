let currentSlide = 0; 
const slides = document.querySelectorAll('.gallery img'); 
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active'); 
        if (i === index) {
            slide.classList.add('active'); 
        }
    });
}
function moveSlide(direction) {
    currentSlide += direction; 
    const totalSlides = slides.length; 
    if (currentSlide >= totalSlides) {
        currentSlide = 0; 
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1; 
    }
    showSlide(currentSlide); 
}
showSlide(currentSlide);



document.getElementById('user-experience-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const textarea = this.querySelector('textarea');
    const userExperience = textarea.value.trim();
    if (userExperience) {
        alert('Thank you for sharing your experience: ' + userExperience);
        textarea.value = ''; 
    } else {
        alert('Please share your experience before submitting.');
    }
});



let timelineIndex = 0;

function moveTimeline(direction) {
    const items = document.querySelectorAll('.timeline-item');
    timelineIndex = (timelineIndex + direction + items.length) % items.length;
    const offset = -timelineIndex * 100; 
    document.querySelector('.timeline-container').style.transform = `translateX(${offset}%)`;
}



function toggleFAQ(questionElement) {
    const answerElement = questionElement.nextElementSibling;
    answerElement.style.display = answerElement.style.display === 'block' ? 'none' : 'block';
}