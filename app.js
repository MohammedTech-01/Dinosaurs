const dinoForm = document.getElementById("dino-compare");
const grid = document.getElementById("grid");
const buttonCompare = document.querySelector("#btn");

// Create Dino Constructor
function Dino(species, weight, height, diet, where, when, fact) {
  this.species = species;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.where = where;
  this.when = when;
  this.fact = fact;
}

// Create Dino Objects
function createDino(dinos) {
  let Dinos = [];
  dinos.forEach((data) => {
    Dinos.push(
      new Dino(
        data.species,
        data.weight,
        data.height,
        data.diet,
        data.where,
        data.when,
        data.fact
      )
    );
  });
  return Dinos;
}

// Create Human Constructor
function Human(name, weight, height, diet) {
  this.name = name;
  this.weight = weight;
  this.height = height;
  this.diet = diet;
  this.image = "human.png";
}

// Use IIFE to get human data from form
let getHumanData = (function () {
  let formData = new FormData(dinoForm);

  return new Human(
    formData.get("name"),
    formData.get("weight"),
    formData.get("feet") * 12 || formData.get("inches"),
    formData.get("diet")
  );
})();

// Create Dino Compare Method 1
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareWeight = (dino) => {
  const diffDino = Math.round(dino.weight - getHumanData.weight);
  const diffHuman = Math.round(getHumanData.weight - dino.weight);

  if (dino.weight > getHumanData.weight) {
    return `${dino.species} was ${diffDino} lbs heavier than you.`;
  } else {
    return `You are ${diffHuman} lbs hevier than ${dino.species}`;
  }
};

// Create Dino Compare Method 2
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareHeight = (dino) => {
  const diffDino = Math.round(dino.height - getHumanData.height);
  const diffHuman = Math.round(getHumanData.height - dino.height);

  if (dino.height > getHumanData.height) {
    return `${dino.species} was ${diffDino} inches taller than you.`;
  } else {
    return `You are ${diffHuman} inches taller than ${dino.species}`;
  }
};

// Create Dino Compare Method 3
// NOTE: Weight in JSON file is in lbs, height in inches.
Dino.prototype.compareDiet = (dino) => {
  return dino.diet.toLowerCase() === getHumanData.diet.toLowerCase()
    ? `you and ${dino.species} have same diet`
    : `you and ${dino.species} haven't same diet, ${dino.species} have ${dino.diet} diet`;
};

// Generate Tiles for each Dino in Array
function tiles(dino) {
  const dFarg = document.createDocumentFragment();
  const tile = document.createElement("div");
  tile.classList.add("grid-item");

  if (dino.name === getHumanData.name) {
    tile.innerHTML = `
    <h3>${getHumanData.name}</h3>
    <img src="images/${getHumanData.image}">
    <p></p>
    `;
  } else if (dino.species === "Pigeon") {
    tile.innerHTML = `
    <h3>${dino.species}</h3>
    <img src="images/${dino.species.toLowerCase()}.png">
    <p>${dino.fact}</p>
    `;
  } else {
    let randomFact = "";
    let randomNum = Math.floor(Math.random() * 9);
    console.log(randomNum);

    switch (randomNum) {
      case 1:
        randomFact = dino.compareWeight(dino);
        break;
      case 2:
        randomFact = dino.compareHeight(dino);
        break;
      case 3:
        randomFact = dino.compareDiet(dino);
        break;
      case 4:
        randomFact = `${dino.species} lived in ${dino.where}`;
        break;
      case 5:
        randomFact = `${dino.species} know since ${dino.when}`;
        break;
      default:
        randomFact = dino.fact;
        break;
    }

    tile.innerHTML = `
    <h3>${dino.species}</h3>
    <img src="images/${dino.species.toLowerCase()}.png">
    <p>${randomFact}</p>
    `;
  }

  // Add tiles to DOM
  grid.appendChild(tile);
}

fetch("dino.json")
  .then((response) => response.json())
  .then((data) => {
    const dinoArray = createDino(data.Dinos);
    dinoArray.splice(4, 0, getHumanData);
    // On button click, prepare and display infographic
    buttonCompare.addEventListener("click", () => {
      dinoArray.forEach((dino) => {
        tiles(dino);
      });
      // Remove form from screen
      dinoForm.innerHTML = "";
    });
  });
