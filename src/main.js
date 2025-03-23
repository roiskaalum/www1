async function display(file)
{
  try {
    let o = await fetch(file);
    let t = await o.json();

    let html = document.getElementsByClassName("container-orders")[0];
    let pizzaElement = "";
    t.pizzas.forEach(item => {
      let ingredients = "";
      for(let i = 0; i < item.ingredients.length; i++)
      {
        ingredients += item.ingredients[i];0
        if(i < item.ingredients.length-1)
        {
          ingredients += ", ";
        }
        else
        {
          ingredients += ".";
        }
      }
      pizzaElement += `
      <div class="container-orders-item">
        <h4 class="container-orders-title">${item.name}</h2>
        <a href="${item.image}_big.jpg"><img class="container-orders-img" src="${item.image}_small.jpg" alt="${item.name} Thumbnail"></a>
        <p class="container-orders-p">${ingredients}</p>
        <span>Price: <span class="price">${item.price}</span> DKK</span>
        <button class="container-orders-button bg-primary-300"">Add To Order</button>
      </div>
      `
    });
    

    html.innerHTML = pizzaElement;
    console.log("Appended pizza elements");
    let drinksElement = "";
    t.drinks.forEach(item => {
      let options = "";
      for(let i = 0;i < item.options.length; i++)
      {
        options += item.options[i];
        if(i <= item.options.length-1)
        {
          options += ", ";
        }
        else
        {
          options = ".";
        }
      }
      drinksElement += `
      <div class="container-orders-item">
        <h4 class="container-orders-title">${item.name}</h4>
        <a href="${item.image}_big.jpg"><img class="container-orders-img" src="${item.image}_small.jpg"></a>
        <p class="container-orders-p">${options}</p>
        <span>Price: <span class="price">${item.price}</span> DKK</span>
        <button class="container-orders-button bg-primary-300 drinks">Add To Order</button>
      </div>
      `
    });
    html.innerHTML += drinksElement;
    console.log("appended drinks");
  }
  catch(error)
  {
    document.getElementsByClassName("container-orders")[0].innerHTML = "Couldn't Fetch from JSON, so Orders List is empty!";
    console.log("error appeared in json fetching: " + error);
  }
  finally
  {
    console.log("Fetching Function Call Over!");
  }
}


document.addEventListener("DOMContentLoaded", () => {
  // #region Darkmode and Hamburger Menu
  console.log("loaded JS");
  const themeToggle = document.querySelector("#theme-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const storedTheme = localStorage.getItem("theme");
  const themeIcon = document.querySelector("#theme-icon");
  const burgerIcon = document.querySelector("#burgerImage");
  
  //Darkmode detection function:
  if (storedTheme == "dark" || (!storedTheme && prefersDark)) {
    document.body.classList.add("dark");
    themeIcon.src = "src/images/darkmode_white.png";
    burgerIcon.src = "src/images/nav-burger-menu-white.png";
  }
  
  //Darkmode Click Function:
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    if(themeIcon.src.includes("darkmode_white.png"))
      {
        themeIcon.src = "src/images/darkmode_black.png";
        burgerIcon.src = "src/images/nav-burger-menu.png";
      }
      else
      {
        themeIcon.src = "src/images/darkmode_white.png";
        burgerIcon.src = "src/images/nav-burger-menu-white.png";
      }
    });
    
    //Hamburger Click Function:
    const burgerMenu = document.querySelector("#burger-menu-button");
    const navContainer = document.querySelector(".nav-container");
    //TODO: Swap src image for hamburger for an opened version of the same color variant.
    burgerMenu.addEventListener("click", () => {
      navContainer.classList.toggle("active");
      burgerMenu.classList.toggle("active");
    });


    // #endregion Darkmode and Hamburger Menu
    display("src/orders.json").then(() => {
      console.log("Orders Displayed!");
      document.addEventListener('click', function (event) {
        // Ensure the button clicked has the 'container-orders-button' class
        if (event.target && event.target.matches('.container-orders-button')) {
          handleButtonClick(event.target);
        }
      });
      loadCartFromCookie();
    });
});

