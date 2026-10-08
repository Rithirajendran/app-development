/* =========================================================
   FRESH BITES - FOOD ORDERING APP
   Beginner-friendly JavaScript
   Only uses: querySelector, querySelectorAll, getElementById,
   addEventListener, createElement, appendChild, innerHTML,
   classList, arrays, objects, loops, and functions.
   ========================================================= */


/* ---------------------------------------------------------
   STEP 1: SELECT ALL THE ELEMENTS WE NEED FROM THE PAGE
   --------------------------------------------------------- */

// All "Add to Cart" buttons on the food cards
const addToCartButtons = document.querySelectorAll(".food-btn");

// All food cards (used for search, filter and sort)
const allFoodCards = document.querySelectorAll(".food-card");

// The container that holds all the food cards
const foodContainer = document.getElementById("foodContainer");

// Message shown when no food matches the search/filter
const noResultsMessage = document.getElementById("noResults");

// Cart display elements
const itemCountDisplay = document.getElementById("itemCount");
const totalPriceDisplay = document.getElementById("totalPrice");
const cartList = document.getElementById("cartList");
const clearCartBtn = document.getElementById("clearCartBtn");

// Search, category filter and sort controls
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortPrice = document.getElementById("sortPrice");

// Toast (success message) box
const toastMessage = document.getElementById("toastMessage");


/* ---------------------------------------------------------
   STEP 2: STORE THE CART DATA
   We keep the cart as an array of objects.
   Each object looks like: { name: "Coke", price: 20, qty: 2 }
   --------------------------------------------------------- */
let cart = [];


/* ---------------------------------------------------------
   STEP 3: ADD TO CART
   Runs whenever any "Add to Cart" button is clicked.
   --------------------------------------------------------- */
addToCartButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        // Read the food name and price from the button's data attributes
        let name = button.dataset.name;
        let price = Number(button.dataset.price);

        // Check if this item is already in the cart
        let existingItem = findItemInCart(name);

        if (existingItem) {
            // Item already exists, so just increase its quantity
            existingItem.qty = existingItem.qty + 1;
        } else {
            // New item, so add it to the cart array with quantity 1
            cart.push({ name: name, price: price, qty: 1 });
        }

        // Refresh the cart display and totals
        renderCart();

        // Show a success message like "Coke Added Successfully"
        showToast(name + " Added Successfully");
    });
});


/* ---------------------------------------------------------
   Helper Function: Find an item inside the cart array by name
   Returns the matching object, or undefined if not found.
   --------------------------------------------------------- */
function findItemInCart(name) {

    let foundItem = undefined;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            foundItem = cart[i];
        }
    }

    return foundItem;
}


/* ---------------------------------------------------------
   STEP 4: RENDER (REDRAW) THE CART
   Clears the cart list and rebuilds it from the cart array.
   Also updates Total Items and Total Price.
   --------------------------------------------------------- */
function renderCart() {

    // Clear the current list before redrawing it
    cartList.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;

    // Loop through every item currently in the cart
    cart.forEach(function (item) {

        totalItems = totalItems + item.qty;
        totalPrice = totalPrice + (item.price * item.qty);

        // Create a list item (li) for this cart entry
        let li = document.createElement("li");

        // Text showing the item name
        let nameSpan = document.createElement("span");
        nameSpan.className = "cart-item-name";
        nameSpan.innerHTML = item.name;

        // Text showing the price for this item x quantity
        let priceSpan = document.createElement("span");
        priceSpan.className = "cart-item-price";
        priceSpan.innerHTML = "₹" + (item.price * item.qty);

        // A wrapper div for the quantity buttons (- qty +)
        let controls = document.createElement("div");
        controls.className = "cart-item-controls";

        // Decrease quantity button
        let decreaseBtn = document.createElement("button");
        decreaseBtn.className = "qty-btn";
        decreaseBtn.innerHTML = "-";
        decreaseBtn.addEventListener("click", function () {
            decreaseQty(item.name);
        });

        // Quantity number display
        let qtySpan = document.createElement("span");
        qtySpan.className = "qty-value";
        qtySpan.innerHTML = item.qty;

        // Increase quantity button
        let increaseBtn = document.createElement("button");
        increaseBtn.className = "qty-btn";
        increaseBtn.innerHTML = "+";
        increaseBtn.addEventListener("click", function () {
            increaseQty(item.name);
        });

        // Remove item button
        let removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.innerHTML = "Remove";
        removeBtn.addEventListener("click", function () {
            removeItem(item.name);
        });

        // Put the quantity controls together
        controls.appendChild(decreaseBtn);
        controls.appendChild(qtySpan);
        controls.appendChild(increaseBtn);
        controls.appendChild(removeBtn);

        // Put everything together into the list item
        li.appendChild(nameSpan);
        li.appendChild(priceSpan);
        li.appendChild(controls);

        // Add the list item to the cart list on the page
        cartList.appendChild(li);
    });

    // Update the Total Items and Total Price shown on the page
    itemCountDisplay.innerHTML = totalItems;
    totalPriceDisplay.innerHTML = totalPrice;
}


