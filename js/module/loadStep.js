// загрузка последнего шага при перезагрузке 
import { writeCookie, readCookie, deleteCookie } from './script__work-cookie.js';


let sections = document.querySelectorAll('.block__create-inner .block__create-form .section-step');
let steps = document.querySelectorAll('.block__create-inner .step .step__value');

export function loadStep() {
   if (readCookie('step-now(letter_of_recomendation_desktop)') !== undefined) {
      steps.forEach(step => {
         if (step.getAttribute('data-value') < readCookie('step-now(letter_of_recomendation_desktop)')) {
            step.classList.add('done');
         }
         if (step.getAttribute('data-value') == readCookie('step-now(letter_of_recomendation_desktop)')) {
            steps.forEach(step => {
               step.classList.remove('now');
            })
            step.classList.add('now');
         }
      })

      sections.forEach(section => {
         if (section.getAttribute('data-value') == readCookie('step-now(letter_of_recomendation_desktop)')) {
            sections.forEach(section => {
               section.classList.add('hide')
            })
            section.classList.remove('hide')
         }
      })
   } else {
      writeCookie('step-now(letter_of_recomendation_desktop)', 1)
      steps.forEach(step => {
         if (step.getAttribute('data-value') != 1) {
            steps.forEach(step => {
               step.classList.remove('done');
            })
         }
         if (step.getAttribute('data-value') == 1) {
            steps.forEach(step => {
               step.classList.remove('now');
            })
            step.classList.add('now');
         }
      })

      sections.forEach(section => {
         if (section.getAttribute('data-value') == '1') {
            sections.forEach(section => {
               section.classList.add('hide')
            })
            section.classList.remove('hide')
         }
      })

   }
}
loadStep()