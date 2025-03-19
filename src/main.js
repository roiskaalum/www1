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
        ingredients += item.ingredients[i];
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
        <h4 class="container-orders-item-title">${item.name}</h2>
        <a href="${item.image}_big.jpg"><img class="container-orders-img" src="${item.image}_small.jpg" alt="${item.name} Thumbnail"></a>
        <p class="container-orders-p">${ingredients}</p>
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
  display("src/orders.json");
});
