let closeBtn = document.getElementById("close-nav")
let openBtn = document.getElementById("open-nav")
let nav = document.getElementById("nav")

closeBtn.addEventListener("click",handleClose)
openBtn.addEventListener("click",handleOpen)

function handleClose(){
    nav.classList.add("hide")
}
function handleOpen(){
    nav.classList.remove("hide")
}