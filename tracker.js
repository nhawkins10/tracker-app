$(document).ready(function() {
	Tracker.ui.registerClickHandlers();
	
	Tracker.ui.populateCalendar(Tracker.data.generateCalendar());
	Tracker.ui.displayMonth();
});

/******************************************************************/
/**																												**/
/**	 This application allows a user to easily record when events have take place		**/
/**	 on a calendar control. The user can customize the events and easily view 		**/	
/**	 a the history of when each event has taken place.										**/
/**	 https://nhawkins10.github.io/tracker-app/													**/
/**																												**/
/**	 All icons courtesy of IconMonstr www.iconmonstr.com									**/
/**	 																											**/
/**	 Created by: Nathan Hawkins																		**/
/**	 Date: July 2016																						**/
/**																												**/
/******************************************************************/
var Tracker = (function() {
	return {
		
		/**
		 * This class contains all the functionality relating to the manipulation
		 *  and processing of the data. No DOM manipulation takes place in this class.
		 */
		data: (function() {
			
			/**
			 *	Determines if the given date is a leap year. If no date is given 
			 *	it defaults to the current year.
			 *
			 * @param date - the date to check
			 * @return {boolean} - true/false indicating if the year is a leap year
			 */
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
				
				/** 
				 *	Generates an array representing the calender for the 
				 * given year and month. If no year or month are given it 
				 * defaults to the current year or month. 
				 *
				 * @param yearParam - the given year
				 * @param monthParam - the given month
				 * @return {Array} - a two dimentional array representing the month
				 */
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
		
		/**
		 * This class contains all the functionality relating
		 * to the manipulation of the DOM.
		 */
		ui: (function() {
			var monthNames= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			
			return {
				
				/**
				 * Populates the calendar UI with data from the 
				 * given monthArray and highlights the given day.
				 *
				 * @param monthArray - the calendar data to display
				 * @param dayParam - the day to highlight, defaults to today if none is given
				 * @return - none
				 */
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
				
				/**
				 * Displays the given month in the title bar.
				 * Defaults to the current month if none is given.
				 *
				 * @param monthIdParam - the zero based ID of the month
				 * @return - none
				 */
				displayMonth: function(monthIdParam) {
					var monthId = monthIdParam || new Date().getMonth();
					$(".title").text(monthNames[monthId]);
				},
				
				/**
				 * Highlights the given day on the calendar. Defaults
				 * to the current day if none is given.
				 * 
				 * @param dayParam - the day to highlight
				 * @return - none
				 */
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
				
				/**
				 * Highlights the given item in the viewer area.
				 * 
				 * @param item - the DOM element to highlight
				 * @return - none
				 */
				highlightItem: function(item) {
					if ($(item).find(".tracker-icon-container").hasClass("grey-border")) {
						$(item).find(".tracker-icon-container").removeClass("grey-border grey-background");
					} else {
						$(item).find(".tracker-icon-container").addClass("grey-border grey-background");
					}
				},
				
				/**
				 * Registers click handlers for the application.
				 * - click handler for calendar cells
				 * - click handler for viewer items
				 *
				 * @return - none
				 */
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