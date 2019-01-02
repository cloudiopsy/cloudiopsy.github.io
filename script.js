var model; 

async function load() {
    console.log("loading model");
    model = await tf.loadModel('https://cloudiopsy.github.io/model/model.json');
}

function previewFile() {
    var preview = document.querySelector('img[class=preview]');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function() {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "NORM-FPDCNHFY.jpg";
    }
}

function analyze() {
    var file = document.querySelector('input[type=file]').files[0];
    if (file) {
        runModel(file)
    } else {
        document.getElementById('loader').style.display = 'none';
        alert('Please save the file and upload above, then click analyze!');
    }
}


async function runModel(file) {
    
    let fileName = file.name;

    let img_tensor = tf.fromPixels(document.getElementById("preview")).resizeNearestNeighbor([224, 224]);

    img_tensor = tf.expandDims(img_tensor, axis = 0);

    img_tensor = tf.div(img_tensor, 255);
    let predictions = await model.predict(img_tensor).dataSync();

    let percent;

    if (predictions < 0.5) {
        percent = ((1 - predictions) * 100).toFixed(2);
    } else {
        percent = ((predictions) * 100).toFixed(2);
    }

    document.getElementById("loader").style.display = "none";
    if (percent > 50) {
        if (predictions < 0.5) {
            document.getElementById("prediction-text").innerHTML = "File name: " + fileName + "<br/>This tissue is normal!";
        } else {
            document.getElementById("prediction-text").innerHTML = "File name: " + fileName + "<br/>This tissue contains tumours!";
        }
    } else {
        document.getElementById("prediction-text").innerHTML = "The model is uncertain. Please try a different image.";
    }


}

function moveSection() {
    window.location.hash = '';
    window.location.hash = 'analysis-section'
}

function showLoader() {
    document.getElementById('prediction-text').innerHTML = ''; 
    document.getElementById('loader').style.display = 'inline'; 
}