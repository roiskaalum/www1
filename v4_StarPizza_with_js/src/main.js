document.addEventListener('DOMContentLoaded', () => {
    const burgerMenu = document.querySelector('.burger-menu');
    const navList = document.querySelector('header navbar ul');
  
    burgerMenu.addEventListener('click', () => {
      burgerMenu.classList.toggle('active');
      navList.classList.toggle('active');
    });
  });