// Get DOM elements
let contactForm = document.getElementById('contactus');
const submitButton = contactForm.querySelector('button[type="submit"]');
const alertContainer = contactForm.querySelector('.status');
const submitButtonOriginalHTML = submitButton.innerHTML;
const arrow = '<span class="arrow ml-2"></span>';
const webhookUrl = 'https://hook.eu1.make.com/pmod5qz3lh5pmvfprv71oncxltoe8swo';

// Handle form submit
contactForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  submitButton.innerHTML = 'Odesílání...';
  let formData = new FormData(contactForm);
  formData.append('timestamp', new Date().toISOString());

  try {
    const response = await sendFormData(formData);
    handleResponse(response);
  } catch (error) {
    handleError(error);
    submitButton.innerHTML = submitButtonOriginalHTML;
  }
});

// Send form data function
async function sendFormData(formData) {
  return Promise.race([
    fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    }),
    new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error('Vypršel čas požadavku.')), 5000)
    ),
  ]);
}

// Handle response function
function handleResponse(response) {
  if (response.ok) {
    showMessage('Formulář byl úspěšně odeslán!', '', alertContainer);
    submitButton.style.display = 'none';
    const resetButton = document.createElement('button');
    resetButton.innerHTML = `Vymazat formulář`;
    resetButton.type = 'reset';
    resetButton.classList.add('btn', 'btn-outline-primary', 'btn-lg', 'w-100');
    resetButton.addEventListener('click', () => {
      resetButton.remove();
      contactForm.reset();
      submitButton.style.display = 'block';
      submitButton.innerHTML = submitButtonOriginalHTML;
      alertContainer.innerHTML = '';
    });
    submitButton.after(resetButton);
  } else if (response.status === 400) {
    showMessage(
      'Něco se někde ztratilo. Zkuste odeslat pozdeji nebo napište přímo na training@viktorkonecny.com',
      'error',
      alertContainer
    );
  } else {
    showMessage(
      'Při odesílání formuláře došlo k chybě, zkuste to znovu později.',
      'error',
      alertContainer
    );
    submitButton.innerHTML = `Zkusit znovu ${arrow}`;
    submitButton.classList.add('btn-danger');
    submitButton.classList.remove('btn-primary');
    throw new Error(
      'Při odesílání formuláře došlo k chybě, zkuste to znovu později.'
    );
  }
}

// Handle error function
function handleError(error) {
  const alertMessage =
    error instanceof TypeError
      ? 'Problém s připojením k internetu nebo jste offline.\nNapište přímo na training@viktorkonecny.com'
      : error.message;
  showMessage(alertMessage, 'error', alertContainer);
}

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
