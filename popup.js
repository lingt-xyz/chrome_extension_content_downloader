let page = document.getElementById("contentDiv");
const presetOptions = ["img"];
const imageDivClassName = 'imgDiv';
let links = [];

function addImages(items) {
  let imageDiv = document.createElement("div");
  imageDiv.style.border = "thick solid #0000FF";
  imageDiv.className = imageDivClassName
  for (let item of items) {
    let element = document.createElement("img");
    element.src = item;
    imageDiv.appendChild(element);
    links.push(item);
  }
  page.appendChild(imageDiv);
}

function downloadCheckedLinks() {
  for (let item of links) {
    chrome.downloads.download({url: item}, function(id) {});
  }
  window.close();
}

window.onload = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {options: presetOptions}, function(response) {
      addImages(response.items);
      document.getElementById('download0').onclick = downloadCheckedLinks;
    });
  });
};
