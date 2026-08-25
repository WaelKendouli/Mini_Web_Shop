  let db = null;

      const basketBody = document.getElementById("basketBody");
      const emptyMsg = document.getElementById("emptyMsg");
      const totalAmount = document.getElementById("totalAmount");
      const statusDot = document.getElementById("statusDot");
      const statusText = document.getElementById("statusText");

      function setStatusOk(msg) {
        statusDot.classList.remove("dot-wait");
        statusDot.classList.add("dot-ok");
        statusText.textContent = msg;
      }

      function setStatusWait(msg) {
        statusDot.classList.remove("dot-ok");
        statusDot.classList.add("dot-wait");
        statusText.textContent = msg;
      }

      setStatusWait("Opening database...");

      const request = indexedDB.open("shopDB" , 1);
      request.onsuccess = function(e) {
        db = e.target.result;
        loadCart();
                setStatusOk("Database opened.");
      }

      function loadCart()
      {
        basketBody.innerHTML = "";
        emptyMsg.textContent = "Loading basket...";

        const tx = db.transaction("cart","readonly");
        const store = tx.objectStore("cart");

        const req = store.getAll();

        req.onsuccess = function () { 
          const items = req.result;
            if (!items || items.length === 0) {
            emptyMsg.textContent = "Basket is empty.";
            totalAmount.textContent = "$0.00";
            return;
          }
          emptyMsg.textContent = "";
           emptyMsg.textContent = "";

          let total = 0;

          
          items.forEach((item) => {
            const tr = document.createElement("tr");

            
            tr.innerHTML = `
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${(item.price * item.quantity).toFixed(2)}</td>
            `;

           
            total += item.price * item.quantity;

            
            basketBody.appendChild(tr);
          });

          totalAmount.textContent = "$" + total.toFixed(2);

        }

      }

      function clearBasket()
      {
                if (!confirm("Clear entire basket?")) return;
                const tx = db.transaction("cart","readwrite");
                const store = tx.objectStore("cart");

                store.clear().onsuccess = () => {
          emptyMsg.textContent = "Basket is empty.";
          basketBody.innerHTML = "";
          totalAmount.textContent = "$0.00";
          setStatusOk("Basket cleared.");
        };
      }

     function confirmOrder() {
        alert("Demo only: Order confirmed!");
     }
      function goBack() {
        window.location.href = "shop.html";
      }