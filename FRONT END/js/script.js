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

// Add to Cart function (stores in localStorage for now)
document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('#paints .product-grid');
    const cards = grid.querySelectorAll('.product-card');
    const left = document.querySelector('#paints .arrow.left');
    const right = document.querySelector('#paints .arrow.right');

    const cardsPerView = 3;
    let currentPage = 0;
    const totalPages = Math.ceil(cards.length / cardsPerView);

    // ------------------------
    // Update slider position
    // ------------------------
    function updateSlider() {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(grid).gap) || 0;
        const moveX = currentPage * (cardWidth + gap) * cardsPerView;
        grid.style.transform = `translateX(-${moveX}px)`;

        left.disabled = currentPage === 0;
        right.disabled = currentPage === totalPages - 1;
    }

    // ------------------------
    // Arrow buttons
    // ------------------------
    right.addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            updateSlider();
        }
    });

    left.addEventListener('click', () => {
        if (currentPage > 0) {
            currentPage--;
            updateSlider();
        }
    });

    // ------------------------
    // Pointer / swipe support
    // ------------------------
    let startX = 0;
    let isDragging = false;

    grid.addEventListener('pointerdown', e => {
        startX = e.clientX;
        isDragging = true;
        grid.setPointerCapture(e.pointerId);
    });

    grid.addEventListener('pointermove', e => {
        if (!isDragging) return;
        const currentX = e.clientX;
        const diff = currentX - startX;
        grid.style.transform = `translateX(${-currentPage * (cards[0].offsetWidth + parseFloat(getComputedStyle(grid).gap) || 0) * cardsPerView + diff}px)`;
    });

    grid.addEventListener('pointerup', e => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.clientX;
        const diff = endX - startX;
        const threshold = 50;

        if (diff < -threshold && currentPage < totalPages - 1) {
            currentPage++;
        } else if (diff > threshold && currentPage > 0) {
            currentPage--;
        }

        updateSlider();
    });

    // Initialize
    updateSlider();

});