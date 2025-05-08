// Combined script.js with enhancements and pagination functionality

document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = document.querySelectorAll(".category-btn");
    const productCards = document.querySelectorAll(".product-card");
    const sortBySelect = document.getElementById("sort-by");
    const productsContainer = document.querySelector(".product-grid");
    const paginationContainer = document.querySelector(".pagination");
    const prevBtn = paginationContainer ? paginationContainer.querySelector(".prev-btn") : null;
    const nextBtn = paginationContainer ? paginationContainer.querySelector(".next-btn") : null;
    const pageButtons = paginationContainer ? paginationContainer.querySelectorAll(".page-btn") : [];

    let currentCategory = "all";
    let currentSort = "default";
    let currentPage = 1;
    const itemsPerPage = 6;

    // Filter products by category
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            categoryButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            currentCategory = button.getAttribute("data-category");
            currentPage = 1;
            updateProducts();
            updatePagination();
        });
    });

    // Sort products by selected criteria
    sortBySelect.addEventListener("change", () => {
        currentSort = sortBySelect.value;
        currentPage = 1;
        updateProducts();
        updatePagination();
    });

    // Update products display based on current filters, sort, and pagination
    function updateProducts() {
        let filteredProducts = Array.from(productCards).filter(card => {
            return currentCategory === "all" || card.classList.contains(currentCategory);
        });

        if (currentSort === "price-low") {
            filteredProducts.sort((a, b) => {
                const priceA = parseFloat(a.querySelector(".price").textContent.replace("$", ""));
                const priceB = parseFloat(b.querySelector(".price").textContent.replace("$", ""));
                return priceA - priceB;
            });
        } else if (currentSort === "price-high") {
            filteredProducts.sort((a, b) => {
                const priceA = parseFloat(a.querySelector(".price").textContent.replace("$", ""));
                const priceB = parseFloat(b.querySelector(".price").textContent.replace("$", ""));
                return priceB - priceA;
            });
        } else if (currentSort === "popular") {
            filteredProducts.sort((a, b) => {
                const ratingA = parseFloat(a.querySelector(".rating span").textContent.replace(/[()]/g, ""));
                const ratingB = parseFloat(b.querySelector(".rating span").textContent.replace(/[()]/g, ""));
                return ratingB - ratingA;
            });
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

        productsContainer.innerHTML = "";
        paginatedProducts.forEach(product => productsContainer.appendChild(product));
    }

    // Update pagination buttons state
    function updatePagination() {
        let filteredProductsCount = Array.from(productCards).filter(card => {
            return currentCategory === "all" || card.classList.contains(currentCategory);
        }).length;

        const totalPages = Math.ceil(filteredProductsCount / itemsPerPage);

        if (prevBtn) prevBtn.disabled = currentPage === 1;
        if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;

        pageButtons.forEach((btn, index) => {
            btn.classList.toggle("active", currentPage === index + 1);
            btn.style.display = (index + 1) <= totalPages ? "inline-block" : "none";
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                updateProducts();
                updatePagination();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            let filteredProductsCount = Array.from(productCards).filter(card => {
                return currentCategory === "all" || card.classList.contains(currentCategory);
            }).length;
            const totalPages = Math.ceil(filteredProductsCount / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updateProducts();
                updatePagination();
            }
        });
    }

    pageButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            currentPage = index + 1;
            updateProducts();
            updatePagination();
        });
    });

    updateProducts();
    updatePagination();

    // Hamburger menu toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }

    // Impact stats animation
    const statNumbers = document.querySelectorAll(".stat-number");
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;

        const scrollPosition = window.scrollY + window.innerHeight;
        const statsSection = document.querySelector(".impact-section");

        if (statsSection && scrollPosition > statsSection.offsetTop) {
            statNumbers.forEach(stat => {
                const target = +stat.getAttribute("data-count");
                let count = 0;
                const increment = target / 100;

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        stat.textContent = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target;
                    }
                };
                updateCount();
            });
            statsAnimated = true;
        }
    }

    window.addEventListener("scroll", animateStats);
    animateStats();
});
