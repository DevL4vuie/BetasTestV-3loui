// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
// import {
//   getFirestore, collection, onSnapshot, addDoc,
//   query, where, getDocs
// } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// // ── Firebase config ──────────────────────────────────────────
// const firebaseConfig = {
//   apiKey:            "AIzaSyBvsn9hLvi4Tq9mLvoo1-YL1uzbB_ntL7s",
//   authDomain:        "pos-and-sales-monitoring.firebaseapp.com",
//   projectId:         "pos-and-sales-monitoring",
//   storageBucket:     "pos-and-sales-monitoring.firebasestorage.app",
//   messagingSenderId: "516453934117",
//   appId:             "1:516453934117:web:1783067b8aa6b37373cbcc",
//   measurementId:     "G-FT1G64DB9N"
// };

// const app = initializeApp(firebaseConfig);
// const db  = getFirestore(app);

// // ── HuggingFace API ──────────────────────────────────────────
// const GROQ_API_KEY = "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";

// // ── State ────────────────────────────────────────────────────
// let allProducts    = [];
// let activeCategory = 'all';
// let cart           = [];

// // ============================================================
// //  FIREBASE LISTENERS
// // ============================================================

// onSnapshot(collection(db, "categories"), (snap) => {
//   const tabs = document.getElementById('catTabs');
//   tabs.innerHTML = `<button class="cat-tab ${activeCategory === 'all' ? 'active' : ''}"
//     onclick="filterCat('all', this)">All Products</button>`;
//   snap.forEach(d => {
//     const name = d.data().name;
//     tabs.innerHTML += `<button class="cat-tab ${activeCategory === name ? 'active' : ''}"
//       onclick="filterCat('${name}', this)">${name}</button>`;
//   });
// });

// onSnapshot(collection(db, "products"), (snap) => {
//   allProducts = [];
//   snap.forEach(d => {
//     const data = d.data();
//     if (data.status === 'inactive' || data.status === 'archived' || data.archived === true) return;
//     const qty = data.quantity !== undefined ? Number(data.quantity) : Number(data.stock || 0);
//     allProducts.push({ id: d.id, ...data, quantity: isNaN(qty) ? 0 : qty });
//   });
//   const search = document.getElementById('searchInput')?.value || '';
//   renderProducts(applyFilters(allProducts, activeCategory, search));
//   updateProductCount();
// });

// // ============================================================
// //  FILTERING
// // ============================================================

// window.filterCat = function (cat, btn) {
//   activeCategory = cat;
//   document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
//   if (btn) btn.classList.add('active');
//   renderProducts(applyFilters(allProducts, cat, document.getElementById('searchInput')?.value || ''));
// };

// window.handleSearch = function (val) {
//   renderProducts(applyFilters(allProducts, activeCategory, val));
// };

// function applyFilters(list, cat, search) {
//   return list.filter(p => {
//     const matchCat    = cat === 'all' || (p.category || '').toLowerCase() === cat.toLowerCase();
//     const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
//     return matchCat && matchSearch;
//   });
// }

// function updateProductCount() {
//   const el = document.getElementById('productCount');
//   if (el) el.textContent = `${allProducts.length} product${allProducts.length !== 1 ? 's' : ''} available`;
// }

// // ============================================================
// //  RENDER PRODUCTS
// // ============================================================

// window.renderProducts = function (list) {
//   const grid = document.getElementById('productsGrid');
//   if (!grid) return;
//   grid.innerHTML = '';

//   if (list.length === 0) {
//     grid.innerHTML = `
//       <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--grey);">
//         <i class="fas fa-search" style="font-size:40px;opacity:0.3;margin-bottom:12px;display:block;"></i>
//         <p style="font-weight:700;font-size:16px;">No products found</p>
//       </div>`;
//     return;
//   }

//   list.forEach(p => {
//     const qty      = Number(p.quantity || p.stock || 0);
//     const isOOS    = qty <= 0;
//     const price    = parseFloat(p.price || p.cost || 0);
//     const imgUrl   = p.imageUrl || p.image || p.img || p.photoURL || '';
//     const lowStock = qty > 0 && qty <= 5;
//     const cartItem = cart.find(i => i.id === p.id);
//     const cartQty  = cartItem ? cartItem.qty : 0;

//     const card = document.createElement('div');
//     card.className = `product-card ${isOOS ? 'oos' : ''}`;
//     if (!isOOS) card.onclick = () => window.addToCart(p);

//     card.innerHTML = `
//       ${cartQty > 0 ? `<span class="product-cart-badge">${cartQty}</span>` : ''}
//       <div class="card-img-placeholder">
//         ${imgUrl ? `<img src="${imgUrl}" alt="${p.name}" onerror="this.parentElement.innerHTML='🐷'"/>` : '🐷'}
//       </div>
//       ${isOOS    ? '<div class="oos-tag">Out of Stock</div>'    : ''}
//       ${lowStock ? `<div class="stock-tag">${qty} left!</div>` : ''}
//       <div class="card-body">
//         <div class="card-name">${p.name}</div>
//         <div class="card-footer">
//           <span class="card-price">₱${price.toLocaleString()}</span>
//           ${!isOOS ? `<button class="btn-add" title="Add to cart"><i class="fas fa-cart-plus"></i> Add to Cart</button>` : ''}
//         </div>
//       </div>`;
//     grid.appendChild(card);
//   });
// };

// // ============================================================
// //  CART
// // ============================================================

// window.addToCart = function (product) {
//   const existing = cart.find(i => i.id === product.id);
//   const stock    = Number(product.quantity || product.stock || 0);
//   const current  = existing ? existing.qty : 0;
//   if (current + 1 > stock) { showToast('Not enough stock!', 'error'); return; }
//   if (existing) { existing.qty++; }
//   else {
//     cart.push({ id: product.id, name: product.name, price: parseFloat(product.price || product.cost || 0), qty: 1, unit: product.unit || 'pcs' });
//   }
//   renderCart();
//   renderProducts(applyFilters(allProducts, activeCategory, document.getElementById('searchInput')?.value || ''));
//   showToast(`${product.name} added!`, 'success');
//   if (!document.getElementById('cartDrawer').classList.contains('open')) animateCartBadge();
// };

// window.updateCartQty = function (id, delta) {
//   const item = cart.find(i => i.id === id);
//   if (!item) return;
//   item.qty += delta;
//   if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
//   renderCart();
//   renderProducts(applyFilters(allProducts, activeCategory, document.getElementById('searchInput')?.value || ''));
// };

// function renderCart() {
//   const list    = document.getElementById('cartItemsList');
//   const badge   = document.getElementById('cartBadge');
//   const totalEl = document.getElementById('cartTotal');
//   const btn     = document.getElementById('inquireBtn');
//   const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
//   const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
//   badge.textContent   = totalQty;
//   totalEl.textContent = fmt(totalPrice);
//   btn.disabled        = cart.length === 0;
//   if (cart.length === 0) {
//     list.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>No items added yet</p></div>`;
//     return;
//   }
//   list.innerHTML = '';
//   cart.forEach(item => {
//     const row = document.createElement('div');
//     row.className = 'cart-item-row';
//     row.innerHTML = `
//       <div class="ci-icon">🐷</div>
//       <div class="ci-info">
//         <div class="ci-name">${item.name}</div>
//         <div class="ci-price">${fmt(item.price * item.qty)}</div>
//       </div>
//       <div class="ci-qty">
//         <button onclick="updateCartQty('${item.id}', -1)"><i class="fas fa-minus" style="font-size:10px;"></i></button>
//         <span>${item.qty}</span>
//         <button onclick="updateCartQty('${item.id}', 1)"><i class="fas fa-plus" style="font-size:10px;"></i></button>
//       </div>`;
//     list.appendChild(row);
//   });
// }

// window.toggleCart = function () {
//   const drawer  = document.getElementById('cartDrawer');
//   const overlay = document.getElementById('cartOverlay');
//   drawer.classList.toggle('open');
//   overlay.classList.toggle('open');
//   document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
// };

// // ============================================================
// //  INQUIRY MODAL
// // ============================================================

// window.openInquiryModal = function () {
//   if (cart.length === 0) return;
//   renderInquiryForm(cart.reduce((s, i) => s + i.price * i.qty, 0));
//   document.getElementById('inquiryModal').classList.add('open');
// };

// window.closeInquiryModal = function () {
//   document.getElementById('inquiryModal').classList.remove('open');
// };

// function renderInquiryForm(total) {
//   const today = new Date().toISOString().split('T')[0];
//   document.getElementById('inquiryModalBody').innerHTML = `
//     <div class="order-summary">
//       <h4>Your Order</h4>
//       ${cart.map(i => `
//         <div class="os-item">
//           <span>${i.qty}× ${i.name}</span>
//           <span>${fmt(i.price * i.qty)}</span>
//         </div>`).join('')}
//       <div class="os-total"><span>Total</span><span>${fmt(total)}</span></div>
//     </div>
//     <div class="form-row">
//       <div class="form-group">
//         <label><i class="fas fa-user" style="color:var(--red);margin-right:5px;"></i> Full Name *</label>
//         <input type="text" id="inqName" placeholder="Juan dela Cruz" oninput="validateInqName(this.value)"/>
//         <small id="inqNameHint" style="display:block;min-height:16px;margin-top:4px;font-size:11px;color:var(--red);font-weight:700;"></small>
//       </div>
//       <div class="form-group">
//         <label><i class="fas fa-phone" style="color:var(--red);margin-right:5px;"></i> Phone Number *</label>
//         <input type="tel" id="inqPhone" placeholder="09xxxxxxxxx" oninput="validateInqPhone(this.value)"/>
//         <small id="inqPhoneHint" style="display:block;min-height:16px;margin-top:4px;font-size:11px;color:var(--red);font-weight:700;"></small>
//       </div>
//     </div>
//     <div class="form-group">
//       <label><i class="fas fa-envelope" style="color:var(--red);margin-right:5px;"></i> Email Address *</label>
//       <input type="email" id="inqEmail" placeholder="juan@gmail.com"/>
//     </div>
//     <div class="form-group">
//       <label><i class="fas fa-truck" style="color:var(--red);margin-right:5px;"></i> Order Type *</label>
//       <select id="inqType" onchange="toggleDeliveryFields()">
//         <option value="pickup">🏪 Pickup at Store</option>
//         <option value="delivery">🚚 Delivery</option>
//       </select>
//     </div>
//     <div id="deliveryAddressWrap" style="display:none;">
//       <div class="form-group">
//         <label><i class="fas fa-map-marker-alt" style="color:var(--red);margin-right:5px;"></i> Street / House No. / Landmark *</label>
//         <input type="text" id="inqStreet" placeholder="e.g. 123 Rizal St., near 7-Eleven"/>
//       </div>
//       <div class="form-group">
//         <label><i class="fas fa-map" style="color:var(--red);margin-right:5px;"></i> Barangay *</label>
//         <input type="text" id="inqBarangay" placeholder="e.g. Bulua, Lapasan, Nazareth..."/>
//       </div>
//       <div class="form-row">
//         <div class="form-group">
//           <label>City / Municipality</label>
//           <input type="text" value="Cagayan de Oro City" readonly style="background:#f5f5f5;color:var(--grey);cursor:not-allowed;"/>
//         </div>
//         <div class="form-group">
//           <label>Province</label>
//           <input type="text" value="Misamis Oriental" readonly style="background:#f5f5f5;color:var(--grey);cursor:not-allowed;"/>
//         </div>
//       </div>
//     </div>
//     <div class="form-row">
//       <div class="form-group">
//         <label><i class="fas fa-calendar" style="color:var(--red);margin-right:5px;"></i> Pickup / Delivery Date *</label>
//         <input type="date" id="inqDate" min="${today}"/>
//       </div>
//       <div class="form-group">
//         <label><i class="fas fa-clock" style="color:var(--red);margin-right:5px;"></i> Preferred Time *</label>
//         <input type="time" id="inqTime" onchange="validateInqTime(this.value)"/>
//         <small id="inqTimeHint" style="color:var(--grey);font-size:11px;margin-top:4px;display:block;">
//           Store hours: 8:00 AM – 10:00 PM · No delivery 12:00 AM – 4:00 AM
//         </small>
//       </div>
//     </div>
//     <div class="form-group">
//       <label><i class="fas fa-comment-alt" style="color:var(--red);margin-right:5px;"></i> Special Instructions</label>
//       <textarea id="inqNotes" rows="3" placeholder="Any special requests, event details..."></textarea>
//     </div>
//     <button class="btn-submit-inquiry" id="submitInquiryBtn" onclick="submitInquiry()">
//       <i class="fas fa-paper-plane"></i> Send Inquiry to Gene's Lechon
//     </button>`;
// }

