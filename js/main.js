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

    var firstDayRange;

    $(".days").mousedown(function (e) {
        firstDayRange = $(this);
        renderLock(firstDayRange, firstDayRange);
        $(".days").mouseover(function (e) {
            renderLock(firstDayRange, $(this));
        });
    });
    $(".days").mouseup(function (e) {
        renderLock(firstDayRange, $(this));
        $(".days").unbind("mouseover");
    });

    $("#calendar").mouseleave(function () {
        $(".days").unbind("mouseover");
    })
});

let getRange = function (firstDay, lastDay) {
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

let displayCalendar = function (range) {
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

let renderLock = function (firstRange, lastRange) {

    let date1 = moment(firstRange[0].id, "DD-MM-YYYY");
    let date2 = moment(lastRange[0].id, "DD-MM-YYYY");
    if (date1.isAfter(date2, 'days') || date2.isAfter(date1, 'days')) {
        /**
         * date1 end
         * date2 start 
         */
        let firstLockedElement = firstRange.find(".locked");
        let lastLockedElement = lastRange.find(".locked");
        let class1;
        let class2;

        if (date1.isAfter(date2, 'days')) { //date1 end - date2 start 
            class1 = "lockedEnd";
            class2 = "lockedStart";
            var daysRange = lastRange.nextUntil(firstRange, ".col");

        } else { //date1 start - date2 end 
            class2 = "lockedEnd";
            class1 = "lockedStart";
            var daysRange = firstRange.nextUntil(lastRange, ".col");

        }

        if (firstLockedElement.length == 0) {
            firstRange.append("<div class='" + class1 + " locked'></div>")
        } else {
            firstLockedElement.addClass(class1);
            firstLockedElement.removeClass(class2)
        }

        if (lastLockedElement.length == 0) {
            lastRange.append("<div class='locked " + class2 + "'></div>")
        } else {
            lastLockedElement.addClass(class2);
            lastLockedElement.removeClass(class1)
        }


        daysRange.each(function () {
            var _day = $(this);
            let lockedElement = _day.find(".locked");
            if (lockedElement.length == 0) {
                _day.append("<div class='locked'></div>")
            } else {
                lockedElement.removeClass(class1)
                lockedElement.removeClass(class2)
            }
        })
    } else {
        let lockedElement = firstRange.find(".locked");
        if (lockedElement.length == 0) {
            firstRange.append("<div class='lockedStart locked lockedEnd'></div>")
        } else {
            lockedElement.addClass("lockedStart locked lockedEnd");
        }
    }



}