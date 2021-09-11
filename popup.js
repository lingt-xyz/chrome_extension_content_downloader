let page = document.getElementById("contentDiv");
const presetOptions = ["img"];
const imageDivClassName = 'imgDiv';

function addImages(items) {
  let imageDiv = document.createElement("div");
  imageDiv.className = imageDivClassName
  for (let item of items) {
    let element = document.createElement("img");
    element.src = item;
    imageDiv.appendChild(element);
  }
  page.appendChild(imageDiv);
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {options: presetOptions}, function(response) {
    addImages(response.items);
  });
});