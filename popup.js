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

function downloadAllImages() {
  for (let item of links) {
    chrome.downloads.download({url: item}, function(id) {});
  }
  window.close();
}

function downloadAsPDF() {
  $('body').modal('show');
  setTimeout(function () {
      html2canvas(document.querySelector("body")).then(canvas => {
          //$("#previewBeforeDownload").html(canvas);
          var imgData = canvas.toDataURL("image/jpeg",1);
          var imageWidth = canvas.width;
          var imageHeight = canvas.height;

          var pdf = new jsPDF("p", "mm", "a4");
          var pageWidth = pdf.internal.pageSize.getWidth();
          var pageHeight = pdf.internal.pageSize.getHeight();

          var ratio = imageWidth/imageHeight >= pageWidth/pageHeight ? pageWidth/imageWidth : pageHeight/imageHeight;
          //pdf = new jsPDF(this.state.orientation, undefined, format);
          pdf.addImage(imgData, 'JPEG', 0, 0, imageWidth * ratio, imageHeight * ratio);
          pdf.save("invoice.pdf");
          //$("#previewBeforeDownload").hide();
          $('body').modal('hide');
      });
  },500);
}

window.onload = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {options: presetOptions}, function(response) {
      addImages(response.items);
      document.getElementById('download_img').onclick = downloadAllImages;
      document.getElementById('download_pdf').onclick = downloadAsPDF;
    });
  });
};