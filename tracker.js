$(document).ready(function() {
	Tracker.ui.registerClickHandlers();
	
	Tracker.ui.populateCalendar(Tracker.data.generateCalendar());
	Tracker.ui.populateIcons();
	Tracker.ui.populateViewer();
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
		 * The currrently set date. Defaults to today.
		 */
		date: {
			"year": new Date().getFullYear(),
			"month": new Date().getMonth(),
			"day": new Date().getDate()
		},
		
		/**
		 * This class contains all the functionality relating to the manipulation
		 *  and processing of the data. No DOM manipulation takes place in this class.
		 */
		data: (function() {
			
			var dataStorage = {
				"2016-05-28": [3,4],
				"2016-06-08": [0, 1, 2, 3, 4, 5],
				"2016-06-10": [2,4,5],
				"2016-06-14": [3],
				"2016-06-12": [0,2],
				"2016-06-28": [2,3,4,5],
				"2016-06-26": [1,2,3,4,5]
			};
			
			var categories = {
				"current": [
				
				],
				"all": [
					{
						id: 0,
						color: "red",
						name: "Hiking",
						icon: "compass-icon.png"
					},
					{
						id: 1,
						color: "blue",
						name: "Music",
						icon: "audio-icon.png"
					},
					{
						id: 2,
						color: "orange",
						name: "Shop",
						icon: "basket-icon.png"
					},
					{
						id: 3,
						color: "green",
						name: "Workout",
						icon: "check-icon.png"
					},
					{
						id: 4,
						color: "brown",
						name: "Drink Coffee",
						icon: "mug-icon.png"
					},
					{
						id: 5,
						color: "purple",
						name: "Charge Phone",
						icon: "lightning-icon.png"
					}
				]
			};
			
			/**
			 *	Determines if the given date is a leap year. If no date is given 
			 *	it defaults to the current year.
			 *
			 * @return {boolean} - true/false indicating if the year is a leap year
			 */
			function isLeapYear() {
				if (Tracker.date.year % 100 === 0 && Tracker.date.year % 400 === 0) {
					return true;
				} else if (Tracker.date.year % 4 === 0) {
					return true;
				} else {
					return false;
				}
			}
			
			return {
				dataStorage: dataStorage,
				categories: categories,
				
				/** 
				 *	Generates an array representing the calender for the 
				 * given year and month. If no year or month are given it 
				 * defaults to the current year or month. 
				 *
				 * @return {Array} - a two dimentional array representing the month
				 */
				generateCalendar: function() {
					var monthStart = new Date(Tracker.date.year, Tracker.date.month, 1);
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
							if (counter <= lengths[Tracker.date.month]) {
								monthArray[weekCounter][dayOfWeekCounter] = counter;
								counter++
							}
						}
					}
					
					return monthArray;
				},
				
				setDate: function(dateString) {
					var dateArray = dateString.split("-");
					
					Tracker.date.year = parseInt(dateArray[0], 10);
					Tracker.date.month = parseInt(dateArray[1], 10);
					Tracker.date.day = parseInt(dateArray[2], 10);
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
				 * @return - none
				 */
				populateCalendar: function(monthArray) {
					var dateString = "";
					
					for (var weekCounter=0; weekCounter<monthArray.length; weekCounter++) {
						for (var dayOfWeekCounter=0; dayOfWeekCounter<monthArray[0].length; dayOfWeekCounter++) {
							//populate the day numbers
							if (monthArray[weekCounter][dayOfWeekCounter] > 0) {
								$("#" + weekCounter + dayOfWeekCounter + " .date").text(monthArray[weekCounter][dayOfWeekCounter]);
								dateString = Tracker.date.year + "-" + 
												 (Tracker.date.month > 9 ? Tracker.date.month : "0" + Tracker.date.month) + "-" + 
												 (monthArray[weekCounter][dayOfWeekCounter] > 9 ? monthArray[weekCounter][dayOfWeekCounter] : "0" + monthArray[weekCounter][dayOfWeekCounter]);
								$("#" + weekCounter + dayOfWeekCounter).attr("data-date", dateString);
							} else {
								$("#" + weekCounter + dayOfWeekCounter + " .date").text("");
							}
						}
					}
					
					Tracker.ui.highlightDay();
				},
				
				/**
				 * Displays icons in the calendar cells.
				 *
				 * @return - none
				 */
				populateIcons: function() {
					var day = "";
					for (item in Tracker.data.dataStorage) {
						if (item.indexOf(Tracker.date.year + "-" + (Tracker.date.month > 9 ? Tracker.date.month : "0" + Tracker.date.month)) > -1) {
							var itemList = Tracker.data.dataStorage[item].sort(),
								  day = item.split("-")[2],
								  id = 0;
							
							//find ID of calendar day
							for (var weekCounter=0; weekCounter<6; weekCounter++) {
								for (var dayOfWeekCounter=0; dayOfWeekCounter<7; dayOfWeekCounter++) {
									if (parseInt(day) === parseInt($("#" + weekCounter + dayOfWeekCounter + " .date").text())) {
										id = $("#" + weekCounter + dayOfWeekCounter).attr("id");
										break;
									}
								}
							}
							
							//display icons on day
							var categories = Tracker.data.categories.all;
							
							for (var i=0; i<itemList.length; i++) {
								$("#" + id).append("<img src='img/" + categories[itemList[i]].icon + "' class='icon' />");
								
								if (itemList.length == 3 && i == 0) {
									$("#" + id).append("<br>");
								} else if (itemList.length == 4 && i == 1) {
									$("#" + id).append("<br>");
								} else if (itemList.length == 5 && i == 1) {
									$("#" + id).append("<br>");
								} else if (itemList.length == 6 && i == 2) {
									$("#" + id).append("<br>");
								}
							}
						}
					}
				},
				
				/**
				 * Displays the icons in the viewer area for the currently set date.
				 *
				 * @return - none
				 */
				populateViewer: function() {
					var dateString = Tracker.date.year + "-" + (Tracker.date.month > 9 ? Tracker.date.month : "0" + Tracker.date.month) + "-" + (Tracker.date.day > 9 ? Tracker.date.day : "0" + Tracker.date.day);
					var itemList = (Tracker.data.dataStorage[dateString] == undefined ? [] : Tracker.data.dataStorage[dateString]);
					
					$(".viewer").html("");
					
					for (var i=0; i<itemList.length; i++) {
						$(".viewer").append(
							"<span class='tracker-item'>" + 
								"<span class='tracker-icon-container'>" + 
									"<img class='tracker-icon' src='img/" + Tracker.data.categories.all[itemList[i]].icon + "' />" +
								"</span>" +
								"<span class='tracker-title'>" + Tracker.data.categories.all[itemList[i]].name + "</span>" +
							"</span>"
						);
						
						if (itemList.length == 3 && i == 0) {
							$(".viewer").append("<br>");
						} else if (itemList.length == 4 && i == 1) {
							$(".viewer").append("<br>");
						} else if (itemList.length == 5 && i == 1) {
							$(".viewer").append("<br>");
						} else if (itemList.length == 6 && i == 2) {
							$(".viewer").append("<br>");
						}
					}
				},
				
				/**
				 * Displays the given month in the title bar.
				 *
				 * @return - none
				 */
				displayMonth: function() {
					$(".title").text(monthNames[Tracker.data.month]);
				},
				
				/**
				 * Highlights the current day on the calendar. 
				 * 
				 * @return - none
				 */
				highlightDay: function() {
					var tempDate = 0;
					for (var weekCounter=0; weekCounter<6; weekCounter++) {
						for (var dayOfWeekCounter=0; dayOfWeekCounter<7; dayOfWeekCounter++) {
							tempDate = ($("#" + weekCounter + dayOfWeekCounter + " .date").text() == "" ? 0 : parseInt($("#" + weekCounter + dayOfWeekCounter + " .date").text()));
							if (parseInt(Tracker.date.day) === tempDate) {
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
						Tracker.data.setDate($(this).attr("data-date"));
						Tracker.ui.highlightDay($(this).text());
						Tracker.ui.populateViewer();
					});
					
					$(".tracker-item").on("click", function() {
						Tracker.ui.highlightItem(this);
					});
				}
			}
		})()
	};
})();