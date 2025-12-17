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
    const viewport = document.querySelector("#paints .slider-viewport");
    const grid = document.querySelector("#paints .product-grid");
    const left = document.querySelector("#paints .arrow.left");
    const right = document.querySelector("#paints .arrow.right");

    if (!viewport || !grid) return;

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
    let autoPlay = setInterval(() => slideRight(), 2000);

    function slideRight() {
        if (viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 5) {
            viewport.scrollLeft = 0;
        } else {
            viewport.scrollLeft += getCardWidth();
        }
    }

    function resetAutoPlay() {
        clearInterval(autoPlay);
        autoPlay = setInterval(() => slideRight(), 2000);
    }

    // -------- PAUSE ON HOVER / TOUCH --------
    viewport.addEventListener("mouseenter", () => clearInterval(autoPlay));
    viewport.addEventListener("mouseleave", resetAutoPlay);

    viewport.addEventListener("touchstart", () => clearInterval(autoPlay), { passive: true });
    viewport.addEventListener("touchend", resetAutoPlay);

    // -------- PAUSE ON MANUAL SCROLL --------
    let scrollTimeout;
    viewport.addEventListener("scroll", () => {
        clearInterval(autoPlay);          // pause autoplay
        clearTimeout(scrollTimeout);      // clear previous timeout
        scrollTimeout = setTimeout(() => { // restart after user stops scrolling
            resetAutoPlay();
        }, 1500); // 1.5s after user stops
    });
});
