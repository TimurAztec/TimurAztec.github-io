
document.getElementById('task__delete').addEventListener('click', function () {
    if (window.getComputedStyle(document.getElementById('deleteWindow')).display === 'none'){
        document.getElementById('deleteWindow').style.display = 'flex';
    }
    else if (window.getComputedStyle(document.getElementById('deleteWindow')).display === 'flex'){
        document.getElementById('deleteWindow').style.display = 'none';
    }
});

document.getElementById('deleteWindow__noButton').addEventListener('click', function () {
   document.getElementById('deleteWindow').style.display = 'none';
});

document.getElementById('task__edit').addEventListener('click', function () {
    if (window.getComputedStyle(document.getElementById('editWindow')).display === 'none'){
        document.getElementById('editWindow').style.display = 'flex';
    }
    else if (window.getComputedStyle(document.getElementById('deleteWindow')).display === 'flex'){
        document.getElementById('deleteWindow').style.display = 'none';
    }
});

document.getElementById('editWindow__noButton').addEventListener('click', function () {
    document.getElementById('editWindow').style.display = 'none';
});