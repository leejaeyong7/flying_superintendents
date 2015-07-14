/*
	1. task obj: name, start_date, end_date, progress
	2. server side
	3. calendar table
	4. pop-out
	5. left-panel displaying name, startDate, endDate
	6. right-panel displaying bars mapped by week number
	7. combine two tables next to each other
	8. use pure text to represent progress bar (not-responsive..)

	problems:
	1. tables next to each other
	2. progress bar cannot show up
	3. bar width 
	4. dynamic scaling weeks
*/

/* array to hold tasks objs */
var tasks = new Array();

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
function generateBar (percent) {
	//calculate the length of the completed bar 
	var progress = percent;
	var i = tasks.length - 1;
	var totalLength = diffDays(tasks[i].startDate, tasks[i].endDate);
	var completed = Math.floor(tasks[i].progress * totalLength);
	var unfinished = totalLength - completed;
	
	/* create a tr with div that looks like below:
		<tr><td>
		<div class="progress" width=13%>
		<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
    		60%
  		</div>
  		</div>
  		</tr></td>
  	*/
	var $row = '<tr><td><div class="progress" style="width: ' + totalLength/365 + ';"><div class="progress-bar" role="progressbar" aria-valuenow="'
					+ progress 
					+ ' aria-valuemin="0" aria-valuemax="100" style="width: '
					+ progress +';">' + progress + '</div></div></tr></td>';         
	

	$('.chart').append($row);
}

/* generate gantt chart table row with newly added tasks array elem */
function addTableRow() {
	var i = tasks.length - 1;
	var $row = '<tr><td>'+ i
		   						+'</td><td>'+tasks[i].taskName
		   						+'</td><td>'+tasks[i].startDate
		   						+'</td><td>'+tasks[i].endDate
		   						+'</td></tr>';
			
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
    addTableRow();
    generateBar(progress);
}

/***** delete task *****/
function deleteTask() {

}


/***** weeks scaling *****/
function scaleWeeks() {
	
}

