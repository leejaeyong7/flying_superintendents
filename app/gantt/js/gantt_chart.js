/*	
	problems left:
	2. data structue of project-schedule-task-subtask
	3. hide/show tasks when clicked on the schedule, hide/show sub-tasks when clicked on the task.
	4. HOVER  mouseover tag, -> parent ->children (neighbor tr) highlight
	5. Quarter function small bug
*/

/* Task Object Complete Attributes: 
name
requestor
personCommitted
responsibleSubs
startDate
endDate
actualStartDate
duration
taskPredecessor
taskSuccessor
taskConstraints
taskPerformance
taskAnticipated
taskPerformanceVariance
taskRepeated
elements
*/ 

/* Project Object Attributes: 
name
userID
projectAddress
projectFaxNumber
projectPhoneNumber
responsibleIndividual
LinkToProjectInfor
*/

/**
 * Parse through each attribute of the project/task and make an unordered list as the project/task detail
 * @param {Object} r             Project / task object   
 * @return {String} output   Project/task detail in HTML format
*/
function listAttributes(r) {
	output = "<div><ul>";
	for (var p in r) {
		output += "<li>" + p + ": " + r[p] + "</li>";
	}
	output += "</ul></div>";
	return output;
}

/**
 * Generate a whole project table div and navigation bar
 * @return {String} output
*/
function generateTable(projectID) {
	output = '<div id="' + projectID + '_TABLE"><!-- nav bars for display of day/week/month/quarter -->'
					  + '<ul class="nav nav-tabs">'
	                + '<li><a href="#' + projectID + '_DAY" data-toggle="tab"> DAY</a></li>'
	                + '<li><a href="#' + projectID + '_WEEK" data-toggle="tab"> WEEK</a></li>'
	                + '<li><a href="#' + projectID + '_MONTH" data-toggle="tab"> MONTH</a></li>'
	                + '<li><a href="#' + projectID + '_QUARTER" data-toggle="tab"> QUARTER</a></li>'
	                + '</ul></div><!-- {projectID}_table -->';
	return output;
}

/**
 * Helper function to calculate the difference in days between two date objects.
 * @param {Date Object} date1  The beginning date.
 * @param {Date Object} date2  The ending date, must be later than or equal to date1
 * @return {Integer} diffDays      Difference in days 
 */
function diffDays(date1, date2)
{
    var one_day=1000*60*60*24;

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();

    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;

    // Convert back to days and return
    var diffDays =  Math.round(difference_ms/one_day); 
    return diffDays;
}


/**
 * Generate Bootstrap built-in progress bar of a task and append it to the assigned table
 * Must set width of td of each table beforehand 
 * @param {Task Object Array}          tasks_data            Task Object Array
 * @param {String}           table_format               Could be "day_table", "week_table", "month_table", or "quarter_table"
 * @param {Date Object} project_start_date       The start date of the project which the task belongs to
 * @param {Date Object} project_end_date         The end date of the project which the task belongs to
 * @return {String}           bar                               The progress bar in HTML format
*/
function generateBar (tasks_data, table_format, project_start_date, project_end_date) {
	var table_width = "." + table_format+" tr td";
	var bar = '';
	$.each(tasks_data, function(key, val) {
		//calculate the length (number of 'td's) of the completed bar 
		var total = diffDays(new Date(val.startDate), new Date(val.endDate));
		var days_before_start = diffDays(project_start_date, new Date(val.startDate));
		var days_after_end = diffDays(new Date(val.endDate), project_end_date);
		bar += '<tr><td colspan=' + days_before_start + '> ' + '</td>'
		         + '<td colspan="' + total +'"><div class="progress" style="width:' 
	             + $(table_width).css('width') * total                                                                 //look for class
	             +'"><div class="progress-bar" role="progressbar" aria-valuenow="'
	             + val.progress
	             + '" aria-valuemin="0" aria-valuemax="100" style="width:' 
	             + val.progress + '%' +'">' + val.progress + '%' +  '</div></div></td>'
		          + '<td colspan="'+ days_after_end +'"></td></tr>'; 
	});
	return bar;
}

