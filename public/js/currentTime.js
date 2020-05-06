let currentTime = document.querySelector('.time');

setInterval(function(){
    var date = new Date();
    currentTime.innerHTML = `<b>${date.toLocaleTimeString()}</b>`
},1000);