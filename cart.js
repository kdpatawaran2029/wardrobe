var cart = JSON.parse(localStorage.getItem('au-cart')) || [];

function formatPrice(n) {
  return (Number(n) || 0).toLocaleString();
}

function addToCart(btn, name, price) {
  price = Number(price) || 0;
  var existing = cart.find(function(i) { return i.name === name; });
  if (existing) {
    existing.qty = (existing.qty || 0) + 1;
  } else {
    cart.push({ name: name, price: price, qty: 1 });
  }
  btn.textContent = "Added";
  setTimeout(function() { btn.textContent = "Add to Bag"; }, 900);
  saveCart();
  renderCart();
  openCart();
}

function removeItem(name) {
  cart = cart.filter(function(i) { return i.name !== name; });
  saveCart();
  renderCart();
}

function changeQty(name, delta) {
  var item = cart.find(function(i) { return i.name === name; });
  if (!item) return;
  item.qty = (item.qty || 1) + delta;
  if (item.qty < 1) {
    cart = cart.filter(function(i) { return i.name !== name; });
  }
  saveCart();
  renderCart();
}

function openCart() {
  document.getElementById("cart-drawer").classList.add("open");
  document.getElementById("overlay").classList.add("show");
}

function closeCart() {
  document.getElementById("cart-drawer").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

function saveCart() {
  localStorage.setItem('au-cart', JSON.stringify(cart));
  var orderArr = [];
  cart.forEach(function(item) {
    var qty = Number(item.qty) || 1;
    for (var q = 0; q < qty; q++) {
      orderArr.push({ prod_name: item.name, prod_price: String(item.price) });
    }
  });
  var hidden = document.getElementById('cust_order');
  if (hidden) hidden.value = JSON.stringify(orderArr);
}

function renderCart() {
  var c = document.getElementById('cart-items');
  var t = document.getElementById('total-price');
  var count = document.getElementById('cart-count');
  c.innerHTML = '';
  if (!cart.length) {
    c.innerHTML = '<p class="empty-msg">Your bag is empty.</p>';
    t.textContent = '\u20b10';
    count.textContent = '0';
    saveCart();
    return;
  }
  var total = 0;
  var qty = 0;
  cart.forEach(function(item) {
    var price = Number(item.price) || 0;
    var quantity = Number(item.qty) || 1;
    total += price * quantity;
    qty += quantity;
    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML =
      '<div class="cart-item-info">' +
        '<div class="cart-item-name">' + item.name + '</div>' +
        '<div class="cart-item-price">\u20b1' + formatPrice(price) + '</div>' +
      '</div>' +
      '<div class="cart-item-controls">' +
        '<button class="qty-btn qty-minus">\u2212</button>' +
        '<span class="qty-num">' + quantity + '</span>' +
        '<button class="qty-btn qty-plus">\u002b</button>' +
        '<button class="cart-remove">\u2715</button>' +
      '</div>';
    (function(itemName) {
      div.querySelector('.qty-minus').onclick = function() { changeQty(itemName, -1); };
      div.querySelector('.qty-plus').onclick = function() { changeQty(itemName, 1); };
      div.querySelector('.cart-remove').onclick = function() { removeItem(itemName); };
    })(item.name);
    c.appendChild(div);
  });
  t.textContent = '\u20b1' + formatPrice(total);
  count.textContent = qty;
  saveCart();
}

renderCart();
