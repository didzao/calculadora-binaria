const keyboard = document.querySelector(".keyboardContainer");
const display = document.querySelector(".displayValue");

const keys = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "/", "*", "C", "=", "«",
];

const teste = ["a", "b", "c"]

const clean = () => {
    display.innerHTML = " ";
}

const addNumber = (value) => {
    if (display.textContent == "Erro!") {
        clean();
        display.innerHTML += value;
    } else {
        display.innerHTML += value;
    }
}

const backspace = () => {
    if (display.textContent) {
        if (display.textContent == "Erro!") {
            clean();
        } else {
            let displayed = document.getElementById("display").innerHTML;
            display.innerHTML = displayed.substring(0, displayed.length - 1);
        }
    }
}

const result = () => {
    if (display.textContent.match("/0")) {
        document.getElementById("display").innerHTML = "Erro!"
    } else {
        document.getElementById("display").innerHTML = eval(display.innerHTML);
    }
}

const handleClick = (key) => {
    switch (key) {
        case "C":
            clean()
            break;
        case "«":
            backspace();
            break;
        case "=":
            result();
            break;
        default:
            addNumber(key);
            break;
    }
}

keys.forEach(key => {
    const keyboardButton = document.createElement("button");
    keyboardButton.textContent = key;
    keyboardButton.setAttribute("id", key);
    keyboardButton.addEventListener("click", () => handleClick(key));
    keyboard.append(keyboardButton);
});



