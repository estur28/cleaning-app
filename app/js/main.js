const toggleModal = () => {
    document.querySelector('.modal')
        .classList.toggle('modal--hidden');
    document.querySelector('.overlay')
        .classList.toggle('overlay--hidden');
}

document.querySelector('#modal-btn')
    .addEventListener('click', toggleModal);

document.querySelector('.overlay')
    .addEventListener('click', toggleModal)

document.querySelector('#learn-more-form')
    .addEventListener('submit', (e) => {
        e.preventDefault();
        toggleModal();
})

document.querySelector('.close')
    .addEventListener('click', toggleModal);

document.querySelector('.overlay')
    .addEventListener('click', toggleModal);


function sendFields() {
    document.getElementById('input-email').value = '';
}