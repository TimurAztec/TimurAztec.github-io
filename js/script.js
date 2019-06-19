var container = document.getElementsByClassName('inventoryList')[0];
var nameSearchTextArea = document.getElementById('sb__nameTextArea');
var amountSearchTextArea = document.getElementById('sb__amountTextArea');
var priceSearchTextArea = document.getElementById('sb__priceTextArea');
var sumSearchTextArea = document.getElementById('sb__sumTextArea');
var amountSortDiv = document.getElementById('sb__amountInnerNumeralDiv');
var priceSortDiv = document.getElementById('sb__priceInnerNumeralDiv');
var sumSortDiv = document.getElementById('sb__sumInnerNumeralDiv');
var ASU, PSU, SSU, DragNDrop=false, menuButtonOn=false;
var itemsList = [];
var savingList = [];

window.onload = function() {
    savingList = JSON.parse(localStorage.getItem('items'));
    if(savingList == null){
        savingList = [];
    }
    savingList.forEach(function (element,index) {
        itemsList[index] = createItem(element.Scheck,
                                      element.Sname,
                                      element.SinvNumber,
                                      element.Samount,
                                      element.Sprice,
                                      element.Ssum,
                                      element.Scomment);
    });
    refreshContainer();
}

window.onbeforeunload = function () {
    try {
        savingList = [];
        itemsList.forEach(function (element, i) {
            savingList.push({
                Scheck: element.children[0].children[0].checked,
                // number: element.children[1].innerHTML,
                Sname: element.children[2].children[0].value,
                SinvNumber: element.children[3].children[0].children[1].innerHTML,
                Samount: element.children[4].children[0].value,
                Sprice: element.children[5].children[0].value,
                Ssum: element.children[6].innerText,
                Scomment: element.children[7].children[0].value
            });
        });

        localStorage.setItem('items', JSON.stringify(savingList));
    }catch (e) {
        alert(e);
    }
}

function refreshContainer() {
    container.innerHTML='';
    for( i=0 ; i<itemsList.length ; i++ ) {
        container.appendChild(itemsList[i]);
    }
    if(nameSearchTextArea.value=='' && amountSearchTextArea.value=='' && priceSearchTextArea.value=='' && sumSearchTextArea.value==''){container.appendChild(createAddButton());}
}

function createAddButton() {
    let button = document.createElement('div'); button.className = 'itemButton';
    button.innerHTML = '<div class="circleButton">' +
        '            <div class="buttonImg">\n' +
        '                <img class="img" src="https://image.flaticon.com/icons/svg/148/148764.svg">\n' +
        '            </div>'
        '       </div>';
    
    button.onclick = function () {
        itemsList.push(createItem());
        refreshContainer();
    }

    return button;
}

