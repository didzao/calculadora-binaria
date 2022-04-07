const button = document.getElementById("button");

const firstBinary = document.getElementById("firstBinary");
const secondBinary = document.getElementById("secondBinary");

let firstNumber;
let secondNumber;

const getValues = () => {
    firstNumber = document.getElementById("firstNumber").value;
    secondNumber = parseInt(document.getElementById("secondNumber").value);
    return (firstNumber, secondNumber)
}

const getAndDisplayValues = () => {
    firstNumber = document.getElementById("firstNumber").value;
    secondNumber = parseInt(document.getElementById("secondNumber").value);

    firstBinary.innerText = `${firstNumber} em binário é ${parseInt(firstNumber).toString(2)}`;
    secondBinary.innerText = `${secondNumber} em binário é ${parseInt(secondNumber).toString(2)}`;
}

button.addEventListener("click", function (e) {
    e.preventDefault();

    getAndDisplayValues();
});






