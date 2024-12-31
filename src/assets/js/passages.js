const stepOneSection = document.querySelector('.step-1');
const stepTwoSection = document.querySelector('.step-2');
const stepOneBtn = document.querySelector('.step-1 .btn');

stepOneBtn.addEventListener('click', () => {
  stepOneSection.classList.add('translate-x-[-100%]');
  stepTwoSection.classList.remove('translate-x-[100%]');
  stepTwoSection.classList.add('translate-x-[0%]');
})