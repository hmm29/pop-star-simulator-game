const audio = new Audio('./audio/audio.mp3');
audio.loop = true;
const boo = new Audio('./audio/boo.mp3');
const cheers = new Audio('./audio/cheers.mp3');

let music = true;

let lastFollowerCount = 0;

function readTextFile(file, callback) {
  var rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  console.log("hey")
  rawFile.onreadystatechange = function () {
    console.log(rawFile.status)
    if (rawFile.readyState === 4 && rawFile.status === 200) {
      console.log('what')
      callback(rawFile.responseText);
    }
  }
  rawFile.send(null);
}
const gameOptions = {
  followers: 1000,
  happiness: {
    index: 6,
    images: [
      "img/happiness/happiness0.png",
      "img/happiness/happiness1.png",
      "img/happiness/happiness2.png",
      "img/happiness/happiness3.png",
      "img/happiness/happiness4.png",
      "img/happiness/happiness5.png",
      "img/happiness/happiness6.png",
      "img/happiness/happiness7.png",
      "img/happiness/happiness8.png",
      "img/happiness/happiness9.png",
      "img/happiness/happiness10.png",
    ]
  },

  time: {
    current: {
      quarter: 1,
      index: 1,
      percentage: 100
    },
    max: 12,
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
  }
}
var imagesLoaded = 0
var charImagesLoaded = 0
var totalImages = gameOptions.happiness.images.length
var imageLoadingFinished = false;
var charImageLoadingFinished = false

function imageLoaded() {
  imagesLoaded++
  if (imagesLoaded === totalImages) {
    imageLoadingFinished = true
    console.log(gameOptions.happiness.images)
  }
}

for (let i = 0; i < totalImages; i++) {
  let img = new Image()
  img.onload = () => {
    gameOptions.happiness.images[i] = img
    imageLoaded()

  }
  img.src = gameOptions.happiness.images[i]
}
//usage:
var options;
var characters;
var question_indices;
var loading = true;

readTextFile("cardText.json", function (text) {
  options = JSON.parse(text);
  question_indices = shuffle([...Array(options[gameOptions.time.current.quarter - 1].length).keys()]);

});
readTextFile("characters.json", function (text) {
  characters = JSON.parse(text);
  // console.log(characters[21])
  for (let i = 0; i < characters.length; i++) {
    let img = new Image()
    img.onload = () => {
      characters[i].cardImg = img
      charImagesLoaded++
      console.log(charImagesLoaded)
      if (charImagesLoaded === characters.length) {
        charImageLoadingFinished = true

      }

    }
    img.src = characters[i].cardImg
  }

});

const load = setInterval(() => {

  if (characters && options && charImageLoadingFinished && imageLoadingFinished) {
    loading = false
  }
  if (!loading) {
    introductionButton.querySelector(".button-middle-content").innerHTML = "I'm ready!"
    introductionButton.addEventListener("click", startGame);
    clearInterval(load)
  }
}, 150)
const findCharacterById = (id) => {
  return characters.find(o => o.id === id);
}


// select all elements
const startButton = document.querySelector(".button-start-game");
const start = document.getElementById("screen-start");
const introductionButton = document.querySelector(".button-im-ready");
const gameover = document.querySelector(".buttons-gameover");
const restart = document.querySelector(".button-restart");
const introduction = document.getElementById("screen-tutorial");

const game = document.getElementById("screen-game");
const question = document.querySelector(".card-description-question");
const characterDescription = document.querySelector(".card-description-character");
const characterImg = document.querySelector(".card-picture-image");

const choiceA = document.querySelector(".button-yes").querySelector(".button-middle-content");
const choiceB = document.querySelector(".button-no").querySelector(".button-middle-content");
const buttonYes = document.querySelector(".button-yes")
const buttonNo = document.querySelector(".button-no")
const followersValue = document.querySelector(".followers-value");
const happinessImg = document.querySelector(".happiness-value");
const month = document.querySelector(".calendar-week");
const monthPercentage = document.querySelector(".calendar-bar-fill");
const buttons = document.querySelector(".buttons");
const card = document.querySelector(".card");

const followersChange = document.querySelector(".followers-change");
const facebookShare = document.querySelector(".button-share");
const facebookShareGameover = document.querySelector(".button-share-gameover");

const body = document.querySelector(".game");
const mute = document.querySelector(".button-mute");
const highscore = document.querySelector(".start-highscore");