function handleButtonClick(button) {
  const orderItem = button.closest('.container-orders-item'); // Get the parent order item
  const itemName = orderItem.querySelector('.container-orders-title').textContent;
  const priceElement = orderItem.querySelector('.price');
  const price = parseFloat(priceElement.textContent);

  // Create the shopping cart if it doesn't exist
  let cartContainer = document.querySelector('#shopping-cart');
  if (!cartContainer) { cartContainer = document.body.appendChild(createCartContainer()); }

  // Add the item to the cart if it doesn't already exist
  let itemRow = cartContainer.querySelector(`[data-item="${itemName}"]`);
  if (!itemRow) {
    itemRow = createCartItem(itemName, price);
    cartContainer.appendChild(itemRow);
  }

  // Update the quantity in the cart if an Add To Order button is clicked
  const quantity = itemRow.querySelector('.order-count');
  if (quantity) {
    quantity.textContent = parseInt(quantity.textContent) + 1;
  }

  // Handle the item button replacement with controls (quantity controls or drinks dropdown)
  if(!orderItem.querySelector('.order-controls'))
    replaceButtonWithControls(button, orderItem, itemRow);
  else
    updateShoppingCart(itemRow, 1);
}

function replaceButtonWithControls(button, orderItem, itemRow) {
  updateShoppingCart(itemRow, 1);
  // Create a container for controls (quantity controls or drinks dropdown)
  const controlContainer = document.createElement('div');
  controlContainer.classList.add('order-controls');

  // Create quantity controls (decrease, quantity span, increase)
  const decreaseBtn = document.createElement('button');
  decreaseBtn.textContent = '-';
  decreaseBtn.classList.add('decrease-btn');

  const countSpan = document.createElement('span');
  countSpan.textContent = '1'; // Initial quantity
  countSpan.classList.add('order-count');

  const increaseBtn = document.createElement('button');
  increaseBtn.textContent = '+';
  increaseBtn.classList.add('increase-btn');

  // Add event listeners to adjust quantity
  decreaseBtn.addEventListener('click', () => {
    const count = parseInt(countSpan.textContent) - 1;
    if (count < 1) {
      orderItem.querySelector('.container-orders-button').classList.toggle("display-none");
      orderItem.querySelector('.order-controls').remove();
    } else {
      countSpan.textContent = count;
    }
    updateShoppingCart(itemRow, -1);
  });

  increaseBtn.addEventListener('click', () => {
    countSpan.textContent = parseInt(countSpan.textContent) + 1;
    updateShoppingCart(itemRow, 1);
  });

  // Create dropdown if it's a drink item
  if (button.classList.contains('drinks')) {
    const optionsText = orderItem.querySelector('.container-orders-p').textContent;
    const options = optionsText.split(',').map(option => option.trim().replace('.', ''));
    const dropdown = document.createElement('select');
    dropdown.classList.add('drinks-dropdown');
    
    options.forEach(optionText => {
      const option = document.createElement('option');
      option.textContent = optionText;
      dropdown.appendChild(option);
    });

    controlContainer.appendChild(dropdown); // Add dropdown to control container
  }

  // Append quantity controls and/or dropdown to the container
  controlContainer.appendChild(decreaseBtn);
  controlContainer.appendChild(countSpan);
  controlContainer.appendChild(increaseBtn);

  // Replace the button with the new control container
  button.classList.toggle("display-none");
  orderItem.appendChild(controlContainer);
}

