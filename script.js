// 🔥 Firebase Config (YOUR PROJECT)
const firebaseConfig = {
  apiKey: "AIzaSyDEq5gkrzOdO-ImAmETPFWebDIZfecw5Rs",
  authDomain: "shop-right-258e6.firebaseapp.com",
  projectId: "shop-right-258e6",
  storageBucket: "shop-right-258e6.firebasestorage.app",
  messagingSenderId: "570942872645",
  appId: "1:570942872645:web:8ab0954e9b3e95e77f972c"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let currentUser = null;

//
// 🔐 LOGIN (Google)
//
function login() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(result => {
      currentUser = result.user;
      alert("Welcome " + currentUser.email);
    });
}

//
// ➕ ADD PRODUCT (ANY USER CAN POST)
//
function addProduct() {
  if (!currentUser) {
    alert("Please login first");
    return;
  }

  const name = prompt("Product name:");
  const price = prompt("Price:");
  const image = prompt("Image URL:");

  db.collection("products").add({
    name: name,
    price: price,
    image: image,
    user: currentUser.email
  });

  loadProducts();
}

//
// 📦 LOAD PRODUCTS
//
function loadProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  db.collection("products").get().then(snapshot => {
    snapshot.forEach(doc => {
      const p = doc.data();

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <img src="${p.image}" width="100%">
        <h3>${p.name}</h3>
        <p>₦${p.price}</p>
        <small>by ${p.user}</small>
      `;

      container.appendChild(div);
    });
  });
}

loadProducts();
