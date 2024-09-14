setInterval(() => {
    const isVamsys = window.location.href.includes('vamsys.io');
    if (isVamsys) {
        const vamsysFlightNumberLabelElement = getVamsysLabelElement('Flight Number');
        const generatePaxNumberButton = document.getElementById('generate-pax-number');
        const vamsysPaxNumberLabelElement = getVamsysLabelElement('Passengers');
        const maxPaxNumberElement = document.querySelector('.max-pax-number');
        if (vamsysPaxNumberLabelElement && !maxPaxNumberElement) {
            const maxPaxNumber = getMaxPaxNumber();
            if (!maxPaxNumber) {
                return;
            }
            const pax = vamsysButtonHandler();
            console.log('generated', pax)
            const spanElement = document.createElement('span');
            spanElement.textContent = `Max: ${maxPaxNumber}`;
            spanElement.style.color = '#F4516C';
            spanElement.style.marginLeft = '1em';
            spanElement.classList.add('max-pax-number');
            vamsysPaxNumberLabelElement.insertAdjacentElement('beforeend', spanElement);
        }
        if (vamsysFlightNumberLabelElement && !generatePaxNumberButton) {
            createAndInsertVamsysButton();
        }
    }
}, 1000);


function generatePaxNumber(maxPaxNumber) {
    const currentMonth = new Date().getMonth();
    const loadFactor = LOAD_FACTOR_PER_MONTH[currentMonth];
    const averagePaxNumber = Math.round(maxPaxNumber * loadFactor / 100);

    const passengerDistributionGroup = Math.floor(Math.random() * 100);
    let generatedPaxNumber;
    console.log('passengerDistributionGroup', passengerDistributionGroup);
    if (passengerDistributionGroup < 1) {
        generatedPaxNumber = getRandomNumber(averagePaxNumber * 0.3, averagePaxNumber * 0.45);
    }
    else if (passengerDistributionGroup < 3) {
        generatedPaxNumber = getRandomNumber(averagePaxNumber * 0.45, averagePaxNumber * 0.9);
    } else if (passengerDistributionGroup < 33) {
        generatedPaxNumber = getRandomNumber(averagePaxNumber * 0.9, averagePaxNumber * 1.05);
    } else if (passengerDistributionGroup < 80) {
        generatedPaxNumber = getRandomNumber(averagePaxNumber * 1.05, maxPaxNumber - 8);
    } else {
        generatedPaxNumber = maxPaxNumber - getRandomNumber(1, 6);
    }

    return generatedPaxNumber;
}

function getRandomNumber(x, y) {
    return Math.round(Math.round(Math.random() * (y - x + 1)) + x);
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

        const event = new Event('input', { bubbles: true });
        paxNumberInputElement.dispatchEvent(event);
    }
}

function createAndInsertVamsysButton() {
    const vamsysButton = document.querySelector('.kt-portlet__head-toolbar');
    const myButton = vamsysButton.firstChild.cloneNode(true);
    myButton.textContent = 'Re-generate pax number';
    myButton.id = 'generate-pax-number';
    myButton.addEventListener('click', vamsysButtonHandler);
    myButton.style.marginLeft = '10px';

    vamsysButton.insertAdjacentElement('beforeend', myButton);
}

function vamsysButtonHandler(event) {
    if (event) {
        event.preventDefault()
    }
    const maxPaxNumber = getMaxPaxNumber();
    const paxNumber = generatePaxNumber(maxPaxNumber);
    setPaxNumber(paxNumber);
    return paxNumber;
}

function getVamsysLabelElement(labelText) {
    return Array.from(document.querySelectorAll('label'))
        .find(label => label.textContent.trim().includes(labelText));
}

const LOAD_FACTOR_PER_MONTH = [
    80, // January
    82, // February
    84, // March
    84, // April
    86, // May
    89, // June
    89, // July
    85, // August
    84, // September
    85, // October
    83, // November
    82  // December
];
