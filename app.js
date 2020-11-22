const container = document.querySelector('.container'); // hämtar ut div:n som jag ska appenda in all info
// --------------- Hämar ut värdet (staden) som användaren skriver in i input fältet ----------------------
function getCityName() {
    const form = document.querySelector('form');
    const input = document.querySelector('input');
    form.addEventListener('submit', e => {
        e.preventDefault();
        container.textContent = '';
        if (input.value === '') {
            container.textContent = 'Vänligen ange en stad!'; // Om användaren klickar sök med tomt input fält så skrivs felmeddelandet ut
        // Vi ändrar URL:n dynamisk beroende på vad användaren skriver in för stad, sedan kallar vi på en funktion som hämtar vädret
        } else fetchWeather(`http://api.openweathermap.org/data/2.5/weather?q=${input.value}&units=metric&appid=cb551f60977841929794b9d830e5e619&lang=sv`);
        input.value = '';
    })
}  
getCityName();
// ------------- fetchWeather gör ett API anrop och hämtar väder informationen och skickar datan vidare till vår render funktion. Vid inskriven stad som inte finns skriver vi ut ett 404 meddelande
function fetchWeather(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => render([data.name, data.weather[0].description, data.main.temp, data.wind.speed, data.main.humidity, data.weather[0].icon, data.main.temp]))    
        .catch(err => { 
            const errMsg = document.createElement('h3');
            errMsg.textContent = '404 Staden existerar inte!';
            container.appendChild(errMsg)
            console.log(err);
        })    
}
// ----------- render funktionen formaterar datan i en tabell och renderar ut den i DOM:n ----------------
function render(arrData) {
    const label = ['Stad:', 'Väder beskrivning:', 'Väder temperatur:', 'Vindhastighet:', 'Luftfuktighet:', 'Vädersymbol:', 'Temperatur färg:'];
    const units = ['', '', '°C', 'km/h', '%', '', ''];
    const table = document.createElement('table');
    for (let i = 0; i < arrData.length; i++) {
        const tr = document.createElement('tr');
        table.appendChild(tr);
        const tdLabel = document.createElement('td');
        tdLabel.textContent = label[i];
        tr.appendChild(tdLabel);
        if (arrData[5] === arrData[i]) { // när vi i vår loop kommer till väder ikon "koden" så sätter vi img taggens src attribut till "kod" värdet
            const iconImg = document.createElement('img');
            iconImg.src = `http://openweathermap.org/img/wn/${arrData[i]}@2x.png`;
            const tdIcon = document.createElement('td');
            tdIcon.appendChild(iconImg);
            tr.appendChild(tdIcon);
        } else if (label[i] === 'Temperatur färg:') { // när vi loopar över temp så färgsätter vi bakgrundsfärgen istället
            const tdTempColor = document.createElement('td');
            tdTempColor.style.backgroundColor = tempColor(arrData[i]);
            tr.appendChild(tdTempColor);
        }
        else {
            const tdData = document.createElement('td');
            tdData.textContent = `${arrData[i]} ${units[i]}`;
            tr.appendChild(tdData);
        }
    }
    container.appendChild(table);
}

function tempColor(t) {
    let color = (t >= 30) ? 'rgb(255, 0, 0)' : (((t >= 25) && (t < 30)) ? 'rgb(255, 111, 0)' : 
    (((t >= 15) && (t < 25)) ? 'rgb(228, 203, 13)' : (((t >= 10) && (t < 15)) ? 'rgb(193, 210, 11)' : 
    (((t >= 1) && (t < 10)) ? 'rgb(150, 210, 11)' : (((t >= -5) && (t < 1)) ? 'rgb(12, 95, 249)' : 
    (((t >= -10) && (t < -5)) ? 'rgb(22, 56, 247)' : ((t < 10) ? 'rgb(44, 44, 255)' : 'rgb(44, 44, 255)')))))));
    return color;
}