function createCartContainer() {
  const cartContainer = document.createElement('div');
  cartContainer.classList.add('shopping-cart');
  cartContainer.id = 'shopping-cart';
  

  const minimizeBtn = document.createElement('button');
  minimizeBtn.textContent = 'Minimize';
  minimizeBtn.classList.add('minimize-btn');
  
  cartContainer.appendChild(minimizeBtn);
  
  const orderBtn = document.createElement('button');
  orderBtn.textContent = 'Place Order';
  orderBtn.classList.add('order-btn');
  orderBtn.style.float = 'right';
  
  minimizeBtn.addEventListener('click', () => {
    cartContainer.classList.toggle('minimized');
    minimizeBtn.textContent = cartContainer.classList.contains('minimized') ? 'Maximize' : 'Minimize';
    if(cartContainer.classList.contains('minimized'))
    {
      cartContainer.classList.remove('shopping-cart');
      cartContainer.classList.add('shopping-cart-minimized');
      orderBtn.style.display = 'none';
    }
    else
    {
      cartContainer.classList.remove('shopping-cart-minimized');
      cartContainer.classList.add('shopping-cart');
      orderBtn.style.display = 'block';
    }
  });

  orderBtn.onclick = function() {
    window.location.href= 'order.html';
  };

  cartContainer.appendChild(orderBtn);

  let orderTotalText = document.createElement('span');
  let orderTotal = document.createElement('span');
  let flavorText_1 = document.createElement('span');
  flavorText_1.textContent = 'Total: ';
  let flavorText_2 = document.createElement('span');
  flavorText_2.textContent = ' Dkk';
  orderTotal.textContent = 0;
  orderTotal.classList.add('cart-total');
  orderTotalText.classList.add('cart-total-span');
  orderTotalText.appendChild(flavorText_1);
  orderTotalText.appendChild(orderTotal);
  orderTotalText.appendChild(flavorText_2);

  cartContainer.appendChild(orderTotalText);
  console.log("Cart Container Created!");
  return cartContainer;
}

function createCartItem(itemName, price) {
  const itemRow = document.createElement('div');
  const rowText = document.createElement('span');
  
  const name = document.createElement('span');
  name.textContent = itemName;
  name.classList.add('item-name');

  const priceSpan = document.createElement('span');
  priceSpan.textContent = price.toFixed(2);
  priceSpan.classList.add('item-price');

  const itemQuantitySpan = document.createElement('span');
  itemQuantitySpan.textContent = 0;
  itemQuantitySpan.classList.add('item-quantity');
  
  let flavorText_1 = document.createElement('span'); flavorText_1.textContent = 'Item: ';
  let flavorText_2 = document.createElement('span'); flavorText_2.textContent = ' | * ';
  let flavorText_3 = document.createElement('span'); flavorText_3.textContent = ' | Price: ';
  let flavorText_4 = document.createElement('span'); flavorText_4.textContent = ' Dkk';
  
  itemRow.classList.add('cart-item'); itemRow.setAttribute('data-item', itemName);
  
  rowText.appendChild(flavorText_1);
  rowText.appendChild(name);
  rowText.appendChild(flavorText_2);
  rowText.appendChild(itemQuantitySpan);
  rowText.appendChild(flavorText_3);
  rowText.appendChild(priceSpan);
  rowText.appendChild(flavorText_4);
  itemRow.appendChild(rowText);
  console.log("Item Row Created!");
  return itemRow;
}

// Function to update the shopping cart display
function updateShoppingCart(orderItem, count) {
  console.log("Update Shopping Cart Called!");
  let cartItem = document.querySelector(`[data-item="${orderItem.querySelector('.item-name').textContent}"`);
  let cartItemAmount = orderItem.querySelector('.item-quantity');
  if(!cartItemAmount) { cartItemAmount = 0; }

  if(cartItemAmount <= 0 && cartItem)
  {
    updateCartTotal(-parseFloat(cartItem.querySelector('.item-price').textContent));
    if(document.querySelector("#shopping-cart"))
      cartItem.remove();
    return;
  }
  
  let itemPriceSpan = 0;
  if(orderItem.classList.contains("container-orders-item"))
  {
    itemPriceSpan = orderItem.querySelector('.price'); // Get item price span
  }
  else
  {
    itemPriceSpan = orderItem.querySelector('.item-price'); // Get item price span
  }
  
  const itemPrice = parseFloat(itemPriceSpan.textContent); // Get item price
  
  // If the item is already in the cart
  if (cartItem) {
    const quantityElement = cartItem.querySelector('.item-quantity');

    let newCount = parseInt(quantityElement.textContent) + count;
    
    // If count is 0 or negative, remove the item from the cart
    if (newCount <= 0) { cartItem.remove(); }
    else { quantityElement.textContent = newCount; }

    if(count == 1) { updateCartTotal(itemPrice); }
    else { updateCartTotal(-itemPrice); }
  }
}

