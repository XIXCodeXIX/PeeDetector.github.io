const urineColorRanges = {
  Clear: [
    [200, 220, 230], // Adjusted upper bound
    [255, 255, 255],
  ],
  "Pale or transparent": [
    [180, 200, 210], // Adjusted upper bound
    [240, 250, 255], // Adjusted upper bound
  ],
  "Dark yellow": [
    [80, 60, 0], // Adjusted lower bound
    [240, 220, 140],
  ],
  Orange: [
    [120, 50, 0], // Adjusted lower bound
    [255, 200, 100],
  ],
  "Dark orange or brown": [
    [50, 20, 5], // Adjusted lower bound
    [200, 130, 80],
  ],
  "Dark brown or black": [
    [10, 5, 0], // Adjusted lower bound
    [100, 70, 50],
  ],
  "Pink or red": [
    [50, 0, 0], // Adjusted lower bound to include a wider range of red tones
    [255, 170, 170], // Adjusted upper bound
  ],
  Cloudy: [
    [180, 180, 180], // Adjusted lower bound
    [255, 255, 255], // Adjusted upper bound
  ],
  "White or milky": [
    [220, 220, 220],
    [255, 255, 255],
  ],
  Blue: [
    [0, 50, 50], // Adjusted lower bound
    [0, 200, 200], // Adjusted upper bound
  ],
};

// Function to check if a color falls within a specified range
function isColorInRange(color, colorRange) {
  for (let i = 0; i < 3; i++) {
    if (color[i] < colorRange[0][i] || color[i] > colorRange[1][i]) {
      return false;
    }
  }
  return true;
}

// Function to analyze urine color
function analyzeUrineColor(color) {
  for (const [urineColor, range] of Object.entries(urineColorRanges)) {
    if (isColorInRange(color, range)) {
      return urineColor;
    }
  }
  return "Unknown"; // If color doesn't match any range
}

// Function to handle image upload and analysis
function uploadUrineImage() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;

        let totalColor = [0, 0, 0];
        let pixelCount = 0;

        // Define the color of the toilet
        const toiletColor = [255, 255, 255]; // Adjust as needed

        for (let i = 0; i < pixels.length; i += 4) {
          // Check if the pixel color is different from the toilet color
          if (
            pixels[i] !== toiletColor[0] ||
            pixels[i + 1] !== toiletColor[1] ||
            pixels[i + 2] !== toiletColor[2]
          ) {
            totalColor[0] += pixels[i];
            totalColor[1] += pixels[i + 1];
            totalColor[2] += pixels[i + 2];
            pixelCount++;
          }
        }

        if (pixelCount === 0) {
          console.log(
            "No valid pixels found. Make sure the toilet color is different from the urine color."
          );
          return;
        }

        const averageColor = [
          totalColor[0] / pixelCount,
          totalColor[1] / pixelCount,
          totalColor[2] / pixelCount,
        ];

        const urineColor = analyzeUrineColor(averageColor);
        const resultElement = document.getElementById("result");
        resultElement.innerText = "Urine color: " + urineColor;

        // Display color description
        displayColorDescription(urineColor);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// Function to display color description
function displayColorDescription(urineColor) {
  const colorDescriptionElement = document.getElementById("colorDescription");
  let description = "";
  switch (urineColor) {
    case "Clear":
      description = "A sign that a person is drinking too much water.";
      break;
    case "Pale or transparent":
      description = "A sign that a person is drinking enough water.";
      break;
    case "Dark yellow":
      description = "A sign that a person is not drinking enough water.";
      break;
    case "Orange":
      description =
        "A sign that a person is not drinking enough water. Certain vitamins and medications can also cause orange urine.";
      break;
    case "Dark orange or brown":
      description =
        "A sign that a person is not drinking enough water or the body is not producing enough water. It can also indicate liver problems.";
      break;
    case "Dark brown or black":
      description =
        "A sign of medical conditions, such as liver disease, rhabdomyolysis, or alkaptonuria.";
      break;
    case "Pink or red":
      description =
        "An indication of blood in the urine or a result of some medications or foods, such as beets.";
      break;
    case "Blue or green":
      description =
        "A result of eating foods containing large amounts of dye or some medications. Green urine can indicate a urinary tract infection.";
      break;
    case "Cloudy":
      description = "A sign of a urinary tract infection.";
      break;
    case "White or milky":
      description = "An indication of a condition called chyluria.";
      break;
    default:
      description = "Unknown";
  }
  colorDescriptionElement.innerText = description;

  // Show the container after analysis
  document.getElementById("container0").style.display = "block";
}
