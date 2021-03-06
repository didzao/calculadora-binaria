const keyboard = document.querySelector(".keyboardContainer");
const inputNumber = document.querySelector(".displayValue");
const displayBinary = document.querySelector(".displayBinaryValue");
const inputLabel = document.getElementById("input");

let result;
let operator;
let splitNumbers;
let overflow = false;
let isTwosComplement = false;

const keys = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "/", "*", "C", "=", "«",
];

const resetInputLabel = () => {
    inputLabel.innerText = "Digite os valores";
}

const clean = () => {
    resetInputLabel();
    overflow = false;
    result = undefined;
    inputNumber.innerHTML = "";
    displayBinary.innerHTML = "";
}

const concatNumber = (value) => {
    overflow = false;
    resetInputLabel();
    if (inputNumber.textContent == "Erro!") {
        clean();
        inputNumber.innerHTML += value;
    } else if (result != undefined) {
        clean();
        inputNumber.innerHTML += value;
    } else {
        inputNumber.innerHTML += value;
    }
}

const backspace = () => {
    if (inputNumber.textContent) {
        if (inputNumber.textContent == "Erro!") {
            clean();
        } else {
            let displayed = document.getElementById("displayNumber").innerHTML;
            inputNumber.innerHTML = displayed.substring(0, displayed.length - 1);
        }
    }
}

const splitInputNumbers = (displayNumber) => {
    operator = displayNumber.innerHTML.split(/[0-9]/).join("").split("");

    splitNumbers = displayNumber.innerHTML.split(/[\+\-\*\/]/);
}

const addZeros = (binaryStr) => {
    return "00000000".substring(binaryStr.length) + binaryStr;
}

const convertBinaryToDecimal = (binary) => {
    return binary.split('').reverse().reduce((acc, currentValue, i) => {
        return (currentValue === '1') ? acc + Math.pow(2, i) : acc;
    }, 0);
}

const binarySum = (firstValue, secondValue) => {
    let sumResult = "";
    let carry = 0;

    let firstBinary = firstValue;
    let secondBinary = secondValue;

    if (typeof firstValue === "number") {
        firstBinary = addZeros(firstValue.toString(2));
    }

    if (typeof secondValue === "number") {
        secondBinary = addZeros(secondValue.toString(2));
    }

    while (firstBinary || secondBinary || carry) {

        let sum = +firstBinary.slice(-1) + +secondBinary.slice(-1) + carry;

        if (sum > 1) {
            sumResult = sum % 2 + sumResult;
            carry = 1;
        }
        else {
            sumResult = sum + sumResult;
            carry = 0;
        }

        firstBinary = firstBinary.slice(0, -1);
        secondBinary = secondBinary.slice(0, -1);
    }

    if (convertBinaryToDecimal(sumResult) >= 256 && operator) {
        overflow = true;
    }

    return sumResult.substring(sumResult.length - 8);
}

const flipBit = (bit) => bit === '1' ? '0' : '1';

const twosComplement = (value) => {

    let twosComplementValue = '';
    let binaryValue = addZeros(value.toString(2));
    const lastOne = binaryValue.lastIndexOf('1');

    if (lastOne === -1) {
        return '1' + binaryValue;
    } else {
        for (let i = 0; i < lastOne; i++) {
            twosComplementValue += flipBit(binaryValue[i]);
        }
    }
    twosComplementValue += binaryValue.substring(lastOne);
    return twosComplementValue;
}

const isBiggerThan255 = (value) => value > 255;

const binaryDivision = (firstValue, secondValue) => {
    let i = 0;
    if (firstValue === secondValue) {
        i = 1;
    } else {
        while (firstValue >= secondValue) {
            firstValue = convertBinaryToDecimal(binarySum(firstValue, twosComplement(secondValue)));
            i++
        }
    }

    const quotient = i.toString(2)
    return addZeros(quotient);
}

const binaryMultiplication = (firstValue, secondValue) => {
    let i = 0;
    let multiplicationResult = 0;

    if (firstValue === 0 || secondValue == 0) {
        multiplicationResult = addZeros("0");
    } else {
        while (i < secondValue) {
            multiplicationResult = binarySum(multiplicationResult, firstValue);
            i++;
        }
    }

    return multiplicationResult;
}

