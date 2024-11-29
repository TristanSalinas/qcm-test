const url = "https://opentdb.com/api.php?amount=15";

//UTILITY functions
//GPT STUFF: la flemme de coder ça
//GPT SHUFFLE ARRAY
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at index i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
//GPT DECODE HTML ESCAPE CHARACTER
function decodeHtmlEntities(str) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = str;
  return textArea.value;
}

//function process(string)

//MON SUPER TRIVIAL
async function getQuestions() {
  console.log("loading questions");
  let response = await fetch(url);
  let data = await response.json();
  return data;
}

getQuestions().then((data) => {
  console.log(data);
  const questionsList = data.results;
  game(questionsList);
});

function game(questionList) {
  const container = document.querySelector(".game-container");
  const questionP = document.createElement("p");
  const responsesDiv = document.createElement("div");
  responsesDiv.classList.add("responses");
  const nextButton = document.createElement("button");
  nextButton.textContent = "Submit";
  let currQuestionIndex = 0;
  let state = "SUBMIT"; // state  = SUBMIT || NEXT

  const scoreP = document.createElement("p");
  const score = { points: 0, total: 0 };

  scoreP.textContent = "Score :" + score.points + " / " + score.total;

  container.append(questionP, responsesDiv, nextButton, scoreP);

  const clear = () => {
    questionP.textContent = "";
    responsesDiv.innerHTML = "";
  };

  const answerOption = (answer, index) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "radio";
    input.name = "option";
    input.value = answer.split(" ").join("");
    label.setAttribute("data", answer);
    label.appendChild(input);
    label.appendChild(document.createTextNode(` ${answer}`));

    return label;
  };

  const actualise = () => {
    clear();
    let currentQuestion = questionList[currQuestionIndex];
    questionP.appendChild(
      document.createTextNode(
        "Question n°" +
          (currQuestionIndex + 1) +
          " : " +
          decodeHtmlEntities(currentQuestion.question)
      )
    );

    let answerArray = [
      currentQuestion.correct_answer,
      ...currentQuestion.incorrect_answers,
    ];

    answerArray = shuffleArray(answerArray);

    answerArray.forEach((answer, index) => {
      responsesDiv.append(answerOption(decodeHtmlEntities(answer), index));
    });
    scoreP.textContent = "Score :" + score.points + " / " + score.total;
  };

  nextButton.addEventListener("click", () => {
    if (state === "SUBMIT") {
      state = "NEXT";
      nextButton.textContent = "Next";
      const correctAnswerLabel = responsesDiv.querySelector(
        `label[data="${questionList[currQuestionIndex].correct_answer}"]`
      );
      correctAnswerLabel.style.backgroundColor = "green";

      if (correctAnswerLabel.firstChild.checked) {
        score.points++;
        score.total++;
      } else {
        score.total++;
      }
      currQuestionIndex++;
    } else {
      state = "SUBMIT";
      nextButton.textContent = "Submit";
      actualise();
    }
  });
  actualise();
}
