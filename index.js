//  Declare cart globally so it's available across pages
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", function () {
    loadCart(); //  Initialize cart before updating UI

    // Initialize Bootstrap Toast
    const toastElement = document.getElementById("cart-toast");
    let toast = toastElement ? new bootstrap.Toast(toastElement) : null;

    //  Global Add to Cart function
    window.addToCart = function (name, price) {
        let existingItem = cart.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity++; 
        } else {
            cart.push({ name, price, quantity: 1 });
        }
        saveCart();

        //  Show toast if initialized
        if (toast) {
            toast.show();
        } else {
            console.error(" Toast is not initialized correctly.");
        }
    };

    // there i  Attach event listener to handle dynamically added products
    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("add-to-cart") || event.target.classList.contains("btn-success")) {
            const product = event.target.closest(".product-card");
            if (!product) return;

            const productName = product.querySelector("h3")?.innerText;
            const productPriceText = product.querySelector("p")?.innerText;
            if (!productName || !productPriceText) return;

            //  first i write price in dollare now i chang it in pounds
            const productPrice = parseFloat(productPriceText.replace("$", "").replace("£", ""));
            addToCart(productName, productPrice);
        }
    });

    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        document.getElementById("cart-count").innerText = cart.reduce((sum, item) => sum + item.quantity, 0);
        let cartItemsContainer = document.getElementById("cart-items");
        let cartTotal = document.getElementById("cart-total");
        cartItemsContainer.innerHTML = "";

        let total = 0;
        cart.forEach(item => {
            let li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.innerHTML = `${item.name} x${item.quantity} - £${(item.price * item.quantity).toFixed(2)}
                <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.name}')">Remove</button>`;
            cartItemsContainer.appendChild(li);
            total += item.price * item.quantity;
        });

        cartTotal.innerText = `£${total.toFixed(2)}`;
    }

    window.removeFromCart = function (name) {
        cart = cart.filter(item => item.name !== name);
        saveCart();
    };

    window.clearCart = function () {
        cart = [];
        saveCart();
    };

    window.checkout = function () {
        if (cart.length === 0) {
            alert("Your cart is empty!");
        } else {
            alert("Thank you for your purchase!");
            clearCart();
        }
    };

    window.toggleCart = function () {
        let cartModal = new bootstrap.Modal(document.getElementById("cart-modal"));
        cartModal.show();
    };

    function loadCart() {
        updateCartUI();
    }
});

//  Image Slider: Move Right Functionality
let index = 0;

function moveRight() {
    const container = document.querySelector('.styled-container');
    const firstCard = container.firstElementChild;

    // Add transition effect
    firstCard.style.transition = "transform 0.5s ease-in-out";
    firstCard.style.transform = "translateX(100%)";

    // Wait for animation to complete before moving the element
    setTimeout(() => {
        firstCard.style.transition = "none";
        firstCard.style.transform = "translateX(0)";
        container.appendChild(firstCard); // Move the first image to the end
    }, 500); // Match this duration to the transition time
}


setInterval(moveRight, 2000);

