function smoothHeight(itemSelector, buttonSelector, contentSelector) { // объявляем основную функцию, которая принимает в качестве параметров селекторы элемента, кнопки внутри элемента и блока с контентом

   const items = document.querySelectorAll(itemSelector) // находим все элементы по переданному селектору в параметре itemSelector и записываем в константу items

   if (!items.length) return // если таких элементов нет, прекращаем выполнение функции

   items.forEach(el => { // для каждого элемента
      const button = el.querySelector(buttonSelector) // находим кнопку и записываем в константу button
      const content = el.querySelector(contentSelector) // находим блок с контентом и записываем в константу content

      button.addEventListener('click', () => { // при клике на кнопку
         if (el.dataset.open !== 'true') { // если значение data-атрибута open у элемента не равно 'true' и блок с контентом еще не отображен
            el.dataset.open = 'true' // тогда устанавливаем значение 'true'
            content.style.maxHeight = `${content.scrollHeight}px` // и блоку с контентом устанавливаем inline-свойсво max-height со вычисленным значением полной высоты этого блока
         } else { // если блок с контентом отображен и значение data-атрибута open у элемента равно 'true'
            el.dataset.open = 'false' // тогда устанавливаем значение 'false'
            content.style.maxHeight = '' // и сбрасываем ранее установленное inline-свойсво max-height
         }
      })

      const onResize = () => { // объявляем функцию onResize, которая будет корректировать значение inline-свойства max-height при изменении размеров окна браузера
         if (el.dataset.open === 'true') { // если значение data-атрибута open у элемента равно 'true' (коректировать высоту нужно только если блок контента отображен)
            if (parseInt(content.style.maxHeight) !== content.scrollHeight) { // если текущее значение inline-свойства max-height у блока контента не равно полной высоте
               content.style.maxHeight = `${content.scrollHeight}px` // только тогда блоку с контентом корректируем значение inline-свойсва max-height
            }
         }
      }
      window.addEventListener('resize', onResize) // вызываем функцию onResize при изменении размеров окна браузера
   })
}

export default smoothHeight