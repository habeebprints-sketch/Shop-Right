// 🔥 Firebase Config (PUT YOUR REAL ONE HERE)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentUser = null;
let allProducts = [];

/* ---------------- SPLASH 10 SECONDS ---------------- */
window.onload = function () {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
  }, 10000); // 10 seconds
};

/* ---------------- LOGIN ---------------- */
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(res => {
      currentUser = res.user;
      alert("Welcome " + currentUser.email);
    });
}

/* ---------------- ADD PRODUCT ---------------- */
function addProduct() {
  if (!currentUser) return alert("Login first");

  const name = prompt("Product name:");
  const price = prompt("Price:");
  const image = prompt("Image URL:");
  const category = prompt("Category (phones, fashion, home):");

  db.collection("products").add({
    name,
    price,
    image,
    category,
    user: currentUser.email
  });

  loadProducts();
}

/* ---------------- LOAD PRODUCTS ---------------- */
function loadProducts() {
  const container = document.getElementById("products");
  const status = document.getElementById("status");

  container.innerHTML = "";
  status.innerText = "Loading...";

  db.collection("products").get().then(snapshot => {
    allProducts = [];

    if (snapshot.empty) {
      status.innerText = "No products yet";
      return;
    }

    status.innerText = "";

    snapshot.forEach(doc => {
      const p = doc.data();
      allProducts.push(p);
      renderProduct(p);
    });
  });
}

/* ---------------- RENDER ---------------- */
function renderProduct(p) {
  const container = document.getElementById("products");

  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${p.image || 'https://via.placeholder.com/150'}">
    <h3>${p.name}</h3>
    <p>₦${p.price}</p>
    <small>${p.category}</small>
  `;

  container.appendChild(div);
}

/* ---------------- SEARCH ---------------- */
function searchProducts() {
  const value = document.getElementById("search").value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(value)
  );

  document.getElementById("products").innerHTML = "";
  filtered.forEach(renderProduct);
}

/* ---------------- FILTER CATEGORY ---------------- */
function filterCategory(cat) {
  document.getElementById("products").innerHTML = "";

  let filtered = allProducts;

  if (cat !== "all") {
    filtered = allProducts.filter(p => p.category === cat);
  }

  filtered.forEach(renderProduct);
}

/* INIT */
loadProducts();
