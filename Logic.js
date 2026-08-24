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
      // ✅ Runs when DB is opened successfully
      openReq.onsuccess = function (event) {
        db = event.target.result; // save db globally
        setStatusOk("Database opened.");

        // ✅ On startup: render products and cart
        loadProducts();
        renderCart();
      };

      // ✅ Runs when opening fails
      openReq.onerror = function (event) {
        console.error("Error opening ShopDB:", event.target.error);
        setStatusWait("Error opening DB.");
      };

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

        function renderCart()
        {
             cartItems.innerHTML = "";
        const tx = db.transaction("cart", "readonly");
        const cartStore = tx.objectStore("cart");
        const req = cartStore.getAll();

        req.onsuccess = function () {
            const items = req.result;
            if (!items || items.length === 0) {
            cartEmpty.style.display = "block";
            cartEmpty.textContent = "Your basket is empty.";
            cartTotal.textContent = "$0.00";
            return;
          }
            cartEmpty.style.display = "none";
            let total = 0 ;
            items.forEach((item) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                const row = document.createElement("div");
            row.className = "cart-item";

            row.innerHTML = `
              <div class="cart-item-main">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">
                  $${item.price.toFixed(2)} × ${
              item.quantity
            } = $${itemTotal.toFixed(2)}
                </div>
                <span class="remove-link" onclick="removeFromCart(${item.id})">
                  Remove
                </span>
              </div>

              <div class="cart-item-controls">
                <button class="small-btn" onclick="decreaseQty(${
                  item.id
                })">−</button>
                <span class="qty-display">${item.quantity}</span>
                <button class="small-btn" onclick="increaseQty(${
                  item.id
                })">+</button>
              </div>
            `;
            cartItems.appendChild(row);
            });
              cartTotal.textContent = "$" + total.toFixed(2);
        };
         req.onerror = function () {
          console.error("Error reading cart.");
        };
        }

         function goToCheckout() {
        // ✅ navigate to checkout page (must exist in same folder)
        window.location.href = "checkout.html";
      }

      function addToCart(productID)
      {
                setStatusWait("Updating basket...");

                const tx = db.transaction(["products", "cart"], "readwrite");
                        const productsStore = tx.objectStore("products");
                const cartStore = tx.objectStore("cart");

                const productRequest = productsStore.get(productID);
                productRequest.onsuccess = function() {

                 const product = productRequest.result;
          if (!product) {
            console.error("Product not found:", productId);
            setStatusWait("Product not found.");
            return;
          }
            const cartItemRequest = cartStore.get(productId);

          cartItemRequest.onsuccess = function () {
            const existing = cartItemRequest.result;

            if (existing) {
              // ✅ already in cart → increment quantity
              existing.quantity += 1;
              cartStore.put(existing); // put() updates existing row
            } else {
              // ✅ not in cart → create new cart item
              cartStore.add({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
              });
            }
          };
        };
        tx.oncomplete = function () {
          renderCart();
          setStatusOk("Basket updated.");
        };

        tx.onerror = function () {
          console.error("Error adding to cart.");
          setStatusWait("Error updating basket.");
        };
      }