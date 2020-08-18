console.log('Hey, this javascript file :)');

$(function () {
  var navMain = $('.navbar-collapse');
  // avoid dependency on #id
  // "a:not([data-toggle])" - to avoid issues caused
  // when you have dropdown inside navbar
  navMain.on('click', 'a:not([data-toggle])', null, function () {
    navMain.collapse('hide');
  });
});

function init() {
  window.addEventListener('scroll', function (e) {
    var distanceY = window.pageYOffset || document.documentElement.scrollTop,
      shrinkOn = 10,
      header = document.querySelector('.navbar');
    if (distanceY > shrinkOn) {
      classie.add(header, 'smaller');
    } else {
      if (classie.has(header, 'smaller')) {
        classie.remove(header, 'smaller');
      }
    }
  });
}

window.onload = init();

// var frmvalidator = new Validator('contactus');
// frmvalidator.EnableOnPageErrorDisplay();
// frmvalidator.EnableMsgsTogether();
// frmvalidator.addValidation('name', 'req', 'Vyplňte prosím jméno a příjmení');
// frmvalidator.addValidation('email', 'req', 'Vyplňte prosím e-mail');
// frmvalidator.addValidation('email', 'email', 'Vyplňte prosím správný e-mail');
// frmvalidator.addValidation('interest', 'req', 'Vyberte o co máte zájem');
// frmvalidator.addValidation('message', 'req', 'Vyplňte prosím zprávu');
// frmvalidator.addValidation(
//   'message',
//   'maxlen=2048',
//   'Važe zpráva je příliš dlouhá (více než 2KB!)'
// );
// frmvalidator.addValidation('scaptcha', 'req', 'Opište prosím text z obrázku');

// document.forms['contactus'].scaptcha.validator = new FG_CaptchaValidator(
//   document.forms['contactus'].scaptcha,
//   document.images['scaptcha_img']
// );

// function SCaptcha_Validate() {
//   return document.forms['contactus'].scaptcha.validator.validate();
// }

// frmvalidator.setAddnlValidationFunction(SCaptcha_Validate);

// function refresh_captcha_img() {
//   var img = document.images['scaptcha_img'];
//   img.src =
//     img.src.substring(0, img.src.lastIndexOf('?')) +
//     '?rand=' +
//     Math.random() * 1000;
// }
