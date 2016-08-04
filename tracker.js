$(document).ready(function() {
	Tracker.ui.registerSwipeEvents();
	Tracker.ui.refreshScreen();
});

/******************************************************************/
/**																												**/
/**	 This application allows a user to easily record when events have take place		**/
/**	 on a calendar control. The user can customize the events and easily view 		**/	
/**	 a the history of when each event has taken place.										**/
/**	 https://nhawkins10.github.io/tracker-app/													**/
/**																												**/
/**	 All icons courtesy of IconMonstr www.iconmonstr.com									**/
/**	 Swipe detection from:																				**/
/**	 	http://www.javascriptkit.com/javatutors/touchevents2.shtml						**/
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
				"2016-06-26": [1,2,3,4,5],
				"2016-07-01": [2],
				"2016-07-04": [3, 5]
			};
			
			var categories = {
				"current": [1, 2, 4],
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
				},
				
				incrementMonth: function() {
					if (Tracker.date.month == 11) {
						Tracker.date.month = 0;
						Tracker.date.year++;
					} else {
						Tracker.date.month++;
					}
					
					if (Tracker.date.month == new Date().getMonth()) {
						Tracker.date.day = new Date().getDate();
					} else {
						Tracker.date.day = 1;
					}
				},
				
				decrementMonth: function() {
					if (Tracker.date.month == 0) {
						Tracker.date.month = 11;
						Tracker.date.year--;
					} else {
						Tracker.date.month--;
					}
					
					if (Tracker.date.month == new Date().getMonth()) {
						Tracker.date.day = new Date().getDate();
					} else {
						Tracker.date.day = 1;
					}
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
				 * Repaints the screen with the most currently set date.
				 *
				 * @return - none
				 */
				refreshScreen: function() {
					Tracker.ui.populateCalendar(Tracker.data.generateCalendar());
					Tracker.ui.populateIcons();
					Tracker.ui.populateViewer();
					Tracker.ui.displayMonth();
				},
				
				/**
				 * Populates the calendar UI with day number data from the 
				 * given monthArray and highlights the given day.
				 *
				 * @param monthArray - the calendar data to display
				 * @return - none
				 */
				populateCalendar: function(monthArray) {
					var dateString = "";
					
					$(".calendar td").off("click");
					
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
					
					$(".calendar td").on("click", function() {
						Tracker.data.setDate($(this).attr("data-date"));
						Tracker.ui.highlightDay($(this).text());
						Tracker.ui.populateViewer();
					});
					
					Tracker.ui.highlightDay();
				},
				
				/**
				 * Displays icons in the calendar cells.
				 *
				 * @return - none
				 */
				populateIcons: function() {
					var day = "";
					$(".calendar-icons-container").html("");
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
								$("#" + id + " .calendar-icons-container").append("<img src='img/" + categories[itemList[i]].icon + "' class='icon' />");
								
								if (itemList.length == 3 && i == 0) {
									$("#" + id + " .calendar-icons-container").append("<br>");
								} else if (itemList.length == 4 && i == 1) {
									$("#" + id + " .calendar-icons-container").append("<br>");
								} else if (itemList.length == 5 && i == 1) {
									$("#" + id + " .calendar-icons-container").append("<br>");
								} else if (itemList.length == 6 && i == 2) {
									$("#" + id + " .calendar-icons-container").append("<br>");
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
					var today = new Date();
					var todayString = today.getFullYear() + "-" + (today.getMonth() > 9 ? today.getMonth() : "0" + today.getMonth()) + "-" + (today.getDate() > 9 ? today.getDate() : "0" + today.getDate());
					
					var itemList = (Tracker.data.dataStorage[dateString] == undefined ? [] : Tracker.data.dataStorage[dateString]);
					
					$(".tracker-item").off("click");
					
					$(".viewer").html("");
					
					if (todayString == dateString) {
						//populate viewer for current day
						if (itemList.length == 0) {
							$(".viewer").html("<div class='viewer-text secondary-text'>Nothing for today :)</div>");
						} else {
							var highlight = false;
							for (var i=0; i<Tracker.data.categories.current.length; i++) {
								if (itemList.indexOf(Tracker.data.categories.current[i]) > -1) {
									highlight = true;
								}
								
								$(".viewer").append(
									"<span class='tracker-item'>" + 
										"<span class='tracker-icon-container " + (highlight ? "grey-border grey-background" : "") + "'>" + 
											"<img class='tracker-icon' src='img/" + Tracker.data.categories.all[Tracker.data.categories.current[i]].icon + "' />" +
										"</span>" +
										"<span class='tracker-title'>" + Tracker.data.categories.all[Tracker.data.categories.current[i]].name + "</span>" +
									"</span>"
								);
								
								if (Tracker.data.categories.current.length == 3 && i == 0) {
									$(".viewer").append("<br>");
								} else if (Tracker.data.categories.current.length == 4 && i == 1) {
									$(".viewer").append("<br>");
								} else if (Tracker.data.categories.current.length == 5 && i == 1) {
									$(".viewer").append("<br>");
								} else if (Tracker.data.categories.current.length == 6 && i == 2) {
									$(".viewer").append("<br>");
								}
								
								highlight = false;
							}
						}
					} else {
						//populate viewer for a past day
						if (itemList.length == 0) {
							$(".viewer").html("<div class='viewer-text secondary-text'>Nothing for this day :)</div>");
						} else {
							for (var i=0; i<itemList.length; i++) {
								$(".viewer").append(
									"<span class='tracker-item'>" + 
										"<span class='tracker-icon-container grey-border grey-background'>" + 
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
						}
					}
					
					$(".tracker-item").on("click", function() {
						if (new Date(Tracker.date.year, Tracker.date.month, Tracker.date.day).toDateString() == new Date().toDateString()) {
							Tracker.ui.highlightItem(this);
						}
					});
				},
				
				/**
				 * Displays the given month in the title bar.
				 *
				 * @return - none
				 */
				displayMonth: function() {
					$(".title").text(monthNames[Tracker.date.month]);
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
				 * - swipe up/down on calendar
				 *
				 * @return - none
				 */
				registerSwipeEvents: function() {
					Tracker.ui.swipeDetect(function(swipeDir) {
						console.log(swipeDir);
						if (swipeDir === "up") {
							Tracker.data.incrementMonth();
							Tracker.ui.refreshScreen();
						} else if (swipeDir === "down") {
							Tracker.data.decrementMonth();
							Tracker.ui.refreshScreen();
						}
					});
				},
				
				/**
				 * Un-registers click handlers for the application.
				 * - click handler for calendar cells
				 * - click handler for viewer items
				 * - swipe up/down on calendar
				 *
				 * @return - none
				 */
				unregisterSwipeEvents: function() {
					$(".calendar").off("touchstart");
					$(".calendar").off("touchmove");
					$(".calendar").off("touchend");
				},
				
				/**
				* Detects swipes in the calendar and calls the given callback function
				* with "up", "down", "left", "right", or "none" based on the direction of the swipe.
				*
				* @param callback - the function to call when a valid swipe is detected
				* @return - none
				*/
				swipeDetect: function( callback){
					 var touchsurface = document.getElementsByClassName("calendar")[0],
						swipedir,
						startX,
						startY,
						distX,
						distY,
						threshold = 150, //required min distance traveled to be considered swipe
						restraint = 100, // maximum distance allowed at the same time in perpendicular direction
						allowedTime = 300, // maximum time allowed to travel that distance
						elapsedTime,
						startTime,
						handleswipe = callback || function(swipedir){};
				  
					touchsurface.addEventListener('touchstart', function(e){
						var touchobj = e.changedTouches[0]
						swipedir = 'none'
						dist = 0
						startX = touchobj.pageX
						startY = touchobj.pageY
						startTime = new Date().getTime() // record time when finger first makes contact with surface
					}, false)
				  
					touchsurface.addEventListener('touchmove', function(e){
					}, false)
				  
					touchsurface.addEventListener('touchend', function(e){
						var touchobj = e.changedTouches[0]
						distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
						distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
						elapsedTime = new Date().getTime() - startTime // get time elapsed
						if (elapsedTime <= allowedTime){ // first condition for awipe met
							if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
								swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
							}
							else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
								swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
							}
						}
						handleswipe(swipedir);
						if (swipedir != "none") {
							e.preventDefault()
						}
					}, false)
				}
			}
		})()
	};
})();