/**
 * @param {Integer}        projectID
 * @param {Task Object} r
 * @return {String}          modal       Task attributes in a Bootstap built-in modal in HTML format
*/ 
function generateTaskDetailsModal(projectID, r) {
	var modal = '<div id="' + projectID + "_" +r.ID + '_modal' +'" class="modal fade" tabindex="-1">'
       				+'<div class="modal-dialog">' 
       				+'<div class="modal-content">'       
       				+	'<div class="modal-header">' 
       				+	'<button type="button" class="close glyphicon glyphicon-remove" data-dismiss="modal"></button>'
       				+	'<h3 class="modal-title">Task Details</h3>' 
       				+	'</div>' 
       				+'<div class="modal-body">'
  	                + listAttributes(r)
	       			+'</div>'
	   			+'<div class="modal-footer">'
			          		+'<button class="btn btn-primary" data-dismiss="modal">Close</button>'
			           +'</div>'
	       		+'</div>' 
	       		+'</div>' 
	       	+'</div>';
	return modal;
}


/**
 * Pass in JSON data with tasks of a project and generate left_table with task info
 * @param {Task Object Array}   data              The name of the JSON file
 * @param {Integer}                    projectID
 * @return {String}                      left_table     The left_table in HTML format
*/ 
function generateLeftTable(data, projectID) {
	var left_table = '<div class="table-responsive left_portion">'
			          + '<table class="table table-hover" id="'+ projectID +'_left_table"><tbody class="interactive">'    //assign an unique id: "{projectID}_left_table"
			          + '<tr><th colspan="5">TASKS INFO</th></tr>'                                                                          //a stub up tr
			          + '<tr>'
			          + '<td style="width: 15%">ID</td>'
			          + '<td style="width: 25%">Task Name</td>'
			          + '<td style="width: 25%">Start Date</td>'
			          + '<td style="width: 25%">End Date</td>'
			          + '<td style="width: 10%">Details</td>'
			          + '</tr>';
	var output = '';
	$.each(data, function(key, val) {   //val is task obj
		output += '<tr data-toggle="tooltip" data-placement="bottom" title="' + val.detail + '">';
		output += '<td>'+ val.ID +'</td>';
		output += '<td>'+ val.name +'</td>';
		output += '<td>'+ val.startDate +'</td>';
		output += '<td>'+ val.endDate +'</td>';
		$("#"+projectID+"_TABLE").append(generateTaskDetailsModal(projectID, val));    
		output += '<td><p><a href="#' + projectID +"_" +val.ID + '_modal' + '" data-toggle="modal" class="btn btn-primary">expand</a></p></td>';
		output += '</tr>';
	});
	left_table += output;
	left_table += '</tbody></table><!-- left table -->'+'</div><!-- left table responsive div -->';
	return left_table;
}

/**
 * Generate right table frame with day/week/month/quarter format
 * @param {Integer} projectID
*/
function generateRightTableFrame(projectID) {
	var arr = ["DAY", "WEEK", "MONTH", "QUARTER"];
	var output = '<div class="right_portion">'
							+ '<div class="tab-content">';
	for (i in arr) {
		output += (i==0) ? '<div class="tab-pane fade active in" id="'+ projectID + '_' + arr[i] +'">' : '<div class="tab-pane fade" id="'+ projectID + '_' + arr[i] +'">';
		output += '<div class="table-responsive">'
						  + '<table class="table table-hover" id="'+ projectID + '_' + arr[i] + '_table">'
						  + '<tbody class="interactive"></tbody></table></div></div>';
	}
	output += '</div><!-- tab content --></div><!-- div for right portion -->';
	return output;
}


/**
 * Return the nearest Sunday obj (The returned date is EARLIER than the passed in date)
 * @param {String}          d         A string date formated like "2015-01-01"
 * @return {Date Object} date   Date obj which is the nearest Sunday
*/
function returnNearestSunday(d) {
	var date = new Date(d);
	var day = date.getDay();
	if (day != 0) {   // 0 means Sunday
		date.setDate(date.getDate() - day);  //decrement {day} times
	} else {
		date.setDate(date.getDate() - 7);     //derement 7 times 
	}
	return date;    //returns a Date obj
}
	
