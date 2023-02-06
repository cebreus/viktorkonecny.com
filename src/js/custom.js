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

// -----

const form = document.querySelector('#contactus');
const formData = new FormData(form);
const submitButton = document.querySelector("#contactus [type='submit']");
const submitButtonOriginalText = submitButton.innerHTML;
const arrow = '<span class="arrow ml-2"></span>';

submitButton.addEventListener('click', async (event) => {
  let alertContainer = form.querySelector('.status');
  let catchCounter = 0;
  let formSubmitted = false;
  let response;

  if (formSubmitted) {
    return;
  }
  formSubmitted = true;

  event.preventDefault();
  submitButton.innerHTML = 'Odesílám...';
  submitButton.disabled = true;
  alertContainer.innerHTML = '';

  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log(formData);

  try {
    response = await fetch(
      'https://hook.eu1.make.com/pmod5qz3lh5pmvfprv71oncxltoe8swo',
      {
        method: 'POST',
        body: formData,
      }
    );
  } catch (error) {
    catchCounter++;
    if (catchCounter > 2) {
      showMessage(
        'Problém s připojením.<br>Napište přímo e-mail <a class="text-danger" href="mailto:training@viktorkonecny.com" target="_blank">training@viktorkonecny.com</a>',
        'error',
        alertContainer
      );
    } else {
      showMessage('Problém s připojením.', 'error', alertContainer);
    }
    submitButton.innerHTML = `Zkusit znovu ${arrow}`;
    submitButton.disabled = false;
    formSubmitted = false;
    return;
  }

  if (response.ok) {
    showMessage('Formulář úspěšně odeslán!', '', alertContainer);
    submitButton.innerHTML = `Vymazat formulář ${arrow}`;
    submitButton.disabled = false;
    submitButton.classList.remove('btn-primary');
    submitButton.classList.add('btn-outline-primary');

    submitButton.addEventListener('click', (event) => {
      event.preventDefault();
      console.log('clicked');
      form.reset();
      alertContainer.innerHTML = '';
      submitButton.innerHTML = submitButtonOriginalText;
      submitButton.classList.add('btn-primary');
      submitButton.classList.remove('btn-outline-primary');
      submitButton.classList.remove('btn-danger');
      formSubmitted = false;
    });
  } else if (response.status === 400) {
    showMessage(
      'Něco se někde ztratilo. Zkuste odeslat pozdeji nebo napište přímo e-mail <a class="text-danger" href="mailto:training@viktorkonecny.com" target="_blank">training@viktorkonecny.com</a>',
      'error',
      alertContainer
    );
    submitButton.innerHTML = `Zkusit později ${arrow}`;
    submitButton.classList.add('btn-danger');
    submitButton.classList.remove('btn-primary');
    submitButton.disabled = false;
    formSubmitted = false;
  } else {
    showMessage('Něco se někde ztratilo.', 'error', alertContainer);
    submitButton.innerHTML = `Zkusit znovu ${arrow}`;
    submitButton.classList.add('btn-danger');
    submitButton.classList.remove('btn-primary');
    submitButton.disabled = false;
    formSubmitted = false;
  }
});

function showMessage(message, type, container) {
  if (type === 'error') {
    console.error(message);
  } else {
    console.log(message);
  }
  const escapedMessage = message.replace(/[&<>"']/g, (match) => {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[match];
  });
  container.innerHTML = `
    <div class="alert alert-${
      type === 'error' ? 'danger' : 'success'
    } alert-dismissible fade show" role="alert" style="margin: 20px 0px;">
      <div style="margin: 3px 0px;">${escapedMessage}</div>
      <button class="close" data-dismiss="alert" aria-label="Zavřít">
        <span aria-hidden="true">×</span>
      </button>
    </div>
  `;
}
