var date = new Date();
var inputTextArea = document.getElementById('taskBar__textArea');
var searchTextArea = document.getElementById('nameSelector__textArea');
var container = document.querySelector(".tasksContainer");
var taskObjectsList = [];
var taskItemsList = [];
var SBD, SBP, SBR;

// Загрузка
window.onload = function(){
    taskObjectsList = JSON.parse(localStorage.getItem("Objects"));
    if(taskObjectsList==null){
        taskObjectsList = [];
    }
    taskItemsList = [];
    for (let i=0 ; i < taskObjectsList.length ; i++){
        taskItemsList.push(createTaskItem(taskObjectsList[i]));
    }
    refreshContainer();
};

// Выгрузка
window.onbeforeunload = function(){
    localStorage.setItem("Objects", JSON.stringify(taskObjectsList));
};

// Кнопки "Нет" у всплывающих окон
document.getElementById('deleteWindow__noButton').addEventListener('click', function () {
    document.getElementById('deleteWindow').style.display = 'none';
});

document.getElementById('editWindow__noButton').addEventListener('click', function () {
    document.getElementById('editWindow').style.display = 'none';
});

// Работа с JSON placeholder
document.getElementById('JSPHButton').onclick = function (){
    fetch('https://jsonplaceholder.typicode.com/todos')
        .then(response => response.json())
        .then(json => {
            taskObjectsList = [];
            for (i=0 ; i<4 ; i++){
                console.log(json[i]);
                addTaskObject();
                taskObjectsList[i].taskText = json[i].title;
                taskObjectsList[i].taskDone = json[i].completed;
            }
            taskItemsList = [];
            taskObjectsList.forEach(function (element, index) {
                taskItemsList.push(createTaskItem(taskObjectsList[index]));
            });
            refreshContainer();
        })
};

// Обработчик кнопки "добавить"
document.getElementById('addButton').onclick = function () {
    if(inputTextArea.value) {
        taskItemsList.push(createTaskItem(addTaskObject()));
    }else {
        alert('You should enter the task!');
    }
    refreshContainer();
};

// Обработчик сортировки по приоритету
document.getElementById('prioritySelector').onclick = function () {
    if(SBP) {
        sortByPriorityUp();
        SBP = false;
    }else{
        sortByPriorityDown();
        SBP = true;
    }
};

// Обработчик сортировки по исполненности
document.getElementById('readinessSelector').onclick = function () {
    if (SBR) {
        sortByReadinessUp();
        SBR = false;
    } else {
        sortByReadinessDown();
        SBR = true;
    }
};

// Обработчик сортировки по дате
document.getElementById('dateSelector').onclick = function () {
    if (SBD) {
        sortByDateUp();
        SBD = false;
    } else {
        sortByDateDown();
        SBD = true;
    }
};

// Поиск
searchTextArea.oninput = function () {
    for (i = 0; i < taskItemsList.length; i++) {
        if (taskObjectsList[i].taskText.toUpperCase().indexOf(searchTextArea.value.toUpperCase()) > -1) {
            taskItemsList[i].style.display = "";
        } else {
            taskItemsList[i].style.display = "none";
        }
    }
    refreshContainer();
};

// Добавление объекта
function addTaskObject() {
        taskObjectsList.push(
            {
                taskDate: String(date.getDay()).padStart(2, '0') + '.' + String(date.getMonth()+1).padStart(2, '0') + '.' + date.getFullYear(),
                taskTime: date.getHours() + ':' + date.getMinutes(),
                taskPriority: 1,
                taskText: inputTextArea.value,
                taskDone: false
            }
        );
        inputTextArea.value = '';
        return taskObjectsList[taskObjectsList.length-1];
}

