import './style.css'

const videoElement = document.querySelector('#videoElement');
const cameraSelect = document.querySelector('#cameraselect');
const buttons = [...document.querySelectorAll('button')];
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext("2d");

const [play, pause] = buttons;

async function findFaces() {
  // Load the model.
  const model = await blazeface.load();

  // Pass in an image or video to the model. The model returns an array of
  // bounding boxes, probabilities, and landmarks, one for each detected face.

  while (true) {
    const returnTensors = false; // Pass in `true` to get tensors back, rather than values.
    const predictions = await model.estimateFaces(videoElement, returnTensors);

    if (predictions.length > 0) {
      /*
      `predictions` is an array of objects describing each detected face, for example:
  
      [
        {
          topLeft: [232.28, 145.26],
          bottomRight: [449.75, 308.36],
          probability: [0.998],
          landmarks: [
            [295.13, 177.64], // right eye
            [382.32, 175.56], // left eye
            [341.18, 205.03], // nose
            [345.12, 250.61], // mouth
            [252.76, 211.37], // right ear
            [431.20, 204.93] // left ear
          ]
        }
      ]
      */
      console.log(predictions);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < predictions.length; i++) {
        const start = predictions[i].topLeft;
        const end = predictions[i].bottomRight;
        const size = [end[0] - start[0], end[1] - start[1]];

        // Render a rectangle over each detected face.
        ctx.fillRect(start[0], start[1], size[0], size[1]);

      }

    }
  }

}

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  const options = videoDevices.map(videoDevice => {
    return `<option value="${videoDevice.deviceId}">${videoDevice.label}</option>`;
  });
  cameraSelect.innerHTML = options.join('');
};

const startStream = (constraints) => {
  navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    videoElement.srcObject = stream;
  });
};

cameraSelect.onchange = () => {
  const updatedConstraints = {
    video: {
      width: 640,
      height: 480,
    },
    deviceId: {
      exact: cameraSelect.value
    }
  };
  startStream(updatedConstraints);
};

const pauseStream = () => {
  videoElement.pause();
};

pause.onclick = pauseStream;

play.onclick = () => {
  /*
  videoElement.play();

  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      video: {
        width: 640,
        height: 480,
      },
      deviceId: {
        exact: cameraSelect.value
      }
    };
    startStream(updatedConstraints);
  }
  */
  findFaces();
};

function load() {
  navigator.mediaDevices.getUserMedia({
    video: {
      width: 640,
      height: 480,
    }
  }).then(stream => {
    videoElement.srcObject = stream;
  });
}

load();
getCameraSelection();
