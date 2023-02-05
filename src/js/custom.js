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

// Get DOM elements
const delayForSubmitButtonChange = 1000;
const form = document.getElementById('contactus');
const submitButton = form.querySelector('button[type="submit"]');
const submitButtonOriginalHTML = submitButton.innerHTML;
const webhookUrl = 'https://hook.eu1.make.com/pmod5qz3lh5pmvfprv71oncxltoe8swo';

// Messages
const errorMessage =
  'Při odesílání formuláře došlo k chybě, zkuste to znovu později.';
const errorNetwork = 'Připojení k internetu je špatné nebo jste offline';
const requestTimedOutMessage = 'Vypršel čas požadavku.';
const sendingMessage = 'Odesílání...';
const successMessage = 'Formulář byl úspěšně odeslán!';

// Create alert function
function createAlert(message, className) {
  const alert = document.createElement('div');
  alert.className = `alert ${className} alert-dismissible fade show`;
  alert.setAttribute('role', 'alert');
  alert.style.margin = '20px 0';

  const alertMessage = document.createElement('div');
  alertMessage.style.margin = '3px 0';
  alertMessage.innerHTML = message;
  alert.appendChild(alertMessage);
  alert.appendChild(closeButton);

  return alert;
}

// Create close button function
const closeButton = document.createElement('button');
closeButton.className = 'close';
closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
closeButton.setAttribute('data-dismiss', 'alert');
closeButton.setAttribute('aria-label', 'Zavřít');

// Hide alert on click function
closeButton.addEventListener('click', () => {
  alert.style.display = 'none';
});

// Handle form submit function
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  handleFormSubmit();
});

// Handle form submit
async function handleFormSubmit() {
  submitButton.innerHTML = sendingMessage;
  const formData = new FormData(form);
  formData.append('timestamp', new Date().toISOString());

  try {
    const response = await sendFormData(formData);
    handleResponse(response);
  } catch (error) {
    handleError(error);
  } finally {
    resetForm();
  }
}

// Send form data function
async function sendFormData(formData) {
  return Promise.race([
    fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    }),
    new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error(requestTimedOutMessage)), 5000)
    ),
  ]);
}

// Handle response function
function handleResponse(response) {
  if (!response.ok) throw new Error(errorMessage);
  const alert = createAlert(successMessage, 'alert-success');
  setTimeout(() => {
    form.insertBefore(alert, form.lastChild);
  }, delayForSubmitButtonChange);

  setTimeout(() => resetForm(), 10000);
}

// Handle error function
function handleError(error) {
  console.error(error);
  const alertMessage =
    error instanceof TypeError ? errorNetwork : error.message;
  const alert = createAlert(alertMessage, 'alert-warning');
  setTimeout(() => {
    form.insertBefore(alert, form.lastChild);
  }, delayForSubmitButtonChange);
}

// Reset form function
function resetForm() {
  setTimeout(() => {
    submitButton.innerHTML = submitButtonOriginalHTML;
  }, delayForSubmitButtonChange);
}
