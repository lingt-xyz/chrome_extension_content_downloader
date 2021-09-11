chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.options) {
            console.log(getContent())
            sendResponse({items: getContent()});
        }
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

