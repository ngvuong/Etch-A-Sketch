const container = document.querySelector(".container");
//configure grid size to start sketch
const sizeInput = document.querySelector("#size-input");

const sketchBtn = document.querySelector("#sketch-btn");
sketchBtn.addEventListener("click", createGrid);

//initial 16x16 grid
createGrid();
//draw square grid by creating the appropriate amount of divs, default 16x16
function createGrid(e, size = sizeInput.value || 16) {
  if (!+size || size > 100) {
    alert("Please enter a valid number from 2 to 100.");
    return;
  }
  if (container.childNodes.length != size * size) {
    container.textContent = "";
    for (i = 0; i < size * size; i++) {
      div = document.createElement("div");
      div.classList.add("squares");
      container.appendChild(div);
      //setting css grid style for square grid using size
      container.setAttribute(
        "style",
        `grid-template-columns: repeat(${size}, 1fr)`
      );
    }
  }
  chooseMode();
}

//sets up and handle mouse enter event on each square according to mode
function chooseMode() {
  container.childNodes.forEach((div) =>
    div.addEventListener("mouseenter", function (e) {
      const mode = document.querySelector("#mode-select").value;
      if (e.ctrlKey) {
        if (mode != "shading") {
          this.style.opacity = null;
        }
        //pass event and mode to start sketching
        sketchPad(e, mode);
        document.body.style.cursor = "url('assets/brush.cur'), auto";
      } else if (e.shiftKey) {
        this.style.backgroundColor = "white";
        document.body.style.cursor = "url('assets/eraser.cur'), auto";
      } else {
        document.body.style.cursor = "default";
      }
    })
  );
}

//fill squares accordingly depending on mode
function sketchPad(e, mode) {
  let square = e.target;
  const color = document.querySelector("#color-picker").value;
  if (mode == "fill") {
    square.style.backgroundColor = color;
  } else if (mode == "rgb") {
    rgbVals = sketchRGB();
    square.style.backgroundColor = rgbVals;
  } else {
    //track current opacity for shading
    opacity = +square.style.opacity;
    if (opacity < 1 || square.style.backgroundColor != color) {
      square.style.backgroundColor = color;
      square.style.opacity = `${opacity + 0.1}`;
    }
  }
}

//resetting sketch
const resetBtn = document.querySelector("#reset-btn");
resetBtn.addEventListener("click", resetSketch);

//reset canvas by setting squares background color back to white and null out opacity
function resetSketch() {
  if (container.firstChild && confirm("Resetting sketch, are you sure?")) {
    container.childNodes.forEach((div) => {
      div.style.backgroundColor = "white";
      div.style.opacity = null;
    });
  }
}
//returns string for RGB mode
function sketchRGB() {
  let rand = () => Math.floor(Math.random() * 256);
  return `rgb(${rand()},${rand()},${rand()})`;
}