/* ---------------------------------------------------------
   STEP 5: INCREASE QUANTITY of an item already in the cart
   --------------------------------------------------------- */
function increaseQty(name) {

    let item = findItemInCart(name);

    if (item) {
        item.qty = item.qty + 1;
    }

    renderCart();
}


/* ---------------------------------------------------------
   STEP 6: DECREASE QUANTITY of an item in the cart.
   If quantity reaches 0, the item is removed completely.
   --------------------------------------------------------- */
function decreaseQty(name) {

    let item = findItemInCart(name);

    if (item) {
        item.qty = item.qty - 1;

        if (item.qty <= 0) {
            removeItem(name);
            return;
        }
    }

    renderCart();
}


/* ---------------------------------------------------------
   STEP 7: REMOVE ITEM completely from the cart array
   --------------------------------------------------------- */
function removeItem(name) {

    // Build a new cart array that excludes the removed item
    let newCart = [];

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].name !== name) {
            newCart.push(cart[i]);
        }
    }

    cart = newCart;

    renderCart();
}


/* ---------------------------------------------------------
   STEP 8: CLEAR CART - empties the cart completely
   --------------------------------------------------------- */
clearCartBtn.addEventListener("click", function () {
    cart = [];
    renderCart();
});


/* ---------------------------------------------------------
   STEP 9: SHOW SUCCESS MESSAGE (TOAST)
   Displays a small message at the bottom of the screen
   for a couple of seconds.
   --------------------------------------------------------- */
function showToast(message) {

    toastMessage.innerHTML = message;
    toastMessage.classList.add("show");

    // Hide the message again after 2 seconds
    setTimeout(function () {
        toastMessage.classList.remove("show");
    }, 2000);
}


/* ---------------------------------------------------------
   STEP 10: SEARCH + CATEGORY FILTER
   Both work together. Every time the user types in the
   search box OR changes the category dropdown, we re-check
   every food card and show/hide it as needed.
   --------------------------------------------------------- */
function applyFilters() {

    // What the user typed, in lower case for easy comparing
    let searchTerm = searchInput.value.toLowerCase();

    // Which category is selected ("all" means no filter)
    let selectedCategory = categoryFilter.value;

    let visibleCount = 0;

    allFoodCards.forEach(function (card) {

        // Get this card's food name and category
        let foodName = card.querySelector(".food-name").innerHTML.toLowerCase();
        let foodCategory = card.dataset.category;

        // Does the name match the search box?
        let matchesSearch = foodName.includes(searchTerm);

        // Does the category match the dropdown (or is "all" selected)?
        let matchesCategory = (selectedCategory === "all" || foodCategory === selectedCategory);

        if (matchesSearch && matchesCategory) {
            card.style.display = "flex";
            visibleCount = visibleCount + 1;
        } else {
            card.style.display = "none";
        }
    });

    // Show a friendly message if nothing matched
    if (visibleCount === 0) {
        noResultsMessage.style.display = "block";
    } else {
        noResultsMessage.style.display = "none";
    }
}

// Run the filter whenever the user types in the search box
searchInput.addEventListener("keyup", applyFilters);

// Run the filter whenever the category dropdown changes
categoryFilter.addEventListener("change", applyFilters);


/* ---------------------------------------------------------
   STEP 11: SORT BY PRICE (Low to High / High to Low)
   Reorders the actual food cards inside the container.
   --------------------------------------------------------- */
sortPrice.addEventListener("change", function () {

    let sortValue = sortPrice.value;

    // Turn the NodeList of cards into a normal array so we can sort it
    let cardsArray = Array.from(document.querySelectorAll(".food-card"));

    if (sortValue === "lowToHigh") {
        cardsArray.sort(function (a, b) {
            return Number(a.dataset.price) - Number(b.dataset.price);
        });
    } else if (sortValue === "highToLow") {
        cardsArray.sort(function (a, b) {
            return Number(b.dataset.price) - Number(a.dataset.price);
        });
    }

    // Re-attach each card in its new sorted order.
    // appendChild() on an element that already exists in the page
    // simply MOVES it to the new position instead of duplicating it.
    cardsArray.forEach(function (card) {
        foodContainer.appendChild(card);
    });
});