var canvas = document.getElementById("image")
var ctx = canvas.getContext("2d")

var currentPart = "hair"

const parts = {
    hair: ["bang", "curls", "default", "elegant", "fancy", "quiff", "short"],
    ears: ["default", "tilt-backward", "tilt-forward"],
    eyes: ["angry", "default", "naughty", "panda", "smart", "star"],
    mouth: ["astonished", "default", "eating", "laugh", "tongue"],
    neck: ["bend-backward", "bend-forward", "default", "thick"],
    backgrounds: ["blue50", "darkblue30", "green50","grey70", "red60", "yellow50"],
    accessories: ["earings", "flower", "glasses", "headphone"],
    leg: ["bubble-tea", "cookie", "default", "game-console", "tilt-backward", "tilt-forward"],
    nose: ["nose"],
}

const currentStyle = [
    {backgrounds: "blue50"},
    {neck: "default"}, 
    {ears: "default"}, 
    {nose: "nose"},
    {mouth: "default"},
    {leg: "default"}, 
    {hair: "default"},
    {accessories: "flower"},
    {eyes: "default"}
]

draw()

function choicePart(button){
    for (var part of Object.keys(parts)){
        if(part === (button.innerHTML).toLowerCase()){
            currentPart = part
            $('.style-selection').html('')
            for(var style in parts[part] ){
                $('.style-selection').append('<button class=styling-btn onclick=styleAlpaca(this)>' 
                + parts[part][style] 
                + "</button>")
            }
        }
    }
}

function styleAlpaca(button){ 
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    for(var i = 0; i < currentStyle.length; i++){
        var key = Object.keys(currentStyle[i])[0]
        if(key === currentPart){
            currentStyle[i][key] = (button.innerHTML).toLowerCase()
        }
    }

    draw()
}

function download(){
    var link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = 'alpaca.png';

    var clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });

    link.dispatchEvent(clickEvent);
}

function random(){
    for(var i = 0; i< currentStyle.length; i++){
        var key = Object.keys(currentStyle[i])[0]
        var random = Math.floor(Math.random() * parts[key].length)

        currentStyle[i][key] = parts[key][random]
    }

    draw()
    
}

function loadImages(src){
    return new Promise((resolve, reject) => {
        var img = new Image()
        img.onload = () => {
            resolve(img)
        }
        img.onerror = () => {
            reject(new Error("Error while loading image: " + src))
        }
        img.src = src
    })
}

function draw(){
    var promises = []
    
    for(var i = 0; i < currentStyle.length; i++){
        var key = Object.keys(currentStyle[i])[0]

        var imgPromise = loadImages(`../alpaca/${key}/${currentStyle[i][key]}.png`)
        promises.push(imgPromise)
    }

    Promise.all(promises)
        .then((imgs) => {
            for(var i = 0; i < imgs.length; i++){
                ctx.drawImage(imgs[i], 0, 0, canvas.width, canvas.height);
            }
        })
        .catch((error) => {
            console.error(error.message)
        })
}