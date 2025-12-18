// Fetch products from backend
async function fetchProducts() {
    try {
        const res = await fetch("http://localhost:5000/products");
        const products = await res.json();

        const productsContainer = document.getElementById("products-container");
        productsContainer.innerHTML = "";

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" />
                <h3>${product.name}</h3>
                <p>${product.description || ""}</p>
                <p>Price: R${product.price}</p>
                <button onclick="addToCart('${product.name}', ${product.price})">Add to Cart</button>
            `;
            productsContainer.appendChild(productCard);
        });
    } catch (err) {
        console.error("Error fetching products:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {

    function initSlider(sliderId, autoPlayTime = 2000) {
        const slider = document.querySelector(`#${sliderId} .product-slider`);
        if (!slider) return;

        const viewport = slider.querySelector(".slider-viewport");
        const grid = slider.querySelector(".product-grid");
        const left = slider.querySelector(".arrow.left");
        const right = slider.querySelector(".arrow.right");

        if (!viewport || !grid || !left || !right) return;

        function getCardWidth() {
            const card = grid.querySelector(".product-card");
            const gap = parseFloat(getComputedStyle(grid).gap) || 0;
            return card.offsetWidth + gap;
        }

        // -------- ARROWS --------
        left.addEventListener("click", () => {
            viewport.scrollLeft -= getCardWidth();
            resetAutoPlay();
        });

        right.addEventListener("click", () => {
            viewport.scrollLeft += getCardWidth();
            resetAutoPlay();
        });

        // -------- AUTO PLAY --------
        let autoPlay = setInterval(slideRight, autoPlayTime);

        function slideRight() {
            if (viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 5) {
                viewport.scrollLeft = 0;
            } else {
                viewport.scrollLeft += getCardWidth();
            }
            updateArrowsVisibility();
        }

        function resetAutoPlay() {
            clearInterval(autoPlay);
            autoPlay = setInterval(slideRight, autoPlayTime);
        }

        // -------- PAUSE ON HOVER / TOUCH --------
        viewport.addEventListener("mouseenter", () => clearInterval(autoPlay));
        viewport.addEventListener("mouseleave", resetAutoPlay);
        viewport.addEventListener("touchstart", () => clearInterval(autoPlay), { passive: true });
        viewport.addEventListener("touchend", resetAutoPlay);

        // -------- PAUSE ON MANUAL SCROLL --------
        let scrollTimeout;
        viewport.addEventListener("scroll", () => {
            clearInterval(autoPlay);
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => resetAutoPlay(), 1500);
            updateArrowsVisibility();
        });

        // -------- SHOW / HIDE ARROWS --------
        function updateArrowsVisibility() {
            if (viewport.scrollLeft <= 0) {
                left.classList.add("hidden");
            } else {
                left.classList.remove("hidden");
            }

            if (viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 5) {
                right.classList.add("hidden");
            } else {
                right.classList.remove("hidden");
            }
        }

        // Initialize arrow visibility
        updateArrowsVisibility();
        // Recalculate on window resize
        window.addEventListener("resize", updateArrowsVisibility);
    }

    // Initialize sliders
    initSlider("paints", 2000); // Paints & Coatings
    initSlider("parts", 2000);  // Automotive Parts
});