function createItem(Schecked, Sname, SinvNumber, Samount, Sprice, Ssum, Scomment) {
    let item = document.createElement('div'); item.className = 'item';
    let checkDiv = document.createElement('div'); checkDiv.className = 'checkDiv';
    let check = document.createElement('input'); check.setAttribute('type', 'checkbox');
    if (Schecked==null){check.checked = true;}else{check.checked=Schecked;}
    let numberDiv = document.createElement('div'); numberDiv.className = 'numberDiv';
    numberDiv.innerText = itemsList.length+1;
    let nameDiv = document.createElement('div'); nameDiv.className = 'itemDiv';
    let name = document.createElement('textarea'); name.className = 'nameTextArea';
    if(Sname==null){name.value='';}else{name.value=Sname;}
    // name.value = Sname;
    let invNumberDiv = document.createElement('div'); invNumberDiv.className = 'itemDiv';
    let invNumberInnerDiv = document.createElement('div'); invNumberInnerDiv.className = 'invNumberInnerDiv';
    let invNumber; if(SinvNumber==null){invNumber = Math.floor(Math.random() * 100) + 1;}else{invNumber=SinvNumber;}
    invNumberInnerDiv.innerHTML = name.value.toUpperCase() + '<br>' + invNumber;
    let amountDiv = document.createElement('div'); amountDiv.className = 'numeralDiv';
    let amount = document.createElement('textarea'); amount.className = 'amountTextArea';
    if(Samount==null){amount.value='';}else {amount.value=Samount;}
    let priceDiv = document.createElement('div'); priceDiv.className = 'numeralDiv';
    let price = document.createElement('textarea'); price.className = 'priceTextArea';
    if(Sprice==null){price.value='';}else {price.value=Sprice;}
    let sum = document.createElement('div'); sum.className = 'numeralDiv';
    if(Ssum==null){sum.innerText='';}else {sum.innerText=Ssum;}
    let commentDiv = document.createElement('div'); commentDiv.className = 'commentDiv';
    let comment = document.createElement('textarea'); comment.className = 'commentTextArea';
    if(Scomment==null){comment.value='';}else {comment.value=Scomment;}
    let deleteButtonDiv = document.createElement('div'); deleteButtonDiv.className = 'deleteButtonDiv';
    deleteButtonDiv.innerHTML = '<img class="img" src="https://image.flaticon.com/icons/svg/63/63260.svg">'

    let getInvNumber = document.createElement('span'); getInvNumber.style.display = 'none'; getInvNumber.innerText = invNumber;

    // name.addEventListener('input', function () {
    //     invNumberInnerDiv.innerHTML = name.value.toUpperCase() + '<br>' + invNumber;
    // });

    // amount.oninput = function(){
    //     sum.innerText = amount.value * price.value;
    // }
    //
    // price.oninput = function(){
    //     sum.innerText = amount.value * price.value;
    // }

    deleteButtonDiv.onclick = function(){
        itemsList.splice(itemsList.indexOf(this.parentNode), 1);
        itemsList.forEach(function (element, index) {
            element.children[1].innerHTML = index+1;
        });
        refreshContainer();
    }

    invNumberInnerDiv.onclick = function(){
        html2canvas(invNumberInnerDiv).then(function(canvas) {
            var tmpDownloadElement = document.createElement( 'a' );
            tmpDownloadElement.download = 'Инвентарный_номер_' + name.value + '_' + invNumber + '.png';
            tmpDownloadElement.href = canvas.toDataURL();
            document.body.appendChild( tmpDownloadElement );
            tmpDownloadElement.click();
            document.body.removeChild( tmpDownloadElement );
        });
    }

    item.onchange = function (){
        location.reload();
    }

    item.oninput = function(){
        sum.innerText = amount.value * price.value;
    }

    //###DRAG AND DROP###
    item.ondragstart = function(){
        return false;
    }

    if(DragNDrop) {
        (checkDiv || numberDiv || invNumberDiv || sum).onmousedown = function (e) {
            let itemId = itemsList.indexOf(this);
            try {
                container.removeChild(container.querySelector('.itemButton'));
            } catch (e) {
                console.log(e);
            }
            item.style.transform = 'scale(1.1)';
            item.style.position = 'absolute';
            moveAt(e);
            container.appendChild(item);
            item.style.zIndex = 1000;

            function moveAt(e) {
                item.style.top = e.pageY - item.offsetHeight / 0.5 + 'px';
            }

            document.onmousemove = function (e) {
                moveAt(e);
            }

            item.onmouseup = function (e) {
                console.log('a');
                item.style.transform = 'none';
                document.onmousemove = null;

                if (Array.prototype.indexOf.call(this.parentNode.children, this) == itemId) {
                    location.reload();
                    console, log('b');
                    console.log(Array.prototype.indexOf.call(this.parentNode.children, this));
                } else {
                    itemsList[Array.prototype.indexOf.call(this.parentNode.children, this)] = itemsList[itemId];
                    itemsList.splice(itemId, 1);
                    location.reload();
                    console.log('c');
                    console.log(Array.prototype.indexOf.call(this.parentNode.children, this));
                }

                item.onmouseup = null;
            }
        }
    }

    //### Drag and Drop end###

    item.appendChild(checkDiv);
    checkDiv.appendChild(check);
    item.appendChild(numberDiv);
    item.appendChild(nameDiv);
    nameDiv.appendChild(name);
    item.appendChild(invNumberDiv);
    invNumberDiv.appendChild(invNumberInnerDiv);
    invNumberInnerDiv.appendChild(getInvNumber);
    item.appendChild(amountDiv);
    amountDiv.appendChild(amount);
    item.appendChild(priceDiv);
    priceDiv.appendChild(price);
    item.appendChild(sum);
    item.appendChild(commentDiv);
    commentDiv.appendChild(comment);
    item.appendChild(deleteButtonDiv);

    return item;
}

nameSearchTextArea.oninput = function () {
    for (i = 0; i < itemsList.length; i++) {
        if (itemsList[i].children[2].children[0].value.toUpperCase().indexOf(nameSearchTextArea.value.toUpperCase()) > -1) {
            itemsList[i].style.display = "";
        } else {
            itemsList[i].style.display = "none";
        }
    }
    refreshContainer();
}

