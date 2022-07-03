// запись значений
export function setLS(name, value) {
   localStorage.setItem(name, encodeURIComponent(value))
   // localStorage.setItem(name, value)
}

// получение значений
export function getLS(name) {
   return decodeURIComponent(localStorage.getItem(name))
   // return localStorage.getItem(name)
}

// удаление значений
export function removeLS(name) {
   localStorage.removeItem(name)
}