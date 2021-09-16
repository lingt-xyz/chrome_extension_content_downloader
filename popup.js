const { jsPDF } = window.jspdf;

let page = document.getElementById("contentDiv");
const presetOptions = ["img"];
const imageDivClassName = 'imgDiv';

function addImages(items) {
  let links = [];
  let imagesDiv = document.createElement("div");
  for (let item of items) {
    let element = document.createElement("img");
    element.src = item;
    links.push(item);

    let imageDiv = document.createElement("div");
    imageDiv.style.border = "thick solid #0000FF";
    imageDiv.className = imageDivClassName
    imageDiv.appendChild(element);

    imagesDiv.appendChild(imageDiv);
  }
  page.appendChild(imagesDiv);
  return links;
}

function downloadAllImages(links) {
  for (let item of links) {
    chrome.downloads.download({ url: item }, function (id) { });
  }
  window.close();
}

// function htmlToElement(html) {
//   var template = document.createElement('template');
//   html = html.trim(); // Never return a text node of whitespace as the result
//   template.innerHTML = html;
//   alert(template.content.firstChild instanceof HTMLElement);
//   return template.content.firstChild;
// }

function htmlToElement(html) {
  let div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstChild;
}

function generatePDF(html, clientHeight) {
  let element = htmlToElement(html)
  return [element, clientHeight];
}

function downloadAsPDF(pdfElement, clientHeight) {
  setTimeout(function () {
    document.body.appendChild(pdfElement);

    html2canvas(pdfElement)
      .then((canvas) => {
        //! MAKE YOUR PDF
        var pdf = new jsPDF('p', 'pt', 'letter');
        console.log(clientHeight);
        for (var i = 0; i <= clientHeight / 980; i++) {
          //! This is all just html2canvas stuff
          var srcImg = canvas;
          var sX = 0;
          var sY = 980 * i; // start 980 pixels down for every new page
          var sWidth = 900;
          var sHeight = 980;
          var dX = 0;
          var dY = 0;
          var dWidth = 900;
          var dHeight = 980;
  
          window.onePageCanvas = document.createElement("canvas");
          onePageCanvas.setAttribute('width', 900);
          onePageCanvas.setAttribute('height', 980);
          var ctx = onePageCanvas.getContext('2d');
          // details on this usage of this function: 
          // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images#Slicing
          ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
  
          // document.body.appendChild(canvas);
          var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
  
          var width = onePageCanvas.width;
          var height = onePageCanvas.clientHeight;
  
          //! If we're on anything other than the first page,
          // add another page
          if (i > 0) {
            // pdf.addPage([612, 791]); //8.5" x 11" in pts (in*72)
            pdf.addPage('letter');
          }
          //! now we declare that we're working on that page
          pdf.setPage(i + 1);
          //! now we add content to that page!
          // pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .62), (height * .62));
          pdf.addImage(canvasDataURL, 'PNG', 20, 40, width, height);
  
        }
        //! after the for loop is finished running, we save the pdf.
        pdf.save('Test.pdf');
      });

    // html2canvas(pdfElement).then(canvas => {
    //   let imgData = canvas.toDataURL("image/jpeg",1);
    //   let imageWidth = canvas.width;
    //   let imageHeight = canvas.height;

    //   let pdf = new jsPDF("p", "pt", "letter");
    //   let pageWidth = pdf.internal.pageSize.getWidth();
    //   let pageHeight = pdf.internal.pageSize.getHeight();

    //   let ratio = imageWidth/imageHeight >= pageWidth/pageHeight ? pageWidth/imageWidth : pageHeight/imageHeight;
    //   //pdf = new jsPDF(this.state.orientation, undefined, format);
    //   pdf.addImage(imgData, 'JPEG', 0, 0, imageWidth * ratio, imageHeight * ratio);

    //   pdf.save("test.pdf");
    // });

    document.body.removeChild(pdfElement);
  }, 500);
}

window.onload = function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { options: presetOptions, querySelector: '.docItemContainer_2cwg' }, function (response) {
      let links = addImages(response.items);
      let [pdfElement, clientHeight] = generatePDF(response.html, response.height);
      document.getElementById('download_img').onclick = () => downloadAllImages(links);
      document.getElementById('download_pdf').onclick = () => downloadAsPDF(pdfElement, clientHeight);
    });
  });
};