amountSearchTextArea.oninput = function () {
    for (i = 0; i < itemsList.length; i++) {
        if (itemsList[i].children[4].children[0].value.toUpperCase().indexOf(amountSearchTextArea.value.toUpperCase()) > -1) {
            itemsList[i].style.display = "";
        } else {
            itemsList[i].style.display = "none";
        }
    }
    refreshContainer();
}

priceSearchTextArea.oninput = function () {
    for (i = 0; i < itemsList.length; i++) {
        if (itemsList[i].children[5].children[0].value.toUpperCase().indexOf(priceSearchTextArea.value.toUpperCase()) > -1) {
            itemsList[i].style.display = "";
        } else {
            itemsList[i].style.display = "none";
        }
    }
    refreshContainer();
}

sumSearchTextArea.oninput = function () {
    for (i = 0; i < itemsList.length; i++) {
        if (itemsList[i].children[6].innerText.toUpperCase().indexOf(sumSearchTextArea.value.toUpperCase()) > -1) {
            itemsList[i].style.display = "";
        } else {
            itemsList[i].style.display = "none";
        }
    }
    refreshContainer();
}

amountSortDiv.onclick = function () {
    if (ASU) {
        itemsList.sort(function (taskA, taskB) {
            return taskA.children[4].children[0].value - taskB.children[4].children[0].value;
        });
        ASU = false;
    }else{
        itemsList.sort(function (taskA, taskB) {
            return taskB.children[4].children[0].value - taskA.children[4].children[0].value;
        });
        ASU = true;
    }
    itemsList.forEach(function (element, index) {
        element.children[1].innerHTML = index+1;
    });
    refreshContainer();
}

priceSortDiv.onclick = function () {
    if (PSU) {
        itemsList.sort(function (taskA, taskB) {
            return taskA.children[5].children[0].value - taskB.children[5].children[0].value;
        });
        PSU = false;
    }else{
        itemsList.sort(function (taskA, taskB) {
            return taskB.children[5].children[0].value - taskA.children[5].children[0].value;
        });
        PSU = true;
    }
    itemsList.forEach(function (element, index) {
        element.children[1].innerHTML = index+1;
    });
    refreshContainer();
}

sumSortDiv.onclick = function () {
    if (SSU) {
        itemsList.sort(function (taskA, taskB) {
            return taskA.children[6].innerText - taskB.children[6].innerText;
        });
        SSU = false;
    }else{
        itemsList.sort(function (taskA, taskB) {
            return taskB.children[6].innerText - taskA.children[6].innerText;
        });
        SSU = true;
    }
    itemsList.forEach(function (element, index) {
        element.children[1].innerHTML = index+1;
    });
    refreshContainer();
}

document.getElementById('sb__checkbox').onclick = function () {
    if (document.getElementById('sb__checkbox').checked == true) {
        itemsList.sort(function (taskA, taskB) {
            return taskB.children[0].children[0].checked - taskA.children[0].children[0].checked;
        });
    }else{
        itemsList.sort(function (taskA, taskB) {
            return taskA.children[0].children[0].checked - taskB.children[0].children[0].checked;
        });
    }
    console.log(document.getElementById('sb__checkbox').value);
    itemsList.forEach(function (element, index) {
        element.children[1].innerHTML = index+1;
    });
    refreshContainer();
}

document.getElementsByClassName('sb__menuButton')[0].onclick = function () {
    if(menuButtonOn){
        document.getElementsByClassName('options')[0].style.display = 'flex'
        menuButtonOn=false;
    }else{
        document.getElementsByClassName('options')[0].style.display = 'none';
        menuButtonOn=true;
    }
}

document.getElementsByClassName('options__itemButton')[1].querySelector('.circleButton').onclick = function () {
    menuButtonOn=false;
    document.getElementsByClassName('options')[0].style.display = 'none';
}

document.getElementsByName('DnDcheck').onchange = function () {
    if (document.getElementsByName('DnDcheck').checked){
        DragNDrop = true;
    } else {
        DragNDrop = false;
    }
}

document.getElementsByClassName('options__itemButton')[0].querySelector('.circleButton').onclick = function () {
    html2canvas(container).then(function(canvas) {
        var tmpDownloadElement = document.createElement( 'a' );
        tmpDownloadElement.download = 'Звіт.png';
        tmpDownloadElement.href = canvas.toDataURL();
        document.body.appendChild( tmpDownloadElement );
        tmpDownloadElement.click();
        document.body.removeChild( tmpDownloadElement );
    });
}