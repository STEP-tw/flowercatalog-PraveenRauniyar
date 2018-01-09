const removeWaterJarImage = function () {
  document.getElementById("waterImage").style.visibility = "hidden";
};
const displayeWaterJarImage = function () {
  document.getElementById("waterImage").style.visibility = "visible";
}
const removeAndDisplayImage = function () {
  removeWaterJarImage();
  setTimeout(displayeWaterJarImage,1000);
}
