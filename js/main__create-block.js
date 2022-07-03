import { writeCookie, readCookie, deleteCookie } from './module/script__work-cookie.js';
import { setLS, getLS, removeLS } from './module/script__work-localStorage.js'

document.addEventListener("DOMContentLoaded", () => {
   let blockCreateLetters = document.querySelector('.block__create');
   let createLettersForm = blockCreateLetters.querySelector('.block__create-form');
   let createLettersFormData = {};
   let previewLettersForm = blockCreateLetters.querySelectorAll('.block__create-preview *');



   let recommendationsSelect = createLettersForm.querySelector('.recommendations__select'),
      recommendationsHeader = recommendationsSelect.querySelector('.select__header'),
      recommendationsList = recommendationsSelect.querySelector('.select__list');


   // вывести сегодняшнию дату в окне предпросмотра
   function printNowDate() {
      let now = new Date();
      let previewLettersFormDataNow = blockCreateLetters.querySelector('.block__create-preview .now__date');
      let months = {
         0: "января",
         1: "февраля",
         2: "марта",
         3: "апреля",
         4: "мая",
         5: "июня",
         6: "июля",
         7: "августа",
         8: "сентября",
         9: "октября",
         10: "ноября",
         11: "декабря"
      }

      previewLettersFormDataNow.querySelector('.day').textContent = now.getDate()

      for (let key in months) {
         if (key == now.getMonth()) {
            console.log();
            previewLettersFormDataNow.querySelector('.month').textContent = months[key]
         }
      }

      previewLettersFormDataNow.querySelector('.year').textContent = now.getFullYear() % 100;
   }
   printNowDate()

   // маска для ввода номера телефона
   var mask
   createLettersForm.querySelectorAll('input[type="tel"]').forEach(input => {
      const maskOptions = {
         mask: '+{7}(000)000-00-00',
         lazy: false
      }
      mask = IMask(input, maskOptions);
   })

   // записать значения которе установленны по умолчанию
   createLettersForm.querySelectorAll('input').forEach(elem => {
      if (elem.type === 'radio' && elem.checked === true) {
         createLettersFormData[elem.name] = elem.value
         // console.log("createLettersFormData", createLettersFormData)
      }

      for (let key in createLettersFormData) {
         previewLettersForm.forEach(elem => {
            if (elem.classList.contains(`${[key]}`)) {
               elem.querySelector('span').textContent = createLettersFormData[key]
            }
         })
      }
   })


   // ввод данных в основную форму
   createLettersForm.addEventListener('input', (event) => {
      let target = event.target

      createLettersFormData[target.name] = target.value

      // нажитие в селекте с выбором одного элемента
      if (target.type === 'radio' && target.closest('.select-radio')) {
         target.closest('.select-radio').querySelector('.select__header').textContent = target.value
         target.closest('.select-radio').querySelector('.select__header').setAttribute('data-value', target.value)
      }

      // ввод данных в textarea
      if (target.type === 'textarea') {
         target.closest('.textarea').querySelector('.length span').textContent = target.value.length
      }

      if (target.name == 'phone') {
         if (mask.unmaskedValue === '7') {
            createLettersFormData[target.name] = ''
         }
      }

      // вывод данных при вводе в форму предпросмотра
      previewLettersForm.forEach(elem => {
         if (elem.classList.contains(`${target.name}`)) {
            elem.querySelector('span').textContent = target.value

            if (elem.getAttribute('data-type') === 'tel' && mask.unmaskedValue === '7') {
               elem.querySelector('span').textContent = ''
            }
         }
      })

      setLS('create_letters', JSON.stringify(createLettersFormData))
   })


   document.addEventListener('click', (event) => {
      let target = event.target

      // открытие/закрытие селекта с рекомендациямя
      if (target.closest('.recommendations__select .select__header')) {
         recommendationsHeader.classList.toggle('active')
         recommendationsList.classList.toggle('active')
      } else if (recommendationsList.classList.contains('active')) {
         recommendationsHeader.classList.remove('active')
         recommendationsList.classList.remove('active')
      }
   })


   window.addEventListener("load", function load() {
      if (getLS('create_letters') != 'null') {
         createLettersFormData = JSON.parse(getLS('create_letters'))

         for (let key in createLettersFormData) {
            // вывод значения в выподающий селект рекомендации
            if (createLettersForm.elements[key] instanceof RadioNodeList) {
               if (createLettersForm.querySelector(`.${[key]}`).classList.contains('select-radio')) {
                  // установить значение в хедере выпадающего списка
                  createLettersForm.querySelector(`.${[key]} .select__header`).textContent = createLettersFormData[key]
                  createLettersForm.querySelector(`.${[key]} .select__header`).setAttribute('data-value', createLettersFormData[key])

                  // выбрать активный элемент из списка
                  createLettersForm.querySelectorAll(`.${[key]} .select__list .item input`).forEach(item => {
                     if (item.value === createLettersFormData[key]) {
                        item.checked = true
                     }
                  })
               }
               // вывод данных в форму предпросмотра
               previewLettersForm.forEach(elem => {
                  if (elem.classList.contains(`${[key]}`)) {
                     elem.querySelector('span').textContent = createLettersFormData[key]
                  }
               })
            }

            // вывод значений в инпуты
            createLettersForm.elements[key].value = createLettersFormData[key];

            // вывод количества символов в textarea
            if (createLettersForm.querySelector(`.${[key]}`).classList.contains('textarea')) {
               createLettersForm.querySelector(`.${[key]}`).querySelector('.length span').textContent = createLettersFormData[key].length
            }

            // вывод данных в форму предпросмотра
            previewLettersForm.forEach(elem => {
               if (elem.classList.contains(`${createLettersForm.elements[key].name}`)) {
                  elem.querySelector('span').textContent = createLettersFormData[key]
               }
            })

         }

      }
   })
})