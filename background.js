setInterval(() => console.log('background.js is running'), 1000);
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'get_max_pax_number') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "get_max_pax_number"});
        });
    }
    if (request.message == 'post_max_pax_number') {
        console.log(request.data);
        chrome.runtime.sendMessage({
            message: "post_max_pax_number",
            data: request.data,
        })
    }
    if (request.message == 'post_pax_number') {
        console.log(request.data);
        chrome.runtime.sendMessage({
            message: "post_pax_number",
            data: request.data,
        })
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "post_pax_number", data: request.data,});
        });
    }
})
