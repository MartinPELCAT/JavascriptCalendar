window.addEventListener("DOMContentLoaded", () => {
    var currentMonth = 0;

    function main(value) {
        $(".days").remove();
        var now = moment().add(value, 'M');
        $("#currentMonth").html(moment().month(now.month()).format("MMMM") + " " + moment(now).year());
        displayCalendar(getRange(moment(now).startOf("month"), moment(now).endOf("month")));
    }

    main(currentMonth);
    $("#prevMonth").click(function () {
        currentMonth--;
        main(currentMonth);
    });

    $("#nextMonth").click(function () {
        currentMonth++;
        main(currentMonth);
    });

    $(".days").mousedown(function (e) {

        var _that = $(this);

        if (_that.find(".locked").length == 0)
            _that.append("<div class='locked lockedStart'></div>");
        $(".days").mouseover(function (e) {
            var _that = $(this);

            if (_that.find(".locked").length == 0)
                _that.append("<div class='locked'></div>");
        });
    });

    $(".days").mouseup(function (e) {
        $(this).find(".locked").addClass("lockedEnd");
        $(".days").unbind("mouseover");
    });




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
        $("#calendarBody .row").append('<div class="w-100 days"></div>');
        for (let day = 0; day < 7; day++) {
            let cls = ""
            if (dayToDisplay.isBefore(range.firstDayOfMonth) || dayToDisplay.isAfter(range.lastDayOfMonth)) {
                cls = "notInMonth";
            }
            $("#calendarBody .row").append('<div class="days col ' + cls + '" id="' + dayToDisplay.format("DD-MM-YYYY") + '" >' + dayToDisplay.format("DD") + '</div>')
            dayToDisplay = dayToDisplay.add(1, 'days');
        }
    }
}