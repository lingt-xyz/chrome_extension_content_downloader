chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        sendResponse({items: getContent(request.options), html: getHtml(request.querySelector)});
    }
);

function getContent(options) {
    let images = [];
    let elements = document.getElementsByTagName('img');
    for (let element of elements) {
        if(element.src){
            images.push(element.src)
        }
    }
    return images;
}

function getHtml(querySelector) {
    pdfHtml = document.querySelector(querySelector).outerHTML;
    pdfHtml = document.getElementById('__docusaurus').outerHTML;
    return pdfHtml;
}
