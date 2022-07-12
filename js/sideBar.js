import { writeCookie, readCookie, deleteCookie } from './module/script__work-cookie.js';
import smoothHeight from './module/smothHeight.js';

smoothHeight('.documents', '.documents__header', '.documents__list')

document.addEventListener("DOMContentLoaded", () => {
   let mainWrapper = document.querySelector('.main__wrapper .container');
   let mainMenu = document.querySelector('.main__menu');
   let hideMenuBtn = mainMenu.querySelector('.hide-menu__btn');

   let userBlock = mainMenu.querySelector('.user'),
      userPhoto = userBlock.querySelector('.user__photo'),
      userSelectHeader = userBlock.querySelector('.select__header'),
      userSelectList = userBlock.querySelector('.select__list'),
      userSelectListItems = userSelectList.querySelectorAll('.select__list-item');

   let menuList = mainMenu.querySelector('.menu__list');
   let documentBlock = menuList.querySelector('.documents'),
      documentHeader = documentBlock.querySelector('.documents__header'),
      documentsList = documentBlock.querySelector('.documents__list');



   document.addEventListener('click', (event) => {
      let target = event.target

      // скрытие меню
      if (target === hideMenuBtn) {
         hideMenuBtn.classList.toggle('hide-menu')
         mainMenu.classList.toggle('hide-menu')
         mainWrapper.classList.toggle('hide-menu')


         if (documentsList.classList.contains('active')) {
            documentsList.classList.remove('active')
            documentsList.style = ''
            documentBlock.setAttribute('data-open', false)
         }
      }


      // нажатие в блоке пользователя
      function clickUserBlock() {
         if (target.closest('.user')) {
            // открытие слекта
            if (target.closest('.select__header')) {
               userSelectList.classList.toggle('active')
            }

            // нажатие на элементы списка
            if (target.closest('.select__list-item') && userSelectList.classList.contains('active')) {
               // скрыть список после нажатия
               userSelectList.classList.remove('active')

               // установка активного элемента в списке
               userSelectListItems.forEach(item => {
                  item.classList.remove('active')
               })
               target.closest('.select__list-item').classList.add('active')

               // изменение иконки на фото
               userPhoto.className = `user__photo text-s16-h22-w600 ${target.closest('.select__list-item').getAttribute('data-class')}`
               // изменение заголовка
               userSelectHeader.querySelector('p').textContent = target.closest('.select__list-item').getAttribute('data-name')
               // изменение списка
               menuList.className = `menu__list ${target.closest('.select__list-item').getAttribute('data-class')}`

               // очистить активную категорию в списке
               let menuListItems = menuList.querySelectorAll('li')
               menuListItems.forEach(li => {
                  li.classList.remove('active')
               })

               // закрытие списка документов если он открыт
               if (documentHeader.classList.contains('active')) {
                  documentsList.classList.remove('active')

                  documentsList.querySelectorAll('.documents__list-item').forEach(item => {
                     item.classList.remove('active');
                  })

                  documentsList.style = ''
                  documentBlock.setAttribute('data-open', false)
               }

               writeCookie('menu-class', target.closest('.select__list-item').getAttribute('data-class'), 30)
            }
         } else if (userSelectList.classList.contains('active')) {
            // если нажатие произошло не на списке и он открыт то скрыть его
            userSelectList.classList.remove('active')
         }
      }
      clickUserBlock()

      // нажатия в панеле основного меню
      function clickMenuList() {
         if (target.closest('.menu__list')) {
            // нажатия на списках бокового меню
            if (target.closest('li') || target.closest('.documents__header')) {
               let menuListItems = target.closest('.menu__list').querySelectorAll('li')
               menuListItems.forEach(li => {
                  li.classList.remove('active')
               })
               target.closest('li').classList.add('active')

               // закрытие списка документов если он открыт
               if (target.closest('.menu__list').classList.contains('employer') && !target.closest('.documents__header')) {
                  documentsList.classList.remove('active')

                  documentsList.querySelectorAll('.documents__list-item').forEach(item => {
                     item.classList.remove('active');
                  })

                  documentsList.style = ''
                  documentBlock.setAttribute('data-open', false)
               }
            }

            // открытие слекта с документами
            if (target.closest('.documents__header')) {
               documentsList.classList.toggle('active')
            }

            // нажатие на элементы из селекта документы
            if (target.closest('.documents__list-item') && target.closest('.documents__list')) {
               documentsList.querySelectorAll('.documents__list-item').forEach(item => {
                  item.classList.remove('active');
               })
               target.closest('.documents__list-item').classList.add('active');

               if (mainMenu.classList.contains('hide-menu')) {
                  documentsList.classList.remove('active')
                  documentsList.style = ''
                  documentBlock.setAttribute('data-open', false)
               }
            }
         }
      }
      clickMenuList()
   })


   function loadCookies() {
      if (readCookie('menu-class') !== undefined) {
         userSelectListItems.forEach(item => {
            if (item.getAttribute('data-class') === readCookie('menu-class')) {
               item.classList.add('active')
               userSelectHeader.querySelector('p').textContent = item.getAttribute('data-name')
            } else {
               item.classList.remove('active')
            }
         })

         userPhoto.className = `user__photo text-s16-h22-w600 ${readCookie('menu-class')}`
         menuList.className = `menu__list ${readCookie('menu-class')}`
      } else {
         userSelectListItems.forEach(item => {
            if (item.getAttribute('data-class') === 'home-page') {
               userSelectHeader.querySelector('p').textContent = item.getAttribute('data-name')
               item.classList.add('active')
            }
         })

         writeCookie('menu-class', 'home-page', 30)

         userPhoto.className = `user__photo text-s16-h22-w600 ${readCookie('menu-class')}`
         menuList.className = `menu__list ${readCookie('menu-class')}`
      }
   }
   window.addEventListener("load", function load() {
      loadCookies()
   })
})