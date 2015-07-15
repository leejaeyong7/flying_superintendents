/*

	2. server side
	3. calendar table
	4. pop-out (modal?)
	

	7/14 Tasks
	2. data binding (angularJS?
	3. delete (buggily finished), modify
*/

/* global array to hold tasks objs */
var tasks = new Array();
/* var to hold current number of weeks */
var weeks = 7; 


/* task object ctor*/
function Task (number, taskName, startDate, endDate, progress) {
	this.number = tasks.length + 1;
	this.taskName = taskName;
	this.startDate = startDate;
	this.endDate = endDate;
	this.progress = progress;
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
					+ ' aria-valuemin="0" aria-valuemax="100" style="width: '
					+ progressLength +';">' + progressLength + '</div></div>';         
	
	//calculate position of the bar
	var weekDiv = scaleWeeks();    //get the div width of each week number 
	var divsBeforeBar = diffDays(document.getElementById("startWeek").value, task.startDate) / 7;     //cannot be < 0 

	var $completeBar = '';

	for (var i = 1; i <= divsBeforeBar; i++) {
		$completeBar += '<div style="display: inline-block; width: ' + weekDiv + '">' + " " + '</div>';
	};
	$completeBar += $bar;

	return $completeBar;
}

/* generate gantt chart table row with newly added tasks array elem */
function addTableRow(task) {
	var $row = '<tr><td>'+ task.number
		   						+'</td><td>'+task.taskName
		   						+'</td><td>'+task.startDate
		   						+'</td><td>'+task.endDate
		   						+'</td><td><button class="btn btn-default" onclick="deleteTask(this)">delete</button></td>'
								+ '<td>' + generateBar(task) + '</td>'
								+ '</tr>';
	$('.table').append($row);
}


/****** add task obj to the tasks array and generate updated table ******/
function addTask() {
	var name = document.getElementById("taskName").value;
	var startDate = document.getElementById("startDate").value;
	var endDate = document.getElementById("endDate").value;
	var progress = document.getElementById("progress").value;
    //document.getElementById("result").innerHTML = [name, startDate, endDate, progress];
    var task = new Task(tasks.length, name, startDate, endDate, progress);
    tasks.push(task);
    addTableRow(task);
}

/***** delete task *****/
function deleteTask(r) {
	var rowNum = r.parentNode.parentNode.rowIndex;         //get current row number
	document.getElementById("gantt_chart_table").deleteRow(rowNum);    //delete current row of chart
	tasks.splice(rowNum, 1);   //buggy
}


/***** weeks scaling once the reset button is clicked *****/
function scaleWeeks() {
	var start = document.getElementById("startWeek").value;
	var end = document.getElementById("endWeek").value;
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
}

function changeID(r) {
	
}



$(document).ready(function(){
    scaleWeeks();
});