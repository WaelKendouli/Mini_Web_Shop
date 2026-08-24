let db = null;

      const productsGrid = document.getElementById("productsGrid");
      const cartItems = document.getElementById("cartItems");
      const cartEmpty = document.getElementById("cartEmpty");
      const cartTotal = document.getElementById("cartTotal");
      const statusDot = document.getElementById("statusDot");
      const statusText = document.getElementById("statusText");

      function setStatusOk(message) {
        statusDot.classList.remove("dot-wait"); // remove yellow
        statusDot.classList.add("dot-ok"); // add green
        statusText.textContent = message; // set message text
      }

      function setStatusWait(message) {
        statusDot.classList.remove("dot-ok"); // remove green
        statusDot.classList.add("dot-wait"); // add yellow
        statusText.textContent = message; // set message text
      }

      const openReq = indexedDB.open("ShopDB",1);
      
     openReq.onupgradeneeded = function (event) {
            const InstanceDB = event.target.result;
            InstanceDB.createObjectStore("products" , {keypath : "id"});
            InstanceDB.createObjectStore("cart" , {keypath : "id"});
const seedProducts = [
          {
            id: 1,
            name: "JavaScript Basics Course",
            price: 49,
            description: "Perfect for beginners starting JS.",
          },
          {
            id: 2,
            name: "Advanced JS Patterns",
            price: 79,
            description: "Deep dive into patterns and architecture.",
          },
          {
            id: 3,
            name: "DOM Mastery Workshop",
            price: 39,
            description: "DOM, events, and interactive UIs.",
          },
          {
            id: 4,
            name: "Async & Promises Lab",
            price: 59,
            description: "Master async, promises, and async/await.",
          },
          {
            id: 5,
            name: "IndexedDB Hands-On",
            price: 29,
            description: "Offline storage & IndexedDB in practice.",
          },
          {
            id: 6,
            name: "Fullstack JS Bundle",
            price: 129,
            description: "Front-end + Node.js + APIs bundle.",
          },
        ];
        const tx = event.target.transaction;
        const store = tx.ObjectStore("products");
        seedProducts.forEach((product) => 
        {
            store.add(product);
        });

     } 
        function loadProducts()
        {
            productsGrid.innerHTML = "";

            const tx = db.transaction("products","readonly");
            const store = tx.objectStore("products");

            const request = store.getAll();
            request.onsuccess = function () {
                const Products = request.result;
                if (!Products || Products.lengh === 0) {
                    productsGrid.innerHTML =
              "<p style='color:#9ca3af;font-size:0.9rem;'>No products found.</p>";
            return;
                }
                products.forEach((product) => {
            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
              <div class="product-name">${product.name}</div>
              <div class="product-desc">${product.description}</div>
              <div class="product-footer">
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button onclick="addToCart(${
                  product.id
                })">Add to Basket</button>
              </div>
            `;

            productsGrid.appendChild(card);
          });
                };
             request.onerror = function () {
          console.error("Error loading products.");
        };
        }