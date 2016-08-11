switch(getCookie('filter')) {
    case 0:
        $.post('/update_filter_condition_to_active', null, function(tasks) {
            return redrawChangedTaskList(tasks);
        });
        break
    
    case 1:
        $.post('/update_filter_condition_to_finished', null, function(tasks) {
            return redrawChangedTaskList(tasks);
        });
        break

    case 2:
        $.post('/update_filter_condition_to_all', null, function(tasks) {
            return redrawChangedTaskList(tasks);
        });

    default:
        $.post('/update_filter_condition_to_all', null, function(tasks) {
            return redrawChangedTaskList(tasks);
        });
}

reloadTaskCounter();

document.getElementById('addNewTask').focus();

document.getElementById('addNewTask').addEventListener('keyup', function (event) {
    switch (Number(event.keyCode)) {
        case 13:
            var task_definition = this.value;
            this.value = '';
            if (task_definition !== '') {
                var taskPattern = createNewTaskSource(task_definition);
                addNewTaskPatternAndGetIdForTask(taskPattern);
            }
            break;

        case 27:
            this.value = '';
            this.blur();
    }
});

function clearThePage() {
    var taskList = document.getElementById('taskList');
    while (taskList.hasChildNodes()) {
        taskList.removeChild(taskList.firstChild);
    }
}

function redrawChangedTaskList(taskList) {
    clearThePage();
    for (var i = 0; i < taskList.length; i++) {
        drawNewTask(taskList[i]);
    }
}

function createNewTaskSource(task_definition) {
    return {finished: 0, task_definition: task_definition};
}

function drawNewTask(taskPattern) {
    var checkbox = createCheckBox(taskPattern);
    var p = createTaskDefinition(taskPattern);
    var taskChangeField = createInputField(taskPattern);
    var del = createDeleteButton(taskPattern);
    createAndAppendOneTaskBody(checkbox, p, taskChangeField, del, taskPattern);
}

function createCheckBox(taskPattern) {
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'main-oneTask-checkbox_todo';
    checkbox.id = 'checkbox' + taskPattern.task_id;
    checkbox.checked = parseInt(taskPattern.finished) ? true : false;
    checkbox.addEventListener('click', function () {
        changeFinishedStatusOfOneTask(this);
    });
    return checkbox;
}

function createTaskDefinition(taskPattern) {
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(taskPattern.task_definition));
    p.style.textDecoration = parseInt(taskPattern.finished) ? 'line-through' : 'none';
    p.className = 'main-oneTask-p_todo';
    p.id = 'p' + taskPattern.task_id;
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
    input.type = 'task_definition';
    input.className = 'main-oneTask-hidden_todo';
    input.id = 'input' + taskPattern.task_id;
    input.style.display = 'none';
    input.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
            case 13:
                updateTaskDefinition(this);
                this.style.display = 'none';
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
    del.id = 'del' + taskPattern.task_id;
    del.style.visibility = 'hidden';
    del.addEventListener('click', function() {
        removeTask(this.parentElement)
    });
    return del;
}

function createAndAppendOneTaskBody(checkbox, p, taskChangeField, del, taskPattern) {
    var div = document.createElement('div');
    div.id = taskPattern.task_id;
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

function removeTask(taskElem) {
    var data = {
        task_id: parseInt(taskElem.id)
    };

    $.post('/remove_one_task', data, function(tasks) {
        redrawChangedTaskList(tasks);
        reloadTaskCounter();
    });
}

function removeAllFinishedTasks() {
    $.post('/remove_all_finished_tasks', null, function(tasks) {
        redrawChangedTaskList(tasks);
    });
}

(function addListenersToClearAllFinishedButton() {
    var clearAllFinishedButton = document.getElementsByClassName('footer-clearCompleted_todo')[0];

    clearAllFinishedButton.addEventListener('mouseover', function () {
        this.style.textDecoration = 'underline';
        this.style.cursor = 'pointer';
    });

    clearAllFinishedButton.addEventListener('mouseout', function () {
        this.style.textDecoration = 'none';
    });

    clearAllFinishedButton.addEventListener('click', function(tasks) {
        removeAllFinishedTasks();
    });
})();


//footer-filter-active_todo
document.getElementsByClassName('footer-filter-active_todo')[0].addEventListener('click', function () {
    $.post('/update_filter_condition_to_active', null, function(tasks) {
        redrawChangedTaskList(tasks);
    });
});

//footer-filter-all_todo
document.getElementsByClassName('footer-filter-all_todo')[0].addEventListener('click', function () {
    $.post('/update_filter_condition_to_all', null, function(tasks) {
        redrawChangedTaskList(tasks);
    });
});

//footer-filter-completed_todo
document.getElementsByClassName('footer-filter-completed_todo')[0].addEventListener('click', function () {
    $.post('/update_filter_condition_to_finished', null, function(tasks) {
        redrawChangedTaskList(tasks);
    });
});

//header-mark_todo
document.getElementsByClassName('header-mark_todo')[0].addEventListener('click', function () {
   var status = this.checked ? 1 : 0;
   var data = {
        status: status
   };

   $.post('/reverse_finished_status_off_all', data, function(tasks) {
        redrawChangedTaskList(tasks);
        reloadTaskCounter();
   });
});

function addNewTaskPatternAndGetIdForTask(taskPattern) {
    var data = {
        finished: taskPattern.finished,
        task_definition: taskPattern.task_definition
    };
    
    $.post('/add_new_task_and_get_id', data, function(tasks) {
        redrawChangedTaskList(tasks);
        reloadTaskCounter();
    });
}

function changeFinishedStatusOfOneTask(checkbox) {
    var status = checkbox.checked ? 1 : 0;
    var data = {
        task_id: checkbox.parentElement.id,
        finished: status
    };

    $.post('/update_finished_status_of_one_task', data, function(tasks) {
        redrawChangedTaskList(tasks);
        reloadTaskCounter();
    });
}

function updateTaskDefinition(inputField) {
    var data = {
        task_id: inputField.id.substring(5),
        task_definition: inputField.value
    };

    $.post('/update_task_definition', data, function(tasks) {
        redrawChangedTaskList(tasks)
    });
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function reloadTaskCounter() {
    document.getElementById('taskCounter').innerHTML = 'remain ' + getCookie('count');
}