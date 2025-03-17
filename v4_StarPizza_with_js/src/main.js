// document.addEventListener('DOMContentLoaded', () => {
//     const burgerMenu = document.querySelector('.burger-menu');
//     const navList = document.querySelector('header navbar ul');
  
//     burgerMenu.addEventListener('click', () => {
//       burgerMenu.classList.toggle('active');
//       navList.classList.toggle('active');
//     });
//   });
display("./src/orders.json");
async function display(file)
{
  let o = await fetch(file);
  let t = await o.json();

  let html = document.getElementsByClassName("container-orders")[0];
  let pizzaElement = "";
  t.pizzas.forEach(item => {
    console.log(item.name + " : " + item.ingredients);
    let ingredients = "";
    for(let i = 0; i < ingredients.length; i++)
    {
      ingredients += ingredients[i];
      if(i != ingredients.length-1)
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
      <a href="${item.image}_big.jpg"><img class="container-orders-img" src="${item.image}_small.jpg"></a>
      <p class="container-orders-p">${ingredients}</p>
    </div>
    `
  });

  html.innerHTML = pizzaElement;

  t.drinks.forEach(item => {
    console.log(item);
  })
}




// async function display(file)
// {
//   fetch(file)
//   .then(o => o.text())
//   .then(t => console.log(t));
// }

