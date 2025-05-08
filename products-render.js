document.addEventListener("DOMContentLoaded", () => {
  const productsContainer = document.querySelector(".product-grid");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const sortBySelect = document.getElementById("sort-by");
  const paginationContainer = document.querySelector(".pagination");
  const prevBtn = paginationContainer ? paginationContainer.querySelector(".prev-btn") : null;
  const nextBtn = paginationContainer ? paginationContainer.querySelector(".next-btn") : null;
  const pageButtons = paginationContainer ? paginationContainer.querySelectorAll(".page-btn") : [];
  const searchInput = document.getElementById("search-input");

  let currentCategory = "all";
  let currentSort = "default";
  let currentPage = 1;
  let searchQuery = "";
  const itemsPerPage = 6;

  function renderStars(rating) {
    let starsHTML = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        starsHTML += '<i class="fas fa-star"></i>';
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
      } else {
        starsHTML += '<i class="far fa-star"></i>';
      }
    }
    return starsHTML;
  }

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = totalCount);
  }

  function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  }

  function renderProducts() {
    let filteredProducts = products.filter(product => {
      const matchesCategory = currentCategory === "all" || product.category === currentCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (currentSort === "price-low") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (currentSort === "price-high") {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (currentSort === "popular") {
      filteredProducts.sort((a, b) => b.reviews - a.reviews);
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    productsContainer.innerHTML = "";

    paginatedProducts.forEach(product => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");
      productCard.classList.add(product.category);

      let badgeHTML = "";
      if (product.badge) {
        badgeHTML = `<div class="product-badge">${product.badge}</div>`;
      }

      let originalPriceHTML = "";
      if (product.originalPrice) {
        originalPriceHTML = `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>`;
      }

      productCard.innerHTML = `
        ${badgeHTML}
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          <button class="quick-view">Quick View</button>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="price">$${product.price.toFixed(2)} ${originalPriceHTML}</div>
          <div class="rating">
            ${renderStars(product.rating)}
            <span>(${product.reviews})</span>
          </div>
          <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
      `;

      productsContainer.appendChild(productCard);
    });

    attachAddToCartListeners();
    updatePagination(filteredProducts.length);
    updateCartCount();
  }

  function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-id'));
        addToCart(productId);
      });
    });
  }

  function updatePagination(filteredCount) {
    const totalPages = Math.ceil(filteredCount / itemsPerPage);

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

    pageButtons.forEach((btn, index) => {
      btn.classList.toggle("active", currentPage === index + 1);
      btn.style.display = (index + 1) <= totalPages ? "inline-block" : "none";
    });
  }

  categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
      categoryButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      currentCategory = button.getAttribute("data-category");
      currentPage = 1;
      renderProducts();
    });
  });

  sortBySelect.addEventListener("change", () => {
    currentSort = sortBySelect.value;
    currentPage = 1;
    renderProducts();
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderProducts();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const filteredCount = products.filter(product => {
        const matchesCategory = currentCategory === "all" || product.category === currentCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      }).length;
      const totalPages = Math.ceil(filteredCount / itemsPerPage);
      if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
      }
    });
  }

  pageButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      currentPage = index + 1;
      renderProducts();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      currentPage = 1;
      renderProducts();
    });
  }

  renderProducts();
});