function lsTest(){
    const test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

if(lsTest()) {
  if (localStorage.highscore !== undefined && localStorage.highscore > 0) {
    highscore.innerHTML = "Your high score: " + nFormatter(localStorage.highscore, 1) + " followers"
  }
}

mute.addEventListener("click", () => {
  if (music) {
    audio.pause()
    music = false
    mute.classList.add("muted")
  } else {
    audio.play()
    music = true
    mute.classList.remove("muted")
  }
})

// create some variables

let runningQuestion = 0; //track current question

// connect buttons with functions
startButton.addEventListener("click", startIntroduction);
facebookShare.addEventListener("click", () => {
  const gameUrl = encodeURIComponent("https://replit.com/@hmaxgoeshuge/Pop-Star-Simulator")
  const fbUrl = "https://www.facebook.com/sharer/sharer.php?u="
  window.open(fbUrl + gameUrl, '_blank').focus();
});
// const tweet = "here you can write your tweet #hashtags @tags https://url"
// twitterShare.href = "https://twitter.com/intent/tweet?text=" + encodeURIComponent("tweet");
// twitterShare.addEventListener("click", () => {
//   window.open(twitterShare.href, '_blank').focus();
// });

buttonYes.addEventListener("click", () => {
  console.log("clicked button yes")
  renderResult(0)
});
buttonNo.addEventListener("click", () => {
  renderResult(1)
});

// shuffle a given array
function shuffle(l) {
  for (var j, x, i = l.length; i; j = parseInt(Math.random() * i), x = l[--i], l[i] = l[j], l[j] = x);
  return l;
}

function nFormatter(num, digits) {
  const isNegative = num < 0;
  if (num < 0) {
    num = -num;
  }

  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "B" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function (item) {
    return num >= item.value;
  });
  return item ? (isNegative ? "-" : "") + (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

// render starting stats
function renderStats(followersgain = 0) {
  animateFollowersGain(followersgain)
  followersValue.innerHTML = nFormatter(gameOptions.followers, 2);
  happinessImg.innerHTML = gameOptions.happiness.images[gameOptions.happiness.index].outerHTML


  month.innerHTML = gameOptions.time.months[gameOptions.time.current.index - 1] || "";
  monthPercentage.style.width = (gameOptions.time.months[gameOptions.time.current.index - 1] == undefined ? "0" : gameOptions.time.current.percentage) + '%';

}

function animateFollowersGain(followers) {

  followersChange.style.top = "-10px";
  followersChange.style.display = "none";

  let green = "rgb(38, 187, 38)"
  let red = "red"
  var sign = ""
  if (followers > 0) {
    followersChange.style.color = green
    sign = "+"

  } else if (followers < 0) {
    followersChange.style.color = red
  } else {
    return;
  }
  followersChange.querySelector(".followers-change-value").innerHTML = sign + nFormatter(followers)

  followersChange.style.display = "block"

  while (top > -50) {
    console.log(followersChange.style.top)
    console.log(followersChange.style.display)
    followersChange.style.top = (top - 0.5) + "px"
    top -= 0.5

  }
  var animate = setInterval(move, 10);
  var top = parseInt(followersChange.style.top.substr(0, followersChange.style.top.length - 2));

  function move() {
    top -= 0.5;
    followersChange.style.top = top + "px";
    if (top < -50) {
      clearInterval(animate)
    }
  }

}

// render a question
function renderQuestion() {
  // hidden.style.display = "none";
  // current question
  let q = options[gameOptions.time.current.quarter - 1][question_indices[runningQuestion]];
  console.log("running", runningQuestion)
  console.log("quarter", gameOptions.time.current.quarter - 1)
  console.log("indices", question_indices)
  console.log("option", options[gameOptions.time.current.quarter - 1])
  // recycle questions if run out to prevent dead end
  // TODO: q is sometimes undefined


  question.innerHTML = "<p>" + q.prompt + "</p>";
  const char = findCharacterById(q.characterId)
  characterDescription.innerHTML = char.firstName + ", " + char.role
  characterImg.style.backgroundImage = "url(" + char.cardImg.src + ")";
  // qImg.innerHTML = '<img src="' + q.imgSrc + '"/>';
  choiceA.innerHTML = q.options[0].optionText;
  choiceB.innerHTML = q.options[1].optionText;
  // choiceC.innerHTML = changeTextColor("&" + q.choiceC + "&");
  // testing whether the conditions are satisfied for choice C

}


//render a result
function renderResult(choice) {
  console.log("running", runningQuestion)
  console.log("quarter", gameOptions.time.current.quarter - 1)
  console.log("indices", question_indices)
  console.log("option", options[gameOptions.time.current.quarter - 1])
  let q = options[gameOptions.time.current.quarter - 1][question_indices[runningQuestion]];
  console.log(q)
  lastFollowerCount = gameOptions.followers;
  let newFollowerCount = gameOptions.followers + q.options[choice].followerDelta


  gameOptions.followers = newFollowerCount >= 0 ? newFollowerCount : 0;
  gameOptions.happiness.index += q.options[choice].happinessDelta
  gameOptions.happiness.index = gameOptions.happiness.index > 10 ? 10 : gameOptions.happiness.index;
  gameOptions.happiness.index = gameOptions.happiness.index < 0 ? 0 : gameOptions.happiness.index

  gameOptions.time.current.percentage += q.options[choice].timeDelta
  if (gameOptions.time.current.percentage <= 0) {
    gameOptions.time.current.percentage = 100
    gameOptions.time.current.index++

  }
  gameOptions.time.current.quarter = Math.floor((gameOptions.time.current.index - 1 + 3) / 3);

  renderStats(q.options[choice].followerDelta);
  continueGame()


}


// start introduction
function startIntroduction() {
  document.body.style.backgroundImage = "none";

  start.style.display = "none";
  introduction.style.display = "inline-block";
}


// start game
function startGame() {

  introduction.style.display = "none";
  game.style.display = "inline-block";

  audio.volume = 0.16;
  audio.play();

  renderQuestion();
  renderStats();
}

// next question
function continueGame() {



  console.log(gameOptions.time.current)
  // game over logics
  if (gameOptions.followers >= 1000000000) {
    gameOver('win');
  }
  else if (gameOptions.time.current.index > gameOptions.time.max) {

    gameOptions.time.current.percentage = 0
    gameOptions.time.current.index = gameOptions.time.max
    renderStats()
    if (gameOptions.followers >= 1000000000) {
      gameOver('win');

    } else {
      gameOver('time');

    }
  } else if (gameOptions.happiness.index <= 0) {
    gameOptions.happiness.index = 0

    renderStats()
    gameOver('happiness');
  } else if (gameOptions.followers <= 0) {
    gameOver('followers');
  } else {
    runningQuestion++;

    if (runningQuestion >= question_indices.length || runningQuestion >= options[gameOptions.time.current.quarter - 1].length) {
      runningQuestion = 0
      question_indices = shuffle([...Array(options[gameOptions.time.current.quarter - 1].length).keys()]);
      // console.log("question_indices: " + JSON.stringify(question_indices));
    }
    renderQuestion();
  }
}


function gameOver(temp) {

  audio.pause();

  boo.volume = 0.1;
  boo.play();

  if (temp == 'time') {
    characterImg.style.backgroundImage = "url('img/over.png')";
    characterDescription.innerHTML = "<p>Your pop career is dead</p>";
    question.innerHTML = "<p>You ran out of time. You were big but not big enough. The world moves on. You go back to living in your parents' basement.</p>";
    buttons.style.display = "none";
    gameover.style.display = "block";
    card.classList.add("defeat")
  } else if (temp == 'happiness') {
    characterImg.style.backgroundImage = "url('img/over.png')";
    characterDescription.innerHTML = "<p>Your pop career is dead</p>";
    question.innerHTML = "<p>With no team to help you run your business, you burn out and quit the industry.</p>";
    buttons.style.display = "none";
    gameover.style.display = "block";
    card.classList.add("defeat")
  } else if (temp == 'followers') {
    characterImg.style.backgroundImage = "url('img/over.png')";
    characterDescription.innerHTML = "<p>Your pop career is dead</p>";
    question.innerHTML = "<p>With no followers, you become irrelevant and are forgotten by the Internet.</p>"
    buttons.style.display = "none";
    gameover.style.display = "block";
    card.classList.add("defeat")
  } else if (temp == 'win') {
    cheers.volume = 0.3;
    cheers.play();
    characterImg.style.backgroundColor = "#26bb26";
    characterImg.style.backgroundImage = "url('img/win.gif')";
    characterDescription.innerHTML = "<p>You broke 1 Billion!!</p>";
    question.innerHTML = "<p>Congrats on all your success! You're officially the biggest pop star on the planet.</p>";

    buttons.style.display = "none";
    gameover.style.display = "block";

  }

  if(lsTest()) {
    if (localStorage.highscore === undefined) {
      if (temp == 'win') {
        localStorage.setItem("highscore", gameOptions.followers)
      } else {
        localStorage.setItem("highscore", lastFollowerCount);
      }
    } else {
      if (temp == 'win' && gameOptions.followers > parseInt(localStorage.highscore)) {
        localStorage.setItem("highscore", gameOptions.followers);
      } else if (lastFollowerCount > parseInt(localStorage.highscore)) {
        localStorage.setItem("highscore", lastFollowerCount);
      }
    }
  }

  restart.addEventListener("click", () => {
    location.reload();
  })

  facebookShareGameover.addEventListener("click", () => {
    const gameUrl = encodeURIComponent("https://replit.com/@hmaxgoeshuge/Pop-Star-Simulator")
    const fbUrl = "https://www.facebook.com/sharer/sharer.php?u="
    window.open(fbUrl + gameUrl, '_blank').focus();
  });

}



