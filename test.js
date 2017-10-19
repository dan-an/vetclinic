function doctorSchedule(doctor) {

    Hash.add('doctor', doctor.parentNode.parentNode.dataset.doctorName)
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
    doctorLabelName.textContent = doctor.parentNode.querySelector('.info__name').textContent;

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