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
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name, price });
    localStorage.setItem("cart", JSON.stringify(cart));

    alert(`${name} added to cart!`);
}

// Run fetchProducts on page load
window.addEventListener("DOMContentLoaded", fetchProducts);