// Update the total price of the cart
function updateCartTotal(itemPrice) {
  const cartTotalSpan = document.querySelector('.cart-total');
  let total = parseFloat(cartTotalSpan.textContent);
  console.log(cartTotalSpan);
  console.log(total);
  console.log(itemPrice);
  console.log(cartTotalSpan.textContent);
  total += itemPrice;
  console.log(total);

  // Display the cart total
  const cartTotalElement = document.querySelector('.cart-total');
  cartTotalElement.textContent = total.toFixed(2);
  if(!total || total <= 0)
  {
    document.querySelector('#shopping-cart').remove();
    console.log("Cart removed!");
  }
  saveCartToCookie();
}


function saveCartToCookie() {
  console.log("Save Cart To Cookie Called!");
  let cartContainer = document.querySelector('#shopping-cart');
  if (!cartContainer) return;

  let cartItems = [];
  cartContainer.querySelectorAll('[data-item]').forEach(itemRow => {
    let itemName = itemRow.getAttribute('data-item');
    let quantity = parseInt(itemRow.querySelector('.item-quantity').textContent);
    let price = parseFloat(itemRow.querySelector('.item-price').textContent);
    
    cartItems.push({ name: itemName, quantity, price });
  });

  document.cookie = `shoppingCart=${JSON.stringify(cartItems)}; path=/; max-age=86400`; // Expires in 1 day
}

// Function to load the shopping cart from the cookie
function getShoppingCartFromCookie() {
  console.log("Get Shopping Cart From Cookie Called!");
  const cartData = document.cookie.split('; ').find(row => row.startsWith('shoppingCart='));
  
  if (cartData) {
      // Assuming the shoppingCart is stored as a JSON string in the cookie
      const cartJSON = cartData.split('=')[1];
      return JSON.parse(cartJSON); // Parse the cart data and return as an array of items
  }
  
  return []; // Return empty array if no cart data is found
}

// Function to simulate button presses based on the saved shopping cart
function loadCartFromCookie() {
  console.log("Load Cart From Cookie Called!");
  const shoppingCart = getShoppingCartFromCookie(); // Fetch the cart data from the cookie

  shoppingCart.forEach(cartItem =>
  {
    console.log(cartItem);
    // 1. Find the corresponding item based on the cart name
    const itemTitle = Array.from(document.querySelectorAll('.container-orders-title')).find(title => title.textContent.trim() === cartItem.name);

    if (!itemTitle) return; // If the item doesn't exist on the page, skip it

    // 2. Find the "Add to Order" button
    const itemButton = itemTitle.closest('.container-orders-item').querySelector('.container-orders-button');
    if (!itemButton) return; // If the button doesn't exist, skip this item
    
    // 3. Trigger the initial click (Add to Order) for the first quantity
    itemButton.click();
    console.log("Item Button Clicked!");

    // 4. Calculate remaining quantity to be added
    const remainingQuantity = cartItem.quantity - 1;

    // 5. Find and click the increase button for the remaining quantity
    const increaseButton = itemTitle.closest('.container-orders-item').querySelector('.increase-btn');
    if (increaseButton)
    {
      for (let i = 0; i < remainingQuantity; i++)
      {
        increaseButton.click(); // Simulate click to increase quantity
      }
    }
  });
}