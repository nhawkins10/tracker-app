$(document).ready(function() {
	Tracker.ui.registerClickHandlers();
	
	Tracker.ui.populateCalendar(Tracker.data.generateCalendar());
	Tracker.ui.displayMonth();
});

var Tracker = (function() {
	return {
		data: (function() {
			function isLeapYear(date) {
				var now = date || new Date();

				if (now.getYear() % 100 === 0 && now.getYear() % 400 === 0) {
					return true;
				} else if (now.getYear() % 4 === 0) {
					return true;
				} else {
					return false;
				}
			}
			
			return {
				generateCalendar: function(yearParam, monthParam) {
					var year = yearParam || new Date().getFullYear(),
						  month = monthParam || new Date().getMonth(),
						  monthStart = new Date(year, month, 1);
					var lengths = {
						"0": 31,
						"1": (isLeapYear() ? 29 : 28),
						"2": 31,
						"3": 30,
						"4": 31,
						"5": 30,
						"6": 31,
						"7": 31,
						"8": 30,
						"9": 31,
						"10": 30,
						"11": 31
					};
					var monthArray = [
						[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0],
						[0,0,0,0,0,0,0]
					];
					var counter = 1;
					
					for (var weekCounter=0; weekCounter<monthArray.length; weekCounter++) {
						for (var dayOfWeekCounter=0; dayOfWeekCounter<monthArray[0].length; dayOfWeekCounter++) {
							if (weekCounter === 0 && dayOfWeekCounter < monthStart.getDay()) {
								continue;
							}
							if (counter <= lengths[month]) {
								monthArray[weekCounter][dayOfWeekCounter] = counter;
								counter++
							}
						}
					}
					
					return monthArray;
				}
			}
		})(),
		
		ui: (function() {
			var monthNames= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			
			return {
				populateCalendar: function(monthArray, dayParam) {
					var day = dayParam || new Date().getDate();
					for (var weekCounter=0; weekCounter<monthArray.length; weekCounter++) {
						for (var dayOfWeekCounter=0; dayOfWeekCounter<monthArray[0].length; dayOfWeekCounter++) {
							//populate the day numbers
							if (monthArray[weekCounter][dayOfWeekCounter] > 0) {
								$("#" + weekCounter + dayOfWeekCounter + " .date").text(monthArray[weekCounter][dayOfWeekCounter]);
							} else {
								$("#" + weekCounter + dayOfWeekCounter + " .date").text("");
							}
						}
					}
					
					Tracker.ui.highlightDay(day);
				},
				
				displayMonth: function(monthIdParam) {
					var monthId = monthIdParam || new Date().getMonth();
					$(".title").text(monthNames[monthId]);
				},
				
				highlightDay: function(dayParam) {
					var day = dayParam || new Date().getDate();
					
					for (var weekCounter=0; weekCounter<6; weekCounter++) {
						for (var dayOfWeekCounter=0; dayOfWeekCounter<7; dayOfWeekCounter++) {
							if (parseInt(day) === parseInt($("#" + weekCounter + dayOfWeekCounter + " .date").text())) {
								$("#" + weekCounter + dayOfWeekCounter).addClass("highlight");
							} else {
								$("#" + weekCounter + dayOfWeekCounter).removeClass("highlight");
							}
						}
					}
				},
				
				highlightItem: function(item) {
					if ($(item).find(".tracker-icon-container").hasClass("grey-border")) {
						$(item).find(".tracker-icon-container").removeClass("grey-border grey-background");
					} else {
						$(item).find(".tracker-icon-container").addClass("grey-border grey-background");
					}
				},
				
				registerClickHandlers: function() {
					$(".calendar td").on("click", function() {
						Tracker.ui.highlightDay($(this).text());
					});
					
					$(".tracker-item").on("click", function() {
						Tracker.ui.highlightItem(this);
					});
				}
			}
		})()
	};
})();