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
