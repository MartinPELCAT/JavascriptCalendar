window.addEventListener("DOMContentLoaded", () => {
    var currentMonth = 0;

    function main(value) {
        $(".days").remove();
        var now = moment().add(value, 'M');
        $("#currentMonth").html(moment().month(now.month()).format("MMMM") + " " + moment(now).year());
        displayCalendar(getRange(moment(now).startOf("month"), moment(now).endOf("month")));
        var firstDayRange;
        var isCreate = true;
        $(".days").mousedown(function(e) {
            firstDayRange = $(this);
            if (firstDayRange.find(".locked").length > 0) isCreate = false;
            renderLock(firstDayRange, firstDayRange, isCreate);
            $(".days").mouseenter(function(e) {
                $(".tmp").remove();
                renderLock(firstDayRange, $(this), isCreate);
            });
        });
        $(".days").mouseup(function(e) {
            renderLock(firstDayRange, $(this), isCreate);
            $(".days").unbind("mouseenter");
            $(".tmp").removeClass("tmp");
            isCreate = true;
        });
        $("#calendar").mouseleave(function() {
            $(".days").unbind("mouseenter");
        })
    }
    main(currentMonth);
    $("#prevMonth").click(function() {
        currentMonth--;
        main(currentMonth);
    });
    $("#nextMonth").click(function() {
        currentMonth++;
        main(currentMonth);
    });
});
let getRange = function(firstDay, lastDay) {
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
let displayCalendar = function(range) {
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
let renderLock = function(firstRange, lastRange, createStatus) {
    let date1 = moment(firstRange[0].id, "DD-MM-YYYY");
    let date2 = moment(lastRange[0].id, "DD-MM-YYYY");
    let firstLockedElement = firstRange.find(".locked");
    let lastLockedElement = lastRange.find(".locked");
    if (date1.isAfter(date2, 'days') || date2.isAfter(date1, 'days')) {
        let class1;
        let class2;
        let daysRange;
        if (date1.isAfter(date2, 'days')) { //date1 end - date2 start 
            class1 = "lockedEnd";
            class2 = "lockedStart";
            daysRange = lastRange.nextUntil(firstRange, ".col");
        } else { //date1 start - date2 end 
            class2 = "lockedEnd";
            class1 = "lockedStart";
            daysRange = firstRange.nextUntil(lastRange, ".col");
        }
        if (firstLockedElement.length == 0 && createStatus) {
            firstRange.append("<div class='" + class1 + " locked' tmp></div>")
        } else {
            if (!createStatus) {
                firstLockedElement.remove();
            }
            firstLockedElement.addClass(class1);
            firstLockedElement.removeClass(class2)
        }
        if (lastLockedElement.length == 0 && createStatus) {
            lastRange.append("<div class='locked " + class2 + " tmp'></div>")
        } else {
            if (!createStatus) {
                lastLockedElement.remove();
            }
            lastLockedElement.addClass(class2);
            lastLockedElement.removeClass(class1)
        }
        daysRange.each(function() {
            var _day = $(this);
            let lockedElement = _day.find(".locked");
            if (lockedElement.length == 0 && createStatus) {
                _day.append("<div class='locked tmp'></div>")
            } else {
                if (!createStatus) {
                    lockedElement.remove();
                }
                lockedElement.removeClass(class1)
                lockedElement.removeClass(class2)
            }
        })
    } else {
        if (firstLockedElement.length == 0 && createStatus) {
            firstRange.append("<div class='lockedStart locked lockedEnd'></div>")
        } else {
            if (!createStatus) {
                firstLockedElement.remove();
            }
            firstLockedElement.addClass("lockedStart locked lockedEnd");
        }
    }
    smoothifyAll();
}
let smoothifyAll = function() {
    let allDays = $(".days.col");
    for (let index = 0; index < allDays.length; index++) {
        let element = allDays[index];
        if (index === 0) {
            if ($(allDays[index + 1]).find(".locked").length > 0) {
                $(element).find(".locked").removeClass("lockedEnd");
                $(allDays[index + 1]).find(".locked").removeClass("lockedStart")
            }
        } else if (index == allDays.length - 1) {
            //Do nothing
        } else {
            if ($(allDays[index + 1]).find(".locked").length > 0 && $(element).find(".locked").length > 0) {
                $(element).find(".locked").removeClass("lockedEnd");
                $(allDays[index + 1]).find(".locked").removeClass("lockedStart")
            } else {
                $(element).find(".locked").addClass("lockedEnd");
                $(allDays[index + 1]).find(".locked").addClass("lockedStart")
            }
            if ($(allDays[index - 1]).find(".locked").length > 0 && $(element).find(".locked").length > 0) {
                $(element).find(".locked").removeClass("lockedStart");
                $(allDays[index - 1]).find(".locked").removeClass("lockedEnd")
            } else {
                $(element).find(".locked").addClass("lockedStart");
                $(allDays[index - 1]).find(".locked").addClass("lockedEnd")
            }
        }
    }
}