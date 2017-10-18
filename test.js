function createCalendar(id, year, month) {
    // ajax запрос


    let calendarXhr = new XMLHttpRequest;
    
    calendarXhr.open('GET', '../calendar.json', false);
    
    calendarXhr.send();
    
    let calendar = JSON.parse(calendarXhr.responseText);
    
    console.log(calendar);

    // Переменные для таблицы

    let currMonth = month - 1;
    let day = new Date(year, currMonth);

    let table = document.getElementById(id);
    let tableBody = document.createElement('tbody')
    let tableRow = document.createElement('tr');
    tableRow.className = 'week';

    table.appendChild(tableBody);
    tableBody.appendChild(tableRow);

    // Ячейки до начала месяца

    for (let i = 0; i < getDay(day); i++) {
        let tableCell = document.createElement('td');
        tableCell.className = 'weekday';
        tableRow.appendChild(tableCell);
    }

    // Ячейки с 1 числа текущего месяца

    while (day.getMonth() == currMonth) {

        let tableCell = document.createElement('td');
        tableCell.className = 'weekday';
        tableRow.appendChild(tableCell)
        tableCell.dataset.weekday = getDay(day);

        let weekdayDate = document.createElement('div')
        weekdayDate.classList.add('weekday__date');
        weekdayDate.textContent = day.getDate();
        tableCell.appendChild(weekdayDate);


        let sidebox_btn = document.createElement('div');
        sidebox_btn.classList.add('sidebox_btn');
        sidebox_btn.innerHTML = '<span></span><span></span><span></span>'
        tableCell.appendChild(sidebox_btn);
        (tableCell.dataset.weekday > 2) ? sidebox_btn.classList.add('js-btnLeft'): sidebox_btn.classList.remove('js-btnLeft');

        

        let workingHours = document.createElement('p');
        workingHours.className = 'weekday__workingHours';
        workingHours.textContent = '09:00-24:00'
        tableCell.appendChild(workingHours);

        if (getDay(day) % 7 == 6) { // вс, последний день - перевод строки
            tableRow = document.createElement('tr');
            tableRow.className = 'week';
            tableBody.appendChild(tableRow);
        };

        day.setDate(day.getDate() + 1);
    };

    // добить таблицу пустыми ячейками, если нужно
    if (getDay(day) != 0) {
        for (let i = getDay(day); i < 7; i++) {
            let tableCell = document.createElement('td');
            tableCell.className = 'weekday';
            tableRow.appendChild(tableCell);
        }
    };

};

function getDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
    let day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
};



createCalendar("table", 2017, 10);

let selected;
let sidebox = document.createElement('div');
sidebox.className = 'sidebox';
sidebox.innerHTML = '<div class="btn-close sidebox__btn_close"></div><div class="sidebox__content"></div>'

table.addEventListener('click', (event) => {
    let target = event.target;

    while (target != table) {
        if (target.classList.contains('sidebox_btn')) {
            renderBox(target);
            target.classList.add('js-active');
            return;
        }
        target = target.parentNode;
    }
})

function renderBox(node) {

    if (selected) {
        sidebox.remove();
        if (document.querySelector('div.js-active')) {
            document.querySelector('div.js-active').classList.remove('js-active');
        }
    }


    selected = node;
    console.log(node.classList)
    if (node) {
        (node.parentNode.dataset.weekday > 2) ? sidebox.classList.add('js-displayLeft'): sidebox.classList.remove('js-displayLeft');
    };

    selected.parentNode.appendChild(sidebox);
}


let removeCust = function () {
    this.parentNode.remove();
    document.querySelector('div.js-active').classList.remove('js-active')
}

sidebox.querySelector(".btn-close").addEventListener('click', removeCust);

let todayBtn = document.querySelector(".tabs__today");
todayBtn.addEventListener('click', todayRender);


function todayRender() {
    if (document.querySelector('div.js-active')) {
        document.querySelector('div.js-active').classList.remove('js-active');
    }
    sidebox.classList.add('js-displayLeft');
    table.querySelectorAll('.weekday')[5].appendChild(sidebox)
}