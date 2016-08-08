var taskArchive = [];
var userId = 1;
var url = "http://localhost:3000/";
var filterCondition;

$.post(url, {'hi': 'helloworld'});

apllyChangesAndRedrawThePage();

document.getElementById('addNewTask').addEventListener('keyup', function (event) {
    switch (Number(event.keyCode)) {
        case 13:
            var taskDefinition = this.value;
            this.value = '';
            if (taskDefinition !== '') {
                var taskPattern = createNewTaskSource(taskDefinition);
                taskPattern.id = addNewTaskPatternAndGetIdForTask(taskPattern);
                apllyChangesAndRedrawThePage();
            }
            break;

        case 27:
            this.value = '';
            this.blur();
    }
});

function clearPageTaskList() {
    var taskList = document.getElementById('taskList');
    while (taskList.hasChildNodes()) {
        taskList.removeChild(taskList.firstChild);
    }
}

function redrawTasksFromArchive() {
    clearPageTaskList();

    for (var i = 1; i < taskArchive.length; i++) {
        drawNewTask(taskArchive[i]);
    }
}

function createNewTaskSource(taskDefinition) {
    var taskPattern = {userId: userId, finished: 0, taskDefinition: taskDefinition};
    return taskPattern;
}

function drawNewTask(taskPattern) {
    var checkbox = createCheckBox(taskPattern);
    var p = createTaskDefinition(taskPattern);
    var taskChangeField = createInputField(taskPattern);
    var del = createDeleteButton(taskPattern);
    createAndAppendOneTaskBody(checkbox, p, taskChangeField, del, taskPattern);
    reloadTaskCounter();
}

function createCheckBox(taskPattern) {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'main-oneTask-checkbox_todo';
    checkbox.id = 'checkbox' + taskPattern.id;
    checkbox.checked = taskPattern.finished ? true : false;
    checkbox.addEventListener('click', function () {
        changeFinishedStatus(this);
        apllyChangesAndRedrawThePage();
    });
    return checkbox;
}

function createTaskDefinition(taskPattern) {
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(taskPattern.taskDefinition));
    p.style.textDecoration = (taskPattern.finished) ? 'line-through' : 'none';
    p.className = 'main-oneTask-p_todo';
    p.id = 'p' + taskPattern.id;
    p.addEventListener('dblclick', function () {
        this.style.display = 'none';
        var inputField = document.getElementById('input' + this.id.substring(1));
        inputField.style.display = 'block';
        inputField.focus();
        inputField.value = this.innerHTML;
    });
    return p;
}

function createInputField(taskPattern) {
    var input = document.createElement('input');
    input.type = 'taskDefinition';
    input.className = 'main-oneTask-hidden_todo';
    input.id = 'input' + taskPattern.id;
    input.style.display = 'none';
    input.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
            case 13:
                changeTaskDefinition(this);
                this.style.display = 'none';
                apllyChangesAndRedrawThePage();
                break;

            case 27:
                this.style.display = 'none';
                document.getElementById('p' + this.id.substring(5)).style.display = 'block';
        }
    });

    input.addEventListener('blur', function() {
        document.getElementById('p' + this.id.substring(5)).style.display = 'block';
        this.style.display = 'none';
    });
    return input;
}

function createDeleteButton(taskPattern) {
    var del = document.createElement('img');
    del.src = 'img/del.png';
    del.className = 'main-oneTask-delete_todo';
    del.id = 'del' + taskPattern.id;
    del.style.visibility = 'hidden';
    del.addEventListener('click', function () {
        removeTask(this.parentElement);
    });
    return del;
}

function createAndAppendOneTaskBody(checkbox, p, taskChangeField, del, taskPattern) {
    var div = document.createElement('div');
    div.id = taskPattern.id;
    div.className = 'main-oneTask_todo';
    div.appendChild(checkbox);
    div.appendChild(p);
    div.appendChild(taskChangeField);
    div.appendChild(del);
    div.addEventListener('mouseover', function () {
        this.style.backgroundColor = '#e0cae9';
        var del = document.getElementById('del' + this.id);
        del.style.visibility = 'visible';
    });
    div.addEventListener('mouseout', function () {
        var del = document.getElementById('del' + this.id);
        del.style.visibility = 'hidden';
        this.style.backgroundColor = '#b9d2ff';
    });
    document.getElementById('taskList').appendChild(div);
}
function getIncrementedId() {
    id++;
    return id;
}

