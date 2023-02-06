document.addEventListener('click', function () {
  document.querySelector('#navbarDefault').classList.remove('show');
});

var position = window.scrollY;
var header = document.querySelector('.navbar');

window.addEventListener('scroll', function () {
  position = window.scrollY;

  if (position >= 50) {
    header.classList.add('smaller');
  } else {
    header.classList.remove('smaller');
  }
});
