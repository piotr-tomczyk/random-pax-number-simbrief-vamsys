chrome.runtime.sendMessage({
  message: "get_max_pax_number",
});

setInterval(() => chrome.runtime.sendMessage({
  message: "get_max_pax_number",
}), 1000);


document.getElementById('generate-pax-number').addEventListener('click', function () {
    const maxPaxNumberItem = localStorage.getItem('maxPaxNumber');
    if (!maxPaxNumberItem) {
      return;
    }
    const maxPaxNumber = parseInt(maxPaxNumberItem);
    const paxNumber = generatePaxNumber(maxPaxNumber);
    chrome.runtime.sendMessage({
        message: "post_pax_number",
        data: {
            paxNumber,
        },
    })
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "post_max_pax_number") {
    if (!request.data.maxPaxNumber) {
      document.getElementById('max-pax').textContent = 'False';
      return;
    }
    localStorage.setItem('maxPaxNumber', request.data.maxPaxNumber);
    document.getElementById('max-pax').textContent = `True (${request.data.maxPaxNumber})`;
  }
});

function generatePaxNumber(maxPaxNumber) {
    const passengerDistributionGroup = Math.floor(Math.random() * 100);
    let generatedPaxNumber;
    if (passengerDistributionGroup < 2) {
        generatedPaxNumber = Math.floor(maxPaxNumber * 0.22) + Math.floor(Math.random() * (maxPaxNumber * 0.32));
    } else if (passengerDistributionGroup < 16) {
        generatedPaxNumber = Math.floor(maxPaxNumber * 0.54) + Math.floor(Math.random() * (maxPaxNumber * 0.18));
    } else if (passengerDistributionGroup < 58) {
        generatedPaxNumber = Math.floor(maxPaxNumber * 0.72) + Math.floor(Math.random() * (maxPaxNumber * 0.15));
    } else {
        generatedPaxNumber = Math.floor(maxPaxNumber * 0.87) + Math.floor(Math.random() * (maxPaxNumber * 0.13));
    }
    return generatedPaxNumber;
}
