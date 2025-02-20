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