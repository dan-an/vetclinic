function createCalendar(id, year, month, jsonUrl) {
    // ajax запрос для календаря
    let calendarXhr = new XMLHttpRequest;
    calendarXhr.open('GET', jsonUrl, false);
    calendarXhr.send();
    let calendar = JSON.parse(calendarXhr.responseText, (key, value) => {
        if (key == 'date') return new Date(value);
        return value;
    });

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
        sidebox_btn.classList.add('sidebox_btn', 'btn');
        sidebox_btn.dataset.datenum = day.getDate().toString();
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

createCalendar("table", 2017, 10, '/calendar.json');

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
            Hash.add('date', target.dataset.datenum);
            renderBox(target);
            target.classList.add('js-active');
            return;
        }
        target = target.parentNode;
    }
})

function renderBox(node) {

    let scheduleXhr = new XMLHttpRequest;
    scheduleXhr.open('GET', '/schedule.json', false);
    scheduleXhr.send();

    let scheduleJSON = JSON.parse(scheduleXhr.responseText);

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

function removeSidebox() {
    document.querySelector('.sidebox').remove();
    document.querySelector('div.js-active').classList.remove('js-active');
    Hash.remove('date');
}

function todayRender() {

    if (document.querySelector('div.js-active')) {
        document.querySelector('div.js-active').classList.remove('js-active');
    };

    sidebox.classList.add('js-displayLeft');
    table.querySelectorAll('.weekday')[5].appendChild(sidebox)
};

let doctorContent = document.querySelector('.inner__content');

document.querySelector('.tabs__doctors').addEventListener('click', () => {

    Hash.add('tab', 'doctors');

    let scheduleXhr = new XMLHttpRequest;
    scheduleXhr.open('GET', '/schedule.json', false);
    scheduleXhr.send();

    let scheduleJSON = JSON.parse(scheduleXhr.responseText);

    for (let i = 0; i < scheduleJSON.length; i++) {

        let item = itemGenerate(scheduleJSON[i]);

        let scheduleBtn = document.createElement('div');
        scheduleBtn.classList.add('schedule__btn');
        scheduleBtn.textContent = 'Расписание';

        scheduleBtn.addEventListener('click', doctorSchedule);

        doctorContent.appendChild(item);
        doctorContent.querySelector('.info__workinghours').remove();

        item.querySelector('.item__info').appendChild(scheduleBtn);
    };

    document.querySelector('.current-doctors').style.display = 'flex';

});

sidebox.querySelector(".btn-close").addEventListener('click', removeSidebox);

document.querySelector(".tabs__today").addEventListener('click', todayRender);

function doctorSchedule() {

    Hash.add('doctor', this.parentNode.parentNode.dataset.doctorName)
        // Hash.remove('tab')

    document.querySelector('.current-doctors').style.display = 'none';
    document.querySelector('.inner__content').innerHTML = '';
    table.querySelector('tbody').remove();
    createCalendar("table", 2017, 10, '/calendar.json');

    let filter = document.querySelector('.filter');
    let currDoctorLabel = document.createElement('div');
    currDoctorLabel.classList.add('current__doctor-label');

    let doctorLabelName = document.createElement('div');
    doctorLabelName.classList.add('doctor_label__name');
    doctorLabelName.textContent = this.parentNode.querySelector('.info__name').textContent;

    let closeBtn = document.createElement('div');
    closeBtn.classList.add('btn', 'btn-close', 'label__btn_close')

    currDoctorLabel.innerHTML += doctorLabelName.outerHTML + closeBtn.outerHTML;

    document.querySelector('.js-replace').replaceChild(currDoctorLabel, filter);

    document.querySelector('.label__btn_close').addEventListener('click', () => {
        table.querySelector('tbody').remove();
        createCalendar("table", 2017, 10, '/calendar.json');
        document.querySelector('.js-replace').replaceChild(filter, currDoctorLabel);
        Hash.clear();
    })
}

function itemGenerate(item) {
    const sideboxItem = document.createElement('div');
    sideboxItem.classList.add('sidebox__item');
    sideboxItem.dataset.doctorName = item.name;

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

document.querySelector('.btn-close-doctors').addEventListener('click', () => {
    Hash.remove('tab');
    document.querySelector('.current-doctors').style.display = 'none';
    doctorContent.innerHTML = '';
})

Hash = {
    // Получаем данные из адреса
    get: function() {
        var vars = {},
            hash, splitter, hashes;
        if (!this.oldbrowser()) {
            var pos = window.location.href.indexOf('?');
            hashes = (pos != -1) ? decodeURIComponent(window.location.href.substr(pos + 1)) : '';
            splitter = '&';
        } else {
            hashes = decodeURIComponent(window.location.hash.substr(1));
            splitter = '/';
        }

        if (hashes.length == 0) {
            return vars;
        } else {
            hashes = hashes.split(splitter);
        }

        for (var i in hashes) {
            if (hashes.hasOwnProperty(i)) {
                hash = hashes[i].split('=');
                if (typeof hash[1] == 'undefined') {
                    vars['anchor'] = hash[0];
                } else {
                    vars[hash[0]] = hash[1];
                }
            }
        }
        return vars;
    },
    // Заменяем данные в адресе на полученный массив
    set: function(vars) {
        var hash = '';
        for (var i in vars) {
            if (vars.hasOwnProperty(i)) {
                hash += '&' + i + '=' + vars[i];
            }
        }

        if (!this.oldbrowser()) {
            if (hash.length != 0) {
                hash = '?' + hash.substr(1);
            }
            window.history.pushState(hash, '', document.location.pathname + hash);
        } else {
            window.location.hash = hash.substr(1);
        }
    },
    // Добавляем одно значение в адрес
    add: function(key, val) {
        var hash = this.get();
        hash[key] = val;
        this.set(hash);
    },
    // Удаляем одно значение из адреса
    remove: function(key) {
        var hash = this.get();
        delete hash[key];
        this.set(hash);
    },
    // Очищаем все значения в адресе
    clear: function() {
        this.set({});
    },
    // Проверка на поддержку history api браузером
    oldbrowser: function() {
        return !(window.history && history.pushState);
    },
};

window.onload = function() {
    var hash = Hash.get(); // получаем все значения
    if (hash.anchor) {
        window.location.hash = hash.anchor; // сохраняем родной функционал якорей
    } else if (hash.tab == 'doctors') {
        document.querySelector('.tabs__doctors').click();
        if (hash.doctor) {
            let hasedDoctor = document.querySelector('[data-doctor-name="' + hash.doctor + '"]')
            hasedDoctor.querySelector('.schedule__btn').click();
        }
    } else if (hash.date) {
        let hasedDate = '[data-datenum="' + hash.date + '"]'
        document.querySelector(hasedDate).click();
    }

}

document.querySelector('.filter').addEventListener('focus', () => {
    event.target.placeholder = '';
})
document.querySelector('.filter').addEventListener('blur', () => {
    event.target.value = '';
    event.target.placeholder = 'Начните набирать название врача, услуги, заболевания или специализации'
})
document.querySelector('.filter').addEventListener('keyup', showResult)

document.addEventListener('click', () => {
    if (event.target != document.querySelector('.filter__result_dropdown')) {
        document.querySelector('.filter__result_dropdown').style.display = 'none';
    }
})

// livesearch

function showResult() {

    document.getElementById("livesearch").innerHTML = "";

    if (this.value.length == 0) {
        document.querySelector('.filter__result_dropdown').style.display = 'none';
        document.getElementById("livesearch").innerHTML = "";
        document.getElementById("livesearch").style.border = "0px";
        return;
    }
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        request = new XMLHttpRequest();
    } else { // code for IE6, IE5
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    // request.onreadystatechange = function() {
    //     if (this.readyState == 4 && this.status == 200) {

    //     }
    // }
    request.open("GET", '/filter.json', false);
    request.send();

    let filterAnswer = JSON.parse(request.responseText);

    let searchQuery = this.value.toLowerCase();

    let hints = filterAnswer.filter(function(el) {
        searchValue = el.title.toLowerCase();
        return searchValue.indexOf(searchQuery) !== -1;
    })

    let fragment = document.createDocumentFragment();

    let titles = [];

    for (let i = 0; i < hints.length; i++) {
        titles.push(hints[i].title)
    };


    titles.forEach(function(title){
        let listItem = document.createElement('li');
        listItem.classList.add('hints_list__item');
        listItem.textContent = title;
        fragment.appendChild(listItem);
    })

    document.querySelector('.filter__result_dropdown').style.display = 'flex';
    document.getElementById("livesearch").appendChild(fragment);
}