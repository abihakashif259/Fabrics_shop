
const WHATSAPP_NUMBER = "03227500068";
const OWNER_PIN = "8788";

// Change the number and PIN before using the demo.

const womenBrands = [
  "Zellbury", "Lakhani", "Johra", "Zara Ansari",
  "Bin Saeed", "Dressline", "Mah-e-Roh", "Flossie",
  "Saya", "Sapphire", "Limelight", "J.",
  "Bonanza Satrangi"
];

const menBrands = ["Pasha", "JNG"];
const specialBrands = ["Kamalia Khaddar"];
const allBrands = [...womenBrands, ...menBrands, ...specialBrands];

const defaultProducts = [
  {id:1,name:"Printed Lawn Suit",brand:"Zellbury",price:4500,category:"Women",image:""},
  {id:2,name:"Premium Cotton Suit",brand:"Lakhani",price:3800,category:"Women",image:""},
  {id:3,name:"Elegant Silk Fabric",brand:"Johra",price:6500,category:"Women",image:""},
  {id:4,name:"Chiffon Collection",brand:"Zara Ansari",price:5500,category:"Women",image:""},
  {id:5,name:"Embroidered Suit",brand:"Bin Saeed",price:7200,category:"Women",image:""},
  {id:6,name:"Luxury Dress Fabric",brand:"Dressline",price:4800,category:"Women",image:""},
  {id:7,name:"Printed Collection",brand:"Mah-e-Roh",price:4200,category:"Women",image:""},
  {id:8,name:"Floral Lawn Suit",brand:"Flossie",price:3900,category:"Women",image:""},
  {id:9,name:"Summer Collection",brand:"Saya",price:4500,category:"Women",image:""},
  {id:10,name:"Premium Suit",brand:"Sapphire",price:6200,category:"Women",image:""},
  {id:11,name:"Casual Collection",brand:"Limelight",price:3500,category:"Women",image:""},
  {id:12,name:"Classic Outfit",brand:"J.",price:5000,category:"Women",image:""},
  {id:13,name:"Festive Collection",brand:"Bonanza Satrangi",price:6900,category:"Women",image:""},
  {id:14,name:"Men's Wash & Wear",brand:"Pasha",price:5200,category:"Men",image:""},
  {id:15,name:"Men's Premium Fabric",brand:"JNG",price:4800,category:"Men",image:""},
  {id:16,name:"Traditional Khaddar",brand:"Kamalia Khaddar",price:3200,category:"Khaddar",image:""}
];

function loadData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

let products = loadData("farhan_products", defaultProducts);
let announcements = loadData("farhan_announcements", []);
let feedback = loadData("farhan_feedback", []);
let cart = [];
let ownerLoggedIn = false;

function saveData() {
  try {
    localStorage.setItem("farhan_products", JSON.stringify(products));
    localStorage.setItem("farhan_announcements", JSON.stringify(announcements));
    localStorage.setItem("farhan_feedback", JSON.stringify(feedback));
    return true;
  } catch (error) {
    alert("Storage is full. Try using smaller product photos.");
    return false;
  }
}

// BRAND SECTIONS
function renderBrands(id, brands) {
  const container = document.getElementById(id);
  container.innerHTML = "";

  brands.forEach(brand => {
    const card = document.createElement("button");
    card.className = "brand-card";
    card.textContent = brand;
    card.onclick = () => {
      document.getElementById("brand-filter").value = brand;
      renderProducts();
      document.getElementById("products").scrollIntoView();
    };
    container.appendChild(card);
  });
}

renderBrands("women-brands", womenBrands);
renderBrands("men-brands", menBrands);
renderBrands("special-brands", specialBrands);

// BRAND FILTER AND OWNER BRAND SELECT
const filter = document.getElementById("brand-filter");
const productBrand = document.getElementById("product-brand");

allBrands.forEach(brand => {
  const option = document.createElement("option");
  option.value = brand;
  option.textContent = brand;
  filter.appendChild(option);

  const ownerOption = document.createElement("option");
  ownerOption.value = brand;
  ownerOption.textContent = brand;
  productBrand.appendChild(ownerOption);
});

// PRODUCT DISPLAY
const placeholderImage =
  "https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=600&q=80";

