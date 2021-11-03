const notebook = document.querySelector(".notebook"); // parent container to text input
const inputText = document.querySelector("#inputText");
const inputDate = document.querySelector("#inputDate");
const inputTime = document.querySelector("#inputTime");
const submitBtn = document.querySelector("#submitBtn");
const resetFormBtn = document.querySelector("#resetFormBtn");
const information = document.querySelector(".information"); // displays error/success messages to user
const ul = document.querySelector("ul");
const clearBtn = document.querySelector("#clearBtn");

notebook.addEventListener("click", function() {
    inputText.focus();
})


inputText.addEventListener("input", resizeInputTextArea)

function resizeInputTextArea() {
    inputText.style.height = "auto";
    inputText.style.height = inputText.scrollHeight + 'px';
}


if (localStorage.getItem("todoArrayKey") === null) { // LS
    localStorage.setItem("todoArrayKey", "[]"); // LS
}

let todoArray = JSON.parse(localStorage.getItem("todoArrayKey")); // LS


submitBtn.addEventListener("click", function(){
    if (inputText.value.trim() == "") {
        information.innerHTML = '<span class="red">Error: Text input is required.</span>'
        inputText.focus();
    } else if (!inputDate.value) { // if input date is empty:
        information.innerHTML = '<span class="red">Error: Date input is required.</span>'
        inputDate.focus();
    } else if (!inputTime.value) { // if input time is empty:
        information.innerHTML = '<span class="red">Error: Time input is required.</span>'
        inputTime.focus();
    } else {
        todoArray.push({text: inputText.value, date: inputDate.value, time: inputTime.value, isNew: true, scrollPos: 0});
        localStorage.setItem("todoArrayKey", JSON.stringify(todoArray)); // LS
        inputText.value = "";
        inputDate.value = "";
        inputTime.value = "";
        resizeInputTextArea();
        information.innerHTML = '<span class="green">✔️ Succesfully added new note.</span>'
        drawTodoArray();
    }
})

clearBtn.addEventListener("click", function() {
    localStorage.removeItem("todoArrayKey"); // LS
    todoArray = [];
    drawTodoArray();
})

function drawTodoArray() {
    let htmlScrollPosition = document.querySelector("html").scrollTop // save scroll position of entire document then later set it back at the end of the function
    ul.innerHTML =  "";
    for (let i = 0; i < todoArray.length; i++) {
        const li = document.createElement("li");
        const liText = document.createElement("p");
        const liDate = document.createElement("h4");
        const liTime = document.createElement("h4");
        
        liText.innerText = todoArray[i].text;
        // will update scroll position of item in array when scrolling
        liText.addEventListener("scroll", function(){
            todoArray[i].scrollPos = liText.scrollTop;
        })

        // reformat date
        let myDate = new Date(todoArray[i].date); 
        let dd = myDate.getDate();
        let mm = myDate.getMonth() + 1;
        let yyyy = myDate.getFullYear();
        liDate.innerText = `${dd}/${mm}/${yyyy}`;

        liTime.innerText = todoArray[i].time;

        const delBtn = document.createElement("button");
        delBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
        delBtn.addEventListener("click", function(){
            todoArray.splice(i, 1);
            localStorage.setItem("todoArrayKey", JSON.stringify(todoArray)); // LS
            drawTodoArray();
        })

        if (todoArray[i].isNew == true) { // if the element is new, then give it a fade-in animation.
            li.classList.add("invisible");
            li.append(liText);
            li.append(liDate);
            li.append(liTime);
            li.append(delBtn)
            ul.append(li);
            setTimeout(function() {li.classList.add("visible")}); // setTimeout is necessary for fade-in animation to work.
            todoArray[i].isNew = false; // element is no longer a first-timer and will no longer fade-in on redraw.
            localStorage.setItem("todoArrayKey", JSON.stringify(todoArray)); // LS
        } else {
            li.append(liText);
            li.append(liDate);
            li.append(liTime);
            li.append(delBtn)
            ul.append(li);
        }
        liText.scrollTop = todoArray[i].scrollPos; // go back to previous scroll position of each item
    }
    document.querySelector("html").scrollTop = htmlScrollPosition; // go back to previous scroll position of entire page
}

resetFormBtn.addEventListener("click", function() {
    inputText.value = "";
    inputDate.value = "";
    inputTime.value = "";
    information.innerHTML = "";
    resizeInputTextArea();
})

drawTodoArray();