
let selectHTML = `<option value="none" disabled selected>Select pre-trained model</option>`;

let rnns = {};

let rnn = null;
let story = "";

async function preload() {

    let models = await (await fetch("./models/models.json")).json();

    for(let model of models) {
        
        rnns[model.path] = ml5.charRNN(model.path);
        selectHTML += `<option value="${model.path}">${model.name}</option>`;

    }

    document.querySelector("#model").innerHTML = selectHTML;

}

function setup() {

    noCanvas();
    noLoop();

}

async function runModel() {

    // 20 generations of 5 characters based on the preceeding 10
    // createStory(20, 5, 10);

    // createStory(500, 7, 35, true);
    // createStory(500, 1, 30, false);
    // createStory(500, 50, 100, false);

    let model = rnns[document.querySelector("#model").value];
    let generationCount = parseInt(document.querySelector("#gen-cou").value);
    let generationLength = parseInt(document.querySelector("#gen-len").value);
    let seedLength = parseInt(document.querySelector("#see-len").value);

    if(model && (generationCount > 0) && (generationLength > 0) && (seedLength > 0)) {

        if(confirm(`Do ${generationCount} generations of ${generationLength} characters based on the preceeding ${seedLength}?`)) {

            rnn = model;
            story = document.querySelector("#sta-sto").value;
            await createStory(generationCount, generationLength, seedLength);

        }

    } else {

        alert("Make sure you have filled in all the fields with a valid value.")

    }

}

async function createStory(generations, length, sampleSize, verbose) {

    let outputText = document.querySelector("#output-text");

    for(let i = 0; i < generations; i++) {

        let res = await rnn.generate({
            seed: story.substring(story.length - sampleSize),
            length: length,
            temperature: 0.5 // Low temperatures results in more predictable text. Higher temperatures results in more surprising text.
        });

        if(outputText.hasAttribute("hidden"))
            outputText.removeAttribute("hidden");

        outputText.innerHTML = story.replace(/\n/g, "<br/>");
        story += res.sample;

        // if(i + 1 == generations && story.charAt(story.length - 1) != ".") {
            
        //     i --;

        // }

    }

    story = story.replace(/  /g, " ");
    alert("Done.");

}