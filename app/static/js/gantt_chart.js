/*	
	server side
	load multiple projects 

	
	tasks
	1. modify table day display in different nav bar (day, week, year) using tab-content
	2. bar shows each date vertically
	3. a vertical red bar indicating today 
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

    var date_1 = new Date(date1);
    var date_2 = new Date(date2);

    // Convert both dates to milliseconds
    var date1_ms = date_1.getTime();
    var date2_ms = date_2.getTime();

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
		<td>
		<div class="progress" width=13%>
		<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
    		60%
  		</div>
  		</div>
  		</td>
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
	var $modal = '<div id="' + r.number + '" class="modal fade" tabindex="-1">'
       				+'<div class="modal-dialog">' 
       				+'<div class="modal-content">' 
       				+	'<div class="modal-header">' 
       				+		'<button type="button" class="close glyphicon glyphicon-remove" data-dismiss="modal"></button>'
       				+		'<h3 class="modal-title">Task Details</h3>' 
       				+	'</div>' 
       				+'<div class="modal-body">'
       				+'<p>' + r.details 
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

/*********************************/
/* below are some mockup objs */
/******************************************************************/
var task1 = new Task(1, "task1",  "2015-05-24", "2015-09-12", 34);
var task2 = new Task(2, "task2",  "2015-02-27", "2015-07-07", 89);
var task3 = new Task(3, "task3",  "2015-07-24", "2015-10-13", 77);
var tasks1 = new Array(task1, task2, task3);
var project1 = new Project(123, "taskCategory1", tasks1);
var tasks2 = new Array(task1, task2, task3);
var project2 = new Project(456, "taskCategory2", tasks2);
/*******************************************************************/

/** retrieve project data from the db and create a project obj **/
/* load one project at a time */
function loadProject() {
	//use temp project stubs here 
	var project = project1;
	for (var i = 0; i <= project.tasks.length - 1; i++) { 
		addTableRow(project.tasks[i]);
		generateTaskDetailsModal(project.tasks[i]);	
	};

}









$(document).ready(function(){
    generateCalendar();
});

$(function () {
  $('[data-toggle="tooltip"]').tooltip();
})
