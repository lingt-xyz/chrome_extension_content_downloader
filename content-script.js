chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        let [pdfHtml, clientHeight] = getHtml(request.querySelector);
        sendResponse({items: getContent(request.options), html: pdfHtml, height: clientHeight});
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
    let element = document.querySelector(querySelector);
    let clientHeight = element.clientHeight;
    let pdfHtml = element.outerHTML;
    return [pdfHtml, clientHeight];
}
