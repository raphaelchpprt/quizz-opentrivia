const URL = "https://opentdb.com/api.php?amount=";
const selector = document.getElementById("sub-container");
const delayInMilliseconds = 500;
let j = 0;
let questions = [];
let userAnswers = [];

document.getElementById("amount-form").onsubmit = (e) => {
  e.preventDefault();
  submitForm();
};

const submitForm = () => {
  const questionsAmount = document.getElementById("exampleSelect1").value;
  const difficulty = document
    .getElementById("exampleSelect2")
    .value.toLowerCase();
  document.getElementById("welcome-form").remove();
  getQuestions(questionsAmount, difficulty);
};

const getQuestions = (questionsAmount, difficulty) => {
  fetch(URL + questionsAmount + `&difficulty=` + difficulty)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      questions.push(response.results);
      questions = questions.flat();
      showQuestion(questions[j]);
    });
};

const showQuestion = (question) => {
  selector.innerHTML = `
  <div class="card p-md-5 p-3 mt-5 mb-5 ml-md-5 mr-md-5 pb-5 question">
    <h3 class="text-center mt-2 font-weight-bold text-primary"><span class="badge badge-pill badge-primary mb-2">${
      j + 1
    }</span><br>${question.question}</h3>
    <div class="row" id="answers"></div>
  </div>
  `;
  showAnswers(question);
  newQuestionAnim();
};

const showAnswers = (question) => {
  const answers = [];
  answers.push(question.correct_answer);
  question.incorrect_answers.forEach((e) => {
    answers.push(e);
  });
  shuffle(answers);

  const selectorAnswer = document.getElementById("answers");
  answers.forEach((answer) => {
    selectorAnswer.innerHTML += `
        <div class="col-sm-6">
          <div class="card p-4 mt-5 border-primary answer-card">
            <h6 class="text-center mt-2 text-primary">${answer}</h5>
          </div>
        </div>
      `;
  });

  let answerCards = document.getElementsByClassName("answer-card");
  for (let i = 0; i < answerCards.length; i++) {
    getUserAnswer(answerCards[i]);
    answerCards[i].addEventListener("click", function () {
      j++;
      leavingQuestionAnim();
      if (j < questions.length) {
        setTimeout(function () {
          showQuestion(questions[j]);
        }, delayInMilliseconds);
      } else {
        setTimeout(function () {
          showResults();
        }, 1500);
      }
    });
  }
};

const leavingQuestionAnim = () => {
  anime({
    targets: ".question",
    translateX: -1500,
  });
};

const newQuestionAnim = () => {
  anime({
    targets: ".question",
    translateX: -250,
  });
};

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const getUserAnswer = (answerCard) => {
  answerCard.addEventListener(
    "click",
    function (e) {
      e = e || window.event;
      let target = e.target || e.srcElement,
        userAnswer = target.textContent || target.innerText;
      userAnswer = userAnswer.trim();
      userAnswers.push(userAnswer);
    },
    false
  );
};

const showResults = () => {
  let goodAnswers = 0;
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].correct_answer) {
      goodAnswers++;
    }
  }
  selector.innerHTML = `
  <div class="mt-3">
    <h3 class="text-center mt-5 mb-5 font-weight-bold text-primary">Score : <span class="font-weight-light">${goodAnswers}/${questions.length}</span></h3>
    <table class="table bg-white table-responsive mb-5 p-3 rounded table-borderless">
      <thead>
        <tr>
          <th scope="col" class="text-primary" style="width: 2%"></th>
          <th scope="col" class="text-primary text-nowrap" style="width: 60%">Question</th>
          <th scope="col" class="text-primary text-nowrap" style="width: 20%">Ta réponse</th>
          <th scope="col" class="text-primary text-nowrap" style="width: 20%">La bonne réponse</th>
        </tr>
        <tbody id="row-results">
        </tbody>
      </thead>
    </table>
  </div>
  `;

  let rowResult = document.getElementById("row-results");
  for (let i = 0; i < questions.length; i++) {
    if (userAnswers[i] === questions[i].correct_answer) {
      rowResult.innerHTML += `
      <tr>
        <td scope="row"><i class="fas fa-check-circle text-success h4"></i></th>
        <td scope="row">${questions[i].question}</th>
        <td class="text-success">${userAnswers[i]}</td>
        <td class="text-success">${questions[i].correct_answer}</td>
      </tr>
      `;
    } else {
      rowResult.innerHTML += `
      <tr>
        <td scope="row"><i class="fas fa-times-circle text-danger h4"></i></th>
        <td>${questions[i].question}</th>
        <td class="text-danger">${userAnswers[i]}</td>
        <td class="text-success">${questions[i].correct_answer}</td>
      </tr>
      `;
    }
  }
  anime({
    targets: selector,
    rotate: 720,
    duration: 5000,
  });
};
