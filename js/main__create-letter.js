import { setLS, getLS, removeLS } from './module/script__work-localStorage.js';
import { writeCookie, readCookie, deleteCookie } from './module/script__work-cookie.js';
import { loadStep } from './module/loadStep.js';
import switchBtn from './module/switchBtn.js';
import { clickBtnBack, clickBtnNext } from './module/clickBtnNavigation.js';
import { bgLock, bgUnlock } from "./module/bgFixed.js";


document.addEventListener("DOMContentLoaded", () => {
   // ФОН ДЛЯ ВСЕХ ПОПАПОВ
   let popupBackground = document.querySelector('.popup');
   // попап отправки рекоменлательного письма
   let popupSendLetters = popupBackground.querySelector('.popup__send-recomendation');
   let sendLetter = [];
   // попап удаления письма
   let popupDeleteLetter = popupBackground.querySelector('.popup__delete-letter');
   let deleteLetter = [];
   // попап успешной отправки письма
   let popupSuccessLetter = popupBackground.querySelector('.popup__send-success');
   // попап успешного сохранения письма
   let popupSaveLetter = popupBackground.querySelector('.popup__save-letter');
   // попап продолжить создания письма
   let popupContinueCreate = popupBackground.querySelector('.popup__continue-create');
   // попап завершения создания письма
   let popupCancelCreate = popupBackground.querySelector('.popup__cancel-create');

   // ОСНОВНОЙ БЛОК РЕКОМЕНДАТЕЛЬНЫХ ПИСЕМ
   let blockBasic = document.querySelector('.main__unit .block__basic');

   // КНОПКИ ДЛЯ ПЕРЕХОДА ПО РАЗДЕЛАМ НА ОСНОВНОЙ ВКЛАДКЕ С ФАЙЛАМИ
   // кнопки "Мои файлы; Файлы моих коллег"
   let button = blockBasic.querySelectorAll('.block__basic-title .button button'),
      slideBtn = blockBasic.querySelector('.block__basic-title .button .slide');
   switchBtn(button, slideBtn);
   // блок с вкладками "Предложение о работе; Рек. письма; Тестовые задания; Анкеты"
   let blockBasicTabs = blockBasic.querySelector('.block__basic-tabs'),
      tabsBtn = blockBasicTabs.querySelectorAll('button'),
      slideTabBtn = blockBasicTabs.querySelector('.slide');
   switchBtn(tabsBtn, slideTabBtn);

   // БЛОК ЕСЛИ ЕСТЬ СОХРАНЕННЫЕ ПИСЬМА
   let haveLettersBlock = blockBasic.querySelector('.block__basic-have-letters'),
      chooseAllLettersCheckbox = haveLettersBlock.querySelector('.letters-interection-btn .choose-all-letters input'),
      sendLettersBtn = haveLettersBlock.querySelector('.letters-interection-btn .send-letters'),
      removeLettersBtn = haveLettersBlock.querySelector('.letters-interection-btn .remove-letters'),
      lettersItemsBlock = haveLettersBlock.querySelector('.letters-items'),
      lettersItems, // переменная для записи ВСЕХ СОХРАНЁННЫХ ПИСЕМ
      letterItem, // переменная для записи ПИСЬМА ПО КОТОРОМУ ПРОИЗОШЛО НАДЖАТИЕ
      countChecked = 0; // счетчик ВЫБРАННЫХ ПИСЕМ

   // БЛОК СОЗДАНИЯ НОВОГО РЕКОМЕДАТЕЛЬНОГО ПИСЬМА
   let blockCreate = document.querySelector('.main__unit .block__create'),
      blockCreateTitle = blockCreate.querySelector('.block__create-title'),
      blockCreateCancelBtn = blockCreateTitle.querySelector('.cancel_create_letters'),
      blockCreateSection = blockCreate.querySelector('.block__create-inner .block__create-form .section-step'),
      blockCreateStep = blockCreate.querySelectorAll('.step .step__value');

   // ОСНОВНЯ ФОРМА ДЛЯ СОЗДАНИЯ НОВОГО РЕКОМЕНДАТЕЛЬНОГО ПИСЬМА
   let createForm = blockCreate.querySelector('.block__create-form'),
      // основной объект для заполенных данных рекомендательного письма
      createFormData = {},
      // поля для ввода периода работы
      periodFrom = createForm.querySelector('.period__from'),
      periodTo = createForm.querySelector('.period__to'),
      // селект с выбором рекомедации
      recommendationsSelect = createForm.querySelector('.recommendations__select'),
      recommendationsHeader = recommendationsSelect.querySelector('.select__header'),
      recommendationsList = recommendationsSelect.querySelector('.select__list');

   // ФОРМА ПРЕДПРОСМОТР РЕКОМЕНДАТЕЛЬНОГО ПИСЬМА
   let previewForm = blockCreate.querySelectorAll('.block__create-preview *'),
      previewFormBlock = blockCreate.querySelector('.block__create-preview'),
      previewFormTitleText = blockCreateTitle.querySelector('.preview__title h5'),
      previewFormDataCreate = blockCreate.querySelector('.block__create-preview .create__date');
   // поле с датой в окне предпросмотра
   let now = new Date();
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
   };
   // объект для данных при открытие предпросмотра с основной страницы
   let letterDate = {};

   // БЛОК ДЛЯ СОХРАНЕНИЯ НОВЫХ ПИСЕМ
   let blockSaveLetters = blockBasic.querySelector('.block__basic-have-letters .letters-items');
   // ШАБЛОН ДЛЯ СОЗДАНИЯ НОВОГО ПИСЬМА
   let templateLetter = document.querySelector('template#letter__item'),
      cloneLetterItem = templateLetter.content.querySelector('.letter__item');

   // маска для ввода номера телефона
   var mask
   createForm.querySelectorAll('input').forEach(elem => {
      if (elem.type === 'tel') {
         const maskOptions = {
            mask: '+{7}(000)000-00-00',
            lazy: false
         }
         mask = IMask(elem, maskOptions);
      }
   })


   // очистка попапа "ОТПРАВИТЬ РЕКОМЕНДАЦИЮ"
   function clearPopupSendLetters() {
      popupSendLetters.querySelectorAll('input').forEach(input => {
         if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false
         } else {
            input.value = ''
         }
      })
   }

   // вывод даты созания письма при нажатии создать новое
   function printNowDate() {
      previewFormDataCreate.querySelector('.day').textContent = now.getDate()

      for (let key in months) {
         if (key == now.getMonth()) {
            previewFormDataCreate.querySelector('.month').textContent = months[key]
         }
      }

      previewFormDataCreate.querySelector('.year').textContent = now.getFullYear() % 100;
   }

   // записать значения которе установленны по умолчанию
   function defaultDataColection() {

      // календарь для выбора периода работы
      flatpickr(periodFrom, {
         "plugins": [new rangePlugin({ input: periodTo })],
         "locale": "ru",
         "dateFormat": "d.m.Y",
         "minDate": `${now.getDate()}.${now.getMonth()}.${now.getFullYear() - 60}}`,
         "maxDate": "today",
         onChange: function () {
            createFormData[`${periodFrom.name}`] = periodFrom.value
            createFormData[`${periodTo.name}`] = periodTo.value

            if (periodFrom.classList.contains('error')) {
               periodFrom.classList.remove('error')
            }
            if (periodTo.classList.contains('error')) {
               periodTo.classList.remove('error')
            }

            // вывод данных в окно предпросмотра
            previewForm.forEach(elem => {
               if (elem.classList.contains(`${periodFrom.name}`)) {
                  elem.querySelector('span').textContent = periodFrom.value
               }
               if (elem.classList.contains(`${periodTo.name}`)) {
                  elem.querySelector('span').textContent = periodTo.value
               }
            })
         }
      })

      createForm.querySelectorAll('input').forEach(elem => {
         if (elem.type === 'tel') {
            const maskOptions = {
               mask: '+{7}(000)000-00-00',
               lazy: false
            }
            mask = IMask(elem, maskOptions);
         }

         if (elem.type === 'radio' && elem.checked === true) {
            createFormData[elem.name] = elem.value
         }

         for (let key in createFormData) {
            previewForm.forEach(elem => {
               if (elem.classList.contains(`${[key]}`)) {
                  if (elem.getAttribute('data-type') === 'textarea') {
                     elem.querySelector('textarea').value = createFormData[key]
                  } else {
                     elem.querySelector('span').textContent = createFormData[key]
                  }
               }
            })
         }
      })
   }

   // заполнение формы "СОЗДАНИЯ НОВОГО ПИСЬМА"
   function fillInTheForm() {
      createFormData = JSON.parse(getLS('create_letters'))

      let startPeriod
      let endPeriod
      startPeriod = createFormData[`period__from`] === undefined || createFormData[`period__from`] === '' ? '' : createFormData[`period__from`]
      endPeriod = createFormData[`period__to`] === undefined || createFormData[`period__to`] === '' ? '' : createFormData[`period__to`]
      flatpickr(periodFrom, {
         "plugins": [new rangePlugin({ input: periodTo })],
         "locale": "ru",
         "dateFormat": "d.m.Y",
         "defaultDate": [startPeriod, endPeriod],
         "minDate": `${now.getDate()}.${now.getMonth()}.${now.getFullYear() - 60}}`,
         "maxDate": "today",

         onChange: function () {
            createFormData[`${periodFrom.name}`] = periodFrom.value
            createFormData[`${periodTo.name}`] = periodTo.value

            if (periodFrom.classList.contains('error')) {
               periodFrom.classList.remove('error')
            }
            if (periodTo.classList.contains('error')) {
               periodTo.classList.remove('error')
            }

            // вывод данных в окно предпросмотра
            previewForm.forEach(elem => {
               if (elem.classList.contains(`${periodFrom.name}`)) {
                  elem.querySelector('span').textContent = periodFrom.value
               }
               if (elem.classList.contains(`${periodTo.name}`)) {
                  elem.querySelector('span').textContent = periodTo.value
               }
            })
         }
      })

      for (let key in createFormData) {
         // вывод значения в выподающий селект рекомендации
         if (createForm.elements[key] instanceof RadioNodeList) {
            if (createForm.querySelector(`.${[key]}`).classList.contains('select-radio')) {
               // установить значение в хедере выпадающего списка
               createForm.querySelector(`.${[key]} .select__header`).textContent = createFormData[key]
               createForm.querySelector(`.${[key]} .select__header`).setAttribute('data-value', createFormData[key])

               // выбрать активный элемент из списка
               createForm.querySelectorAll(`.${[key]}.select__list.item input`).forEach(item => {
                  if (item.value === createFormData[key]) {
                     item.checked = true
                  }
               })
            }
         }

         // вывод значений в инпуты
         for (let keyEl in createForm.elements) {
            if (keyEl === key) {
               createForm.elements[keyEl].value = createFormData[key];

               // вывод количества символов в textarea
               if (createForm.querySelector(`.${[keyEl]}`).classList.contains('textarea')) {
                  createForm.querySelector(`.${[keyEl]}`).querySelector('.length span').textContent = createFormData[key].length
               }

               // вывод данных в форму предпросмотра
               previewForm.forEach(elem => {
                  if (key == 'create__letter') {
                     let dateCreate = createFormData[key].split('.')
                     previewFormDataCreate.querySelector('.day').textContent = dateCreate[0]
                     for (let key in months) {
                        if (key == dateCreate[1] - 1) {
                           previewFormDataCreate.querySelector('.month').textContent = months[key]
                        }
                     }
                     previewFormDataCreate.querySelector('.year').textContent = dateCreate[2] % 100
                  }

                  if (elem.classList.contains(`${[key]}`)) {
                     if (elem.getAttribute('data-type') === 'textarea') {
                        if (createFormData[key] !== '' && createFormData[key] !== undefined) {
                           elem.querySelector('textarea').value = createFormData[key]
                           elem.querySelector('textarea').classList.add('not-empty')
                           elem.querySelector('.textarea__inner').classList.add('not-empty')

                           setTimeout(() => {
                              elem.querySelector('textarea').style.height = elem.querySelector('textarea').scrollHeight + "px"
                           }, 1);
                        }
                     } else {
                        elem.querySelector('span').textContent = createFormData[key]
                     }
                  }
               })
            }
         }
      }
   }

   // очистка формы "СОЗДАНИЯ НОВОГО ПИСЬМА"
   function clearFormCreateLetter() {

      recommendationsList.querySelectorAll('input[type="radio"]').forEach(elem => {
         if (elem.value === "безоговорочно рекомендую") {
            recommendationsHeader.textContent = elem.value
            recommendationsHeader.setAttribute('data-value', elem.value)
            elem.checked = true
         } else {
            elem.checked = false
         }
      })

      createForm.querySelectorAll('*').forEach(elem => {
         if (elem.type !== 'radio') {
            elem.value = ''
         }
      })

      for (let key in createFormData) {
         // очистка формы предпросмотра
         previewForm.forEach(elem => {
            if (elem.classList.contains(`${[key]}`)) {
               if (elem.getAttribute('data-type') === 'textarea') {
                  elem.querySelector('textarea').value = ''
                  elem.querySelector('textarea').classList.remove('not-empty')
                  elem.querySelector('.textarea__inner').classList.remove('not-empty')
                  elem.querySelector('textarea').style.height = 'auto'
                  elem.querySelector('textarea').style.height = elem.querySelector('textarea').scrollHeight + "px"
               } else {
                  elem.querySelector('span').textContent = ''
               }
            }
         })
      }

      createFormData = {}

      blockBasic.classList.remove('hide')
      blockCreate.classList.add('hide')

      removeLS('create_letters')
      deleteCookie('step-now(letter_of_recomendation_desktop)')
   }



   // НАЖАТИЯ В ОСНОВНОМ БЛОКЕ
   blockBasic.addEventListener('click', (event) => {
      let target = event.target

      // нажатие кнопки создание нового письма
      if (target.closest('.block__basic-title .create_a_new_letter') || target.closest('.block__basic-no-letters .create_a_new_letter')) {
         if (getLS('create_letters') != 'null') {
            popupBackground.classList.add('active')
            popupContinueCreate.classList.add('active')
            bgLock()
         } else {
            clearFormCreateLetter()
            defaultDataColection()
            printNowDate()

            blockCreate.setAttribute('data-open__block', 'create-block')
            blockBasic.classList.add('hide')
            blockCreate.classList.remove('hide')
         }
      }

      // нажатие на чекбоксе "ВЫБРАТЬ ВСЕ ПИСЬМА"
      if (target === chooseAllLettersCheckbox) {
         lettersItems = lettersItemsBlock.querySelectorAll('.letter__item')

         if (chooseAllLettersCheckbox.parentElement.classList.contains('not-all')) {
            chooseAllLettersCheckbox.parentElement.classList.remove('not-all')
         }

         if (chooseAllLettersCheckbox.checked === true) {
            lettersItems.forEach(item => {
               item.querySelector('.letter__item-checkbox input').checked = true
            })
            countChecked = lettersItems.length
         } else {
            lettersItems.forEach(item => {
               item.querySelector('.letter__item-checkbox input').checked = false
            })
            countChecked = 0
         }
      }

      // нажатие кнопки "ОТПРАВИТЬ ВЫБРАННЫЕ"
      if (target === sendLettersBtn) {
         lettersItems = lettersItemsBlock.querySelectorAll('.letter__item')

         sendLetter = []
         lettersItems.forEach(item => {
            if (item.querySelector('.letter__item-checkbox input').checked === true) {
               sendLetter.push(item.getAttribute('data-id'))

               popupBackground.classList.add('active')
               popupSendLetters.classList.add('active')
               bgLock()

               popupSendLetters.setAttribute('data-send', 'selected')
            }
         })
      }

      // нажатие на кнопку "УДАЛИТЬ ВЫБРАННЫЕ"
      if (target === removeLettersBtn) {
         lettersItems = lettersItemsBlock.querySelectorAll('.letter__item')

         deleteLetter = []
         lettersItems.forEach(item => {
            if (item.querySelector('.letter__item-checkbox input').checked === true) {
               deleteLetter.push(item.getAttribute('data-id'))

               popupBackground.classList.add('active')
               popupDeleteLetter.classList.add('active')
               bgLock()

               popupDeleteLetter.setAttribute('data-delete', 'selected')
               popupDeleteLetter.querySelector('p span').textContent = `выбранные файлы`
            }
         })
      }

      // нажатие на конкретном письме
      if (target.closest('.letter__item')) {
         // нажатие кнопок на конкретном письме письме
         if (target.closest('.letter__item-btn')) {
            // нажатие кнопки удалить
            if (target.closest('.letter__item-delete')) {
               letterItem = target.closest('.letter__item')

               deleteLetter = []
               deleteLetter.push(letterItem.getAttribute('data-id'))

               popupBackground.classList.add('active')
               popupDeleteLetter.classList.add('active')
               bgLock()

               popupDeleteLetter.setAttribute('data-delete', 'one')
               popupDeleteLetter.querySelector('p span').textContent = `файл "${target.closest('.letter__item').getAttribute('data-recommended')}"`
            }

            // нажатие кнопки отправить
            if (target.closest('.letter__item-send')) {
               letterItem = target.closest('.letter__item')

               sendLetter = []
               sendLetter.push(letterItem.getAttribute('data-id'))

               popupBackground.classList.add('active')
               popupSendLetters.classList.add('active')
               bgLock()

               popupSendLetters.setAttribute('data-send', 'one')
            }

            // нажатие кнопки редакитровать
            if (target.closest('.letter__item-edit')) {

            }
         }

         // нажатие на чекбоксы на письмах
         if (target.closest('.letter__item-checkbox input')) {
            lettersItems = lettersItemsBlock.querySelectorAll('.letter__item')

            // считать количество выбранных писем
            if (target.closest('.letter__item-checkbox input').checked === true) {
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

         // нажатие кнопки открыть предпросмотр
         if (target.closest('.open-preview')) {

            // получить значения письма по которому нажали
            for (let key in target.closest('.letter__item').dataset) {
               if (target.closest('.letter__item').dataset[key] !== undefined && target.closest('.letter__item').dataset[key] !== '') {
                  letterDate[key] = target.closest('.letter__item').dataset[key]
               }
            }

            // заполнить форму предпросмотра полученными значениями форму предпросмотра
            for (let key in letterDate) {
               previewForm.forEach(elem => {
                  if (key === 'create__letter') {
                     let dateCreate = letterDate[key].split('.')
                     previewFormDataCreate.querySelector('.day').textContent = dateCreate[0]
                     for (let key in months) {
                        if (key == dateCreate[1] - 1) {
                           previewFormDataCreate.querySelector('.month').textContent = months[key]
                        }
                     }
                     previewFormDataCreate.querySelector('.year').textContent = dateCreate[2] % 100
                  } else if (elem.classList.contains(`${[key]}`)) {
                     if (elem.getAttribute('data-type') === "textarea") {
                        elem.querySelector('textarea').classList.add('not-empty')
                        elem.querySelector('.textarea__inner').classList.add('not-empty')

                        elem.querySelector('textarea').value = letterDate[key]
                        setTimeout(() => {
                           elem.querySelector('textarea').style.height = elem.querySelector('textarea').scrollHeight + "px"
                        }, 10);
                     } else {
                        elem.querySelector('span').textContent = letterDate[key]
                     }
                  }
               })
            }

            // вывести ФИО рекомендуемого в заголовке
            previewFormTitleText.textContent = letterDate['recommended'] === undefined || letterDate['recommended'] === '' ? 'Фамилия Имя Отчество' : letterDate['recommended']

            // открыть блок предпросмотра
            blockBasic.classList.add('hide')
            blockCreate.classList.remove('hide')
            blockCreate.classList.add('preview')
            // установить аттрибут "от куда был открыт предпосмотр"
            blockCreate.setAttribute('data-open__block', 'basic-block')

            // очистить объект с данными после открытия превью
            for (let key in target.closest('.letter__item').dataset) {
               if (target.closest('.letter__item').dataset[key] !== undefined && target.closest('.letter__item').dataset[key] !== '') {
                  letterDate[key] = ''
               }
            }
         }

         // нажатие на кнопки редактировать
         if (target.closest('.letter__item-edit')) {
            // получить значения письма по которому нажали
            for (let key in target.closest('.letter__item').dataset) {
               if (target.closest('.letter__item').dataset[key] !== undefined && target.closest('.letter__item').dataset[key] !== '') {
                  letterDate[key] = target.closest('.letter__item').dataset[key]
               }
            }
            setLS('create_letters', JSON.stringify(letterDate))

            // открытие блока редактирования конкретного письма
            blockCreate.setAttribute('data-open__block', 'create-block')
            blockBasic.classList.add('hide')
            blockCreate.classList.remove('hide')

            loadStep()
            fillInTheForm()
         }
      }
   })

   // НАЖАТИЯ В ШАПКЕ СОЗДАНИЯ НОВОГО ПИСЬМА
   blockCreateTitle.addEventListener('click', (event) => {
      let target = event.target;

      // закрытие окна предпросмотра нажатием на кнопку назад
      if (target.closest('.hide_preview')) {
         // закрытие предпросмотра, если оно было открыто со сраницы с СОХРАНЁННЫМИ ПИСЬМАМИ
         if (blockCreate.getAttribute('data-open__block') === "basic-block") {
            blockBasic.classList.remove('hide')
            blockCreate.classList.add('hide')
            blockCreate.classList.remove('preview')

            // заполнить форму предпросмотра пустыми значениями
            for (let key in letterDate) {
               previewForm.forEach(elem => {
                  if (elem.classList.contains(`${[key]}`)) {
                     if (elem.getAttribute('data-type') === 'textarea') {
                        elem.querySelector('textarea').value = ''
                        elem.querySelector('textarea').classList.remove('not-empty')
                        elem.querySelector('.textarea__inner').classList.remove('not-empty')
                        elem.querySelector('textarea').style.height = 'auto'
                        elem.querySelector('textarea').style.height = elem.querySelector('textarea').scrollHeight + "px"
                     } else {
                        elem.querySelector('span').textContent = ''
                     }
                  }
               })
            }
         }
         // закрытие предпросмотра, если оно было открыто со сраницы с СОЗАНИЯ ПИСЬМАМИ
         if (blockCreate.getAttribute('data-open__block') === "create-block") {
            blockCreate.classList.remove('preview')
         }
      }

      // нажатие кнопки открыть предпросмотр из блока создания
      if (target.closest('.open_preview')) {
         previewFormTitleText.textContent = createFormData['recommended'] === undefined || createFormData['recommended'] === '' ? 'Фамилия Имя Отчество' : createFormData['recommended']

         blockCreate.classList.add('preview')
      }
   })

   // НАЖАТИЯ В БЛОКЕ "СОЗДАНИЯ ПИСЬМА"
   blockCreate.addEventListener('click', (event) => {
      let target = event.target

      // нажатие кнопки назад на блоке создания письма
      if (target === blockCreateCancelBtn) {
         popupBackground.classList.add('active')
         popupCancelCreate.classList.add('active')
         bgLock()
      }

      // если у поля есть ошибка, то убрать её при нажатии
      if (target.closest('.block__create-form') && target.classList.contains('error')) {
         target.classList.remove('error')
      }

      // нажате на кнопки для перехода между шагами
      function clickBtnStepNavigation() {
         let validateCity = false
         let validateRecommended = false
         let validatePosition = false
         let validatePeriodFrom = false
         let validatePeriodTo = false
         function validateStep1() {
            if (createFormData['city'] == undefined || createFormData['city'] == '') {
               createForm.querySelector('[name="city"]').classList.add('error')
            } else {
               validateCity = true
            }

            if (createFormData['recommended'] == undefined || createFormData['recommended'] == '') {
               createForm.querySelector('[name="recommended"]').classList.add('error')
            } else {
               validateRecommended = true
            }

            if (createFormData['position'] == undefined || createFormData['position'] == '') {
               createForm.querySelector('[name="position"]').classList.add('error')
            } else {
               validatePosition = true
            }

            if (createFormData['period__from'] == undefined || createFormData['period__from'] == '') {
               createForm.querySelector('[name="period__from"]').classList.add('error')
            } else {
               validatePeriodFrom = true
            }

            if (createFormData['period__to'] == undefined || createFormData['period__to'] == '') {
               createForm.querySelector('[name="period__to"]').classList.add('error')
            } else {
               validatePeriodTo = true
            }

            if (!validateCity || !validateRecommended || !validatePosition || !validatePeriodFrom || !validatePeriodTo) {
               blockCreateStep.forEach(step => {
                  if (step.getAttribute('data-value') == '1') {
                     step.classList.add('error');
                  }
               })
            } else {
               blockCreateStep.forEach(step => {
                  if (step.getAttribute('data-value') == '1') {
                     if (step.classList.contains('error')) {
                        step.classList.remove('error');
                     }
                  }
               })
            }
         }

         if (target.closest('.next') && target.closest('.step-1')) {
            event.preventDefault()

            validateStep1()

            if (validateCity && validateRecommended && validatePosition && validatePeriodFrom && validatePeriodTo) {
               clickBtnNext();
            }
         }

         if (target.closest('.back') && target.closest('.step-2')) {
            event.preventDefault()
            clickBtnBack();
         }
         if (target.closest('.next') && target.closest('.step-2')) {
            event.preventDefault()
            clickBtnNext();
         }

         if (target.closest('.back') && target.closest('.step-3')) {
            event.preventDefault()
            clickBtnBack();
         }
         if (target.closest('.save') && target.closest('.step-3')) {
            event.preventDefault()

            for (let key in createFormData) {
               // установить аттрибуты новому письму в зависимости от заполненных данных
               cloneLetterItem.setAttribute(`data-${key}`, createFormData[key])

               // вывести имя рекомендуемого
               cloneLetterItem.querySelector('.name').textContent = createFormData['recommended']

               // вывести описание рекомендуемого на письме
               cloneLetterItem.querySelector('.letter__item-description p').textContent = createFormData['characteristic'] === undefined || createFormData['characteristic'] === '' ? "Характеристика отсутствует" : createFormData['characteristic']

               // записать аттрибут даты создания письма и вывести значение на сохранённом письме
               cloneLetterItem.setAttribute('data-create__letter', `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`)
               for (let key in months) {
                  if (key == now.getMonth()) {
                     cloneLetterItem.querySelector('.letter__item-create-date').textContent = `${now.getDate()} ${months[key]} ${now.getFullYear()}`
                  }
               }
            }

            blockSaveLetters.append(cloneLetterItem)

            popupBackground.classList.add('active')
            popupSaveLetter.classList.add('active')
            bgLock()
            setTimeout(() => {
               popupBackground.classList.remove('active')
               popupSaveLetter.classList.remove('active')
               bgUnlock()
            }, 1500);

            // если не было ни одного сохранённого письма то отобразить блок с письмами
            if (blockBasic.classList.contains('no-letter')) {
               blockBasic.classList.remove('no-letter')
            }
         }
         if (target.closest('.send') && target.closest('.step-3')) {
            event.preventDefault()

            validateStep1()

            if (validateCity && validateRecommended && validatePosition && validatePeriodFrom && validatePeriodTo) {
               popupBackground.classList.add('active')
               popupSendLetters.classList.add('active')
               bgLock()
            }
         }
      }
      clickBtnStepNavigation()
   })

   // ВВОД ДАННЫХ В ОСНОВНУЮ ФОРМУ
   createForm.addEventListener('input', (event) => {
      let target = event.target

      // ввод данных
      createFormData[`${target.name}`] = target.value

      // ввод данных в "ТЕКСТОВОЕ ПОЛЕ"
      if (target.type === 'textarea') {
         target.closest('.textarea').querySelector('.length span').textContent = target.value.length
      }
      // нажитие в "ВЫПАДАЮЩЕМ СПИСКЕ (С ВЫБОРОМ ОДНОГО ЭЛЕМЕНТА)"
      if (target.type === 'radio' && target.closest('.select-radio')) {
         target.closest('.select-radio').querySelector('.select__header').textContent = target.value
         target.closest('.select-radio').querySelector('.select__header').setAttribute('data-value', target.value)
      }
      // ввод данных в поле "НОМЕРА ТЕЛЕФОНА"
      if (target.name == 'phone') {
         if (mask.unmaskedValue === '7') {
            createFormData[`${target.name}`] = ''
         }
      }

      // ВЫВОД ДАННЫХ В ФОРМЕ ПРЕДПРОСМОТРА ВО ВРЕМЯ ЗАПОЛНЕНИЯ ПОЛЕЙ 
      previewForm.forEach(elem => {
         if (elem.classList.contains(`${target.name}`)) {
            if (elem.getAttribute('data-type') === 'tel' && mask.unmaskedValue === '7') {
               elem.querySelector('span').textContent = ''
            } else if (elem.getAttribute('data-type') === 'textarea') {
               if (target.value.length > 0) {
                  elem.querySelector('textarea').classList.add('not-empty')
                  elem.querySelector('.textarea__inner').classList.add('not-empty')
               } else {
                  elem.querySelector('textarea').classList.remove('not-empty')
                  elem.querySelector('.textarea__inner').classList.remove('not-empty')
               }

               elem.querySelector('textarea').value = target.value
               elem.querySelector('textarea').style.height = 'auto'
               elem.querySelector('textarea').style.height = elem.querySelector('textarea').scrollHeight + "px"
            } else {
               elem.querySelector('span').textContent = target.value
            }
         }
      })

      // запись значения в LocalStorage
      setLS('create_letters', JSON.stringify(createFormData))
   })

   // НАЖИТИЯ НА ФОРМЕ ПРЕДПРОСМОТРА ПИСЬМА ИЗ БЛОКА СОЗДАНИЯ
   previewFormBlock.addEventListener('click', (event) => {
      let target = event.target;

      // нажатие на уже заполненные поля для установки фокуса на необходимое поле ввода
      if (target.closest('.focus') && blockCreate.getAttribute('data-open__block') === "create-block") {
         createForm.querySelectorAll('*').forEach(elem => {

            if (elem.name == target.closest('.focus').getAttribute('data-focus')) {

               for (let key in createFormData) {

                  if (elem.name == key && createFormData[key] !== undefined && createFormData[key] !== '') {
                     blockCreateStep.forEach(step => {
                        if (step.getAttribute('data-value') < target.closest('.focus').getAttribute('data-step')) {
                           step.classList.add('done');
                        }
                        if (step.getAttribute('data-value') == target.closest('.focus').getAttribute('data-step')) {
                           blockCreateStep.forEach(step => {
                              step.classList.remove('now');
                           })
                           step.classList.add('now');
                           writeCookie('step-now(letter_of_recomendation_desktop)', target.closest('.focus').getAttribute('data-step'))
                        }
                     })

                     blockCreateSection.forEach(section => {
                        if (section.getAttribute('data-value') == target.closest('.focus').getAttribute('data-step')) {
                           blockCreateSection.forEach(section => {
                              section.classList.add('hide')
                           })
                           section.classList.remove('hide')
                        }
                     })
                     elem.focus()
                  }
               }
            }
         })
      }
   })

   // НАЖАТИЯ НА ПОПАПАХ
   popupBackground.addEventListener('click', (event) => {
      let target = event.target;

      // нажатия в попапе "УДАЛЕНИЯ ПИСЬМА"
      function clickPopupDelete() {
         if (popupDeleteLetter.classList.contains('active') && popupBackground.classList.contains('active')) {
            // нажатие кнопки отмена, крестик, фон попапа
            if (target.closest('.cancel') || target.closest('.close-popup') || target === popupBackground) {
               popupBackground.classList.remove('active')
               popupDeleteLetter.classList.remove('active')
               popupDeleteLetter.removeAttribute('data-delete')
               bgUnlock()
            }
            // нажатие кнопки удалить
            if (target.closest('.delete')) {
               // получение всех сохраненных писем
               lettersItems = lettersItemsBlock.querySelectorAll('.letter__item')

               // удаление выбранных
               if (popupDeleteLetter.getAttribute('data-delete') === 'selected') {
                  lettersItems.forEach(item => {
                     if (item.querySelector('.letter__item-checkbox input').checked === true) {
                        item.remove();

                        countChecked--

                        chooseAllLettersCheckbox.checked = false
                        chooseAllLettersCheckbox.parentElement.classList.remove('not-all')
                        lettersItems = lettersItemsBlock.querySelectorAll('.letter__item')
                     }
                  })
               }

               // удаление конкретного
               if (popupDeleteLetter.getAttribute('data-delete') === 'one') {
                  letterItem.remove();
                  lettersItems = lettersItemsBlock.querySelectorAll('.letter__item')

                  // менять индикатор чекбокса "выбрать все"
                  if (letterItem.querySelector('.letter__item-checkbox input').checked === true) {
                     countChecked--
                  }

                  // изменять индикатор отмеченных писем
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

               // если нет элементов то скрыть блок
               if (lettersItems.length === 0) {
                  blockBasic.classList.add('no-letter')
               }

               // закрытие попапа удаления письма
               popupBackground.classList.remove('active')
               popupDeleteLetter.classList.remove('active')
               popupDeleteLetter.removeAttribute('data-delete')
               bgUnlock()
            }
         }
      }
      clickPopupDelete()

      // нажатие в попапе "ОТПРАВКИ ПИСЬМА"
      function clickPopupSend() {
         if (popupSendLetters.classList.contains('active') && popupBackground.classList.contains('active')) {
            // нажатие кнопки отмена, крестик, фон попапа
            if (target.closest('.cancel') || target.closest('.close-popup' || target === popupBackground)) {
               popupBackground.classList.remove('active')
               popupSendLetters.classList.remove('active')
               popupSendLetters.removeAttribute('data-send')
               bgUnlock()

               clearPopupSendLetters()
            }
            // нажатие кнопки отправить
            if (target.closest('.send')) {
               let emloyeesItem = popupSendLetters.querySelectorAll('.have-employees__block .items .item input')

               // отправка выбранных писем
               if (popupDeleteLetter.getAttribute('data-delete') === 'selected') {

               }
               // отправка конкретного письма
               if (popupDeleteLetter.getAttribute('data-delete') === 'one') {

               }

               if (emloyeesItem.length !== 0) {
                  emloyeesItem.forEach(item => {
                     if (item.checked) {
                        popupSendLetters.classList.remove('active')
                        popupSendLetters.removeAttribute('data-send')

                        popupSuccessLetter.classList.add('active')
                     }
                  })
               }
            }
         }
      }
      clickPopupSend()

      // нажатие в попапе "УСПЕШНОЙ ОТПРАВКИ"
      function clickPopupSuccessSend() {
         if (popupSuccessLetter.classList.contains('active') && popupBackground.classList.contains('active')) {
            if (target.closest('.my__files-btn')) {
               if (!createForm.classList.contains('hide') && blockBasic.classList.contains('hide')) {
                  popupBackground.classList.remove('active')
                  popupSuccessLetter.classList.remove('active')
                  bgUnlock()

                  clearPopupSendLetters()
                  clearFormCreateLetter()
                  loadStep()
               } else {
                  popupBackground.classList.remove('active')
                  popupSuccessLetter.classList.remove('active')
                  bgUnlock()
               }
            }
         }
      }
      clickPopupSuccessSend();

      // нажатие в попапе "ПРОДОЛЖИТЬ СОЗДАНИЕ ПИСЬМА"
      function clickPopupContinueCreate() {
         if (popupContinueCreate.classList.contains('active') && popupBackground.classList.contains('active')) {
            // закрытие попапа
            if (target.closest('.close-popup') || target === popupBackground) {
               popupBackground.classList.remove('active')
               popupContinueCreate.classList.remove('active')
               bgUnlock()
            }

            // нажатие кнопки "ПРОДОЛЖИТЬ СОЗДАНИЕ"
            if (target.closest('.continue__create')) {
               fillInTheForm()

               popupBackground.classList.remove('active')
               popupContinueCreate.classList.remove('active')
               bgUnlock()

               blockCreate.setAttribute('data-open__block', 'create-block')
               blockBasic.classList.add('hide')
               blockCreate.classList.remove('hide')
            }

            // нажатие кнопки "СОЗДАТЬ НОВОЕ"
            if (target.closest('.new__create')) {
               clearFormCreateLetter()
               defaultDataColection()
               printNowDate()
               loadStep()

               popupBackground.classList.remove('active')
               popupContinueCreate.classList.remove('active')
               bgUnlock()

               blockCreate.setAttribute('data-open__block', 'create-block')
               blockBasic.classList.add('hide')
               blockCreate.classList.remove('hide')
            }
         }
      }
      clickPopupContinueCreate()

      // нажатие в попапе "ОТМЕНИТЬ СОЗДАНИЕ ПИСЬМА"
      function clickPopupCancelCreate() {
         if (popupCancelCreate.classList.contains('active') && popupBackground.classList.contains('active')) {
            // закрытие
            if (target.closest('.close-popup') || target === popupBackground || target.closest('.continue__create')) {
               popupCancelCreate.classList.remove('active')
               popupBackground.classList.remove('active')
               bgUnlock()
            }
            // нажатие кнопки "ОТМНИТЬ СОЗДАНИЕ"
            if (target.closest('.cancel__create')) {
               clearFormCreateLetter()

               popupCancelCreate.classList.remove('active')
               popupBackground.classList.remove('active')
               bgUnlock()

               loadStep()
            }
         }
      }
      clickPopupCancelCreate();
   })

   // ОБЩИЙ ОБРАБОТЧИК НА ДОКУМЕНТЕ (ИСПОЛЬЗОВАТЬ ДЛЯ ОТКРЫТИЯ/ЗАКРЫТИЯ ВЫПАДАЮЩХ СПИСКОВ)
   document.addEventListener('click', (event) => {
      let target = event.target

      // нажатие на селект с выбором рекомендации
      if (target === recommendationsHeader) {
         recommendationsHeader.classList.toggle('active')
         recommendationsList.classList.toggle('active')
      } else if (recommendationsList.classList.contains('active')) {
         recommendationsHeader.classList.remove('active')
         recommendationsList.classList.remove('active')
      }
   })
})