// async function checkDailyLimit(name, email, phone) {
//   const MAX   = 3;
//   const now   = new Date();
//   const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
//   const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
//   try {
//     const snap = await getDocs(query(collection(db, "inquiries"), where("date", ">=", start), where("date", "<=", end)));
//     const emailLow = email.toLowerCase();
//     let count = 0;
//     snap.forEach(d => {
//       const data = d.data();
//       if ((data.email||'').toLowerCase()===emailLow || (data.phone||'')===phone || (data.customer||'')===name) count++;
//     });
//     return { count, blocked: count >= MAX, remaining: Math.max(0, MAX - count) };
//   } catch (err) {
//     console.warn('Rate limit check failed:', err.message);
//     return { count: 0, blocked: false, remaining: MAX };
//   }
// }

// function isNightTimeBlocked(timeStr) {
//   if (!timeStr) return false;
//   const [h] = timeStr.split(':').map(Number);
//   return h >= 0 && h < 4;
// }
// function isOutsideStoreHours(timeStr) {
//   if (!timeStr) return false;
//   const [h, m] = timeStr.split(':').map(Number);
//   const mins = h * 60 + m;
//   return mins < 8 * 60 || mins > 22 * 60;
// }

// window.toggleDeliveryFields = function () {
//   const type    = document.getElementById('inqType')?.value;
//   const wrapper = document.getElementById('deliveryAddressWrap');
//   if (wrapper) wrapper.style.display = (type === 'delivery') ? 'block' : 'none';
// };

// window.validateInqTime = function (val) {
//   const hint = document.getElementById('inqTimeHint');
//   const type = document.getElementById('inqType')?.value;
//   if (!hint) return;
//   if (type === 'delivery' && isNightTimeBlocked(val)) {
//     hint.textContent = '⛔ No deliveries from 12:00 AM to 4:00 AM.';
//     hint.style.color = 'var(--red)'; hint.style.fontWeight = '700';
//   } else if (isOutsideStoreHours(val)) {
//     hint.textContent = '⛔ Outside store hours (8:00 AM – 10:00 PM).';
//     hint.style.color = 'var(--red)'; hint.style.fontWeight = '700';
//   } else {
//     hint.textContent = 'Store hours: 8:00 AM – 10:00 PM · No delivery 12:00 AM – 4:00 AM';
//     hint.style.color = 'var(--grey)'; hint.style.fontWeight = '';
//   }
// };

// window.validateInqName = function (val) {
//   const hint = document.getElementById('inqNameHint');
//   if (!hint) return;
//   hint.textContent = /\d/.test(val) ? '⛔ Name must not contain numbers.' : '';
// };

// window.validateInqPhone = function (val) {
//   const hint = document.getElementById('inqPhoneHint');
//   if (!hint || !val) { if (hint) hint.textContent = ''; return; }
//   const digits = val.replace(/\D/g, '').replace(/^63/, '0');
//   const ok = /^09\d{9}$/.test(digits);
//   hint.textContent = ok || digits.length < 4 ? '' : '⛔ Number must start with 9 (e.g. 09xxxxxxxxx).';
// };

// window.submitInquiry = async function () {
//   const name     = document.getElementById('inqName')?.value?.trim();
//   const phone    = document.getElementById('inqPhone')?.value?.trim();
//   const email    = document.getElementById('inqEmail')?.value?.trim();
//   const date     = document.getElementById('inqDate')?.value;
//   const time     = document.getElementById('inqTime')?.value;
//   const notes    = document.getElementById('inqNotes')?.value?.trim() || '';
//   const type     = document.getElementById('inqType')?.value || 'pickup';
//   const street   = document.getElementById('inqStreet')?.value?.trim() || '';
//   const barangay = document.getElementById('inqBarangay')?.value?.trim() || '';

//   if (!name) { showToast('Please enter your full name.', 'error'); return; }
//   if (/\d/.test(name)) { showToast('Name must not contain numbers.', 'error'); return; }
//   if (!phone) { showToast('Please enter your phone number.', 'error'); return; }
//   const digits = phone.replace(/\D/g, '').replace(/^63/, '0');
//   if (!/^09\d{9}$/.test(digits)) { showToast('Phone number must start with 9 (e.g. 09xxxxxxxxx).', 'error'); return; }
//   if (!email || !date || !time) { showToast('Please fill in all required fields!', 'error'); return; }
//   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email address!', 'error'); return; }
//   if (isOutsideStoreHours(time)) { showToast('Please choose a time within store hours (8:00 AM – 10:00 PM).', 'error'); return; }
//   if (type === 'delivery' && isNightTimeBlocked(time)) { showToast('No deliveries from 12:00 AM to 4:00 AM.', 'error'); return; }
//   if (type === 'delivery') {
//     if (!street)   { showToast('Please enter your street / house address.', 'error'); return; }
//     if (!barangay) { showToast('Please enter your barangay.', 'error'); return; }
//   }

//   const btn = document.getElementById('submitInquiryBtn');
//   btn.disabled  = true;
//   btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';

//   try {
//     const limit = await checkDailyLimit(name, email, phone);
//     if (limit.blocked) {
//       showToast('You have reached the maximum of 3 inquiries per day.', 'error');
//       btn.disabled  = false;
//       btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry to Gene\'s Lechon';
//       showLimitWarning();
//       return;
//     }
//     btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
//     const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
//     const deliveryAddress = type === 'delivery' ? `${street}, ${barangay}, Cagayan de Oro City, Misamis Oriental` : '';
//     const inquiryDoc = {
//       orderId: `#INQ-${Math.floor(100000 + Math.random() * 900000)}`,
//       customer: name, email: email.toLowerCase(), phone,
//       date: new Date().toISOString(), orderDate: date, orderTime: time,
//       orderType: type, deliveryAddress, deliveryStreet: street, deliveryBarangay: barangay,
//       deliveryCity: type==='delivery'?'Cagayan de Oro City':'', deliveryProvince: type==='delivery'?'Misamis Oriental':'',
//       items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, unit: i.unit||'pcs' })),
//       total, notes, status: 'pending', source: 'landing_page'
//     };
//     await addDoc(collection(db, "inquiries"), inquiryDoc);
//     sendInquiryAutoReply(inquiryDoc); // fire-and-forget
//     cart = [];
//     renderCart();
//     showSuccessState(name, inquiryDoc.orderId, 3 - (limit.count + 1));
//   } catch (err) {
//     console.error("Inquiry submission failed:", err);
//     showToast('Failed to submit. Please try again or call us directly.', 'error');
//     btn.disabled  = false;
//     btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry to Gene\'s Lechon';
//   }
// };

// function showLimitWarning() {
//   const existing = document.getElementById('limitWarningBox');
//   if (existing) return;
//   const btn = document.getElementById('submitInquiryBtn');
//   if (!btn) return;
//   const box = document.createElement('div');
//   box.id = 'limitWarningBox';
//   box.style.cssText = 'background:#fff0e6;border:2px solid var(--red);border-radius:10px;padding:12px 16px;margin-bottom:14px;font-size:13px;font-weight:600;color:var(--red);display:flex;align-items:flex-start;gap:10px;';
//   box.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-top:1px;flex-shrink:0;"></i><div><strong>Daily limit reached.</strong><br/>Max 3 inquiries per day. Call us at <strong>(088) 123-4567</strong>.</div>`;
//   btn.parentNode.insertBefore(box, btn);
// }

// function showSuccessState(name, orderId, remaining) {
//   const remainingMsg = remaining > 0
//     ? `<p style="margin-top:10px;font-size:12px;color:var(--grey);">You can submit <strong>${remaining} more ${remaining===1?'inquiry':'inquiries'}</strong> today.</p>`
//     : `<p style="margin-top:10px;font-size:12px;color:var(--grey);">You've used all 3 inquiries today. Call us at <strong>(088) 123-4567</strong>.</p>`;
//   document.getElementById('inquiryModalBody').innerHTML = `
//     <div class="success-state">
//       <div class="check-circle">✅</div>
//       <h3>Inquiry Submitted!</h3>
//       <p>Hi <strong>${name}</strong>! Your inquiry <strong>${orderId}</strong> has been received.</p>
//       <p style="margin-top:8px;color:var(--grey);font-size:13px;">Our team will reach out shortly. Thank you for choosing Gene's Lechon! 🐷</p>
//       ${remainingMsg}
//       <button class="btn-done" onclick="closeInquiryModal()">Done</button>
//     </div>`;
// }

// // ============================================================
// //  MOBILE MENU
// // ============================================================

// window.toggleMobileMenu = function () {
//   const menu = document.getElementById('mobileMenu');
//   menu.classList.toggle('open');
//   document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
// };

// // ============================================================
// //  UTILITIES
// // ============================================================

// function fmt(n) { return '₱' + n.toLocaleString(undefined, { minimumFractionDigits: 2 }); }

