import switchBtn from './module/switchBtn.js';

document.addEventListener("DOMContentLoaded", () => {
   // основной блок
   let blockBasic = document.querySelector('.main__unit .block__basic'),
      createNewLetterBtn = blockBasic.querySelector('.block__basic-title .create_a_new_letter');

   // блок с созданием нового письма
   let blockCreate = document.querySelector('.main__unit .block__create');

   let popupBackground = document.querySelector('.popup');
   // попап отправки рекоменлательного письма
   let popupSendLetters = popupBackground.querySelector('.popup__send-recomendation'),
      popupSendLettersSendBtn = popupSendLetters.querySelector('.send-btn'),
      popupSendLettersCanselBtn = popupSendLetters.querySelector('.cancel-btn'),
      popupSendLettersCloseBtn = popupSendLetters.querySelector('.close-popup');

   // очистка попапа "ОТПРАВИТЬ РЕКОМЕНДАЦИЮ"
   function clearPopupSendLetters() {
      popupBackground.classList.remove('active')
      popupSendLetters.classList.remove('active')

      popupSendLetters.querySelectorAll('input').forEach(input => {
         if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false
         } else {
            input.value = ''
         }
      })
   }

   // кнопки "Мои файлы; Файлы моих коллег"
   let button = blockBasic.querySelectorAll('.block__basic-title .button button'),
      slideBtn = blockBasic.querySelector('.block__basic-title .button .slide');
   switchBtn(button, slideBtn);

   // блок с вкладками "Предложение о работе; Рек. письма; Тестовые задания; Анкеты"
   let blockBasicTabs = blockBasic.querySelector('.block__basic-tabs'),
      tabsBtn = blockBasicTabs.querySelectorAll('button'),
      slideTabBtn = blockBasicTabs.querySelector('.slide');
   switchBtn(tabsBtn, slideTabBtn);

   // блок если нет писем
   let noLettersBlock = blockBasic.querySelector('.block__basic-no-letters');

   // блок если есть письма
   let haveLettersBlock = blockBasic.querySelector('.block__basic-have-letters'),
      chooseAllLettersCheckbox = haveLettersBlock.querySelector('.letters-interection-btn .choose-all-letters input'),
      sendLettersBtn = haveLettersBlock.querySelector('.letters-interection-btn .send-letters'),
      removeLettersBtn = haveLettersBlock.querySelector('.letters-interection-btn .remove-letters'),
      lettersItemsBlock = haveLettersBlock.querySelector('.letters-items'),
      lettersItems,
      countChecked = 0;

   document.addEventListener('click', (event) => {
      let target = event.target

      function clickBlockHaveLetters() {
         // нажатие на чекбоксе "выбрать все письма"
         if (target === chooseAllLettersCheckbox) {
            lettersItems = lettersItemsBlock.querySelectorAll('.letters__item')

            if (chooseAllLettersCheckbox.parentElement.classList.contains('not-all')) {

               chooseAllLettersCheckbox.parentElement.classList.remove('not-all')
            }

            if (chooseAllLettersCheckbox.checked === true) {
               lettersItems.forEach(item => {
                  item.querySelector('.letters__item-checkbox input').checked = true
               })
               countChecked = lettersItems.length
            } else {
               lettersItems.forEach(item => {
                  item.querySelector('.letters__item-checkbox input').checked = false
               })
               countChecked = 0
            }
         }

         // нажатие на чекбоксы на письмах
         if (target.closest('.letters__item-checkbox input')) {
            lettersItems = lettersItemsBlock.querySelectorAll('.letters__item')

            // считать количество выбранных писем
            if (target.closest('.letters__item-checkbox input').checked === true) {
               countChecked++
            } else {
               countChecked--
            }

            if (countChecked === 0) {
               chooseAllLettersCheckbox.checked = false
               chooseAllLettersCheckbox.parentElement.classList.remove('not-all')
            } else if (countChecked === lettersItems.length) {
               chooseAllLettersCheckbox.checked = true
               chooseAllLettersCheckbox.parentElement.classList.remove('not-all')
            } else if (countChecked < lettersItems.length) {
               chooseAllLettersCheckbox.checked = false
               chooseAllLettersCheckbox.parentElement.classList.add('not-all')
            }
         }

         // нажатие на кнопку "удалить выбранные"
         if (target === removeLettersBtn) {
            lettersItems = lettersItemsBlock.querySelectorAll('.letters__item')

            lettersItems.forEach(item => {
               if (item.querySelector('.letters__item-checkbox input').checked === true) {
                  item.remove();
                  lettersItems = lettersItemsBlock.querySelectorAll('.letters__item')
               }
            })

            if (lettersItems.length === 0) {
               noLettersBlock.classList.remove('hide')
               haveLettersBlock.classList.add('hide')
            }
         }

         // нажатие кнопки отправить выбранные
         if (target === sendLettersBtn) {
            lettersItems = lettersItemsBlock.querySelectorAll('.letters__item')

            lettersItems.forEach(item => {
               if (item.querySelector('.letters__item-checkbox input').checked === true) {
                  popupBackground.classList.add('active')
                  popupSendLetters.classList.add('active')
               }
            })
         }

         // нажатие кнопок на конкретном письме письме
         if (target.closest('.letters__item-btn')) {
            // нажатие кнопки удалить
            if (target.closest('.letters__item-delete')) {
               target.closest('.letters__item').remove();
               lettersItems = lettersItemsBlock.querySelectorAll('.letters__item')

               // менять индикатор чекбокса "выбрать все"
               if (target.closest('.letters__item').querySelector('.letters__item-checkbox input').checked === true) {
                  countChecked--
               }
               if (countChecked === 0) {
                  chooseAllLettersCheckbox.checked = false
                  chooseAllLettersCheckbox.parentElement.classList.remove('not-all')
               } else if (countChecked === lettersItems.length) {
                  chooseAllLettersCheckbox.checked = true
                  chooseAllLettersCheckbox.parentElement.classList.remove('not-all')
               } else if (countChecked < lettersItems.length) {
                  chooseAllLettersCheckbox.checked = false
                  chooseAllLettersCheckbox.parentElement.classList.add('not-all')
               }

               // если нет элементов то скрыть блок
               if (lettersItems.length === 0) {
                  noLettersBlock.classList.remove('hide')
                  haveLettersBlock.classList.add('hide')
               }
            }

            // нажатие кнопки отправить
            if (target.closest('.letters__item-send')) {
               popupBackground.classList.add('active')
               popupSendLetters.classList.add('active')
            }

            // нажатие кнопки редакитровать
            if (target.closest('.letters__item-edit')) {

            }
         }

         // нажатия в попапе "ОТПРАВИТЬ РЕКОМЕНДАЦИЮ"
         if (target.closest('.popup__send-recomendation')) {
            if (target === popupSendLettersCloseBtn) {
               clearPopupSendLetters()
            }
            if (target === popupSendLettersCanselBtn) {
               clearPopupSendLetters()
            }
            if (target === popupSendLettersSendBtn) {
               clearPopupSendLetters()
            }
         }

         // нажатие на кнопку "создание нового рекомендательного письма"
         if (target === createNewLetterBtn) {
            blockBasic.classList.add('hide')
            blockCreate.classList.remove('hide')
         }
      }
      clickBlockHaveLetters()
   })
})