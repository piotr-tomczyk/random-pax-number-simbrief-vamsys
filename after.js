// this code will be executed after page load
(function() {
  console.log('after.js executed');
})();


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == "get_max_pax_number") {
    const maxPaxNumber = getMaxPaxNumber();
    chrome.runtime.sendMessage({
      message: "post_max_pax_number",
      data: {
        maxPaxNumber,
      },
    })
  }
  if (request.message == "post_pax_number") {
    console.log(request.data);
    setPaxNumber(request.data.paxNumber);
  }
});


function getMaxPaxNumber() {
  const isVamsys = window.location.href.includes('vamsys.io');
  if (isVamsys) {
    const maxPaxNumberLabelElement = Array.from(document.querySelectorAll('label'))
        .find(label => label.textContent.trim() === 'Passengers');
    const maxPaxNumber = maxPaxNumberLabelElement?.nextElementSibling?.max;
    return maxPaxNumber;
  } else {
    const isAircraftTypeSelected = Array.from(document.querySelector('#basetype').classList)
        .find((record) => record === 'invalid') === undefined;
    if (isAircraftTypeSelected) {
        const maxPaxNumberElement = document.querySelector('#pax');
        const maxPaxNumber = maxPaxNumberElement?.max;
        return maxPaxNumber;
    }
  }
  return null;
}

function setPaxNumber(paxNumber) {
  const isVamsys = window.location.href.includes('vamsys.io');
  if (isVamsys) {
    const paxNumberLabelElement = Array.from(document.querySelectorAll('label'))
        .find(label => label.textContent.trim() === 'Passengers');
    const paxNumberInputElement = paxNumberLabelElement?.nextElementSibling;
    paxNumberInputElement.value = paxNumber;
  } else {
    console.log('setting pax number');
    const isAircraftTypeSelected = Array.from(document.querySelector('#basetype').classList)
        .find((record) => record === 'invalid') === undefined;
    console.log({isAircraftTypeSelected});
    if (isAircraftTypeSelected) {
      const paxNumberElement = document.querySelector('#pax');
      console.log({paxNumberElement});
      paxNumberElement.value = paxNumber;
    }
  }
}