/**
 * Return the nearest Saturday obj (The returned date is LATER than the passed in date)
 * @param {String}          d         A string date formated like "2015-01-01"
 * @return {Date Object} date   Date obj which is the nearest Saturday
*/
function returnNearestSaturday(d) {
	var date = new Date(d);
	var day = date.getDay();
	if (day != 6) {  
		date.setDate(date.getDate() + 6 - day);   //increment 6-day times
	}else {
		date.setDate(date.getDate() + 7);     //increment 7 times 
	} 
	return date;    //returns a Date obj
}

/**
 * Generate the right table in DAY format
 * @param {Integer}                   duration              project duration in days 
 * @param {Date Object}           start    expanded start date of the project
 * @param {Date Object}           end      expanded end date of the project
 * @return {String}                     rows     two table rows for the day table heading
 */
function generateRightDayTable(duration, start, end) {
	var first_row = '<tr>';     //display current week 
	var second_row = '<tr>';   //display current day

	//iterate to generate the table heading with each date in a div
	var d = new Date(start); 
	for (var i = 0; i < duration; i++) {
		second_row += '<td><div class="block" style="display: inline-block;"> ' + d.getDate() + ' </div></td>'; 
		d.setDate(d.getDate() + 1);  //increment by 1
	}
	d = new Date(start);   //reset date 
	for (var i = 0; i < duration/7; i++) {
		//returns the format like 1/01 - 1/08/15
		first_row += '<td colspan="7"><div style="display: inline-block;"> ' + (d.getMonth()+1) + '/' + d.getDate() + ' - ';
		d.setDate(d.getDate() + 7);  //increment by 7
		first_row += (d.getMonth()+1)  + '/' + d.getDate() +  '/' + d.toDateString().substring(13) + '</div></td>';
	}
	rows = first_row + '</tr>' + second_row + '</tr>';
	return rows; 
}

/**
 * Generate the right table in WEEK format
 * @param {Integer}                  duration              project duration in days 
 * @param {Date Object}           start    expanded start date of the project
 * @param {Date Object}           end      expanded end date of the project
 * @return {String}                    rows     two table rows for the week table heading
 */
function generateRightWeekTable(duration, start, end) {
	var first_row = '<tr>';    //display current yr
	var second_row = '<tr>';   //current current week 

	//iterate to generate the table heading with each date in a div
	var d = new Date(start); 
	for (var i = 0; i < duration/7; i++) {
		first_row += '<td colspan="7"><div class="block" style="display: inline-block;"> ' 
									+ '\'' + d.toDateString().substring(13) + ' </div></td>'; 
		d.setDate(d.getDate() + 7);  //increment by 7
	}
	d = new Date(start);   //reset date 
	for (var i = 0; i < duration/7; i++) {
		//returns the start date of the current week
		second_row += '<td colspan="7"><div style="display: inline-block;"> ' + (d.getMonth()+1) + '/' + d.getDate() + '</div></td>';
		d.setDate(d.getDate() + 7);  //increment by 7
	}
	rows = first_row + '</tr>' + second_row + '</tr>';
	return rows; 
}

/**
 * Generate the right table in MONTH format
 * @param {Integer}                   duration              project duration in days 
 * @param {Date Object}           start    expanded start date of the project
 * @param {Date Object}           end      expanded end date of the project
 * @return {String}                     rows     two table rows for the month table heading
 */
function generateRightMonthTable(duration, start, end) {
	var first_row = '<tr>';    //display current yr
	var second_row = '<tr>';   //current current month 
	//iterate to generate the table heading with each date in a div
	var d = new Date(start); 
	var nextMonth = (d.getMonth()+1)%12;    //get next month
	var colspan = 1;
	//iterate to generate the month row and the year row 
	for (var i = 0; i < duration; i++) {
		if (nextMonth == d.getMonth() ) {
			second_row += '<td colspan="' + colspan +'"><div class="block" style="display: inline-block;">' 
											+ d.toDateString().substring(4,7) + '</div></td>';
			first_row += '<td colspan="'+ colspan +'"><div class="block" style="display: inline-block;">' 
										+ '\'' + d.toDateString().substring(13) + '</div></td>';
			nextMonth = (nextMonth+1)%12;   //update nextMonth
			colspan = 1;   //reset colspan
		}
		//update 
		colspan++;
		d.setDate(d.getDate() + 1);
	}
	rows = first_row + '</tr>' + second_row + '</tr>';
	return rows; 	
}

