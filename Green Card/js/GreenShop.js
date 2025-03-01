document.addEventListener("DOMContentLoaded", () => {
  const buttonContainer = document.querySelector(".button-container");
  const productsContainer = document.getElementById("products");
  const cartBadge = document.getElementById("Cart-Badge");

  // Variablat për kategoritë, produktet dhe karrocën
  let categories = [];
  let products = [];
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Fetch kategoritë nga API-ja
  fetch("https://dummyjson.com/products/categories")
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data)) {
        categories = data.map((category) => category.slug);
        createCategoryButtons();
      }
    })
    .catch((error) => console.error("Error fetching categories:", error));

  // Fetch produktet nga API-ja
  fetch("https://dummyjson.com/products")
    .then((response) => response.json())
    .then((data) => {
      if (data && Array.isArray(data.products)) {
        products = data.products;
        loadProducts("All");
      }
    })
    .catch((error) => console.error("Error fetching products:", error));

  function createCategoryButtons() {
    buttonContainer.innerHTML = "";

    const allButton = createButton("All");
    buttonContainer.appendChild(allButton);

    categories.forEach((category) => {
      const btn = createButton(category);
      buttonContainer.appendChild(btn);
    });
  }

  // Funksioni për krijimin e butonave për kategoritë
  function createButton(categoryName) {
    const button = document.createElement("button");
    button.textContent = categoryName;

    if (categoryName === "All") {
      button.classList.add("active");
    }

    // Event listener për klikimin e butonave të kategorisë
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".button-container button")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      loadProducts(categoryName);
    });

    return button;
  }

  function loadProducts(category) {
    if (category === "All") {
      showProducts(products);
    } else {
      const filteredProducts = products.filter(
        (product) =>
          product.category &&
          typeof product.category === "string" &&
          product.category.toLowerCase() === category.toLowerCase()
      );
      showProducts(filteredProducts);
      r;
    }
  }

  // Funksioni për shfaqjen e produkteve në faqe
  function showProducts(productList) {
    productsContainer.innerHTML = "";

    if (productList.length > 0) {
      productList.forEach((product) => {
        const prodElement = document.createElement("div");
        prodElement.classList.add("product");
        prodElement.setAttribute("data-id", product.id);

        prodElement.innerHTML = `
          <img src="${product.thumbnail}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p>${product.description}</p>
          <div class="info">
            <span class="price">${product.price}$</span>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            <button class="favv"><span class="fav-icon">❤</span></button>
          </div>
        `;

        productsContainer.appendChild(prodElement);
      });

      document.querySelectorAll(".add-to-cart").forEach((button) => {
        button.addEventListener("click", (e) => {
          const productId = e.target.getAttribute("data-id");
          addToCart(productId);
        });
      });
    } else {
      productsContainer.innerHTML =
        "<p>No products available in this category.</p>";
    }
  }

  // Funksioni për shtimin e produktit në karrocë
  function addToCart(productId) {
    const product = products.find((p) => p.id == productId);
    if (product) {
      const existsInCart = cart.find((item) => item.id == productId);
      if (existsInCart) {
        existsInCart.quantity++;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      updateCart();
      saveCart();
    }
  }

  function updateCart() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = count;
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateCart();
});
