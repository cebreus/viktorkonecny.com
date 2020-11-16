// console.log('Hey, this javascript file :)');

// navbar collapse

$(document).on('click', function () {
  $('#navbarDefault').collapse('hide');
});

// header visual changer

var position = window.scrollY;
var header = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  position = window.scrollY;

  if (position >= 50) {
    header.classList.add('smaller');
  } else {
    header.classList.remove('smaller');
  }
});
