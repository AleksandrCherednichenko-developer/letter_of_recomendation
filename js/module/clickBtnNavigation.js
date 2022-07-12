import { writeCookie, readCookie, deleteCookie } from './script__work-cookie.js';

let sectionStep = document.querySelectorAll('.block__create-inner .block__create-form .section-step');
let stepValueItem = document.querySelectorAll('.block__create-inner .step .step__value');
let stepValue;

function clearStepValue() {
   if (readCookie('step-now(letter_of_recomendation_desktop)') != undefined) {
      stepValue = readCookie('step-now(letter_of_recomendation_desktop)');
   } else {
      stepValue = 1;
   }
}

window.addEventListener("load", function load() {
   clearStepValue()
}, false);

// нажатие на кнопку назад
export function clickBtnBack() {
   clearStepValue()
   stepValue--;

   sectionStep.forEach(section => {
      if (section.getAttribute('data-value') == stepValue) {
         section.classList.remove('hide');
      } else {
         section.classList.add('hide');
      }
   })

   stepDone();
}

// нажатие на кнопку вперёд
export function clickBtnNext() {
   clearStepValue()
   stepValue++;

   sectionStep.forEach(section => {
      if (section.getAttribute('data-value') == stepValue) {
         section.classList.remove('hide')
      } else {
         section.classList.add('hide');
      }
   })

   stepValueItem.forEach(step => {
      if (step.getAttribute('data-value') < stepValue) {
         if (!(step.classList.contains('hide'))) {
            step.classList.add('done');
         }
      }
      if ((step.getAttribute('data-value') == stepValue - 1)) {
         if (step.classList.contains('error')) {
            step.classList.remove('error');
         }
      }
   })

   stepDone();
}


function stepDone() {
   stepValueItem.forEach(item => {
      item.classList.remove('now');
   })
   stepValueItem.forEach(item => {
      if (item.getAttribute('data-value') == stepValue) {
         item.classList.add('now');
         writeCookie('step-now(letter_of_recomendation_desktop)', item.getAttribute('data-value'), 30);
      }
   })
}

// преход по секциям нажатием на шаги
document.addEventListener('click', (event) => {
   let target = event.target;

   if (target.closest('.step__value') && target.closest('.done') || target.closest('.now')) {
      sectionStep.forEach(section => {

         if (target.closest('.step__value').getAttribute('data-value') == section.getAttribute('data-value')) {
            sectionStep.forEach(section => {
               section.classList.add('hide')
            })
            section.classList.remove('hide');
            stepValue = target.closest('.step__value').getAttribute('data-value');

            stepValueItem.forEach(step => {
               step.classList.remove('now')
               if (step.classList.contains('done') && step.classList.contains('now')) {
                  step.classList.remove('now')
               }
            })

            target.closest('.step__value').classList.add('now');
         }
      })
   }
})