/**
 * Generate the right table in QUARTER format
 * @param {Integer}                   duration              project duration in days 
 * @param {Date Object}           start    expanded start date of the project
 * @param {Date Object}           end      expanded end date of the project
 * @return {String}                     rows     two table rows for the quarter table heading
 */
function generateRightQuarterTable(duration, start, end) {
	var first_row = '<tr>';    //display current yr
	var second_row = '<tr>';   //current current quarter

	//iterate to generate the table heading with each date in a div
	var d = new Date(start); 
	var nextQuarter = Math.floor(d.getMonth()/3 + 1)%4;    //get next quarter (0,1,2,3)
	var colspan = 1;	

	//iterate to generate the month row and the year row 
	for (var i = 0; i < duration; i++) {
		if (nextQuarter == Math.floor(d.getMonth()/3) ) {
			second_row += '<td colspan="' + colspan +'">' 
											+ 'Qtr. ' + nextQuarter+ '</td>';  //buggy
			first_row += '<td colspan="'+ colspan +'">' 
										+ '\'' + d.toDateString().substring(13) + '</td>';
			nextQuarter = (nextQuarter+1)%4;   //update nextMonth
			colspan = 1;   //reset colspan
		}
		//update 
		colspan++;
		d.setDate(d.getDate() + 1);	
	}
	rows = first_row + '</tr>' + second_row + '</tr>';
	return rows; 	
}

/**
 * Add project footer
*/
function addProjectFooter() {
	return '<footer class="row"><p><strong>End of Project</strong></p></footer>';                     
}

/**
 * Load project with input ID 
*/
function loadProject() {
	var project_id = document.getElementsByTagName("INPUT")[0].value;
	var projectID;
	var projectStartDate;   //expanded start date of project 
	var projectEndDate;     //expanded end date of project
	var duration;

	$.getJSON('JSON/project_'+project_id+'.json', function(data) {
		$.each(data, function(key, val) {   //val is project obj
			//remember some important project info for later functions 
			projectID = val.ID;
			projectStartDate = returnNearestSunday(val.startDate);
			projectEndDate = returnNearestSaturday(val.endDate);
			duration = diffDays(projectStartDate, projectEndDate);
			//list project attributes
			$("#wrapper").append(listAttributes(val)); 
			$("#wrapper").append(generateTable(projectID));
			$("#"+projectID+"_TABLE").append(generateRightTableFrame(projectID));
			$("#"+projectID+"_DAY_table").append(generateRightDayTable(duration, projectStartDate, projectEndDate));				
			$("#"+projectID+"_WEEK_table").append(generateRightWeekTable(duration, projectStartDate, projectEndDate));	
			$("#"+projectID+"_MONTH_table").append(generateRightMonthTable(duration, projectStartDate, projectEndDate));	
			$("#"+projectID+"_QUARTER_table").append(generateRightQuarterTable(duration, projectStartDate, projectEndDate));	
		});
	});                

	$.getJSON('JSON/project_'+project_id+'_tasks.json', function(data) {
		$("#" + projectID+"_TABLE").append(generateLeftTable(data, projectID));
		
		var arr = ["DAY_table", "WEEK_table", "MONTH_table", "QUARTER_table"];
		for (i in arr) {
			$("#"+projectID+"_" +arr[i]).append(generateBar (data, arr[i], projectStartDate, projectEndDate));
		}
		$("#wrapper").append(addProjectFooter());
	}); 
}


$(document).ready(function(){
	//document.getElementsByTagName('tr').addEventListener("mouseover", mouseOver);
});

$(function (){
  $('[data-toggle="tooltip"]').tooltip();
});


function mouseOver() {
	document.getElementsByTagName('tr').style.color = "red";
}