// Отрисовка объекта
function createTaskItem(taskObject) {
    let task = document.createElement('div'); task.className = 'task';
    let prioritySelect = document.createElement('div'); prioritySelect.className = 'task__prioritySelect';
    let prioritySelectUp = document.createElement('div'); prioritySelectUp.className = 'prioritySelect__up';
    prioritySelectUp.innerHTML = '<img class="img" src="https://image.flaticon.com/icons/svg/25/25678.svg">';
    let prioritySelectDown = document.createElement('div'); prioritySelectDown.className = 'prioritySelect__down';
    prioritySelectDown.innerHTML = '<img class="img" src="https://image.flaticon.com/icons/svg/25/25224.svg">';
    let taskText = document.createElement('div'); taskText.className = 'task__text';
    taskText.innerHTML = taskObject.taskText;
    let editButton = document.createElement('div'); editButton.className = 'task__edit';
    editButton.innerHTML = '<img class="img" src="https://image.flaticon.com/icons/svg/149/149307.svg">';
    let madeButton = document.createElement('div'); madeButton.className = 'task__made';
    madeButton.innerHTML = '<img class="img" src="https://image.flaticon.com/icons/svg/128/128517.svg">';
    let deleteButton = document.createElement('div'); deleteButton.className = 'task__delete';
    deleteButton.innerHTML = '<img class="img" src="https://image.flaticon.com/icons/svg/63/63260.svg">';

    // Обработчики кнопочек элемента
    prioritySelectUp.onclick = function(){
        let taskID = taskItemsList.indexOf(this.parentNode.parentNode);
        taskObjectsList[taskID].taskPriority --;
        if(taskObjectsList[taskID].taskPriority >= 5){taskObjectsList[taskID].taskPriority = 5;}else if(taskObjectsList[taskID].taskPriority <= 1){taskObjectsList[taskID].taskPriority = 1;}
        taskItemsList[taskID] = createTaskItem(taskObjectsList[taskID]);
        refreshContainer();
    };

    prioritySelectDown.onclick = function(){
        let taskID = taskItemsList.indexOf(this.parentNode.parentNode);
        taskObjectsList[taskID].taskPriority ++;
        if(taskObjectsList[taskID].taskPriority >= 5){taskObjectsList[taskID].taskPriority = 5;}else if(taskObjectsList[taskID].taskPriority <= 1){taskObjectsList[taskID].taskPriority = 1;}
        taskItemsList[taskID] = createTaskItem(taskObjectsList[taskID]);
        refreshContainer();
    };

    editButton.onclick = function(){
        let taskID = taskItemsList.indexOf(this.parentNode);

        if (window.getComputedStyle(document.getElementById('editWindow')).display === 'none'){
            document.getElementById('editWindow').style.display = 'flex';
            document.getElementById('editWindow__textarea').value = taskObjectsList[taskID].taskText;
        }
        else if (window.getComputedStyle(document.getElementById('editWindow')).display === 'flex'){
            document.getElementById('editWindow').style.display = 'none';
        }

        document.getElementById('editWindow__yesButton').onclick = function (){
            taskObjectsList[taskID].taskText = document.getElementById('editWindow__textarea').value;
            taskItemsList[taskID] = createTaskItem(taskObjectsList[taskID]);

            document.getElementById('editWindow').style.display = 'none';
            document.getElementById('editWindow__textarea').value = '';
            refreshContainer();
        };

    };

    madeButton.onclick = function(){
        let taskID = taskItemsList.indexOf(this.parentNode);

        if(taskObjectsList[taskID].taskDone == false){
            taskObjectsList[taskID].taskDone = true;
            taskItemsList[taskID] = createTaskItem(taskObjectsList[taskID]);
        }else{
            taskObjectsList[taskID].taskDone = false;
            taskItemsList[taskID] = createTaskItem(taskObjectsList[taskID]);
        }

        refreshContainer();
    };

    deleteButton.onclick = function(){
        let taskID = taskItemsList.indexOf(this.parentNode);

        if (window.getComputedStyle(document.getElementById('deleteWindow')).display === 'none'){
            document.getElementById('deleteWindow').style.display = 'flex';
        }
        else if (window.getComputedStyle(document.getElementById('deleteWindow')).display === 'flex'){
            document.getElementById('deleteWindow').style.display = 'none';
        }

        document.getElementById('deleteWindow__yesButton').onclick = function () {
            taskItemsList.splice(taskID, 1); taskObjectsList.splice(taskID, 1);
            document.getElementById('deleteWindow').style.display = 'none';
            refreshContainer();
        }
    };

    if(taskObject.taskDone == true){
        task.className = 'taskDone';
    }else {
        task.className = 'task';
    }

    task.innerHTML='<div class="task__date"><h2>' + taskObject.taskDate + '</h2><br><h3>' + taskObject.taskTime +'</h3></div>\n' +
        '                    <div class="task__priority"><h2>' + taskObject.taskPriority + '</h2></div>';

    task.appendChild(prioritySelect);
    prioritySelect.appendChild(prioritySelectUp);
    prioritySelect.appendChild(prioritySelectDown);
    task.appendChild(taskText);
    // task.write("<div class='task__text'>asdsadsadd</div>");
    task.appendChild(editButton);
    task.appendChild(madeButton);
    task.appendChild(deleteButton);

    return task;
}

// Сортировка по дате
function sortByDateUp() {
    taskObjectsList.sort(function (taskA, taskB) {
        return new Date(taskA.taskPriority) - new Date(taskB.taskPriority);
    });

    for (let i=0 ; i<taskObjectsList.length ; i++){
        taskItemsList[i] = createTaskItem(taskObjectsList[i]);
    }
    refreshContainer();
}

function sortByDateDown() {
    taskObjectsList.sort(function (taskA, taskB) {
        return new Date(taskB.taskPriority) - new Date(taskA.taskPriority);
    });

    for (let i=0 ; i<taskObjectsList.length ; i++){
        taskItemsList[i] = createTaskItem(taskObjectsList[i]);
    }
    refreshContainer();
}

// Сортировка по приоритету
function sortByPriorityUp() {
    taskObjectsList.sort(function (taskA, taskB) {
        return taskA.taskPriority - taskB.taskPriority;
    });

    for (let i=0 ; i<taskObjectsList.length ; i++){
        taskItemsList[i] = createTaskItem(taskObjectsList[i]);
    }
    refreshContainer();
}

function sortByPriorityDown() {
    taskObjectsList.sort(function (taskA, taskB) {
        return taskB.taskPriority - taskA.taskPriority;
    });

    for (let i=0 ; i<taskObjectsList.length ; i++){
        taskItemsList[i] = createTaskItem(taskObjectsList[i]);
    }
    refreshContainer();
}

// Сортировка по исполненности
function sortByReadinessUp() {
    taskObjectsList.sort(function (taskA, taskB) {
        return taskA.taskDone - taskB.taskDone;
    });

    for (let i=0 ; i<taskObjectsList.length ; i++){
        taskItemsList[i] = createTaskItem(taskObjectsList[i]);
    }
    refreshContainer();
}

function sortByReadinessDown() {
    taskObjectsList.sort(function (taskA, taskB) {
        return taskB.taskDone - taskA.taskDone;
    });

    for (let i=0 ; i<taskObjectsList.length ; i++){
        taskItemsList[i] = createTaskItem(taskObjectsList[i]);
    }
    refreshContainer();
}

// Обновление отрисовки объектов
function refreshContainer() {

    container.innerHTML = '';
    for (let i=0 ; i<taskItemsList.length ; i++){
        container.appendChild(taskItemsList[i]);
        // console.log(taskItemsList[i].children[3].innerHTML);
    }

}
