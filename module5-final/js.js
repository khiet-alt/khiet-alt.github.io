document.addEventListener("DOMContentLoaded", (event) =>{
    function sayHello(event){
        
        
        var input = document.getElementById("input").value;
    
        document
            .getElementById("content")
            .innerHTML = "<h2>Hello " + input + "</h2"; 
        
        document
            .getElementById("content")
            .insertAdjacentHTML('beforeend', "<p>testting</p>");
    }
    document
        .querySelector("button")
        .addEventListener("click", sayHello);


    document
        .querySelector("body")
        .addEventListener("mousemove", (event) =>{
            if (event.shiftKey === true) {
                console.log(event.clientX);
                console.log(event.clientY);
            }
        });



})