const stepOneSection = document.querySelector('.step-1');
const stepTwoSection = document.querySelector('.step-2');
const stepOneBtn = document.querySelector('.step-1 .btn');

stepOneBtn.addEventListener('click', () => {
  stepOneSection.classList.add('left-[-100%]');
  stepTwoSection.classList.remove('right-[-100%]');
  stepTwoSection.classList.add('right-0');
})