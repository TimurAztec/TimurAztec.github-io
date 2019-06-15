var container = document.getElementsByClassName('inventoryList')[0];
var nameSearchTextArea = document.getElementById('sb__nameTextArea');
var amountSearchTextArea = document.getElementById('sb__amountTextArea');
var priceSearchTextArea = document.getElementById('sb__priceTextArea');
var sumSearchTextArea = document.getElementById('sb__sumTextArea');
var amountSortDiv = document.getElementById('sb__amountInnerNumeralDiv');
var priceSortDiv = document.getElementById('sb__priceInnerNumeralDiv');
var sumSortDiv = document.getElementById('sb__sumInnerNumeralDiv');
var ASU, PSU, SSU;
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
    if(nameSearchTextArea.value==''){container.appendChild(createAddButton());}
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

        itemsList.forEach(function (element, i) {
            console.log(element.children[2].children[0].value);
        });
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

    item.onchange = function (){
        location.reload();
    }

    item.oninput = function(){
        sum.innerText = amount.value * price.value;
    }

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