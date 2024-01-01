let id = setInterval(closeWindow, 3000)

function closeWindow() {
  window.close();
  clearInterval(id);
}