// function animateCartBadge() {
//   const badge = document.getElementById('cartBadge');
//   badge.style.transform = 'scale(1.6)';
//   badge.style.transition = 'transform 0.2s';
//   setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
// }

// window.showToast = function (msg, type) {
//   let container = document.getElementById('toastContainer');
//   if (!container) { container = document.createElement('div'); container.id = 'toastContainer'; document.body.appendChild(container); }
//   const toast = document.createElement('div');
//   toast.className = `toast-item ${type}`;
//   toast.innerHTML = `${type==='success'?'✅':'❌'} ${msg}`;
//   container.appendChild(toast);
//   setTimeout(() => toast.remove(), 3000);
// };

// window.renderProducts([]);

// // ============================================================
// //  TRACKER
// // ============================================================

// window.openTracker = function () {
//   document.getElementById('trackerModal').classList.add('open');
//   document.body.style.overflow = 'hidden';
//   document.getElementById('trackInput').value = '';
//   document.getElementById('trackResult').innerHTML = '';
//   document.getElementById('trackInput').focus();
// };

// window.closeTracker = function () {
//   document.getElementById('trackerModal').classList.remove('open');
//   document.body.style.overflow = '';
// };

// window.clearTrackResult = function () {
//   document.getElementById('trackResult').innerHTML = '';
// };

// window.searchInquiry = async function () {
//   const raw = (document.getElementById('trackInput').value || '').trim();
//   if (!raw) { showToast('Please enter an Inquiry ID, email, or phone number.', 'error'); return; }
//   const resultEl = document.getElementById('trackResult');
//   const btn      = document.getElementById('trackBtn');
//   btn.disabled   = true;
//   btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Searching…';
//   resultEl.innerHTML = `<div class="track-loading"><div class="track-spinner"></div><p style="color:var(--grey);font-size:13px;font-weight:600;">Looking up your inquiry…</p></div>`;
//   try {
//     const inqCol = collection(db, 'inquiries');
//     let found = null;
//     const q1 = query(inqCol, where('orderId', '==', raw.toUpperCase()));
//     const s1 = await getDocs(q1);
//     if (!s1.empty) { found = { id: s1.docs[0].id, ...s1.docs[0].data() }; }
//     if (!found) {
//       const q2 = query(inqCol, where('email', '==', raw.toLowerCase()));
//       const s2 = await getDocs(q2);
//       if (!s2.empty) {
//         const sorted = s2.docs.sort((a,b) => ((b.data().createdAt?.seconds||0)-(a.data().createdAt?.seconds||0)));
//         found = { id: sorted[0].id, ...sorted[0].data() };
//       }
//     }
//     if (!found) {
//       const q3 = query(inqCol, where('phone', '==', raw));
//       const s3 = await getDocs(q3);
//       if (!s3.empty) {
//         const sorted = s3.docs.sort((a,b) => ((b.data().createdAt?.seconds||0)-(a.data().createdAt?.seconds||0)));
//         found = { id: sorted[0].id, ...sorted[0].data() };
//       }
//     }
//     btn.disabled  = false;
//     btn.innerHTML = '<i class="fas fa-search"></i> Find Inquiry';
//     if (!found) {
//       resultEl.innerHTML = `<div class="track-not-found"><i class="fas fa-search-minus"></i><p>No inquiry found for "<strong>${escHtml(raw)}</strong>".</p></div>`;
//       return;
//     }
//     renderTrackResult(found, resultEl);
//   } catch (err) {
//     console.error('Tracker error:', err);
//     btn.disabled  = false;
//     btn.innerHTML = '<i class="fas fa-search"></i> Find Inquiry';
//     resultEl.innerHTML = `<div class="track-not-found"><i class="fas fa-exclamation-circle"></i><p>Something went wrong. Please try again.</p></div>`;
//   }
// };

// function renderTrackResult(inq, el) {
//   const status      = (inq.status || 'pending').toLowerCase();
//   const statusMap   = { pending:'Pending', confirmed:'Confirmed', ready:'Ready', cancelled:'Cancelled' };
//   const statusLabel = statusMap[status] || status;
//   const items       = Array.isArray(inq.items) ? inq.items : [];
//   const itemsHtml   = items.length
//     ? items.map(i=>`<div class="track-item-row"><span>${escHtml(i.qty||1)}× ${escHtml(i.name)}</span><span>₱${parseFloat(i.price*(i.qty||1)).toLocaleString(undefined,{minimumFractionDigits:2})}</span></div>`).join('')
//     : '<div style="color:var(--grey);font-size:13px;">No items recorded.</div>';
//   const total = inq.total || items.reduce((s,i)=>s+(parseFloat(i.price||0)*(i.qty||1)),0);
//   const submittedStr = inq.createdAt
//     ? new Date(inq.createdAt.seconds*1000).toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})
//     : (inq.date||'—');
//   const statusOrder  = ['pending','confirmed','ready','cancelled'];
//   const currentIdx   = statusOrder.indexOf(status);
//   const timelineSteps = [
//     {key:'pending',icon:'fa-clock',label:'Submitted'},
//     {key:'confirmed',icon:'fa-check-circle',label:'Confirmed'},
//     {key:'ready',icon:'fa-box-open',label:'Ready'},
//   ];
//   if (status==='cancelled') timelineSteps.push({key:'cancelled',icon:'fa-times-circle',label:'Cancelled'});
//   const timelineHtml = timelineSteps.map(step=>{
//     const stepIdx = statusOrder.indexOf(step.key);
//     const isDone  = stepIdx < currentIdx || (step.key===status && status!=='pending');
//     const isActive= step.key===status;
//     return `<div class="track-step ${isDone?'done':isActive?'active':''}"><div class="track-step-dot"><i class="fas ${step.icon}" style="font-size:11px;"></i></div><div class="track-step-label">${step.label}</div></div>`;
//   }).join('');
//   const statusNote = {pending:'⏳ Your inquiry has been received. We\'ll confirm it shortly!',confirmed:'✅ Great news! Your order is confirmed.',ready:'🎉 Your order is ready!',cancelled:'❌ This inquiry was cancelled.'}[status]||'';
//   el.innerHTML = `
//     <div class="track-result-card">
//       <div class="track-result-header">
//         <span class="track-order-id">${escHtml(inq.orderId||inq.id)}</span>
//         <span class="track-status-pill ${status}">${statusLabel}</span>
//       </div>
//       <div class="track-result-body">
//         <p style="font-size:13px;font-weight:600;color:var(--dark);background:white;border-radius:8px;padding:10px 14px;border-left:3px solid var(--red);">${statusNote}</p>
//         <div class="track-status-timeline">${timelineHtml}</div>
//         <div class="track-info-row"><i class="fas fa-user"></i><span class="track-info-label">Name</span><span class="track-info-value">${escHtml(inq.customer||inq.name||'—')}</span></div>
//         <div class="track-info-row"><i class="fas fa-calendar"></i><span class="track-info-label">Submitted</span><span class="track-info-value">${submittedStr}</span></div>
//         <div class="track-info-row"><i class="fas fa-truck"></i><span class="track-info-label">Pickup Date</span><span class="track-info-value">${escHtml(inq.pickupDate||inq.date||'—')}</span></div>
//         <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--grey);margin-top:6px;">Order Items</div>
//         <div class="track-items-list">${itemsHtml}<div class="track-total-row"><span>Total</span><span>₱${parseFloat(total).toLocaleString(undefined,{minimumFractionDigits:2})}</span></div></div>
//         ${inq.notes?`<div class="track-info-row" style="align-items:flex-start;"><i class="fas fa-comment-alt" style="margin-top:2px;"></i><span class="track-info-label">Notes</span><span class="track-info-value">${escHtml(inq.notes)}</span></div>`:''}
//         <p style="font-size:12px;color:var(--grey);text-align:center;margin-top:6px;">Questions? Call <strong>(088) 123-4567</strong></p>
//       </div>
//     </div>`;
// }

// function escHtml(str) {
//   return String(str??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
// }

// // ============================================================
// //  AUTO-REPLY EMAIL — EMAILJS
// //  Setup: https://emailjs.com
// //  1. Create account → Email Services → connect Gmail
// //  2. Email Templates → create template with vars:
// //     {{to_email}}, {{to_name}}, {{order_id}}, {{order_items}},
// //     {{order_total}}, {{order_date}}, {{order_time}},
// //     {{order_type}}, {{tracking_url}}, {{notes}}
// //  3. Replace the IDs below
// // ============================================================

// const EMAILJS_SERVICE_ID   = 'YOUR_SERVICE_ID';
// const EMAILJS_TEMPLATE_ID  = 'YOUR_TEMPLATE_ID';
// const EMAILJS_PUBLIC_KEY   = 'YOUR_PUBLIC_KEY';

// function loadEmailJS() {
//   return new Promise((resolve) => {
//     if (window.emailjs) { resolve(); return; }
//     const s = document.createElement('script');
//     s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
//     s.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); resolve(); };
//     document.head.appendChild(s);
//   });
// }

// async function sendInquiryAutoReply(inq) {
//   if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID') {
//     console.log('📧 [DEV] Would send auto-reply to:', inq.email, '| Inquiry:', inq.orderId);
//     return;
//   }
//   try {
//     await loadEmailJS();
//     const itemsList = (inq.items || []).map(i =>
//       `• ${i.qty}x ${i.name} — ₱${(parseFloat(i.price) * i.qty).toLocaleString(undefined, {minimumFractionDigits:2})}`
//     ).join('\n');
//     const trackingUrl = `${window.location.origin}${window.location.pathname}?track=${encodeURIComponent(inq.orderId)}`;
//     await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
//       to_email:    inq.email,
//       to_name:     inq.customer,
//       order_id:    inq.orderId,
//       order_items: itemsList,
//       order_total: `₱${parseFloat(inq.total).toLocaleString(undefined, {minimumFractionDigits:2})}`,
//       order_date:  inq.orderDate,
//       order_time:  inq.orderTime,
//       order_type:  inq.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup',
//       notes:       inq.notes || 'None',
//       tracking_url: trackingUrl,
//       submitted_at: new Date().toLocaleString('en-PH', { dateStyle:'long', timeStyle:'short' }),
//     });
//     console.log('📧 Auto-reply sent to', inq.email);
//   } catch(err) {
//     console.warn('📧 Email failed (non-critical):', err);
//   }
// }

// // Auto-open tracker if ?track=ID in URL
// (function checkTrackParam() {
//   const params  = new URLSearchParams(window.location.search);
//   const trackId = params.get('track');
//   if (trackId) {
//     setTimeout(() => {
//       const input = document.getElementById('trackInput');
//       if (input) { input.value = trackId; openTracker(); searchInquiry(); }
//     }, 1500);
//   }
// })();

// // ============================================================
// //  RULE-BASED CHATBOT — No API needed, always works
// // ============================================================