function renderProducts() {
  const search = document.getElementById("search").value.toLowerCase();
  const selectedBrand = filter.value;
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  const filtered = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search);

    const matchesBrand =
      selectedBrand === "all" || product.brand === selectedBrand;

    return matchesSearch && matchesBrand;
  });

  if (!filtered.length) {
    grid.textContent = "No products found.";
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = product.image || placeholderImage;
    img.alt = product.name;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const brand = document.createElement("p");
    brand.className = "product-brand";
    brand.textContent = product.brand;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = `Rs. ${Number(product.price).toLocaleString("en-PK")}`;

    const button = document.createElement("button");
    button.className = "add-btn";
    button.textContent = "ADD TO CART";
    button.onclick = () => addToCart(product.id);

    info.append(brand, name, price, button);
    card.append(img, info);
    grid.appendChild(card);
  });
}

document.getElementById("search").addEventListener("input", renderProducts);
filter.addEventListener("change", renderProducts);

// SHOPPING CART
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) existing.quantity++;
  else cart.push({...product, quantity:1});

  updateCart();
}

function updateCart() {
  document.getElementById("cart-count").textContent =
    cart.reduce((sum, item) => sum + item.quantity, 0);

  const container = document.getElementById("cart-items");
  container.innerHTML = "";

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.name;

    const brand = document.createElement("p");
    brand.textContent = item.brand;

    const quantity = document.createElement("p");
    quantity.textContent = `Qty: ${item.quantity}`;

    const remove = document.createElement("button");
    remove.className = "remove-btn";
    remove.textContent = "Remove";
    remove.onclick = () => removeFromCart(item.id);

    details.append(title, brand, quantity, remove);

    const price = document.createElement("strong");
    price.textContent =
      `Rs. ${(item.price * item.quantity).toLocaleString("en-PK")}`;

    row.append(details, price);
    container.appendChild(row);
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("cart-total").textContent =
    total.toLocaleString("en-PK");
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("active");
}

