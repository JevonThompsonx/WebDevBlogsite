const togglerIcon = document.querySelector('.navbar-toggler-icon')
let iconNumber = 0
togglerIcon.addEventListener('click', ()=> {
    iconNumber++
    if (iconNumber % 2 === 0) { 
      togglerIcon.innerHTML =  '<i class="fa-sharp fa-solid fa-angle-down"></i>'
    }
    else {
    togglerIcon.innerHTML = '<i class="fa-solid fa-angle-up"></i>'
    }
})
const welcomeImg = document.querySelector('#welcome-img')


window.addEventListener('DOMContentLoaded' , ()=> {
if (window.matchMedia) {
  if(window.matchMedia('(prefers-color-scheme: dark)').matches){
       welcomeImg.src = 'images/Me-modified.webp'
 
  } else {
    welcomeImg.src = 'images/Me-lightMode-modified.webp'
  }
} else {
}
})