// const CHAT_RULES = [
//   // Greetings
//   { match: ['hi','hello','hey','kumusta','kamusta','good morning','good afternoon','good evening','magandang','musta'],
//     reply: `Kumusta! 🐷 I'm **Lechon Buddy**, Gene's Lechon virtual assistant! How can I help you today?`,
//     chips: ['How to order?','Prices?','Delivery?','Store hours','Location'] },

//   // How to order
//   { match: ['how to order','paano mag order','order','mag order','how do i','how can i order','pano'],
//     reply: `Here's how to order from Gene's Lechon:\n\n1. 🛒 Browse our **Menu** section above\n2. Click **Add to Cart** on the items you want\n3. Click **My Order** (top right)\n4. Click **Send Inquiry** and fill out the form\n5. We'll contact you to confirm! 🐷`,
//     chips: ['Prices?','Delivery?','Payment methods','Store hours'] },

//   // Prices / menu
//   { match: ['price','presyo','magkano','how much','cost','rate','pila','menu','list'],
//     reply: `Here are some of our prices 🐷:\n\n🐷 **Whole Lechon** — ₱6,000–₱10,000\n🥩 **Lechon Belly** — ₱1,800–₱3,200\n🍖 **Dinakdakan** — ₱1,200\n🍗 **Inasal** — ₱1,150\n🍲 **Halang-Halang** — ₱900\n🍛 **Afritada** — ₱1,000\n🥗 **Gene's Salad** — ₱700\n🍝 **Spaghetti** — ₱1,200\n\nAnd many more! Browse the full menu above. 😊`,
//     chips: ['How to order?','Delivery?','Whole Lechon price','Lechon Belly price'] },

//   // Whole lechon price
//   { match: ['whole lechon','buong lechon','whole'],
//     reply: `🐷 **Whole Lechon** pricing:\n\n• 18-20kg — ₱6,000\n• 21-22kg — ₱8,000\n• 23kg+ — ₱10,000\n\nPrice depends on size/weight. Perfect for parties and events! Want to place an order?`,
//     chips: ['How to order?','Delivery?','Payment methods','Call you now?'] },

//   // Lechon belly
//   { match: ['belly','lechon belly','liempo'],
//     reply: `🥩 **Lechon Belly** pricing:\n\n• Small — ₱1,800\n• Medium — ₱2,500\n• Large — ₱3,200\n\nCrispy on the outside, juicy on the inside! 😍`,
//     chips: ['How to order?','Delivery?','Payment methods'] },

//   // Delivery
//   { match: ['deliver','delivery','dalhin','hatid','padala','bring','ship'],
//     reply: `Yes, we offer delivery within **Cagayan de Oro City**! 🚚\n\nDelivery is available daily from **8:00 AM – 8:00 PM**.\n\nTo arrange delivery, just add items to your cart and select **"Delivery"** in the order form. Enter your barangay and address. 📍`,
//     chips: ['Delivery fee?','How long?','How to order?','Payment methods'] },

//   // Delivery fee
//   { match: ['delivery fee','fee','charge','bayad','gastos','cost delivery','magkano delivery'],
//     reply: `Delivery fees depend on your location within CDO. The exact fee will be confirmed when we contact you after your inquiry. 🚚\n\nFor the most accurate quote, please include your complete address in the order form!`,
//     chips: ['How to order?','Payment methods','Store hours'] },

//   // Pickup
//   { match: ['pickup','pick up','take out','takeout','kuha','self','store pickup'],
//     reply: `Yes! You can pick up your order at our store 🏪:\n\n📍 **123 Lechon Street, Divisoria, CDO**\n🕐 Daily: **7:00 AM – 8:00 PM**\n\nJust select "Pickup at Store" when filling out the order form. We'll confirm your order and let you know when it's ready!`,
//     chips: ['How to order?','Location','Store hours'] },

//   // Location / address
//   { match: ['where','location','address','lugar','nasa saan','saan kayo','nasaan','find you','map','directions'],
//     reply: `📍 **Gene's Lechon**\n123 Lechon Street, Divisoria\nCagayan de Oro City, 9000\n\nYou can also find us on the map at the bottom of this page! 🗺️`,
//     chips: ['Store hours','Contact number','How to order?'] },

//   // Store hours
//   { match: ['hours','bukas','open','close','time','oras','schedule','anong oras'],
//     reply: `⏰ **Store Hours:**\nOpen **Daily** — 7:00 AM to 8:00 PM\n\nWe're open every day including weekends and holidays! 🐷`,
//     chips: ['Location','Contact number','How to order?'] },

//   // Contact / phone
//   { match: ['contact','phone','number','call','text','sms','viber','tanong','hotline','numero'],
//     reply: `📞 **Contact Gene's Lechon:**\n\n• Phone/Viber/SMS: **(088) 123-4567**\n• Mobile: **+63 917 000 0000**\n• Email: info@geneslechon.com\n• Facebook: facebook.com/geneslechon\n\nFeel free to reach out anytime! 😊`,
//     chips: ['Store hours','Location','How to order?'] },

//   // Payment
//   { match: ['payment','bayad','pay','gcash','cash','paymaya','maya','bank','transfer','how to pay'],
//     reply: `💳 **Payment Methods:**\n\n• 💵 Cash on delivery/pickup\n• 📱 GCash\n• 🏦 Bank Transfer\n\nPayment details will be confirmed when our team contacts you after your inquiry! 🐷`,
//     chips: ['How to order?','Delivery?','Store hours'] },

//   // Promos / discounts
//   { match: ['promo','discount','sale','offer','cheaper','bawas','libre','free','special'],
//     reply: `🎉 For the latest promos and special offers, check our **Facebook page**: facebook.com/geneslechon\n\nYou can also call us at **(088) 123-4567** to ask about current deals! 🐷`,
//     chips: ['Prices?','How to order?','Contact number'] },

//   // Events / catering
//   { match: ['event','catering','party','kaarawan','birthday','fiesta','wedding','reunion','bulk','malaki','marami'],
//     reply: `🎊 We love catering events! Gene's Lechon is perfect for:\n\n• 🎂 Birthdays\n• 💒 Weddings\n• 🏠 Family reunions\n• 🎉 Fiestas & celebrations\n\nFor bulk orders and event catering, please call us directly at **(088) 123-4567** so we can give you the best quote!`,
//     chips: ['Whole Lechon price','Contact number','How to order?'] },

//   // Track order
//   { match: ['track','status','where is my order','order status','inquiry','check order','inq-'],
//     reply: `🔍 To track your inquiry, click the **"Track Order"** button in the navigation bar, or scroll to the **Track Your Inquiry** section.\n\nYou can search using your:\n• Inquiry ID (e.g. INQ-123456)\n• Email address\n• Phone number`,
//     chips: ['How to order?','Contact number'] },

//   // Thank you
//   { match: ['thank','thanks','salamat','ty','maraming salamat','daghan salamat'],
//     reply: `Salamat! 🐷 Thank you for choosing Gene's Lechon! We hope to serve you the best lechon in CDO. *Walang kapantay ang sarap!* 😊`,
//     chips: ['How to order?','Prices?','Store hours'] },

//   // Call us
//   { match: ['call you','call now','tawag','i want to call'],
//     reply: `Sure! You can call us anytime during store hours:\n\n📞 **(088) 123-4567**\n📱 **+63 917 000 0000**\n\n⏰ We're available **Daily 7:00 AM – 8:00 PM** 🐷`,
//     chips: ['Store hours','Location','How to order?'] },
// ];

// // Fallback responses
// const FALLBACK_REPLIES = [
//   `I'm not sure about that, but I can help with ordering, prices, delivery, and store info! 🐷 Or call us at **(088) 123-4567**.`,
//   `Hmm, I didn't quite get that! Try asking about our **menu**, **prices**, **delivery**, or **store hours**. 😊`,
//   `For that question, it's best to call us directly at **(088) 123-4567** or message us on Facebook! 🐷`,
// ];

// function getBotReply(text) {
//   const lower = text.toLowerCase().trim();
//   for (const rule of CHAT_RULES) {
//     if (rule.match.some(keyword => lower.includes(keyword))) {
//       return rule;
//     }
//   }
//   return {
//     reply: FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)],
//     chips: ['How to order?','Prices?','Delivery?','Contact number','Store hours']
//   };
// }

// const chatHistory = [];
// let chatOpen = false;
// let chatInitialized = false;

// window.toggleChat = function() {
//   chatOpen = !chatOpen;
//   const win = document.getElementById('chatWindow');
//   const fab = document.getElementById('chatFab');
//   win.classList.toggle('open', chatOpen);
//   const dot = fab.querySelector('.chat-notif');
//   if (dot) dot.style.display = 'none';
//   if (chatOpen && !chatInitialized) { chatInitialized = true; initChat(); }
//   if (chatOpen) setTimeout(() => document.getElementById('chatInput')?.focus(), 300);
// };

// function initChat() {
//   appendBotMessage("Kumusta! 🐷 I'm **Lechon Buddy**, Gene's Lechon assistant! How can I help you today?");
//   showQuickChips(['How to order?', 'Prices?', 'Delivery?', 'Store hours', 'Location', 'Contact']);
// }

// function appendBotMessage(text) {
//   const msgs = document.getElementById('chatMessages');
//   const bubble = document.createElement('div');
//   bubble.className = 'chat-bubble-bot';
//   bubble.innerHTML = text
//     .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//     .replace(/\n/g, '<br>');
//   msgs.appendChild(bubble);
//   msgs.scrollTop = msgs.scrollHeight;
// }

// function appendUserMessage(text) {
//   const msgs = document.getElementById('chatMessages');
//   const bubble = document.createElement('div');
//   bubble.className = 'chat-bubble-user';
//   bubble.textContent = text;
//   msgs.appendChild(bubble);
//   msgs.scrollTop = msgs.scrollHeight;
// }

// function showTyping() {
//   const msgs = document.getElementById('chatMessages');
//   const el = document.createElement('div');
//   el.className = 'chat-bubble-bot';
//   el.id = 'typingIndicator';
//   el.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
//   msgs.appendChild(el);
//   msgs.scrollTop = msgs.scrollHeight;
//   return el;
// }

// function removeTyping() { document.getElementById('typingIndicator')?.remove(); }

// function showQuickChips(chips) {
//   const container = document.getElementById('chatChips');
//   container.innerHTML = '';
//   chips.forEach(chip => {
//     const btn = document.createElement('button');
//     btn.className = 'chat-chip';
//     btn.textContent = chip;
//     btn.onclick = () => { container.innerHTML = ''; handleUserMessage(chip); };
//     container.appendChild(btn);
//   });
// }

// window.sendChat = function() {
//   const input = document.getElementById('chatInput');
//   const text = input.value.trim();
//   if (!text) return;
//   input.value = '';
//   document.getElementById('chatChips').innerHTML = '';
//   handleUserMessage(text);
// };

