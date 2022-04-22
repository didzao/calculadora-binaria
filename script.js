const keyboard = document.querySelector(".keyboardContainer");
const inputNumber = document.querySelector(".displayValue");
const displayBinary = document.querySelector(".displayBinaryValue");

let result;
let operator;
let splitNumbers;
let overflow = false;

const keys = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "/", "*", "C", "=", "«",
];

const clean = () => {
    overflow = false;
    result = undefined;
    inputNumber.innerHTML = "";
    displayBinary.innerHTML = "";
}

const concatNumber = (value) => {
    overflow = false;
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

const binarySum = (firstValue, secondValue) => {
    let sumResult = "";
    let carry = 0;

    let firstBinary = firstValue;
    let secondBinary = secondValue;

    if (typeof firstValue === "number") {
        firstBinary = addZeros(parseInt(firstValue).toString(2));
    }

    if (typeof secondValue === "number") {
        secondBinary = addZeros(parseInt(secondValue).toString(2));
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

    if (parseInt(sumResult, 2) >= 256) {
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

const isBiggerThan63 = (value) => value > 63;

const binaryDivision = (firstValue, secondValue) => {
    let i = 0;
    while (firstValue > 0 && firstValue >= secondValue) {
        firstValue = binarySum(firstValue, twosComplement(secondValue));
        i++
    }
    const quotient = i.toString(2)
    return addZeros(quotient);
}

const binaryMultiplication = (firstValue, secondValue) => {
    let i = 0;
    let multiplicationResult = 0;

    while (i < secondValue) {
        multiplicationResult = binarySum(multiplicationResult, firstValue);
        i++;
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
            result = binarySum(arrayOfNumbers[0], twosComplement(arrayOfNumbers[1]));
        } else if (operator.length >= 2 && operator.indexOf("-") === 0 && operator.indexOf("-", 1) === 1) {
            result = binarySum(twosComplement(arrayOfNumbers[1]), twosComplement(arrayOfNumbers[2]))
        } else if (operator.length >= 2 && operator.indexOf("-") === 0) {
            result = binarySum(twosComplement(arrayOfNumbers[1]), arrayOfNumbers[2])
        }
    } else if (operator.includes("*")) {
        if (operator.includes("-")) {
            if (operator.indexOf("-") === 1) {
                result = twosComplement(binaryMultiplication(arrayOfNumbers[0], arrayOfNumbers[2]));
            } else if (operator.length === 2 && operator.indexOf("-") === 0) {
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
                result = twosComplement(binaryDivision(arrayOfNumbers[0], arrayOfNumbers[2]));
            } else if (operator.length === 2 && operator.indexOf("-") === 0) {
                result = twosComplement(binaryDivision(arrayOfNumbers[1], arrayOfNumbers[2]));
            } else if (operator.length === 3 && operator.indexOf("/") === 1) {
                result = binaryDivision(arrayOfNumbers[1], arrayOfNumbers[3]);
            }
        } else {
            result = binaryDivision(arrayOfNumbers[0], arrayOfNumbers[1]);
        }
    }
}

const errorAlert = (message) => {
    Swal.fire(
        {
            title: 'Opa!',
            text: message,
            icon: 'error',
        }
    )
}

const infoAlert = () => {
    Swal.fire(
        {
            width: 800,
            title: 'Informações',
            text: "1 - Essa calculadora opera em 8 bits, ou seja, ela só recebe e retorna valores até 255. "
                + "Então, sempre que as situações acima acontecerem, será retornado um erro. Portanto, não se assuste! \n"
                + "2 - Leia o relatório, para saber mais sobre as funções usadas nesse projeto.",
            icon: 'info',
            //footer: '<a href="/reportPage.html">Deseja saber mais? Leia o relatório</a>'
        }
    )
}

const convertBinaryToDecimal = binary => {
    return (
        parseInt(binary.length >= 8 && binary[0] === "1" ? binary.padStart(32, "1") : binary.padStart(32, "0"), 2) >> 0
    )
};

const operationResult = () => {
    let decimalResult;

    splitInputNumbers(inputNumber);

    const arrayOfNumbers = splitNumbers.map(Number);

    if (
        inputNumber.textContent.includes("/0")
        || inputNumber.textContent.includes("/-0")
        || inputNumber.textContent.includes("/+0")
        || inputNumber.textContent === ""
    ) {
        decimalResult = result = "Erro!";
        errorAlert("Parece que você está tentando cometer o pecado de dividir por 0 "
            + "ou então não inseriu nenhum valor!");
    } else if (arrayOfNumbers.some(isBiggerThan255)) {
        decimalResult = result = "Erro!";
        errorAlert("Parece que você inseriu um valor maior do 255!");
    }
    else {
        mathOperations(arrayOfNumbers);
    }

    if (overflow) {
        result = "Erro!";
        decimalResult = result;
        errorAlert("Pelo visto tivemos um overflow! Tente novamente!")
    }

    if (result !== "Erro!" && !overflow) {
        decimalResult = convertBinaryToDecimal(result);
    }

    if (result !== "Erro!" && !overflow && arrayOfNumbers.some(isBiggerThan63)) {
        decimalResult = parseInt(result, 2);
    }

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










