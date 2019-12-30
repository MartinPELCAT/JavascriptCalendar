window.addEventListener("DOMContentLoaded", () => {
    var currentMonth = 0;

    function main(value) {
        $(".added").remove();
        var now = moment().add(value, 'M');
        $("#currentMonth").html(moment().month(now.month()).format("MMMM") + " " + moment(now).year());
        displayCalendar(getRange(moment(now).startOf("month"), moment(now).endOf("month")));
    }
    main(currentMonth);
    $("#prevMonth").click(function () {
        currentMonth--;
        main(currentMonth);
    })
    $("#nextMonth").click(function () {
        currentMonth++;
        main(currentMonth);
    })
});
getRange = function (firstDay, lastDay) {
    let fistDayToDisplay = moment(firstDay).startOf("week")
    let lastDayToDisplay = moment(lastDay).endOf("week")
    return {
        "fistDayToDisplay": fistDayToDisplay,
        "lastDayToDisplay": lastDayToDisplay,
        "firstDayOfMonth": firstDay,
        "lastDayOfMonth": lastDay,
        "nbOfWeeks": (lastDayToDisplay.diff(fistDayToDisplay, 'days') + 1) / 7
    };
}
displayCalendar = function (range) {
    var dayToDisplay = range.fistDayToDisplay;
    for (let week = 0; week < range.nbOfWeeks; week++) {
        for (let day = 0; day < 7; day++) {
            let cls = ""
            if (dayToDisplay.isBefore(range.firstDayOfMonth) || dayToDisplay.isAfter(range.lastDayOfMonth)) {
                cls = "notInMonth";
            }
            $("#calendarBody .row").append('<div class="added col ' + cls + '" id="' + dayToDisplay.format("DD-MM-YYYY") + '" >' + dayToDisplay.format("DD") + '</div>')
            dayToDisplay = dayToDisplay.add(1, 'days');
        }
        $("#calendarBody .row").append('<div class="w-100 added"></div>');
    }
}