function createCalendar(id, year, month) {
    
    
        let currMonth = month - 1;
        let day = new Date(year, currMonth);
    
        let table = document.getElementById(id);
        let tableBody = document.createElement('tbody')
        let tableRow = document.createElement('tr');
        tableRow.className = 'week';
    
        table.appendChild(tableBody);
        tableBody.appendChild(tableRow);
    
        for (let i = 0; i < getDay(day); i++) {
            let tableCell = document.createElement('td');
            tableCell.className = 'weekday';
            tableRow.appendChild(tableCell);
        }
    
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
    
    table.onclick = (event) => {
        let target = event.target;
    
        while (target != table) {
            if (target.className == 'sidebox_btn') {
                renderBox(target);
                return;
            }
            target = target.parentNode;
        }
    }
    
    function renderBox(node) {
    
        if (selected) {
            sidebox.remove();
        }
        selected = node;
        (node.parentNode.dataset.weekday > 2) ? sidebox.classList.add('js-displayLeft'): sidebox.classList.remove('js-displayLeft');
        selected.parentNode.appendChild(sidebox);
    }








// function createCalendar(id, year, month) {
//     let elem = document.getElementById(id);

//     let currMonth = month - 1;
//     let day = new Date(year, currMonth);
//     tableCell = '<td class = "weekday">'


//     let table = '<table id="table"><thead><tr class ="calendar__weekdays" ><td class = "weekdays__title">Понедельник</td><td class = "weekdays__title">Вторник</td><td class = "weekdays__title">Среда</td><td class = "weekdays__title">Четверг</td><td class = "weekdays__title">Пятница</td><td class = "weekdays__title">Суббота</td><td class = "weekdays__title">Воскресенье</td></tr></thead><tbody><tr>';
    

//     for (let i = 0; i < getDay(day); i++) {
//         table += tableCell + '</td>';
//     }

//     // ячейки календаря с датами (переписать!!!)
//     while (day.getMonth() == currMonth) {
//         table += '<td class="weekday" data-weekday="' + getDay(day) + '">' + day.getDate() + '<p class="weekday__workingHours">09:00-24:00</p></td>';
//         if (getDay(day) % 7 == 6) { // вс, последний день - перевод строки
//             table += '</tr><tr class="week">';
//         }

//         day.setDate(day.getDate() + 1);
//     }



//     // добить таблицу пустыми ячейками, если нужно
//     if (getDay(day) != 0) {
//         for (let i = getDay(day); i < 7; i++) {
//             table += tableCell + '</td>';
//         }
//     }

//     // закрыть таблицу
//     table += '</tr></tbody></table>';

//     // только одно присваивание innerHTML
//     elem.innerHTML = table;
// }

// function getDay(date) { // получить номер дня недели, от 0(пн) до 6(вс)
//     let day = date.getDay();
//     if (day == 0) day = 7;
//     return day - 1;
// }



// createCalendar("js-calendar", 2017, 10);

// let selected;
// let sidebox = document.createElement('div');
// sidebox.className = 'sidebox';

// table.onclick = (event) => {
//     let target = event.target;

//     while (target != table) {
//         if (target.className == 'weekday') {
//             renderBox(target);
//             return;
//         }
//         target = target.parentNode;
//     }
// }

// function renderBox(node) {

//     if (selected) {
//         sidebox.remove();
//     }
//     selected = node;
//     (node.dataset.weekday > 2) ? sidebox.classList.add('js-displayLeft') : sidebox.classList.remove('js-displayLeft');
//     selected.appendChild(sidebox);
// }

    /* Набросок функции, дописать!!! */


    // ячейки календаря с датами
    // while (day.getMonth() == currMonth) {
    //     let cell = document.createElement('td');
    //     cell.className = 'weekday';
    //     cell.dataset.weekday = getDay(day);
    //     cell.innerHTML = day.getDate()
        
    //     '<td class="weekday" data-weekday="' + getDay(day) + '">' + day.getDate() + '</td>';
    //     table += cell;
    //     let hours = document.createElement('p');
    //     hours.className = 'weekday__workingHours';
    //     hours.innerHTML = '09:00-24:00';
    //     cell.appendChild(hours);
    //     if (getDay(day) % 7 == 6) { // вс, последний день - перевод строки
    //         table += '</tr><tr class="week">';
    //     }

    //     day.setDate(day.getDate() + 1);
    // }