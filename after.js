setInterval(() => {
    const isVamsys = window.location.href.includes('vamsys.io');
    if (isVamsys) {
        const maxPaxNumberLabelElement = getVamsysLabelElement('Flight Number');
        const generatePaxNumberButton = document.getElementById('generate-pax-number');
        if (maxPaxNumberLabelElement && !generatePaxNumberButton) {
            createAndInsertVamsysButton();
        }
    }
    const isSimbrief = window.location.href.includes('dispatch.simbrief.com');
    if (isSimbrief) {
        const maxPaxNumberElement = document.querySelector('#pax');
        const generatePaxNumberButton = document.querySelector('.get-vamsys-data');
        if (maxPaxNumberElement && !generatePaxNumberButton) {
            createAndInsertSimbriefButton();
        }
    }
}, 1000);


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

function getMaxPaxNumber() {
    const isVamsys = window.location.href.includes('vamsys.io');
    if (isVamsys) {
        const maxPaxNumberLabelElement = getVamsysLabelElement('Passengers');
        const maxPaxNumber = maxPaxNumberLabelElement?.nextElementSibling?.max;
        return parseInt(maxPaxNumber);
    }

    return null;
}

function setPaxNumber(paxNumber) {
    const isVamsys = window.location.href.includes('vamsys.io');
    if (isVamsys) {
        const paxNumberLabelElement = getVamsysLabelElement('Passengers');
        const paxNumberInputElement = paxNumberLabelElement?.parentElement.querySelector('input');
        paxNumberInputElement.value = paxNumber;
    } else {
        const isAircraftTypeSelected = Array.from(document.querySelector('#basetype').classList)
            .find((record) => record === 'invalid') === undefined;
        if (isAircraftTypeSelected) {
            const paxNumberElement = document.querySelector('#pax');
            paxNumberElement.value = paxNumber;
        }
    }
}

function getFlightNumber() {
    const isVamsys = window.location.href.includes('vamsys.io');
    if (isVamsys) {
        const flightNumberLabelElement = getVamsysLabelElement('Flight Number');
        const flightNumber = flightNumberLabelElement?.nextElementSibling?.value;
        return flightNumber;
    }

    return null;
}

function getCallsign() {
    const isVamsys = window.location.href.includes('vamsys.io');
    if (isVamsys) {
        const callsignLabelElement = getVamsysLabelElement('Callsign');
        const callsign = callsignLabelElement?.nextElementSibling?.value;
        return callsign;
    }
}

function getICAOS() {
    const isVamsys = window.location.href.includes('vamsys.io');
    if (isVamsys) {
        const selectedFlightRow = document.querySelector('.fa-minus').parentElement.parentElement;
        const departureICAO = selectedFlightRow.children[2].textContent.substring(0, 4);
        const arrivalICAO = selectedFlightRow.children[3].textContent.substring(0, 4);
        const alternateICAO = getVamsysLabelElement('Alternate')?.nextElementSibling?.value;
        return {
            departureICAO,
            arrivalICAO,
            alternateICAO: alternateICAO || '',
        };
    }

    return {
        departureICAO: '',
        arrivalICAO: '',
        alternateICAO: ''
    };
}

function getDepartureTime() {
    const isVamsys = window.location.href.includes('vamsys.io');
    if (isVamsys) {
        const departureTimeElement = getVamsysLabelElement('Estimated Departure Time');
        const departureTime = departureTimeElement?.nextElementSibling?.value;

        return convertHourToFormattedDate(departureTime);
    }
}

function convertHourToFormattedDate(hour) {
    const [hours, minutes] = hour.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);

    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-GB', { month: 'short' });
    const year = now.getFullYear();
    const formattedHour = String(now.getHours()).padStart(2, '0');
    const formattedMinutes = String(now.getMinutes()).padStart(2, '0');

    return `${day}${month}${year}-${formattedHour}:${formattedMinutes}`;
}

