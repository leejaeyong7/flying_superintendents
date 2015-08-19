	/*	
		tasks
		1. two table sync with hovering bar 
		2. project-schedule-task-subtask structute 
	*/



	/* global array to hold tasks objs */
	var tasks = new Array();
	/* var to hold current number of weeks */
	var weeks = 7; 
	/* global array to hold projects objs */
	var projects = new Array();
	/* startWeek and endWeek, will getData from project later */
	var start = "2015-05-11";
	var end = "2015-06-16";
	/* use temp static weekDiv now */
	var weekDiv = '4%';


	/* task object ctor*/
	/* Complete Attributes: 
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
	function Task (number, taskName, startDate, endDate, progress) {
		this.number = number;  
		this.taskName = taskName; 
		this.startDate = startDate;
		this.endDate = endDate;
		this.progress = progress;
		this.details = "Task Details" + "\n" + 
			           "Name: Lorem ipsum dolor sit amet" + "\n" + 
			           "Requestor: consectetur adipiscing elit" + "\n" + 
			           "PersonCommitted: Phasellus suscipit"+ "\n" + 
			           "ResponsibleSubs: enim eu feugiat vulputate";
	}

	/* project object ctor  (simplified version)*/
	/*
	Attributes: ?
	name
	userID
	projectAddress
	projectFaxNumber
	projectPhoneNumber
	responsibleIndividual
	LinkToProjectInfor
	*/
	function Project (ID, projectName, tasks) {
		/* solve problem of retriving data from db later */
		this.ID = ID;
		this.projectName = projectName;
		this.tasks = tasks;   // should be an array of task objs 
		//temp mockup details
		this.datails = "name: taskCategory1" + "\n" + 
			            "userID: jdoe123" + "\n" + 
			            "projectAddress: 205 N. Mathews Ave., MC-250 Urbana, IL 61801" + "\n" + 
			            "projectFaxNumber: (217) 300-5226" + "\n" + 
			            "projectPhoneNumber: (217) 300-5226" + "\n" + 
			            "responsibleIndividual: Raamac Doe" + "\n" + 
			            "LinkToProjectInfor: http://raamac.cee.illinois.edu/";
		//this.startDate = ""	       
	}


	/* 
		don't know if there's a built-in diffDay function 
		helper function for generateBar function 
	*/
	function diffDays(date1, date2)
	{
	    var one_day=1000*60*60*24;
	    /*
	    var date_1 = new Date(date1);
	    var date_2 = new Date(date2);
		*/
	    // Convert both dates to milliseconds
	    var date1_ms = date1.getTime();
	    var date2_ms = date2.getTime();

	    // Calculate the difference in milliseconds
	    var difference_ms = date2_ms - date1_ms;

	    // Convert back to days and return
	    var diffDays =  Math.round(difference_ms/one_day); 
	    return diffDays;
	}

	/***** generate the progress bar for the gantt chart using bootstrap built-in feature *****/
	function generateBar (task) {
		//calculate the length of the completed bar 
		var days = diffDays(task.startDate, task.endDate);
		var barLength = Math.floor(days/(weeks*7)*100);
		barLength += '%';

		//current task progress in percent
		var progressLength = task.progress + '%';
		
		/* create a td with div that looks like below:
			<div class="progress" width=13%>
			<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
	    		60%
	  		</div>
	  		</div>
	  	*/
		var $bar = '<div class="progress" style="display: inline-block; width: ' + barLength + ';"><div class="progress-bar" role="progressbar" aria-valuenow="'
						+ task.progress 
						+ '" aria-valuemin="0" aria-valuemax="100" style="width: '
						+ progressLength +';">' + progressLength + '</div></div>';         
		
		//calculate position of the bar
		//var weekDiv = scaleWeeks();    //get the div width of each week number 
		var divsBeforeBar = diffDays(start, task.startDate) ;     //cannot be < 0 

		var $completeBar = '';

		for (var i = 1; i <= divsBeforeBar; i++) {
			$completeBar += '<div style="display: inline-block; width: ' + weekDiv + '">' + " " + '</div>';
			console.log(weekDiv); 
		};
		$completeBar += $bar;

		return $completeBar;
	}

	/* generate gantt chart table row with newly added tasks array elem */
	function addTableRow(task) {
		//<button type="button" class="btn btn-default" data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom">Tooltip on bottom</button>	
		var $row = '<tr  data-toggle="tooltip" data-placement="bottom" title="' 
			+ task.details + '"><td>'
			+ task.number
				+'</td><td>'+task.taskName
				+'</td><td>'+task.startDate
				+'</td><td>'+task.endDate
				+'</td><td><p><a href="#' 
				+ task.number + 
				'" data-toggle="modal" class="btn btn-primary">expand</a></p></td>'
			+ '<td>' + generateBar(task) + '</td>'
			+ '</tr>';
		$('.table').append($row);
	}

	/***** create modal to show task details *****/
	function generateTaskDetailsModal(r) {
		var $modal = '<div id="' + r.ID + '" class="modal fade" tabindex="-1">'
	       				+'<div class="modal-dialog">' 
	       				+'<div class="modal-content">' 
	       				+	'<div class="modal-header">' 
	       				+		'<button type="button" class="close glyphicon glyphicon-remove" data-dismiss="modal"></button>'
	       				+		'<h3 class="modal-title">Task Details</h3>' 
	       				+	'</div>' 
	       				+'<div class="modal-body">'
	       				+'<p>' + r.detail
		       			+'</p>'
		       			+'</div>'
		   			+'<div class="modal-footer">'
				          		+'<button class="btn btn-primary" data-dismiss="modal">Close</button>'
				           +'</div>'
		       		+'</div>' 
		       		+'</div>' 
		       	+'</div>';
		$('#wrapper').append($modal);
	}



	/****** add task obj to the tasks array and generate updated table ******/
	/* no use for now */
	function addTask() {
		var name = document.getElementById("taskName").value;
		var startDate = document.getElementById("startDate").value;
		var endDate = document.getElementById("endDate").value;
		var progress = document.getElementById("progress").value;
	    //document.getElementById("result").innerHTML = [name, startDate, endDate, progress];
	    var task = new Task(tasks.length, name, startDate, endDate, progress);
	    tasks.push(task);
	    addTableRow(task);
	    generateTaskDetailsModal(task);
	}

	/***** weeks scaling once the reset button is clicked *****/
	function generateCalendar() {
		/*
		var start = document.getElementById("startWeek").value;
		var end = document.getElementById("endWeek").value;
		*/
		/* prev work..
		var days = diffDays(start, end);
		weeks = Math.floor(days/7);
		var percent = Math.floor(1/weeks * 100);
		
		if (percent == 1) {
			alert("week scale is too large");
			return;
		}
		
		percent += '%';

		var $row = '';
		for (var i = 1; i <= weeks; i++) {
			//create div like: <div style="width: 20%"> i <div>
			$row += '<div style="display: inline-block; width: ' + percent + ';">' + i + '</div>';
		}
		document.getElementById("weeks_number").innerHTML = $row;	
		return percent;
		*/
		var days = diffDays(start, end);
		var $row = '';
		var currDate = new Date(start);
		//document.getElementById("table_row_with_heads").style.width = 30% + days * weekDiv;  	
		for (var i = 0; i < days; i++) {
			//create div for each date
			$row += '<div style="display: inline-block; width: ' + weekDiv + ';">' + i + '</div>';   //currDate.toDateString()
			currDate.setDate(currDate.getDate() + 1);
		};
		document.getElementById("weeks_number").innerHTML = $row;	
	}




	/***********************************************************************************************************************************************************************/

	//get tasks info from json & create rows for left table
	function generateLeftTable() {
		//request.open('GET', 'tasks.json');
		$.getJSON('tasks.json', function(data) {
			var output = '';
			$.each(data, function(key, val) {
				output += '<tr data-toggle="tooltip" data-placement="bottom" title="' + val.detail + '">';
				output += '<td>'+ val.ID +'</td>';
				output += '<td>'+ val.name +'</td>';
				output += '<td>'+ val.startDate +'</td>';
				output += '<td>'+ val.endDate +'</td>';
				generateTaskDetailsModal(val);
				output += '<td><p><a href="#' + val.ID + '" data-toggle="modal" class="btn btn-primary">expand</a></p></td>';
				output += '</tr>';
			});
		$('#left_table').append(output);
		}); 
	}

	/*
		//calculate the length of the completed bar 
		var days = diffDays(task.startDate, task.endDate);
		var barLength = Math.floor(days/(weeks*7)*100);
		barLength += '%';

		//current task progress in percent
		var progressLength = task.progress + '%';
		
		 create a td with div that looks like below:
			<div class="progress" width=13%>
			<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
	    		60%
	  		</div>
	  		</div>
	  	
		var $bar = '<div class="progress" style="display: inline-block; width: ' + barLength + ';"><div class="progress-bar" role="progressbar" aria-valuenow="'
						+ task.progress 
						+ '" aria-valuemin="0" aria-valuemax="100" style="width: '
						+ progressLength +';">' + progressLength + '</div></div>';         
		
		//calculate position of the bar
		//var weekDiv = scaleWeeks();    //get the div width of each week number 
		var divsBeforeBar = diffDays(start, task.startDate) ;     //cannot be < 0 

		var $completeBar = '';

		for (var i = 1; i <= divsBeforeBar; i++) {
			$completeBar += '<div style="display: inline-block; width: ' + weekDiv + '">' + " " + '</div>';
			console.log(weekDiv); 
		};
		$completeBar += $bar;

		return $completeBar;
	*/

	//get a string date formated like "2015-01-01" and return the nearest sunday obj 
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

	function generateRightDayTable() {
		var first_row = '<tr>';     //display current week 
		var second_row = '<tr>';   //display current day
		var projectStartDate;   //expanded start date of project 
		var projectEndDate;     //expanded end date of project
		//generate project dates heading 
		$.getJSON('project.json', function(data) {
			$.each(data, function(key, val) {	//only one project so far
				var expanded_start = returnNearestSunday(val.startDate);
				projectStartDate = returnNearestSunday(val.startDate);   
				projectEndDate = returnNearestSaturday(val.endDate);
				var expanded_end = returnNearestSaturday(val.endDate);
				var project_days = diffDays(expanded_start, expanded_end);
				var project_weeks = project_days/7;   //should be integer
				//iterate to generate the table heading with each date in a div
				var d = expanded_start; 
				for (var i = 0; i < project_days; i++) {
					second_row += '<td><div class="block" style="display: inline-block;"> ' + d.getDate() + ' </div></td>'; 
					d.setDate(d.getDate() + 1);  //increment by 1
				}
				d = returnNearestSunday(val.startDate);   //reset date 
				for (var i = 0; i < project_weeks; i++) {
					//returns the format of 1/01 - 1/08/15
					first_row += '<td colspan="7"><div style="display: inline-block;"> ' + (d.getMonth()+1) + '/' + d.getDate() + ' - ';
					d.setDate(d.getDate() + 7);  //increment by 7
					first_row += (d.getMonth()+1)  + '/' + d.getDate() +  '/' + (d.getFullYear()-2000) + '</div></td>';
				}
			});
			first_row += '</tr>';
			second_row += '</tr>';
			$('#day_table').append(first_row, second_row); 
		});

		//parse tasks.json and generate progress bar 
		$.getJSON('tasks.json', function(data) {
			$.each(data, function(key, val) {
				//calculate the length (number of 'td's) of the completed bar 
				var total = diffDays(new Date(val.startDate), new Date(val.endDate));
				var days_before_start = diffDays(projectStartDate, new Date(val.startDate));
				var days_after_end = diffDays(new Date(val.endDate), projectEndDate);
				var bar = '<tr><td colspan=' + days_before_start + '> ' + '</td>';
				bar += '<td colspan="' + total +'"><div class="progress" style="width:' + total + 'em' +'"><div class="progress-bar" role="progressbar" aria-valuenow="'
								+ val.progress
								+ '" aria-valuemin="0" aria-valuemax="100" style="width:' + val.progress + '%' +'">' + val.progress + '%' +  '</div></div></td>';      
				bar += '<td colspan="'+ days_after_end +'"></td></tr>';
				$('#day_table').append(bar);
			});
		}); 

	}

	function generateRightWeekTable() {

		var first_row = '<tr>';    //display current yr
		var second_row = '<tr>';   //current current week 
		var projectStartDate;   //expanded start date of project 
		var projectEndDate;     //expanded end date of project
		
		//generate project dates heading 
		$.getJSON('project.json', function(data) {
			$.each(data, function(key, val) {	//only one project so far
				var expanded_start = returnNearestSunday(val.startDate);			
				var expanded_end = returnNearestSaturday(val.endDate); 

				projectStartDate = returnNearestSunday(val.startDate);   
				projectEndDate = returnNearestSaturday(val.endDate);

				var project_days = diffDays(expanded_start, expanded_end);
				var project_weeks = project_days/7;   //should be integer

				//iterate to generate the table heading with each date in a div
				var d = expanded_start; 
				for (var i = 0; i < project_weeks; i++) {
					first_row += '<td colspan="7"><div class="block" style="display: inline-block;"> ' 
												+ '\'' + d.toDateString().substring(13) + ' </div></td>'; 
					d.setDate(d.getDate() + 7);  //increment by 7
				}
				d = returnNearestSunday(val.startDate);   //reset date 
				for (var i = 0; i < project_weeks; i++) {
					//returns the start date of the current week
					second_row += '<td colspan="7"><div style="display: inline-block;"> ' + (d.getMonth()+1) + '/' + d.getDate() + '</div></td>';
					d.setDate(d.getDate() + 7);  //increment by 7
				}
			});
			first_row += '</tr>';
			second_row += '</tr>';
			$('#week_table').append(first_row, second_row); 
		});

		//parse tasks.json and generate progress bar 
		$.getJSON('tasks.json', function(data) {
			$.each(data, function(key, val) {
				//calculate the length (number of 'td's) of the completed bar 
				var total = diffDays(new Date(val.startDate), new Date(val.endDate));
				var days_before_start = diffDays(projectStartDate, new Date(val.startDate));
				var days_after_end = diffDays(new Date(val.endDate), projectEndDate);
				/*
				create a td with div that looks like below:
				<td>
					<div class="progress" style="width:...">
					<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
			    		60%
			  		</div>
			  		</div>
		  		</td>
			  	*/
				var bar = '<tr><td colspan=' + days_before_start + '> ' + '</td>';
				//there's a problem with the width 
				bar += '<td colspan="' + total +'"><div class="progress" style="width:' + $('#week_table tr td').width() * total +'"><div class="progress-bar" role="progressbar" aria-valuenow="'
								+ val.progress
								+ '" aria-valuemin="0" aria-valuemax="100" style="width:' + val.progress + '%' +'">' + val.progress + '%' +  '</div></div></td>';      
				bar += '<td colspan="'+ days_after_end +'"></td></tr>';
				$('#week_table').append(bar);
			});
		}); 

	}

	function generateRightMonthTable() {

		var first_row = '<tr>';    //display current yr
		var second_row = '<tr>';   //current current month 
		var projectStartDate;   //expanded start date of project 
		var projectEndDate;     //expanded end date of project
		
		//generate project dates heading 
		$.getJSON('project.json', function(data) {
			$.each(data, function(key, val) {	//only one project so far
				var expanded_start = returnNearestSunday(val.startDate);			
				var expanded_end = returnNearestSaturday(val.endDate); 

				projectStartDate = returnNearestSunday(val.startDate);   
				projectEndDate = returnNearestSaturday(val.endDate);

				var project_days = diffDays(expanded_start, expanded_end);

				//iterate to generate the table heading with each date in a div
				var d = expanded_start; 
				var nextMonth = (d.getMonth()+1)%12;    //get next month
				var colspan = 1;

				//iterate to generate the month row and the year row 
				for (var i = 0; i < project_days; i++) {
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
			});
			first_row += '</tr>';
			second_row += '</tr>'; 
			$('#month_table').append(first_row, second_row); 	
		});

		//parse tasks.json and generate progress bar 
		$.getJSON('tasks.json', function(data) {
			$.each(data, function(key, val) {
				//calculate the length (number of 'td's) of the completed bar 
				var total = diffDays(new Date(val.startDate), new Date(val.endDate));
				var days_before_start = diffDays(projectStartDate, new Date(val.startDate));
				var days_after_end = diffDays(new Date(val.endDate), projectEndDate);
				/*
				create a td with div that looks like below:
				<td>
					<div class="progress" style="width:...">
					<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
			    		60%
			  		</div>
			  		</div>
		  		</td>
			  	*/
				var bar = '<tr><td colspan=' + days_before_start + '> ' + '</td>';
				bar += '<td colspan="' + total +'"><div class="progress" style="width:' + $('#week_table tr td').width() * total +'"><div class="progress-bar" role="progressbar" aria-valuenow="'
								+ val.progress
								+ '" aria-valuemin="0" aria-valuemax="100" style="width:' + val.progress + '%' +'">' + val.progress + '%' +  '</div></div></td>';      
				bar += '<td colspan="'+ days_after_end +'"></td></tr>'; 
				$('#month_table').append(bar);
			});
		}); 

	}

	function generateRightQuarterTable() {

		var first_row = '<tr>';    //display current yr
		var second_row = '<tr>';   //current current quarter
		var projectStartDate;   //expanded start date of project 
		var projectEndDate;     //expanded end date of project
		
		//generate project dates heading 
		$.getJSON('project.json', function(data) {
			$.each(data, function(key, val) {	//only one project so far
				var expanded_start = returnNearestSunday(val.startDate);			
				var expanded_end = returnNearestSaturday(val.endDate); 

				projectStartDate = returnNearestSunday(val.startDate);   
				projectEndDate = returnNearestSaturday(val.endDate);

				var project_days = diffDays(expanded_start, expanded_end);

				//iterate to generate the table heading with each date in a div
				var d = expanded_start; 
				var nextQuarter = Math.floor(d.getMonth()/3 + 1)%4;    //get next quarter (0,1,2,3)
				var colspan = 1;	

				//iterate to generate the month row and the year row 
				for (var i = 0; i < project_days; i++) {
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
			});
			first_row += '</tr>';
			second_row += '</tr>'; 
			$('#quarter_table').append(first_row, second_row); 	
		});

		//parse tasks.json and generate progress bar 
		$.getJSON('tasks.json', function(data) {
			$.each(data, function(key, val) {
				//calculate the length (number of 'td's) of the completed bar 
				var total = diffDays(new Date(val.startDate), new Date(val.endDate));
				var days_before_start = diffDays(projectStartDate, new Date(val.startDate));
				var days_after_end = diffDays(new Date(val.endDate), projectEndDate);
				/*
				create a td with div that looks like below:
				<td>
					<div class="progress" style="width:...">
					<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
			    		60%
			  		</div>
			  		</div>
		  		</td>
			  	*/
				var bar = '<tr><td colspan=' + days_before_start + '> ' + '</td>';
				bar += '<td colspan="' + total +'"><div class="progress" style="width:' + $('#week_table tr td').width() * total +'"><div class="progress-bar" role="progressbar" aria-valuenow="'
								+ val.progress
								+ '" aria-valuemin="0" aria-valuemax="100" style="width:' + val.progress + '%' +'">' + val.progress + '%' +  '</div></div></td>';      
				bar += '<td colspan="'+ days_after_end +'"></td></tr>'; 
				$('#quarter_table').append(bar);
			});
		}); 

	}

	/** retrieve project data from the db and create a project obj **/
	/* load one project at a time */
	function loadProject() {
		/*
		//use temp project stubs here 
		var project = project1;
		for (var i = 0; i <= project.tasks.length - 1; i++) { 
			addTableRow(project.tasks[i]);
			generateTaskDetailsModal(project.tasks[i]);	
		};
		*/
		generateLeftTable();
		generateRightDayTable();
		generateRightWeekTable();
		generateRightMonthTable();
		generateRightQuarterTable();
	}




	$(document).ready(function(){

	});

	$(function () {
	  $('[data-toggle="tooltip"]').tooltip();
	});
