if (typeof(Storage) == 'undefined') {
    alert('Your browser doesn\'t support Local Storage! Errors may occur!');
}

var id = 0;
var taskArchive = [];

if (localStorage.getItem('taskArchive')) {
    taskArchive = JSON.parse(localStorage.getItem('taskArchive'));
    console.log('taskArchive', taskArchive);
    for (var i = 1; i < taskArchive.length; i++) {
        taskArchive[i].id = 'task' + i;
        id++;
    }
    redrawTasksFromArchive();
}

document.getElementById('addNewTask').addEventListener('keyup', function (event) {
    switch (Number(event.keyCode)) {
        case 13:
            var taskDefinition = this.value;
            this.value = '';
            if (taskDefinition !== '') {
                var taskPattern = createNewTaskSource(taskDefinition);
                taskArchive.push(taskPattern);
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

    switch (taskArchive[0]) {
        case 'all':

            for (var i = 1; i < taskArchive.length; i++) {
                drawNewTask(taskArchive[i]);
            }
            break;

        case 'active':

            for (var i = 1; i < taskArchive.length; i++) {
                if (!taskArchive[i].finished) {
                    drawNewTask(taskArchive[i]);
                }
            }
            break;

        case 'finished':

            for (var i = 1; i < taskArchive.length; i++) {
                if (taskArchive[i].finished) {
                    drawNewTask(taskArchive[i]);
                }
            }
    }
}

function createNewTaskSource(taskDefinition) {
    var taskPattern = {id: 'task' + getIncrementedId(), finished: false, taskDefinition: taskDefinition};
    id++;
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
    checkbox.id = 'checkbox' + taskPattern.id.substring(4);
    checkbox.checked = taskPattern.finished;
    checkbox.addEventListener('click', function () {
        changeFinishedStatusInPageArchive(this);
        apllyChangesAndRedrawThePage();
    });
    return checkbox;
}

function createTaskDefinition(taskPattern) {
    var p = document.createElement('p');
    p.appendChild(document.createTextNode(taskPattern.taskDefinition));
    p.style.textDecoration = (taskPattern.finished) ? 'line-through' : 'none';
    p.className = 'main-oneTask-p_todo';
    p.id = 'p' + taskPattern.id.substring(4);
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
    input.id = 'input' + taskPattern.id.substring(4);
    input.style.display = 'none';
    input.addEventListener('keyup', function (event) {
        switch (event.keyCode) {
            case 13:
                for (var i = 1; i < taskArchive.length; i++) {
                    if (taskArchive[i].id.substring(4) == this.id.substr(5)) {
                        taskArchive[i].taskDefinition = this.value;
                        break;
                    }
                }
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
    del.id = 'del' + taskPattern.id.substring(4);
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
        var del = document.getElementById('del' + this.id.substring(4));
        del.style.visibility = 'visible';
    });
    div.addEventListener('mouseout', function () {
        var del = document.getElementById('del' + this.id.substring(4));
        del.style.visibility = 'hidden';
        this.style.backgroundColor = '#b9d2ff';
    });
    document.getElementById('taskList').appendChild(div);
}
function getIncrementedId() {
    id++;
    return id;
}

function changeFinishedStatusInPageArchive(checkbox) {
    var id = 'task' + checkbox.id.substring(8);
    for (var i = 1; i < taskArchive.length; i++) {
        if (taskArchive[i].id == id) {
            taskArchive[i].finished = checkbox.checked;
            break;
        }
    }
}

function reloadTaskCounter() {
    var count = 0;
    for (var i = 1; i < taskArchive.length; i++) {
        count += (taskArchive[i].finished) ? 0 : 1;
    }
    document.getElementById('taskCounter').innerHTML = 'Всего: ' + count;
}

function removeTask(taskElem) {
    for (var i = 1; i < taskArchive.length; i++) {
        if (taskElem.id == taskArchive[i].id) {
            taskArchive.splice(i, 1);
            break;
        }
    }
    apllyChangesAndRedrawThePage();
}

function syncStorageAndPageArchive() {
    localStorage.clear();
    localStorage.setItem('taskArchive', JSON.stringify(taskArchive));
}

function apllyChangesAndRedrawThePage() {
    redrawTasksFromArchive();
    syncStorageAndPageArchive();
    reloadTaskCounter();
}

function removeFinishedTasks() {
    for (var i = taskArchive.length - 1; i > 0; i--) {
        if (taskArchive[i].finished) {
            taskArchive.splice(i, 1);
        }
    }
    apllyChangesAndRedrawThePage();
}

var clearAllFinishedButton = document.getElementsByClassName('footer-clearCompleted_todo')[0];


function addListenersToClearButton() {
    clearAllFinishedButton.addEventListener('mouseover', function () {
        this.style.textDecoration = 'underline';
        this.style.cursor = 'pointer';
    });

    clearAllFinishedButton.addEventListener('mouseout', function () {
        this.style.textDecoration = 'none';
    });

    clearAllFinishedButton.addEventListener('click', function () {
        removeFinishedTasks();
    });
}

addListenersToClearButton();


//footer-filter-active_todo
document.getElementsByClassName('footer-filter-active_todo')[0].addEventListener('click', function () {
    taskArchive[0] = 'active';
    syncStorageAndPageArchive();
    redrawTasksFromArchive();
});

//footer-filter-all_todo
document.getElementsByClassName('footer-filter-all_todo')[0].addEventListener('click', function () {
    taskArchive[0] = 'all';
    syncStorageAndPageArchive();
    redrawTasksFromArchive();
});

//footer-filter-completed_todo
document.getElementsByClassName('footer-filter-completed_todo')[0].addEventListener('click', function () {
    taskArchive[0] = 'finished';
    syncStorageAndPageArchive();
    redrawTasksFromArchive();


});

//header-mark_todo
document.getElementsByClassName('header-mark_todo')[0].addEventListener('click', function () {
    var marker = this;
    taskArchive.forEach(function (task) {
        task.finished = marker.checked ? true : false;
        redrawTasksFromArchive();
    }, marker);

});