function reloadTaskCounter() {
    var count = 0;
    for (var i = 1; i < taskArchive.length; i++) {
        count += (!taskArchive[i].finished) ? 1 : 0;
    }
    document.getElementById('taskCounter').innerHTML = 'Всего: ' + count;
}

function removeTask(taskElem) {
    var data = {
        taskId: taskElem.id,
        action: 'remove_one_task'
    };
    $.post(url, data, apllyChangesAndRedrawThePage());
}

function getChangesFromServer() {

    filterCondition = getFilterConditionFromServer();

    var data = {
        userId: userId,
        action: 'get_all_tasks',
        filterCondition: filterCondition
    };
    
    $.post(url, data, function(tasks) {
        taskArchive = tasks;
    });
}

function apllyChangesAndRedrawThePage() {
    getChangesFromServer();
    redrawTasksFromArchive();
    reloadTaskCounter();
}

function removeAllFinishedTasks() {
    var data = {
        userId: userId,
        action: 'remove_all_finished_tasks'
    };
    $.post(url, data, apllyChangesAndRedrawThePage());
}

function addListenersToClearAllFinishedButton() {
    var clearAllFinishedButton = document.getElementsByClassName('footer-clearCompleted_todo')[0];
    clearAllFinishedButton.addEventListener('mouseover', function () {
        this.style.textDecoration = 'underline';
        this.style.cursor = 'pointer';
    });

    clearAllFinishedButton.addEventListener('mouseout', function () {
        this.style.textDecoration = 'none';
    });

    clearAllFinishedButton.addEventListener('click', function () {
        removeAllFinishedTasks();
    });
}

addListenersToClearAllFinishedButton();

//footer-filter-active_todo
document.getElementsByClassName('footer-filter-active_todo')[0].addEventListener('click', function () {
    var data = {
        userId: userId,
        action: 'update_filter-condition_to_active'
    };
    $.post(url, data, apllyChangesAndRedrawThePage());
});

//footer-filter-all_todo
document.getElementsByClassName('footer-filter-all_todo')[0].addEventListener('click', function () {
   var data = {
        userId: userId,
        action: 'update_filter-condition_to_all'
    };
    $.post(url, data, apllyChangesAndRedrawThePage());
});

//footer-filter-completed_todo
document.getElementsByClassName('footer-filter-completed_todo')[0].addEventListener('click', function () {
    var data = {
        userId: userId,
        action: 'update_filter-condition_to_finished'
    };
    $.post(url, data, apllyChangesAndRedrawThePage());
});

//header-mark_todo
document.getElementsByClassName('header-mark_todo')[0].addEventListener('click', function () {
   var status = this.checked ? 'all_finished' : 'all_active';
   var data = {
        userId: userId,
        action: 'update_all_tasks_finished_status',
        status: status
   };
   $.post(url, data, apllyChangesAndRedrawThePage());
});

function addNewTaskPatternAndGetIdForTask(taskPattern) {
    var data = {
        userId: userId,
        finished: taskPattern.finished,
        taskDefinition: taskPattern.taskDefinition,
    };
    
    $.post(url, data, function(taskId) {
        return taskId;
    });
}

function getFilterConditionFromServer() {
    var data = {
        userId: userId,
        action: 'get_filter_condition'
    };
    
    $.post(url, data, function(cond) {
         return cond;
    });
}

fuction changeFinishedStatus(checkbox) {
    var status = checkbox.checked;
    var data = {
        taskId: checkbox.id.substring(8),
        finished: checkbox.checked ? 1 : 0,
        action: 'update_finished_status_of_one_task'
    };
    $.post(url, data);
}

function changeTaskDefinition(inputField) {
    var data = {
        taskId: inputField.id.substring(5),
        taskDefinition: inputField.value,
        action: 'change_task_definition'
    };
    $.post(url, data);
}