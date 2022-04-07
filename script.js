const button = document.getElementById("button");

const getValues = () => {
    const firstNumber = parseInt(document.getElementById("firstNumber").value);
    const secondNumber = parseInt(document.getElementById("secondNumber").value);

    console.log(">>", firstNumber + secondNumber);
    console.log(">>", secondNumber.toString(2));

}

button.addEventListener("click", function (e) {
    e.preventDefault();

    getValues();

})