// function handleUserMessage(text) {
//   appendUserMessage(text);
//   showTyping();
//   // Simulate brief thinking delay
//   setTimeout(() => {
//     removeTyping();
//     const result = getBotReply(text);
//     appendBotMessage(result.reply);
//     if (result.chips) showQuickChips(result.chips);
//   }, 600);
// }












import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getFirestore, collection, onSnapshot, addDoc,
  query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// ── Firebase config ──────────────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyBvsn9hLvi4Tq9mLvoo1-YL1uzbB_ntL7s",
  authDomain:        "pos-and-sales-monitoring.firebaseapp.com",
  projectId:         "pos-and-sales-monitoring",
  storageBucket:     "pos-and-sales-monitoring.firebasestorage.app",
  messagingSenderId: "516453934117",
  appId:             "1:516453934117:web:1783067b8aa6b37373cbcc",
  measurementId:     "G-FT1G64DB9N"
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

// ── HuggingFace API ──────────────────────────────────────────
const GROQ_API_KEY = "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";

// ── State ────────────────────────────────────────────────────
let allProducts    = [];
let activeCategory = 'all';
let cart           = [];

// ============================================================
//  FIREBASE LISTENERS
// ============================================================

onSnapshot(collection(db, "categories"), (snap) => {
  const tabs = document.getElementById('catTabs');
  tabs.innerHTML = `<button class="cat-tab ${activeCategory === 'all' ? 'active' : ''}"
    onclick="filterCat('all', this)">All Products</button>`;
  snap.forEach(d => {
    const name = d.data().name;
    tabs.innerHTML += `<button class="cat-tab ${activeCategory === name ? 'active' : ''}"
      onclick="filterCat('${name}', this)">${name}</button>`;
  });
});

onSnapshot(collection(db, "products"), (snap) => {
  allProducts = [];
  snap.forEach(d => {
    const data = d.data();
    if (data.status === 'inactive' || data.status === 'archived' || data.archived === true) return;
    const qty = data.quantity !== undefined ? Number(data.quantity) : Number(data.stock || 0);
    allProducts.push({ id: d.id, ...data, quantity: isNaN(qty) ? 0 : qty });
  });
  const search = document.getElementById('searchInput')?.value || '';
  renderProducts(applyFilters(allProducts, activeCategory, search));
  updateProductCount();
});

// ============================================================
//  FILTERING
// ============================================================

window.filterCat = function (cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts(applyFilters(allProducts, cat, document.getElementById('searchInput')?.value || ''));
};

window.handleSearch = function (val) {
  renderProducts(applyFilters(allProducts, activeCategory, val));
};

function applyFilters(list, cat, search) {
  return list.filter(p => {
    const matchCat    = cat === 'all' || (p.category || '').toLowerCase() === cat.toLowerCase();
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
}

function updateProductCount() {
  const el = document.getElementById('productCount');
  if (el) el.textContent = `${allProducts.length} product${allProducts.length !== 1 ? 's' : ''} available`;
}

// ============================================================
//  RENDER PRODUCTS
// ============================================================

window.renderProducts = function (list) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--grey);">
        <i class="fas fa-search" style="font-size:40px;opacity:0.3;margin-bottom:12px;display:block;"></i>
        <p style="font-weight:700;font-size:16px;">No products found</p>
      </div>`;
    return;
  }

  list.forEach(p => {
    const qty      = Number(p.quantity || p.stock || 0);
    const isOOS    = qty <= 0;
    const price    = parseFloat(p.price || p.cost || 0);
    const imgUrl   = p.imageUrl || p.image || p.img || p.photoURL || '';
    const lowStock = qty > 0 && qty <= 5;
    const cartItem = cart.find(i => i.id === p.id);
    const cartQty  = cartItem ? cartItem.qty : 0;

    const card = document.createElement('div');
    card.className = `product-card ${isOOS ? 'oos' : ''}`;
    if (!isOOS) card.onclick = () => window.addToCart(p);

    card.innerHTML = `
      ${cartQty > 0 ? `<span class="product-cart-badge">${cartQty}</span>` : ''}
      <div class="card-img-placeholder">
        ${imgUrl ? `<img src="${imgUrl}" alt="${p.name}" onerror="this.parentElement.innerHTML='🐷'"/>` : '🐷'}
      </div>
      ${isOOS    ? '<div class="oos-tag">Out of Stock</div>'    : ''}
      ${lowStock ? `<div class="stock-tag">${qty} left!</div>` : ''}
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-footer">
          <span class="card-price">₱${price.toLocaleString()}</span>
          ${!isOOS ? `<button class="btn-add" title="Add to cart"><i class="fas fa-cart-plus"></i> Add to Cart</button>` : ''}
        </div>
      </div>`;
    grid.appendChild(card);
  });
};

// ============================================================
//  CART
// ============================================================

window.addToCart = function (product) {
  const existing = cart.find(i => i.id === product.id);
  const stock    = Number(product.quantity || product.stock || 0);
  const current  = existing ? existing.qty : 0;
  if (current + 1 > stock) { showToast('Not enough stock!', 'error'); return; }
  if (existing) { existing.qty++; }
  else {
    cart.push({ id: product.id, name: product.name, price: parseFloat(product.price || product.cost || 0), qty: 1, unit: product.unit || 'pcs' });
  }
  renderCart();
  renderProducts(applyFilters(allProducts, activeCategory, document.getElementById('searchInput')?.value || ''));
  showToast(`${product.name} added!`, 'success');
  if (!document.getElementById('cartDrawer').classList.contains('open')) animateCartBadge();
};

window.updateCartQty = function (id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
  renderProducts(applyFilters(allProducts, activeCategory, document.getElementById('searchInput')?.value || ''));
};

function renderCart() {
  const list    = document.getElementById('cartItemsList');
  const badge   = document.getElementById('cartBadge');
  const totalEl = document.getElementById('cartTotal');
  const btn     = document.getElementById('inquireBtn');
  const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);
  badge.textContent   = totalQty;
  totalEl.textContent = fmt(totalPrice);
  btn.disabled        = cart.length === 0;
  if (cart.length === 0) {
    list.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>No items added yet</p></div>`;
    return;
  }
  list.innerHTML = '';
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    row.innerHTML = `
      <div class="ci-icon">🐷</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">${fmt(item.price * item.qty)}</div>
      </div>
      <div class="ci-qty">
        <button onclick="updateCartQty('${item.id}', -1)"><i class="fas fa-minus" style="font-size:10px;"></i></button>
        <span>${item.qty}</span>
        <button onclick="updateCartQty('${item.id}', 1)"><i class="fas fa-plus" style="font-size:10px;"></i></button>
      </div>`;
    list.appendChild(row);
  });
}

window.toggleCart = function () {
  const drawer  = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  drawer.classList.toggle('open');
  overlay.classList.toggle('open');
  document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
};

// ============================================================
//  INQUIRY MODAL
// ============================================================

window.openInquiryModal = function () {
  if (cart.length === 0) return;
  renderInquiryForm(cart.reduce((s, i) => s + i.price * i.qty, 0));
  document.getElementById('inquiryModal').classList.add('open');
};

window.closeInquiryModal = function () {
  document.getElementById('inquiryModal').classList.remove('open');
};

function renderInquiryForm(total) {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('inquiryModalBody').innerHTML = `
    <div class="order-summary">
      <h4>Your Order</h4>
      ${cart.map(i => `
        <div class="os-item">
          <span>${i.qty}× ${i.name}</span>
          <span>${fmt(i.price * i.qty)}</span>
        </div>`).join('')}
      <div class="os-total"><span>Total</span><span>${fmt(total)}</span></div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label><i class="fas fa-user" style="color:var(--red);margin-right:5px;"></i> Full Name *</label>
        <input type="text" id="inqName" placeholder="Juan dela Cruz" oninput="validateInqName(this.value)"/>
        <small id="inqNameHint" style="display:block;min-height:16px;margin-top:4px;font-size:11px;color:var(--red);font-weight:700;"></small>
      </div>
      <div class="form-group">
        <label><i class="fas fa-phone" style="color:var(--red);margin-right:5px;"></i> Phone Number *</label>
        <input type="tel" id="inqPhone" placeholder="09xxxxxxxxx" oninput="validateInqPhone(this.value)"/>
        <small id="inqPhoneHint" style="display:block;min-height:16px;margin-top:4px;font-size:11px;color:var(--red);font-weight:700;"></small>
      </div>
    </div>
    <div class="form-group">
      <label><i class="fas fa-envelope" style="color:var(--red);margin-right:5px;"></i> Email Address *</label>
      <input type="email" id="inqEmail" placeholder="juan@gmail.com"/>
    </div>
    <div class="form-group">
      <label><i class="fas fa-truck" style="color:var(--red);margin-right:5px;"></i> Order Type *</label>
      <select id="inqType" onchange="toggleDeliveryFields()">
        <option value="pickup">🏪 Pickup at Store</option>
        <option value="delivery">🚚 Delivery</option>
      </select>
    </div>
    <div id="deliveryAddressWrap" style="display:none;">
      <div class="form-group">
        <label><i class="fas fa-map-marker-alt" style="color:var(--red);margin-right:5px;"></i> Street / House No. / Landmark *</label>
        <input type="text" id="inqStreet" placeholder="e.g. 123 Rizal St., near 7-Eleven"/>
      </div>
      <div class="form-group">
        <label><i class="fas fa-map" style="color:var(--red);margin-right:5px;"></i> Barangay *</label>
        <input type="text" id="inqBarangay" placeholder="e.g. Bulua, Lapasan, Nazareth..."/>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>City / Municipality</label>
          <input type="text" value="Cagayan de Oro City" readonly style="background:#f5f5f5;color:var(--grey);cursor:not-allowed;"/>
        </div>
        <div class="form-group">
          <label>Province</label>
          <input type="text" value="Misamis Oriental" readonly style="background:#f5f5f5;color:var(--grey);cursor:not-allowed;"/>
        </div>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label><i class="fas fa-calendar" style="color:var(--red);margin-right:5px;"></i> Pickup / Delivery Date *</label>
        <input type="date" id="inqDate" min="${today}"/>
      </div>
      <div class="form-group">
        <label><i class="fas fa-clock" style="color:var(--red);margin-right:5px;"></i> Preferred Time *</label>
        <input type="time" id="inqTime" onchange="validateInqTime(this.value)"/>
        <small id="inqTimeHint" style="color:var(--grey);font-size:11px;margin-top:4px;display:block;">
          Store hours: 8:00 AM – 10:00 PM · No delivery 12:00 AM – 4:00 AM
        </small>
      </div>
    </div>
    <div class="form-group">
      <label><i class="fas fa-comment-alt" style="color:var(--red);margin-right:5px;"></i> Special Instructions</label>
      <textarea id="inqNotes" rows="3" placeholder="Any special requests, event details..."></textarea>
    </div>
    <button class="btn-submit-inquiry" id="submitInquiryBtn" onclick="submitInquiry()">
      <i class="fas fa-paper-plane"></i> Send Inquiry to Gene's Lechon
    </button>`;
}

