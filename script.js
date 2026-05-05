const products = [
  {
    id: 1,
    name: "Sneakers",
    price: 50,
    image: "https://via.placeholder.com/200"
  },
  {
    id: 2,
    name: "T-Shirt",
    price: 20,
    image: "https://via.placeholder.com/200"
  },
  {
    id: 3,
    name: "Headphones",
    price: 80,
    image: "https://via.placeholder.com/200"
  }
];

let cart = [];

function displayProducts() {
  const container = document.getElementById("products");

  products.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product");

    div.innerHTML = `
      <img src="${product.image}">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;

    container.appendChild(div);
  });
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  cart.push(product);
  updateCartCount();
}

function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

function viewCart() {
  const modal = document.getElementById("cart-modal");
  const list = document.getElementById("cart-items");
  const total = document.getElementById("total-price");

  list.innerHTML = "";
  let sum = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    list.appendChild(li);
    sum += item.price;
  });

  total.textContent = sum;
  modal.classList.remove("hidden");
}

function closeCart() {
  document.getElementById("cart-modal").classList.add("hidden");
}

function checkout() {
  alert("Order placed successfully!");
  cart = [];
  updateCartCount();
  closeCart();
}

displayProducts();
