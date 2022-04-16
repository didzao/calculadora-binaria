const keyboard = document.querySelector(".keyboardContainer");
const displayNumber = document.querySelector(".displayValue");
const displayBinary = document.querySelector(".displayBinaryValue");

// let inputNumber;
// let operator;

const keys = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "+", "-", "/", "*", "C", "=", "«",
];

const teste = ["a", "b", "c"]

const clean = () => {
    displayNumber.innerHTML = " ";
    displayBinary.innerHTML = " ";
}

const addNumber = (value) => {
    if (displayNumber.textContent == "Erro!") {
        clean();
        displayNumber.innerHTML += value;
        //displayBinary.innerHTML += value;
    } else {
        displayNumber.innerHTML += value;
        //displayBinary.innerHTML += (value).toString(2);
    }
}

const backspace = () => {
    if (displayNumber.textContent) {
        if (displayNumber.textContent == "Erro!") {
            clean();
        } else {
            let displayed = document.getElementById("displayNumber").innerHTML;
            displayNumber.innerHTML = displayed.substring(0, displayed.length - 1);
        }
    }
}

const splitInputNumbers = (displayNumber) => {

    let operator = displayNumber.innerHTML.split(/[0-9]/).join("").split("");

    splitNumbers = displayNumber.innerHTML.split(/[\+\-\*\/]/);

    console.log("aaaa", operator)

    return { splitNumbers, operator };
}

const result = () => {
    splitInputNumbers(displayNumber);

    console.log("zzz", eval(parseInt(splitInputNumbers(displayNumber).splitNumbers[0]).toString(2) + parseInt(splitInputNumbers(displayNumber).splitNumbers[1]).toString(2)))

    // numbers = parseInt(splitInputNumbers(displayNumber).splitNumbers[0]).toString(2)

    //console.log("display", a[0]);

    //displayNumber.innerHTML.split("*", [0])

    const result = eval(displayNumber.innerHTML);
    if (displayNumber.textContent.match("/0") || displayNumber.textContent === "") {
        document.getElementById("displayNumber").innerHTML = "Erro!";
        document.getElementById("displayBinary").innerHTML = "Erro!";
    } else {
        document.getElementById("displayNumber").innerHTML = result;
        document.getElementById("displayBinary").innerHTML = parseInt(result).toString(2);
    }
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