async function checkDailyLimit(name, email, phone) {
  const MAX   = 3;
  const now   = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const end   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();
  try {
    const snap = await getDocs(query(collection(db, "inquiries"), where("date", ">=", start), where("date", "<=", end)));
    const emailLow = email.toLowerCase();
    let count = 0;
    snap.forEach(d => {
      const data = d.data();
      if ((data.email||'').toLowerCase()===emailLow || (data.phone||'')===phone || (data.customer||'')===name) count++;
    });
    return { count, blocked: count >= MAX, remaining: Math.max(0, MAX - count) };
  } catch (err) {
    console.warn('Rate limit check failed:', err.message);
    return { count: 0, blocked: false, remaining: MAX };
  }
}

function isNightTimeBlocked(timeStr) {
  if (!timeStr) return false;
  const [h] = timeStr.split(':').map(Number);
  return h >= 0 && h < 4;
}
function isOutsideStoreHours(timeStr) {
  if (!timeStr) return false;
  const [h, m] = timeStr.split(':').map(Number);
  const mins = h * 60 + m;
  return mins < 8 * 60 || mins > 22 * 60;
}

window.toggleDeliveryFields = function () {
  const type    = document.getElementById('inqType')?.value;
  const wrapper = document.getElementById('deliveryAddressWrap');
  if (wrapper) wrapper.style.display = (type === 'delivery') ? 'block' : 'none';
};

window.validateInqTime = function (val) {
  const hint = document.getElementById('inqTimeHint');
  const type = document.getElementById('inqType')?.value;
  if (!hint) return;
  if (type === 'delivery' && isNightTimeBlocked(val)) {
    hint.textContent = '⛔ No deliveries from 12:00 AM to 4:00 AM.';
    hint.style.color = 'var(--red)'; hint.style.fontWeight = '700';
  } else if (isOutsideStoreHours(val)) {
    hint.textContent = '⛔ Outside store hours (8:00 AM – 10:00 PM).';
    hint.style.color = 'var(--red)'; hint.style.fontWeight = '700';
  } else {
    hint.textContent = 'Store hours: 8:00 AM – 10:00 PM · No delivery 12:00 AM – 4:00 AM';
    hint.style.color = 'var(--grey)'; hint.style.fontWeight = '';
  }
};

window.validateInqName = function (val) {
  const hint = document.getElementById('inqNameHint');
  if (!hint) return;
  hint.textContent = /\d/.test(val) ? '⛔ Name must not contain numbers.' : '';
};

window.validateInqPhone = function (val) {
  const hint = document.getElementById('inqPhoneHint');
  if (!hint || !val) { if (hint) hint.textContent = ''; return; }
  const digits = val.replace(/\D/g, '').replace(/^63/, '0');
  const ok = /^09\d{9}$/.test(digits);
  hint.textContent = ok || digits.length < 4 ? '' : '⛔ Number must start with 9 (e.g. 09xxxxxxxxx).';
};

