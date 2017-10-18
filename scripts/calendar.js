function createCalendar(id, year, month) {


    // ajax запрос для календаря
    let calendarXhr = new XMLHttpRequest;
    calendarXhr.open('GET', '../calendar.json', false);
    calendarXhr.send();
    let calendar = JSON.parse(calendarXhr.responseText, (key, value) => {
        if (key == 'date') return new Date(value);
        return value;
    });

    // Переменные для таблицы

    let currMonth = month - 1;
    let day = new Date(year, currMonth);

    console.log(day);

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
        sidebox_btn.classList.add('sidebox_btn', 'btn');
        sidebox_btn.innerHTML = '<span></span><span></span><span></span>'
        tableCell.appendChild(sidebox_btn);
        (tableCell.dataset.weekday > 2) ? sidebox_btn.classList.add('js-btnLeft'): sidebox_btn.classList.remove('js-btnLeft');



        let workingHours = document.createElement('p');
        workingHours.className = 'weekday__workingHours';
        for (let i = 0; i < calendar.length; i++) {
            let jsonDate = calendar[i].date;
            if (jsonDate.getDate() == day.getDate()) {
                workingHours.textContent = calendar[i].time;
                tableCell.classList.add('workingday');
                break;
            } else {
                workingHours.textContent = 'Выходной';
            }
        }

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

// создаем popup с врачами

let sidebox = document.createElement('div');
sidebox.className = 'sidebox';
sidebox.innerHTML = '<div class="btn btn-close sidebox__btn_close"></div>'

let sideboxContent = document.createElement('div');
sideboxContent.classList.add('sidebox__content');

let sideboxItem = document.createElement('div');
sideboxItem.classList.add('sidebox__item');



let selected;

// eventlistener на кнопку вызова popup (рефакторинг)

table.addEventListener('click', (event) => {
    let target = event.target;

    while (target != table) {
        if (target.parentNode.classList.contains('workingday') && target.classList.contains('sidebox_btn')) {
            renderBox(target);
            target.classList.add('js-active');
            return;
        }
        target = target.parentNode;
    }
})

function renderBox(node) {

    let scheduleXhr = new XMLHttpRequest;
    scheduleXhr.open('GET', '../schedule.json', false);
    scheduleXhr.send();

    let scheduleJSON = JSON.parse(scheduleXhr.responseText);

    console.log(scheduleJSON);

    if (selected) {
        sideboxContent.innerHTML = '';
        sideboxContent.remove()
        sidebox.remove();

        if (document.querySelector('div.js-active')) {
            document.querySelector('div.js-active').classList.remove('js-active');
        }
    }


    selected = node;
    if (node) {
        (node.parentNode.dataset.weekday > 2) ? sidebox.classList.add('js-displayLeft'): sidebox.classList.remove('js-displayLeft');
    };

    selected.parentNode.appendChild(sidebox);

    for (let i = 0; i < scheduleJSON.length; i++) {

        let item = itemGenerate(scheduleJSON[i]);

        sideboxContent.appendChild(item);
    };
    sidebox.appendChild(sideboxContent);
}


let removeCust = function() {
    this.parentNode.remove();
    document.querySelector('div.js-active').classList.remove('js-active');
}

sidebox.querySelector(".btn-close").addEventListener('click', removeCust);

let todayBtn = document.querySelector(".tabs__today");
todayBtn.addEventListener('click', todayRender);


function todayRender() {
    if (document.querySelector('div.js-active')) {
        document.querySelector('div.js-active').classList.remove('js-active');
    };

    sidebox.classList.add('js-displayLeft');
    table.querySelectorAll('.weekday')[5].appendChild(sidebox)
};

let btnDoctors = document.querySelector('.tabs__doctors');

let doctorContent = document.querySelector('.inner__content');

btnDoctors.addEventListener('click', () => {
    let scheduleXhr = new XMLHttpRequest;
    scheduleXhr.open('GET', '../schedule.json', false);
    scheduleXhr.send();

    let scheduleJSON = JSON.parse(scheduleXhr.responseText);

    for (let i = 0; i < scheduleJSON.length; i++) {

        let item = itemGenerate(scheduleJSON[i]);
        doctorContent.appendChild(item);
    };

    document.querySelector('.current-doctors').style.display='flex';
});

function itemGenerate(item) {
    const sideboxItem = document.createElement('div');
    sideboxItem.classList.add('sidebox__item');

    let itemImage = document.createElement('img');
    itemImage.classList.add('item__img');

    let itemInfo = document.createElement('div');
    itemInfo.classList.add('item__info');

    let itemName = document.createElement('p');
    itemName.classList.add('info__name');

    let itemHours = document.createElement('p');
    itemHours.classList.add('info__workinghours');

    itemImage.src = item.image;
    itemImage.alt = item.name;

    itemName.textContent = item.name;
    itemHours.textContent = item.time;

    itemInfo.appendChild(itemName);
    itemInfo.appendChild(itemHours);

    sideboxItem.appendChild(itemImage);
    sideboxItem.appendChild(itemInfo);

    return sideboxItem;
};

let closeBtn = document.querySelector('.btn-close-doctors');

closeBtn.addEventListener('click', () => {
    document.querySelector('.current-doctors').style.display='none';
    doctorContent.innerHTML='';
})