function createAndInsertVamsysButton() {
    const vamsysButton = document.querySelector('.kt-portlet__head-toolbar');
    const myButton = vamsysButton.firstChild.cloneNode(true);
    myButton.textContent = 'Get Vamsys Data';
    myButton.id = 'generate-pax-number';
    myButton.addEventListener('click', vamsysButtonHandler);
    myButton.style.marginLeft = '10px';

    vamsysButton.insertAdjacentElement('beforeend', myButton);
}

function vamsysButtonHandler(event) {
    event.preventDefault()
    const maxPaxNumber = getMaxPaxNumber();
    const paxNumber = generatePaxNumber(maxPaxNumber);
    const flightNumber = getFlightNumber();
    const callsign = getCallsign();
    const airlineCode = callsign?.substring(0, 3);
    const { departureICAO, arrivalICAO, alternateICAO } = getICAOS();
    const departureTime = getDepartureTime();
    setPaxNumber(paxNumber);
    chrome.storage.sync.set({ flightNumber, callsign, airlineCode, paxNumber, departureICAO, arrivalICAO, alternateICAO, departureTime });
}

function createAndInsertSimbriefButton() {
    const simbriefGenerateButton = document.querySelector('#options-generate');
    const myButton = document.createElement('div');
    myButton.classList.add('get-vamsys-data');
    myButton.innerHTML = '<img src="https://vamsys.io/favicon/favicon-light.svg"><span>Get Vamsys Data </span>';
    myButton.addEventListener('click', simbriefButtonHandler);

    simbriefGenerateButton.insertAdjacentElement('afterend', myButton);
}

async function simbriefButtonHandler(event) {
    event.preventDefault();
    const vamsysData = await chrome.storage.sync.get();

    // setPaxNumber(vamsysData.paxNumber);
    const intervalId = setInterval(() => {
        const isAircraftTypeSelected = Array.from(document.querySelector('#basetype').classList)
            .find((record) => record === 'invalid') === undefined;
        if (isAircraftTypeSelected) {
            clearInterval(intervalId);
            setPaxNumber(vamsysData.paxNumber);
        }
    }, 1000);
    setAirlineCode(vamsysData.airlineCode);
    setFlightNumber(vamsysData.flightNumber);
    setCallsign(vamsysData.callsign);
    setDepartureICAO(vamsysData.departureICAO);
    setArrivalICAO(vamsysData.arrivalICAO);
    document.querySelector('#options-reset-date').click();
    // setDepartureTime(vamsysData.departureTime);
}

function setAirlineCode(airlineCode) {
    const airlineCodeElement = document.querySelector('#airline');
    airlineCodeElement.value = airlineCode;
}

function setFlightNumber(flightNumber) {
    const flightNumberElement = document.querySelector('#fltnum');
    flightNumberElement.value = flightNumber;
}

function setCallsign(callsign) {
    const callsignElement = document.querySelector('#callsign');
    callsignElement.value = callsign;
}

function setDepartureICAO(departureICAO) {
    const departureICAOElement = document.querySelector('#orig');
    departureICAOElement.value = departureICAO;
}

function setArrivalICAO(arrivalICAO) {
    const arrivalICAOElement = document.querySelector('#dest');
    arrivalICAOElement.value = arrivalICAO;
}

function setAlternateICAO(alternateICAO) {
    const alternateICAOElement = document.querySelector('#altn');
    alternateICAOElement.value = alternateICAO;
}

function setDepartureTime(departureTime) {
    const departureTimeElement = document.querySelector('#date');
    departureTimeElement.focus();
    departureTimeElement.value = departureTime;
    // document.querySelector('.applyBtn').click();
}

function simulateBackspace(element) {
    const event = new KeyboardEvent('keydown', {
        key: 'Backspace',
        code: 'Backspace',
        which: 8,
        keyCode: 8,
    });
    element.dispatchEvent(event);
}

function getVamsysLabelElement(labelText) {
    return Array.from(document.querySelectorAll('label'))
        .find(label => label.textContent.trim().includes(labelText));
}