window.submitInquiry = async function () {
  const name     = document.getElementById('inqName')?.value?.trim();
  const phone    = document.getElementById('inqPhone')?.value?.trim();
  const email    = document.getElementById('inqEmail')?.value?.trim();
  const date     = document.getElementById('inqDate')?.value;
  const time     = document.getElementById('inqTime')?.value;
  const notes    = document.getElementById('inqNotes')?.value?.trim() || '';
  const type     = document.getElementById('inqType')?.value || 'pickup';
  const street   = document.getElementById('inqStreet')?.value?.trim() || '';
  const barangay = document.getElementById('inqBarangay')?.value?.trim() || '';

  if (!name) { showToast('Please enter your full name.', 'error'); return; }
  if (/\d/.test(name)) { showToast('Name must not contain numbers.', 'error'); return; }
  if (!phone) { showToast('Please enter your phone number.', 'error'); return; }
  const digits = phone.replace(/\D/g, '').replace(/^63/, '0');
  if (!/^09\d{9}$/.test(digits)) { showToast('Phone number must start with 9 (e.g. 09xxxxxxxxx).', 'error'); return; }
  if (!email || !date || !time) { showToast('Please fill in all required fields!', 'error'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email address!', 'error'); return; }
  if (isOutsideStoreHours(time)) { showToast('Please choose a time within store hours (8:00 AM – 10:00 PM).', 'error'); return; }
  if (type === 'delivery' && isNightTimeBlocked(time)) { showToast('No deliveries from 12:00 AM to 4:00 AM.', 'error'); return; }
  if (type === 'delivery') {
    if (!street)   { showToast('Please enter your street / house address.', 'error'); return; }
    if (!barangay) { showToast('Please enter your barangay.', 'error'); return; }
  }

  const btn = document.getElementById('submitInquiryBtn');
  btn.disabled  = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';

  try {
    const limit = await checkDailyLimit(name, email, phone);
    if (limit.blocked) {
      showToast('You have reached the maximum of 3 inquiries per day.', 'error');
      btn.disabled  = false;
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry to Gene\'s Lechon';
      showLimitWarning();
      return;
    }
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const deliveryAddress = type === 'delivery' ? `${street}, ${barangay}, Cagayan de Oro City, Misamis Oriental` : '';
    const inquiryDoc = {
      orderId: `#INQ-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: name, email: email.toLowerCase(), phone,
      date: new Date().toISOString(), orderDate: date, orderTime: time,
      orderType: type, deliveryAddress, deliveryStreet: street, deliveryBarangay: barangay,
      deliveryCity: type==='delivery'?'Cagayan de Oro City':'', deliveryProvince: type==='delivery'?'Misamis Oriental':'',
      items: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, unit: i.unit||'pcs' })),
      total, notes, status: 'pending', source: 'landing_page'
    };
    await addDoc(collection(db, "inquiries"), inquiryDoc);
    sendInquiryAutoReply(inquiryDoc); // fire-and-forget
    cart = [];
    renderCart();
    showSuccessState(name, inquiryDoc.orderId, 3 - (limit.count + 1));
  } catch (err) {
    console.error("Inquiry submission failed:", err);
    showToast('Failed to submit. Please try again or call us directly.', 'error');
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Inquiry to Gene\'s Lechon';
  }
};

function showLimitWarning() {
  const existing = document.getElementById('limitWarningBox');
  if (existing) return;
  const btn = document.getElementById('submitInquiryBtn');
  if (!btn) return;
  const box = document.createElement('div');
  box.id = 'limitWarningBox';
  box.style.cssText = 'background:#fff0e6;border:2px solid var(--red);border-radius:10px;padding:12px 16px;margin-bottom:14px;font-size:13px;font-weight:600;color:var(--red);display:flex;align-items:flex-start;gap:10px;';
  box.innerHTML = `<i class="fas fa-exclamation-triangle" style="margin-top:1px;flex-shrink:0;"></i><div><strong>Daily limit reached.</strong><br/>Max 3 inquiries per day. Call us at <strong>(088) 123-4567</strong>.</div>`;
  btn.parentNode.insertBefore(box, btn);
}

function showSuccessState(name, orderId, remaining) {
  const remainingMsg = remaining > 0
    ? `<p style="margin-top:10px;font-size:12px;color:var(--grey);">You can submit <strong>${remaining} more ${remaining===1?'inquiry':'inquiries'}</strong> today.</p>`
    : `<p style="margin-top:10px;font-size:12px;color:var(--grey);">You've used all 3 inquiries today. Call us at <strong>(088) 123-4567</strong>.</p>`;
  document.getElementById('inquiryModalBody').innerHTML = `
    <div class="success-state">
      <div class="check-circle">✅</div>
      <h3>Inquiry Submitted!</h3>
      <p>Hi <strong>${name}</strong>! Your inquiry <strong>${orderId}</strong> has been received.</p>
      <p style="margin-top:8px;color:var(--grey);font-size:13px;">Our team will reach out shortly. Thank you for choosing Gene's Lechon! 🐷</p>
      ${remainingMsg}
      <button class="btn-done" onclick="closeInquiryModal()">Done</button>
    </div>`;
}

// ============================================================
//  MOBILE MENU
// ============================================================

window.toggleMobileMenu = function () {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
};

// ============================================================
//  UTILITIES
// ============================================================

function fmt(n) { return '₱' + n.toLocaleString(undefined, { minimumFractionDigits: 2 }); }

function animateCartBadge() {
  const badge = document.getElementById('cartBadge');
  badge.style.transform = 'scale(1.6)';
  badge.style.transition = 'transform 0.2s';
  setTimeout(() => { badge.style.transform = 'scale(1)'; }, 200);
}

window.showToast = function (msg, type) {
  let container = document.getElementById('toastContainer');
  if (!container) { container = document.createElement('div'); container.id = 'toastContainer'; document.body.appendChild(container); }
  const toast = document.createElement('div');
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `${type==='success'?'✅':'❌'} ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

window.renderProducts([]);

// ============================================================
//  TRACKER
// ============================================================

window.openTracker = function () {
  document.getElementById('trackerModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('trackInput').value = '';
  document.getElementById('trackResult').innerHTML = '';
  document.getElementById('trackInput').focus();
};

window.closeTracker = function () {
  document.getElementById('trackerModal').classList.remove('open');
  document.body.style.overflow = '';
};

window.clearTrackResult = function () {
  document.getElementById('trackResult').innerHTML = '';
};

window.searchInquiry = async function () {
  const raw = (document.getElementById('trackInput').value || '').trim();
  if (!raw) { showToast('Please enter an Inquiry ID, email, or phone number.', 'error'); return; }
  const resultEl = document.getElementById('trackResult');
  const btn      = document.getElementById('trackBtn');
  btn.disabled   = true;
  btn.innerHTML  = '<i class="fas fa-spinner fa-spin"></i> Searching…';
  resultEl.innerHTML = `<div class="track-loading"><div class="track-spinner"></div><p style="color:var(--grey);font-size:13px;font-weight:600;">Looking up your inquiry…</p></div>`;
  try {
    const inqCol = collection(db, 'inquiries');
    let found = null;
    const q1 = query(inqCol, where('orderId', '==', raw.toUpperCase()));
    const s1 = await getDocs(q1);
    if (!s1.empty) { found = { id: s1.docs[0].id, ...s1.docs[0].data() }; }
    if (!found) {
      const q2 = query(inqCol, where('email', '==', raw.toLowerCase()));
      const s2 = await getDocs(q2);
      if (!s2.empty) {
        const sorted = s2.docs.sort((a,b) => ((b.data().createdAt?.seconds||0)-(a.data().createdAt?.seconds||0)));
        found = { id: sorted[0].id, ...sorted[0].data() };
      }
    }
    if (!found) {
      const q3 = query(inqCol, where('phone', '==', raw));
      const s3 = await getDocs(q3);
      if (!s3.empty) {
        const sorted = s3.docs.sort((a,b) => ((b.data().createdAt?.seconds||0)-(a.data().createdAt?.seconds||0)));
        found = { id: sorted[0].id, ...sorted[0].data() };
      }
    }
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-search"></i> Find Inquiry';
    if (!found) {
      resultEl.innerHTML = `<div class="track-not-found"><i class="fas fa-search-minus"></i><p>No inquiry found for "<strong>${escHtml(raw)}</strong>".</p></div>`;
      return;
    }
    renderTrackResult(found, resultEl);
  } catch (err) {
    console.error('Tracker error:', err);
    btn.disabled  = false;
    btn.innerHTML = '<i class="fas fa-search"></i> Find Inquiry';
    resultEl.innerHTML = `<div class="track-not-found"><i class="fas fa-exclamation-circle"></i><p>Something went wrong. Please try again.</p></div>`;
  }
};

function renderTrackResult(inq, el) {
  const status      = (inq.status || 'pending').toLowerCase();
  const statusMap   = { pending:'Pending', confirmed:'Confirmed', ready:'Ready', cancelled:'Cancelled' };
  const statusLabel = statusMap[status] || status;
  const items       = Array.isArray(inq.items) ? inq.items : [];
  const itemsHtml   = items.length
    ? items.map(i=>`<div class="track-item-row"><span>${escHtml(i.qty||1)}× ${escHtml(i.name)}</span><span>₱${parseFloat(i.price*(i.qty||1)).toLocaleString(undefined,{minimumFractionDigits:2})}</span></div>`).join('')
    : '<div style="color:var(--grey);font-size:13px;">No items recorded.</div>';
  const total = inq.total || items.reduce((s,i)=>s+(parseFloat(i.price||0)*(i.qty||1)),0);
  const submittedStr = inq.createdAt
    ? new Date(inq.createdAt.seconds*1000).toLocaleDateString('en-PH',{year:'numeric',month:'long',day:'numeric'})
    : (inq.date||'—');
  const statusOrder  = ['pending','confirmed','ready','cancelled'];
  const currentIdx   = statusOrder.indexOf(status);
  const timelineSteps = [
    {key:'pending',icon:'fa-clock',label:'Submitted'},
    {key:'confirmed',icon:'fa-check-circle',label:'Confirmed'},
    {key:'ready',icon:'fa-box-open',label:'Ready'},
  ];
  if (status==='cancelled') timelineSteps.push({key:'cancelled',icon:'fa-times-circle',label:'Cancelled'});
  const timelineHtml = timelineSteps.map(step=>{
    const stepIdx = statusOrder.indexOf(step.key);
    const isDone  = stepIdx < currentIdx || (step.key===status && status!=='pending');
    const isActive= step.key===status;
    return `<div class="track-step ${isDone?'done':isActive?'active':''}"><div class="track-step-dot"><i class="fas ${step.icon}" style="font-size:11px;"></i></div><div class="track-step-label">${step.label}</div></div>`;
  }).join('');
  const statusNote = {pending:'⏳ Your inquiry has been received. We\'ll confirm it shortly!',confirmed:'✅ Great news! Your order is confirmed.',ready:'🎉 Your order is ready!',cancelled:'❌ This inquiry was cancelled.'}[status]||'';
  el.innerHTML = `
    <div class="track-result-card">
      <div class="track-result-header">
        <span class="track-order-id">${escHtml(inq.orderId||inq.id)}</span>
        <span class="track-status-pill ${status}">${statusLabel}</span>
      </div>
      <div class="track-result-body">
        <p style="font-size:13px;font-weight:600;color:var(--dark);background:white;border-radius:8px;padding:10px 14px;border-left:3px solid var(--red);">${statusNote}</p>
        <div class="track-status-timeline">${timelineHtml}</div>
        <div class="track-info-row"><i class="fas fa-user"></i><span class="track-info-label">Name</span><span class="track-info-value">${escHtml(inq.customer||inq.name||'—')}</span></div>
        <div class="track-info-row"><i class="fas fa-calendar"></i><span class="track-info-label">Submitted</span><span class="track-info-value">${submittedStr}</span></div>
        <div class="track-info-row"><i class="fas fa-truck"></i><span class="track-info-label">Pickup Date</span><span class="track-info-value">${escHtml(inq.pickupDate||inq.date||'—')}</span></div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:var(--grey);margin-top:6px;">Order Items</div>
        <div class="track-items-list">${itemsHtml}<div class="track-total-row"><span>Total</span><span>₱${parseFloat(total).toLocaleString(undefined,{minimumFractionDigits:2})}</span></div></div>
        ${inq.notes?`<div class="track-info-row" style="align-items:flex-start;"><i class="fas fa-comment-alt" style="margin-top:2px;"></i><span class="track-info-label">Notes</span><span class="track-info-value">${escHtml(inq.notes)}</span></div>`:''}
        <p style="font-size:12px;color:var(--grey);text-align:center;margin-top:6px;">Questions? Call <strong>(088) 123-4567</strong></p>
      </div>
    </div>`;
}

function escHtml(str) {
  return String(str??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ============================================================
//  AUTO-REPLY EMAIL — EmailJS
// ============================================================

const EMAILJS_PUBLIC_KEY  = 'NF5dw0E3BIS13Motq';
const EMAILJS_SERVICE_ID  = 'service_z6kmqm8';
const EMAILJS_TEMPLATE_ID = 'template_c28un3k';

function loadEmailJS() {
  return new Promise((resolve) => {
    if (window.emailjs) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    s.onload = () => { window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); resolve(); };
    document.head.appendChild(s);
  });
}

async function sendInquiryAutoReply(inq) {
  try {
    await loadEmailJS();

    const itemsList = (inq.items || []).map(i =>
      `${i.qty}x ${i.name} — ₱${(parseFloat(i.price) * i.qty).toLocaleString(undefined, {minimumFractionDigits:2})}`
    ).join('\n');

    const trackingUrl = `${window.location.origin}${window.location.pathname}?track=${encodeURIComponent(inq.orderId)}`;

    const orderType = inq.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup';
    const address   = inq.orderType === 'delivery'
      ? `${inq.deliveryStreet}, ${inq.deliveryBarangay}, Cagayan de Oro City`
      : 'Pickup at store — 123 Lechon Street, Divisoria, CDO';

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:#ff4e00;padding:28px 32px;text-align:center;">
      <div style="font-size:40px;">🐷</div>
      <h1 style="color:#fff;margin:8px 0 4px;font-size:24px;">Gene's Lechon</h1>
      <p style="color:rgba(255,255,255,0.9);margin:0;font-size:14px;">Walang Kapantay ang Sarap!</p>
    </div>

    <!-- Body -->
    <div style="padding:28px 32px;">
      <h2 style="color:#1a1a2e;margin-top:0;">Hi ${inq.customer}! 🎉</h2>
      <p style="color:#555;line-height:1.6;">
        Your inquiry has been successfully submitted! We'll contact you shortly to confirm your order.
      </p>

      <!-- Order ID -->
      <div style="background:#fff0eb;border:2px solid #ff4e00;border-radius:10px;padding:16px;text-align:center;margin:20px 0;">
        <div style="font-size:12px;color:#ff4e00;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Your Inquiry ID</div>
        <div style="font-size:28px;font-weight:900;color:#ff4e00;letter-spacing:2px;">${inq.orderId}</div>
        <div style="font-size:12px;color:#888;margin-top:4px;">Save this ID to track your order</div>
      </div>

      <!-- Order Details -->
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr style="background:#f9f9f9;">
          <td style="padding:10px 14px;font-weight:700;color:#333;width:40%;border-bottom:1px solid #eee;">📋 Order Type</td>
          <td style="padding:10px 14px;color:#555;border-bottom:1px solid #eee;">${orderType}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:700;color:#333;border-bottom:1px solid #eee;">📍 Address</td>
          <td style="padding:10px 14px;color:#555;border-bottom:1px solid #eee;">${address}</td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:10px 14px;font-weight:700;color:#333;border-bottom:1px solid #eee;">📅 Date</td>
          <td style="padding:10px 14px;color:#555;border-bottom:1px solid #eee;">${inq.orderDate}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;font-weight:700;color:#333;border-bottom:1px solid #eee;">⏰ Time</td>
          <td style="padding:10px 14px;color:#555;border-bottom:1px solid #eee;">${inq.orderTime}</td>
        </tr>
        <tr style="background:#f9f9f9;">
          <td style="padding:10px 14px;font-weight:700;color:#333;">📝 Notes</td>
          <td style="padding:10px 14px;color:#555;">${inq.notes || 'None'}</td>
        </tr>
      </table>

      <!-- Order Items -->
      <h3 style="color:#1a1a2e;margin-bottom:12px;">🛒 Your Order</h3>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        ${(inq.items||[]).map((item, i) => `
        <tr style="background:${i%2===0?'#f9f9f9':'#fff'};">
          <td style="padding:10px 14px;color:#333;">${item.qty}× ${item.name}</td>
          <td style="padding:10px 14px;color:#ff4e00;font-weight:700;text-align:right;">₱${(parseFloat(item.price)*item.qty).toLocaleString(undefined,{minimumFractionDigits:2})}</td>
        </tr>`).join('')}
        <tr style="background:#ff4e00;">
          <td style="padding:12px 14px;color:#fff;font-weight:700;font-size:16px;">TOTAL</td>
          <td style="padding:12px 14px;color:#fff;font-weight:900;font-size:18px;text-align:right;">₱${parseFloat(inq.total).toLocaleString(undefined,{minimumFractionDigits:2})}</td>
        </tr>
      </table>

      <!-- Track button -->
      <div style="text-align:center;margin:24px 0;">
        <a href="${trackingUrl}" style="background:#ff4e00;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
          🔍 Track My Inquiry
        </a>
      </div>

      <p style="color:#888;font-size:13px;text-align:center;line-height:1.6;">
        Questions? Call us at <strong>(088) 123-4567</strong> or +63 917 000 0000<br/>
        📧 info@geneslechon.com | 📘 facebook.com/geneslechon
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#1a1a2e;padding:16px 32px;text-align:center;">
      <p style="color:rgba(255,255,255,0.6);font-size:12px;margin:0;">
        © 2025 Gene's Lechon • Cagayan de Oro City • Walang Kapantay!
      </p>
    </div>
  </div>
</body>
</html>`;

    await loadEmailJS();

    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:    inq.email,
      to_name:     inq.customer,
      order_id:    inq.orderId,
      order_items: itemsList,
      order_total: `₱${parseFloat(inq.total).toLocaleString(undefined, {minimumFractionDigits:2})}`,
      order_date:  inq.orderDate,
      order_time:  inq.orderTime,
      order_type:  inq.orderType === 'delivery' ? '🚚 Delivery' : '🏪 Pickup',
      address:     address,
      phone:       inq.phone,
      notes:       inq.notes || 'None',
      order_id_display: inq.orderId,
    });

    console.log('📧 Email sent to', inq.email);
  } catch(err) {
    console.warn('📧 Email error (non-critical):', err);
  }
}

// Auto-open tracker if ?track=ID in URL
(function checkTrackParam() {
  const params  = new URLSearchParams(window.location.search);
  const trackId = params.get('track');
  if (trackId) {
    setTimeout(() => {
      const input = document.getElementById('trackInput');
      if (input) { input.value = trackId; openTracker(); searchInquiry(); }
    }, 1500);
  }
})();

// ============================================================
//  RULE-BASED CHATBOT — No API needed, always works
// ============================================================

const CHAT_RULES = [
  // Greetings
  { match: ['hi','hello','hey','kumusta','kamusta','good morning','good afternoon','good evening','magandang','musta'],
    reply: `Kumusta! 🐷 I'm **Lechon Buddy**, Gene's Lechon virtual assistant! How can I help you today?`,
    chips: ['How to order?','Prices?','Delivery?','Store hours','Location'] },

  // How to order
  { match: ['how to order','paano mag order','order','mag order','how do i','how can i order','pano'],
    reply: `Here's how to order from Gene's Lechon:\n\n1. 🛒 Browse our **Menu** section above\n2. Click **Add to Cart** on the items you want\n3. Click **My Order** (top right)\n4. Click **Send Inquiry** and fill out the form\n5. We'll contact you to confirm! 🐷`,
    chips: ['Prices?','Delivery?','Payment methods','Store hours'] },

  // Prices / menu
  { match: ['price','presyo','magkano','how much','cost','rate','pila','menu','list'],
    reply: `Here are some of our prices 🐷:\n\n🐷 **Whole Lechon** — ₱6,000–₱10,000\n🥩 **Lechon Belly** — ₱1,800–₱3,200\n🍖 **Dinakdakan** — ₱1,200\n🍗 **Inasal** — ₱1,150\n🍲 **Halang-Halang** — ₱900\n🍛 **Afritada** — ₱1,000\n🥗 **Gene's Salad** — ₱700\n🍝 **Spaghetti** — ₱1,200\n\nAnd many more! Browse the full menu above. 😊`,
    chips: ['How to order?','Delivery?','Whole Lechon price','Lechon Belly price'] },

  // Whole lechon price
  { match: ['whole lechon','buong lechon','whole'],
    reply: `🐷 **Whole Lechon** pricing:\n\n• 18-20kg — ₱6,000\n• 21-22kg — ₱8,000\n• 23kg+ — ₱10,000\n\nPrice depends on size/weight. Perfect for parties and events! Want to place an order?`,
    chips: ['How to order?','Delivery?','Payment methods','Call you now?'] },

  // Lechon belly
  { match: ['belly','lechon belly','liempo'],
    reply: `🥩 **Lechon Belly** pricing:\n\n• Small — ₱1,800\n• Medium — ₱2,500\n• Large — ₱3,200\n\nCrispy on the outside, juicy on the inside! 😍`,
    chips: ['How to order?','Delivery?','Payment methods'] },

  // Delivery
  { match: ['deliver','delivery','dalhin','hatid','padala','bring','ship'],
    reply: `Yes, we offer delivery within **Cagayan de Oro City**! 🚚\n\nDelivery is available daily from **8:00 AM – 8:00 PM**.\n\nTo arrange delivery, just add items to your cart and select **"Delivery"** in the order form. Enter your barangay and address. 📍`,
    chips: ['Delivery fee?','How long?','How to order?','Payment methods'] },

  // Delivery fee
  { match: ['delivery fee','fee','charge','bayad','gastos','cost delivery','magkano delivery'],
    reply: `Delivery fees depend on your location within CDO. The exact fee will be confirmed when we contact you after your inquiry. 🚚\n\nFor the most accurate quote, please include your complete address in the order form!`,
    chips: ['How to order?','Payment methods','Store hours'] },

  // Pickup
  { match: ['pickup','pick up','take out','takeout','kuha','self','store pickup'],
    reply: `Yes! You can pick up your order at our store 🏪:\n\n📍 **123 Lechon Street, Divisoria, CDO**\n🕐 Daily: **7:00 AM – 8:00 PM**\n\nJust select "Pickup at Store" when filling out the order form. We'll confirm your order and let you know when it's ready!`,
    chips: ['How to order?','Location','Store hours'] },

  // Location / address
  { match: ['where','location','address','lugar','nasa saan','saan kayo','nasaan','find you','map','directions'],
    reply: `📍 **Gene's Lechon**\n123 Lechon Street, Divisoria\nCagayan de Oro City, 9000\n\nYou can also find us on the map at the bottom of this page! 🗺️`,
    chips: ['Store hours','Contact number','How to order?'] },

  // Store hours
  { match: ['hours','bukas','open','close','time','oras','schedule','anong oras'],
    reply: `⏰ **Store Hours:**\nOpen **Daily** — 7:00 AM to 8:00 PM\n\nWe're open every day including weekends and holidays! 🐷`,
    chips: ['Location','Contact number','How to order?'] },

  // Contact / phone
  { match: ['contact','phone','number','call','text','sms','viber','tanong','hotline','numero'],
    reply: `📞 **Contact Gene's Lechon:**\n\n• Phone/Viber/SMS: **(088) 123-4567**\n• Mobile: **+63 917 000 0000**\n• Email: info@geneslechon.com\n• Facebook: facebook.com/geneslechon\n\nFeel free to reach out anytime! 😊`,
    chips: ['Store hours','Location','How to order?'] },

  // Payment
  { match: ['payment','bayad','pay','gcash','cash','paymaya','maya','bank','transfer','how to pay'],
    reply: `💳 **Payment Methods:**\n\n• 💵 Cash on delivery/pickup\n• 📱 GCash\n• 🏦 Bank Transfer\n\nPayment details will be confirmed when our team contacts you after your inquiry! 🐷`,
    chips: ['How to order?','Delivery?','Store hours'] },

  // Promos / discounts
  { match: ['promo','discount','sale','offer','cheaper','bawas','libre','free','special'],
    reply: `🎉 For the latest promos and special offers, check our **Facebook page**: facebook.com/geneslechon\n\nYou can also call us at **(088) 123-4567** to ask about current deals! 🐷`,
    chips: ['Prices?','How to order?','Contact number'] },

  // Events / catering
  { match: ['event','catering','party','kaarawan','birthday','fiesta','wedding','reunion','bulk','malaki','marami'],
    reply: `🎊 We love catering events! Gene's Lechon is perfect for:\n\n• 🎂 Birthdays\n• 💒 Weddings\n• 🏠 Family reunions\n• 🎉 Fiestas & celebrations\n\nFor bulk orders and event catering, please call us directly at **(088) 123-4567** so we can give you the best quote!`,
    chips: ['Whole Lechon price','Contact number','How to order?'] },

  // Track order
  { match: ['track','status','where is my order','order status','inquiry','check order','inq-'],
    reply: `🔍 To track your inquiry, click the **"Track Order"** button in the navigation bar, or scroll to the **Track Your Inquiry** section.\n\nYou can search using your:\n• Inquiry ID (e.g. INQ-123456)\n• Email address\n• Phone number`,
    chips: ['How to order?','Contact number'] },

  // Thank you
  { match: ['thank','thanks','salamat','ty','maraming salamat','daghan salamat'],
    reply: `Salamat! 🐷 Thank you for choosing Gene's Lechon! We hope to serve you the best lechon in CDO. *Walang kapantay ang sarap!* 😊`,
    chips: ['How to order?','Prices?','Store hours'] },

  // Call us
  { match: ['call you','call now','tawag','i want to call'],
    reply: `Sure! You can call us anytime during store hours:\n\n📞 **(088) 123-4567**\n📱 **+63 917 000 0000**\n\n⏰ We're available **Daily 7:00 AM – 8:00 PM** 🐷`,
    chips: ['Store hours','Location','How to order?'] },
];

// Fallback responses
const FALLBACK_REPLIES = [
  `I'm not sure about that, but I can help with ordering, prices, delivery, and store info! 🐷 Or call us at **(088) 123-4567**.`,
  `Hmm, I didn't quite get that! Try asking about our **menu**, **prices**, **delivery**, or **store hours**. 😊`,
  `For that question, it's best to call us directly at **(088) 123-4567** or message us on Facebook! 🐷`,
];

function getBotReply(text) {
  const lower = text.toLowerCase().trim();
  for (const rule of CHAT_RULES) {
    if (rule.match.some(keyword => lower.includes(keyword))) {
      return rule;
    }
  }
  return {
    reply: FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)],
    chips: ['How to order?','Prices?','Delivery?','Contact number','Store hours']
  };
}