const mathOperations = (arrayOfNumbers) => {

    if (
        operator.includes("+")
        && operator.indexOf("-") === -1
        && operator.indexOf("*") === -1
        && operator.indexOf("/") === -1
    ) {
        result = binarySum(arrayOfNumbers[0], arrayOfNumbers[1]);
    } else if (
        operator.includes("-")
        && operator.indexOf("*") === -1
        && operator.indexOf("/") === -1
    ) {
        if (operator.length === 1 && operator.indexOf("-") === 0) {
            if (arrayOfNumbers[0] < arrayOfNumbers[1]) {
                isTwosComplement = true;
            }
            result = binarySum(arrayOfNumbers[0], twosComplement(arrayOfNumbers[1]));
        } else if (operator.length >= 2 && operator.indexOf("-") === 0 && operator.indexOf("-", 1) === 1) {
            isTwosComplement = true;
            result = binarySum(twosComplement(arrayOfNumbers[1]), twosComplement(arrayOfNumbers[2]))
        } else if (operator.length >= 2 && operator.indexOf("-") === 0) {
            if (arrayOfNumbers[1] > arrayOfNumbers[2]) {
                isTwosComplement = true;
            }
            result = binarySum(twosComplement(arrayOfNumbers[1]), arrayOfNumbers[2])
        }
    } else if (operator.includes("*")) {
        if (operator.includes("-")) {
            if (operator.indexOf("-") === 1) {
                isTwosComplement = true;
                result = twosComplement(binaryMultiplication(arrayOfNumbers[0], arrayOfNumbers[2]));
            } else if (operator.length === 2 && operator.indexOf("-") === 0) {
                isTwosComplement = true;
                result = twosComplement(binaryMultiplication(arrayOfNumbers[1], arrayOfNumbers[2]));
            } else if (operator.length === 3 && operator.indexOf("*") === 1) {
                result = binaryMultiplication(arrayOfNumbers[1], arrayOfNumbers[3]);
            }
        } else {
            result = binaryMultiplication(arrayOfNumbers[0], arrayOfNumbers[1]);
        }
    } else if (operator.includes("/")) {
        if (operator.includes("-")) {
            if (operator.indexOf("-") === 1) {
                isTwosComplement = true;
                result = twosComplement(binaryDivision(arrayOfNumbers[0], arrayOfNumbers[2]));
            } else if (operator.length === 2 && operator.indexOf("-") === 0) {
                isTwosComplement = true;
                result = twosComplement(binaryDivision(arrayOfNumbers[1], arrayOfNumbers[2]));
            } else if (operator.length === 3 && operator.indexOf("/") === 1) {
                result = binaryDivision(arrayOfNumbers[1], arrayOfNumbers[3]);
            }
        } else {
            result = binaryDivision(arrayOfNumbers[0], arrayOfNumbers[1]);
        }
    }
    return result;
}

const errorAlert = (message) => {
    Swal.fire(
        {
            title: 'Opa!',
            text: message,
            icon: 'error',
            background: "#f5f5f5",
            backdrop: `rgba(18, 18, 19, 0.3)`
        }
    )
}

const infoImg = './assets/infos.png';

const infoAlert = () => {
    Swal.fire(
        {
            width: 500,
            imageUrl: infoImg,
            background: "#121213",
            confirmButtonColor: '#E3378D',
            backdrop: `rgba(18, 18, 19, 0.3)`
        }
    )
}

const operationResult = () => {
    let decimalResult;

    splitInputNumbers(inputNumber);

    const arrayOfNumbers = splitNumbers.map(Number);

    if (
        inputNumber.textContent.includes("/0")
        || inputNumber.textContent.includes("/-0")
        || inputNumber.textContent.includes("/+0")
        || inputNumber.textContent.includes("/*0")
    ) {
        decimalResult = result = "Erro!";
        errorAlert("Parece que você está tentando cometer o pecado de dividir por 0!");
    } else if (inputNumber.textContent === "") {
        errorAlert("Parece que você não inseriu nenhum valor!");
    } else if (
        inputNumber.textContent.match((/[\+\-\*\/]/)) && !inputNumber.textContent.match(/[0-9]/)
    ) {
        errorAlert("Parece que você apenas inseriu os operadores e esqueceu de selecionar os valores!");
    } else if (arrayOfNumbers.some(isBiggerThan255)) {
        decimalResult = result = "Erro!";
        errorAlert("Parece que você inseriu um valor maior do 255!");
    } else {
        mathOperations(arrayOfNumbers);
    }

    if (overflow) {
        result = "Erro!";
        decimalResult = result;
        errorAlert("Pelo visto tivemos um overflow! Tente novamente!")
    }

    if (result !== "Erro!" && !overflow) {
        if (isTwosComplement) {
            decimalResult = convertBinaryToDecimal(twosComplement(result)) * (-1)
        } else {
            decimalResult = convertBinaryToDecimal(result);
        }
        isTwosComplement = false;
    }

    inputLabel.innerText = "Resultado decimal";
    document.getElementById("displayBinary").innerHTML = result;
    document.getElementById("displayNumber").innerHTML = decimalResult;
}

const handleClick = (key) => {
    switch (key) {
        case "C":
            clean();
            break;
        case "«":
            backspace();
            break;
        case "=":
            operationResult();
            break;
        default:
            concatNumber(key);
            break;
    }
}

keys.forEach(key => {
    const keyboardButton = document.createElement("button");
    keyboardButton.textContent = key;
    keyboardButton.setAttribute("key", key);
    keyboardButton.addEventListener("click", () => handleClick(key));
    keyboard.append(keyboardButton);
});










