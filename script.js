const keyboard = document.querySelector(".keyboardContainer");
const inputNumber = document.querySelector(".displayValue");
const displayBinary = document.querySelector(".displayBinaryValue");

let result;
let operator;
let splitNumbers;

//mudar entrada para resultado quando clica no =

const keys = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "/", "*", "C", "=", "«",
];

const teste = ["a", "b", "c"]

const clean = () => {
    result = undefined
    inputNumber.innerHTML = "";
    displayBinary.innerHTML = "";
}

const concatNumber = (value) => {
    if (inputNumber.textContent == "Erro!") {
        clean();
        inputNumber.innerHTML += value;
    } else if (result != undefined) {
        clean();
        inputNumber.innerHTML += value;
    } else {
        inputNumber.innerHTML += value;
        //displayBinary.innerHTML += (value).toString(2);
        // por disable nos botões quando for identificado um *, + ou / ou -,-
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
    let sumResult = "",
    carry = 0;

    let firstBinary = firstValue;
    let secondBinary = secondValue;

    if (typeof firstValue === "number") {
        firstBinary = addZeros(parseInt(firstValue).toString(2))
        
    }

    if (typeof secondValue === "number") {
        secondBinary = addZeros(parseInt(secondValue).toString(2))
    }

    console.log("first", firstBinary )
    console.log("second", secondBinary)

    while(firstBinary || secondBinary || carry){
        let sum = +firstBinary.slice(-1) + +secondBinary.slice(-1) + carry; 

        if( sum > 1 ){  
        sumResult = sum%2 + sumResult;
        carry = 1;
        }
        else{
        sumResult = sum + sumResult;
        carry = 0;
        }
    
        firstBinary = firstBinary.slice(0, -1)
        secondBinary = secondBinary.slice(0, -1)
    }
    console.log("resultadoooo", sumResult);

    return sumResult.substring(sumResult.length - 8);
}

const flipBit = (bit) => bit === '1' ? '0' : '1';

// const signBit = (b) => b.charAt(0);

const convertBinaryToDecimal = binary => {
    return (
        parseInt(binary.length >= 8 && binary[0] === "1" ? binary.padStart(32, "1") : binary.padStart(32, "0"), 2) >> 0
)};

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

const isBiggerThan255 = (currentValue) => currentValue > 255;

const binaryDivision = (firstValue, secondValue) => {
    let i = 0;
    while (firstValue > 0 && firstValue >= secondValue) {
        firstValue = binarySum((firstValue), twosComplement(secondValue));
        i++
    }
    const quotient = i.toString(2)
    return quotient;
}

const mathOperations = (arrayOfNumbers) => {

    console.log("array-numbers", arrayOfNumbers)
    const divisao = binaryDivision(arrayOfNumbers[0], arrayOfNumbers[1])
    console.log("div", divisao)

    if (
        operator.includes("+") 
        && operator.indexOf("-") === -1 
        && operator.indexOf("*") === -1 
        && operator.indexOf("/") === -1
    ) {
        result = binarySum(arrayOfNumbers[0], arrayOfNumbers[1]);
    }  else if (
        operator.includes("-") 
        && operator.indexOf("*") === -1 
        && operator.indexOf("/") === -1
    ) {
        if (operator.length === 1 && operator.indexOf("-") === 0) {
            result = binarySum(arrayOfNumbers[0], twosComplement(arrayOfNumbers[1]));
        } else if (operator.length >= 2 && operator.indexOf("-") === 0 && operator.indexOf("-", 1) === 1) {
            result = binarySum(twosComplement(arrayOfNumbers[1]), twosComplement(arrayOfNumbers[2]))
        } else if (operator.length >= 2 && operator.indexOf("-") === 0 ) {
            result = binarySum(twosComplement(arrayOfNumbers[1]), arrayOfNumbers[2])
        }
    } else if (operator.includes("*")) {
        if (operator.includes("-")) {
            if (operator.indexOf("-") === 1) {
                result = "*"
                console.log("op", operator)
            } else if (operator.length === 2 && operator.indexOf("-") === 0) {
                result = "**"
            } else if (operator.length === 3 && operator.indexOf("*") === 1) {
                result = "***";
            }
        } else {
            result = "*********"
        }
    } else if (operator.includes("/")){
        if (operator.includes("-")) {
            if (operator.indexOf("-") === 1) {
                result = "/"
                console.log("op", operator)
            } else if (operator.length === 2 && operator.indexOf("-") === 0) {
                result = "//"
            } else if (operator.length === 3  && operator.indexOf("/") === 1) {
                result = "///";
            }
        } else {
            result = binaryDivision(arrayOfNumbers[0], arrayOfNumbers[1])
        }
    }
}


const operationResult = () => {
    splitInputNumbers(inputNumber);

    let decimalResult;

    const arrayOfNumbers = splitNumbers.map(Number);

    if (
        inputNumber.textContent.includes("/0") 
            || inputNumber.textContent.includes("/-0") 
            || inputNumber.textContent.includes("/+0")
            || inputNumber.textContent === ""
        ) {
        decimalResult = result = "Erro!";
    } else if (arrayOfNumbers.some(isBiggerThan255)) {
        decimalResult = result = "Erro!";
    }
    else {
        mathOperations(arrayOfNumbers);
    }

    if (result !== "Erro!") {
        decimalResult = convertBinaryToDecimal(result);
    }
    console.log("zzz", splitNumbers)
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
    keyboardButton.setAttribute("class", "button" + key);
    keyboardButton.addEventListener("click", () => handleClick(key));
    keyboard.append(keyboardButton);
});


const y = document.querySelector(".button6");
console.log("yyyy", y)

//y.setAttribute("disabled", "disabled")


// function binaryAddition(firstValue, secondValue){
//     let result = "",
//         carry = 0;
  
//     while(firstValue || secondValue || carry){
//       let sum = +firstValue.slice(-1) + +secondValue.slice(-1) + carry; // get last digit from each number and sum 
  
//       if( sum > 1 ){  
//         result = sum%2 + result;
//         carry = 1;
//       }
//       else{
//         result = sum + result;
//         carry = 0;
//       }
      
//       // trim last digit (110 -> 11)
//       firstValue = firstValue.slice(0, -1)
//       secondValue = secondValue.slice(0, -1)
//     }
    
//     return result;
//   }
  
//   const flipBit = (bit) => bit === '1' ? '0' : '1';
  
//   const signBit = (b) => b.charAt(0);
  
//   const twosComplement = (value) => {
//       let twosComplementValue = '';
//       const lastOne = value.lastIndexOf('1');
  
//     if (lastOne === -1) {
//         return '1' + value;
//       } else {
//         for (let i = 0; i < lastOne; i++) {
//           twosComplementValue += flipBit(value[i]);
//         }
//       }
//       twosComplementValue += value.substring(lastOne);
//     console.log("qq", signBit( twosComplementValue))
//     //console.log(signBit(twosComplementValue))
//       return twosComplementValue;
//   }
  
//   console.log("aaa", binaryAddition("10000011", "00000001"))
  
  
  // a multiplicação será feita com recursividade
  // a subtração vai ser feita junto com a adição