const chatHistory = [];
let chatOpen = false;
let chatInitialized = false;

window.toggleChat = function() {
  chatOpen = !chatOpen;
  const win = document.getElementById('chatWindow');
  const fab = document.getElementById('chatFab');
  win.classList.toggle('open', chatOpen);
  const dot = fab.querySelector('.chat-notif');
  if (dot) dot.style.display = 'none';
  if (chatOpen && !chatInitialized) { chatInitialized = true; initChat(); }
  if (chatOpen) setTimeout(() => document.getElementById('chatInput')?.focus(), 300);
};

function initChat() {
  appendBotMessage("Kumusta! 🐷 I'm **Lechon Buddy**, Gene's Lechon assistant! How can I help you today?");
  showQuickChips(['How to order?', 'Prices?', 'Delivery?', 'Store hours', 'Location', 'Contact']);
}

function appendBotMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble-bot';
  bubble.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  msgs.appendChild(bubble);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble-user';
  bubble.textContent = text;
  msgs.appendChild(bubble);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const el = document.createElement('div');
  el.className = 'chat-bubble-bot';
  el.id = 'typingIndicator';
  el.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  return el;
}

function removeTyping() { document.getElementById('typingIndicator')?.remove(); }

function showQuickChips(chips) {
  const container = document.getElementById('chatChips');
  container.innerHTML = '';
  chips.forEach(chip => {
    const btn = document.createElement('button');
    btn.className = 'chat-chip';
    btn.textContent = chip;
    btn.onclick = () => { container.innerHTML = ''; handleUserMessage(chip); };
    container.appendChild(btn);
  });
}

window.sendChat = function() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  document.getElementById('chatChips').innerHTML = '';
  handleUserMessage(text);
};

function handleUserMessage(text) {
  appendUserMessage(text);
  showTyping();
  // Simulate brief thinking delay
  setTimeout(() => {
    removeTyping();
    const result = getBotReply(text);
    appendBotMessage(result.reply);
    if (result.chips) showQuickChips(result.chips);
  }, 600);
}