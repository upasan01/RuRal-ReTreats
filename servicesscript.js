document.addEventListener("DOMContentLoaded", () => {
    s/* ============================ BACK TO TOP BUTTON ============================ */
       const backToTopBtn = document.getElementById("backToTop");
   
       if (backToTopBtn) {
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
       } else {
           console.error("❌ Back to Top button not found!");
       }
   
       /* ============================ CHAT BUTTON ============================ */
       const chatButton = document.getElementById("chatButton");
   
       if (chatButton) {
           chatButton.addEventListener("click", () => {
               alert("🚀 Chatbot feature is under construction. Stay tuned!");
           });
       } else {
           console.error("❌ Chat button not found!");
       }
   });muskanS