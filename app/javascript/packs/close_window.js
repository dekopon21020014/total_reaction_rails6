var div = document.getElementById("close")
let id = setInterval(closeWindow, 5000)
div.onclick = function(){
  window.close();
};

function closeWindow() {
  window.close();
  clearInterval(id);
}