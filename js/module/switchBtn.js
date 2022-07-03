const switchBtn = (buttons, slide) => {
   buttons.forEach(button => {
      if (button.classList.contains('active')) {
         slide.style.left = `${button.offsetLeft}px`
         slide.style.width = `${button.offsetWidth}px`
      }
      button.addEventListener('click', () => {
         buttons.forEach(button => {
            button.classList.remove('active');
         })
         button.classList.add('active')

         slide.style.left = `${button.offsetLeft}px`
         slide.style.width = `${button.offsetWidth}px`
      })
   })
}

export default switchBtn;