// WHATSAPP
function sendWhatsApp(message) {
  if (WHATSAPP_NUMBER === "923001234567") {
    alert("Please add your real shop WhatsApp number in script.js first.");
    return;
  }

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

function checkout() {
  if (!cart.length) {
    alert("Your cart is empty!");
    return;
  }

  let message = "Assalam-o-Alaikum! I want to place an order:\n\n";

  cart.forEach(item => {
    message += `${item.name} (${item.brand})\n`;
    message += `Quantity: ${item.quantity}\n`;
    message += `Price: Rs. ${item.price * item.quantity}\n\n`;
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  message += `Total: Rs. ${total}\nPlease confirm my order. Thank you!`;
  sendWhatsApp(message);
}

function contactWhatsApp() {
  sendWhatsApp("Assalam-o-Alaikum! I want to enquire about your collection.");
}

// OWNER LOGIN
function openOwnerLogin() {
  document.getElementById("owner-pin").value = "";
  document.getElementById("login-message").textContent = "";
  document.getElementById("owner-login").classList.add("show");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

function loginOwner() {
  const pin = document.getElementById("owner-pin").value;

  if (pin === OWNER_PIN) {
    ownerLoggedIn = true;
    closeModal("owner-login");
    document.getElementById("owner-dashboard").classList.add("show");
    showOwnerTab("upload-tab");
    renderManageProducts();
  } else {
    document.getElementById("login-message").textContent =
      "Incorrect PIN. Please try again.";
  }
}

function logoutOwner() {
  ownerLoggedIn = false;
  closeModal("owner-dashboard");
}

function showOwnerTab(tabId) {
  if (!ownerLoggedIn) return;

  document.querySelectorAll(".owner-tab").forEach(tab => {
    tab.classList.add("hidden");
  });

  document.getElementById(tabId).classList.remove("hidden");
}

// OWNER: ADD PRODUCT
document.getElementById("product-form").addEventListener("submit", async event => {
  event.preventDefault();
  if (!ownerLoggedIn) return;

  const name = document.getElementById("product-name").value.trim();
  const brand = productBrand.value;
  const price = Number(document.getElementById("product-price").value);
  const file = document.getElementById("product-image").files[0];

  if (!name || !brand || !Number.isFinite(price) || price <= 0) {
    alert("Please enter valid product details.");
    return;
  }

  let image = "";

  if (file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 900000) {
      alert("Please choose an image smaller than 900 KB.");
      return;
    }

    image = await readImage(file);
  }

  const category = specialBrands.includes(brand)
    ? "Khaddar"
    : menBrands.includes(brand) ? "Men" : "Women";

  const newProduct = {
    id: Date.now(),
    name,
    brand,
    price,
    category,
    image
  };

  products.unshift(newProduct);

  if (!saveData()) {
    products.shift();
    return;
  }

  event.target.reset();
  renderProducts();
  renderManageProducts();
  alert("Product added successfully!");
});

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// OWNER: ANNOUNCEMENTS
document.getElementById("announcement-form").addEventListener("submit", event => {
  event.preventDefault();
  if (!ownerLoggedIn) return;

  const title = document.getElementById("announcement-title").value.trim();
  const message = document.getElementById("announcement-text").value.trim();

  if (!title || !message) return;

  announcements.unshift({
    id: Date.now(),
    title,
    message,
    date: new Date().toLocaleDateString()
  });

  if (!saveData()) {
    announcements.shift();
    return;
  }

  event.target.reset();
  renderAnnouncements();
  alert("Announcement published!");
});

function renderAnnouncements() {
  const container = document.getElementById("announcement-list");
  container.innerHTML = "";

  if (!announcements.length) {
    const empty = document.createElement("p");
    empty.textContent = "No announcements yet. Check back soon!";
    container.appendChild(empty);
    return;
  }

  announcements.forEach(item => {
    const card = document.createElement("article");
    card.className = "announcement-card";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const message = document.createElement("p");
    message.textContent = item.message;

    const date = document.createElement("small");
    date.textContent = item.date;

    card.append(title, message, date);

    if (ownerLoggedIn) {
      const remove = document.createElement("button");
      remove.className = "delete-btn";
      remove.textContent = "Delete";
      remove.onclick = () => deleteAnnouncement(item.id);
      card.appendChild(remove);
    }

    container.appendChild(card);
  });
}

function deleteAnnouncement(id) {
  if (!ownerLoggedIn || !confirm("Delete this announcement?")) return;
  announcements = announcements.filter(item => item.id !== id);
  saveData();
  renderAnnouncements();
}

// CUSTOMER FEEDBACK
document.getElementById("feedback-form").addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("customer-name").value.trim();
  const rating = Number(document.getElementById("customer-rating").value);
  const comment = document.getElementById("customer-comment").value.trim();

  if (!name || !comment) return;

  feedback.unshift({
    id: Date.now(),
    name,
    rating,
    comment,
    date: new Date().toLocaleDateString()
  });

  if (!saveData()) {
    feedback.shift();
    return;
  }

  event.target.reset();
  renderFeedback();
  alert("Thank you for your feedback!");
});

function renderFeedback() {
  const container = document.getElementById("feedback-list");
  container.innerHTML = "";

  if (!feedback.length) {
    const empty = document.createElement("p");
    empty.textContent = "Be the first to share your experience!";
    container.appendChild(empty);
    return;
  }

  feedback.forEach(item => {
    const card = document.createElement("article");
    card.className = "feedback-card";

    const name = document.createElement("h3");
    name.textContent = item.name;

    const stars = document.createElement("div");
    stars.className = "stars";
    stars.textContent = "★".repeat(item.rating) + "☆".repeat(5-item.rating);

    const comment = document.createElement("p");
    comment.textContent = item.comment;

    const date = document.createElement("small");
    date.textContent = item.date;

    card.append(name, stars, comment, date);
    container.appendChild(card);
  });
}

// OWNER: MANAGE / DELETE PRODUCTS
function renderManageProducts() {
  const container = document.getElementById("manage-products-list");
  container.innerHTML = "";

  products.forEach(product => {
    const row = document.createElement("div");
    row.className = "manage-item";

    const name = document.createElement("span");
    name.textContent = `${product.name} — Rs. ${product.price}`;

    const remove = document.createElement("button");
    remove.className = "delete-btn";
    remove.textContent = "Delete";
    remove.onclick = () => deleteProduct(product.id);

    row.append(name, remove);
    container.appendChild(row);
  });
}

function deleteProduct(id) {
  if (!ownerLoggedIn || !confirm("Delete this product?")) return;

  products = products.filter(product => product.id !== id);
  cart = cart.filter(item => item.id !== id);

  saveData();
  renderProducts();
  renderManageProducts();
  updateCart();
}

// INITIAL DISPLAY
renderProducts();
renderAnnouncements();
renderFeedback();
updateCart();
