alert("JS is working");
// 🔥 Firebase config (put yours)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentUser = null;
let allProducts = [];

/* ---------------- SPLASH ---------------- */
window.onload = function () {
  setTimeout(() => {
    document.getElementById("splash").style.display = "none";
  }, 3000);
};

/* ---------------- LOGIN ---------------- */
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider).then(res => {
    currentUser = res.user;
    alert("Welcome " + currentUser.email);
  });
}

/* ---------------- CLOUDINARY UPLOAD ---------------- */
function openUploadWidget() {
  if (!currentUser) return alert("Login first");

  cloudinary.openUploadWidget({
    cloudName: "YOUR_CLOUD_NAME",
    uploadPreset: "YOUR_UPLOAD_PRESET",
    sources: ["local", "camera"],
    multiple: false
  },
  (error, result) => {
    if (!error && result && result.event === "success") {
      saveProduct(result.info.secure_url);
    }
  });
}

/* ---------------- SAVE PRODUCT ---------------- */
function saveProduct(imageUrl) {
  const name = prompt("Product name:");
  const price = prompt("Price:");
  const category = prompt("Category:");

  db.collection("products").add({
    name,
    price,
    image: imageUrl,
    category,
    user: currentUser.email
  });

  loadProducts();
}

/* ---------------- LOAD ---------------- */
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
      render(p);
    });
  });
}

/* ---------------- RENDER ---------------- */
function render(p) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <img src="${p.image}">
    <h3>${p.name}</h3>
    <p>₦${p.price}</p>
    <small>${p.category}</small>
  `;

  document.getElementById("products").appendChild(div);
}

/* ---------------- SEARCH ---------------- */
function searchProducts() {
  const value = document.getElementById("search").value.toLowerCase();

  const filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(value)
  );

  document.getElementById("products").innerHTML = "";
  filtered.forEach(render);
}

/* ---------------- CATEGORY ---------------- */
function filterCategory(cat) {
  document.getElementById("products").innerHTML = "";

  let filtered = allProducts;

  if (cat !== "all") {
    filtered = allProducts.filter(p => p.category === cat);
  }

  filtered.forEach(render);
}

loadProducts();
