let socket = io();
let playing = false;

function preload() {
    img = loadImage('holdinghands.png');
}

function sendFreq(){
    const data = [nameField.value(), freqInput.value()]
    socket.emit("frequency", data);
    console.log(data);
}

socket.on('freqResponse', (data) => {
    console.log(data);
    freqState.html(data[0] + " changed the frequency to " + data[1]);
    oscillator.freq(data[1], 0.250);
});

socket.on('receiveCircle', (data) => {
    console.log(data);
    const splitData = data.split(' ');
    const x = splitData[0];
    const y = splitData[1];
    fill(255, 0, 0, 100);
    circle(x, y, 10);
});

//log new users as they come into the room
socket.on('response', (data) => {
    console.log(data);
    freqState.html(data + " joined the room");
});

socket.on('trigger', (data) => {
    console.log(data[0]);
    console.log(data[1]); 
});

function submit() {
    socket.emit("circle", nameField.value());
    freqState.html('idle...');
    oscillator.start();
    playing = true;
}

function networkedCircle(x, y) {
    socket.emit("circle", `${x} ${y}`);
}

async function setup() {
    cnv = createCanvas(400, 400);
    cnv.parent('main');
    background(255, 255, 255, 0);
    imageMode(CENTER);
    image(img, width / 2, height / 2, 400, 400);
    noStroke();
    //create name field and button
    //create instruction text
    instruction = createP('enter your handle to begin');
    instruction.id('instruction');
    instruction.parent('main');
    instruction.position(10, 170);
    nameField = createInput();
    nameField.id('name');
    nameField.attribute('placeholder', 'enter your handle');
    nameField.position(10, 10);
    submitButton = createButton('submit');
    submitButton.id('submit');
    submitButton.position(nameField.x + nameField.width + 10, 10);
    submitButton.mousePressed(submit);

    //create inputStuff section
    inputStuff = createDiv();
    inputStuff.id('inputStuff');
    inputStuff.parent('main');
    inputStuff.position(10, 250);
    //create frequency input and button
    freqInput = createInput();
    freqInput.id('frequency');
    freqInput.attribute('placeholder', 'enter a frequency');
    freqInput.position(10, 50);
    sendButton = createButton('send');
    sendButton.id('send');
    sendButton.position(freqInput.x + freqInput.width + 10, 50);
    sendButton.mousePressed(sendFreq);
    //create play button
    buttonEl = createButton('stop');
    buttonEl.mousePressed(play);
    buttonEl.id('buttonText');
    buttonEl.position(10, 90);
    //create frequency state text
    freqState = createP('idle...');
    freqState.class('freqState');
    freqState.style('width', '400px');
    freqState.position(10, 120);

    //create name stuff section
    nameStuff = createDiv();
    nameStuff.id('nameStuff');
    nameStuff.parent('main');
    nameStuff.position(10, 210);
    nameStuff.child(nameField);
    nameStuff.child(submitButton);
    //create input stuff section
    inputStuff.child(buttonEl);
    inputStuff.child(freqState);
    inputStuff.child(freqInput);
    inputStuff.child(sendButton);
    //create title
    title = createElement('h1', 'group-draw');
    title.parent('main');
    title.position(10, -10);
    title.class('title');
    //create subtitle
    subtitle = createElement('p', 'a multi-person audio work');
    subtitle.parent('main');
    subtitle.position(10, 25);
    subtitle.class('subtitle');
    //attribution
    attribution = createElement('p', 'by Tommy (2023)');
    attribution.parent('main');
    attribution.position(10, 35);
    attribution.class('attribution');
    //create a p5 sound oscillator
    frameRate(10);
}

function draw() {
    circle(mouseX, mouseY, 10);
    networkedCircle(mouseX, mouseY);
}


function play() {
    if (!playing) {
        
        playing = true;
        buttonEl.html('stop');
    } else {
        
        playing = false;
        buttonEl.html('play');
    }
}
