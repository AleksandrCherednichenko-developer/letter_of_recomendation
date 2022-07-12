let body = document.querySelector('body');

let scrollTop

export function bgLock() {
   scrollTop = window.pageYOffset

   body.classList.add('lock')

   body.style.top = `-${scrollTop}px`;
}

export function bgUnlock() {
   body.classList.remove('lock')

   window.scrollBy({
      top: scrollTop, // на какое количество пикселей прокрутить вниз от текущей позиции
      behavior: 'auto' // определяет плавность прокрутки: 'auto' - мгновенно (по умолчанию), 'smooth' - плавно
   });
}