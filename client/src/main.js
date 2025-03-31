document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("searchInput");
    const scrapeButton = document.getElementById("scrapeButton");
    const searchBoxDiv = document.getElementById("searchBox");
    const contentEl = document.getElementById("content");

    let noKeywordError = false
    let isSearching = false

    searchInput.addEventListener("input", () => {
        noKeywordError = false;
        removeErrorElement(searchBoxDiv);
    })

    scrapeButton.addEventListener("click", async () => {
        const keyword = searchInput.value.trim();
        if (!keyword) {
            if(!noKeywordError) {
                searchBoxDiv.insertBefore(createErrorElement("Please enter a search keyword!"), scrapeButton);
                noKeywordError = true;
            }
            return;
        }

        // Prevent multiple searches at the same time
        if(isSearching) return

        contentEl.innerHTML = "<p>Scraping data...</p>";

        try {
            isSearching = true

            // Fetch scraped data from the backend API
            const response = await fetch(
                `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`,
                {
                    method: "GET",
                }
            );

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error(error);
            contentEl.innerHTML = "";
            contentEl.append(createErrorElement("Error fetching data."));
        } finally {
            isSearching = false
        }
    });

    function displayResults(products) {
        contentEl.innerHTML = ""; // Clear previous results

        // If no products found, show a message
        if (products.length === 0) {
            contentEl.innerHTML = "<p>No results found.</p>";
            return;
        }
        const resultsDivEl = document.createElement("div");
        resultsDivEl.classList.add("results");

        products.forEach((product) => {
            resultsDivEl.innerHTML += createCardElement(product);
        });

        contentEl.appendChild(resultsDivEl);
    }

    // Function to create an individual product card
    function createCardElement(product) {
        return `
            <div class="card">
                <div class="img_box">
                    <img src="${product.image}" alt="${product.title}"/>
                </div>
                <div class="rating">
                    <div class="stars">
                        ${createStarElements(product.rating)}
                    </div>
                    <span class="reviews">(${product.reviewsNumber})</span>
                </div>
                <h2>${product.title}</h2>
            </div>
        `
    }

    function createStarElements(rating) {
        let stars = ""
        for(let i = 0; i < 5; i++) {
            if(rating >= 1) stars += '<span class="star on"></span>'; // Full star
            else if (rating > 0) stars += '<span class="star half"></span>'; // Half star
            else stars += '<span class="star"></span>'; // Empty star
            rating--;
        }
        return stars
    }

    function createErrorElement(message) {
        const p = document.createElement('p');
        p.classList.add("error");
        p.innerHTML = message;
        return p
    }

    function removeErrorElement(element) {
        const p = element.querySelector("p.error");
        if(p) element.removeChild(p);
    }
});
