function printOutput(num){
    if (num == "")
        document.getElementById("output-value").innerText = num;
    else
        document.getElementById("output-value").innerText = getFormattedNumber(num);
}
function printHistory(num){
    document.getElementById("history-value").innerText = num;
}
function getHistory(){
    return document.getElementById("history-value").innerText;
}
function getOutput(){
    return document.getElementById("output-value").innerText;
}
function getFormattedNumber(num){
    if (num == "-")
        return "";
    let n = Number(num);
    return  n.toLocaleString("en");
}

function reverseNumberFormat(num){
    return Number(num.replace(/,/g, "")) // replace inside / /g by ""
}

var operator = document.getElementsByClassName("operator");
for (let i = 0; i < operator.length; i++) {
    operator[i].addEventListener('click', function (){
       if (this.id == "clear"){
           printOutput("");
           printHistory("");
       }
       else if (this.id =="backspace"){
           let output = reverseNumberFormat(getOutput()).toString();
           if (output)
               printOutput(output.substr(0, output.length - 1));
       }
       else {
            var output = getOutput();
            var history = getHistory();
            if (output == "" && history !=""){
                if (isNaN(history[history.length - 1]))
                    history = history.substr(0, history.length - 1);
            }
            if (output != "" || history != ""){
                output = output=="" ? output : reverseNumberFormat(output);
                history += output;
                if (this.id == "=") {
                    var result = eval(history);
                    printOutput(result);
                    printHistory("");
                }
                else {
                    history += this.id;
                    printHistory(history);
                    printOutput("");
                }
            }
       }
    })
}

var number = document.getElementsByClassName("number");
for (let i = 0; i < number.length; i++) {
    number[i].addEventListener('click', function (){
        let output = reverseNumberFormat(getOutput());
        if (output != NaN) {
            output += this.id;
            printOutput(output);
        }
    })
}
