import React, { useState } from "react";
import "./Quiz.css";

const bloodGroupMapping = {
  "A+": 11, "A-": 12, "B+": 13, "B-": 14,
  "O+": 15, "O-": 16, "AB+": 17, "AB-": 18
};

const questions = [
  "Age (in Years)", "Weight (in Kg)", "Height (in Cm / Feet)",
  "Can you tell us your blood group?",
  "After how many months do you get your periods? (select 1- if every month/regular)",
  "Have you gained weight recently?",  
  "Do you have excessive body/facial hair growth?",
  "Are you noticing skin darkening recently?",
  "Do you have hair loss/hair thinning/baldness?",
  "Do you have pimples/acne on your face/jawline?",
  "Do you eat fast food regularly?",
  "Do you exercise on a regular basis?",
  "Do you experience mood swings?",
  "Are your periods regular?",
  "How long does your period last? (in Days) example- 1,2,3,4....."
];

const yesNoQuestions = [
  "Have you gained weight recently?",
  "Do you have excessive body/facial hair growth?",
  "Are you noticing skin darkening recently?",
  "Do you have hair loss/hair thinning/baldness?",
  "Do you have pimples/acne on your face/jawline?",
  "Do you eat fast food regularly?",
  "Do you exercise on a regular basis?",
  "Do you experience mood swings?",
  "Are your periods regular?"
];

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    let value = e.target.value.trim();
    setAnswers({ ...answers, [questions[currentQuestion]]: value });
  };

  const handleNext = () => {
    let value = answers[questions[currentQuestion]];

    if (questions[currentQuestion] === "Can you tell us your blood group?") {
      const formattedValue = value.toUpperCase();
      if (bloodGroupMapping[formattedValue]) {
        value = bloodGroupMapping[formattedValue];
      } else {
        alert("Invalid blood group. Please enter a valid blood group (e.g., A+, B-, O+)." );
        return;
      }
    }

    if (yesNoQuestions.includes(questions[currentQuestion])) {
      value = value.toLowerCase();
      if (value === "yes") value = "1";
      else if (value === "no") value = "0";
    }

    setAnswers({ ...answers, [questions[currentQuestion]]: value });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting Data:", answers);
    setSubmitted(true);
    setPrediction("Processing...");

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: Object.values(answers) })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      console.log("API Response:", data);
      setPrediction(data.prediction === 1 ? "You may have PCOS. Please consult a doctor." : "No PCOS detected. Stay healthy!");
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error: Could not fetch prediction.");
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSubmitted(false);
    setPrediction(null);
  };

  return (
    <div className="quiz-container">
      {!submitted ? (
        <div className="quiz-box">
          <h2 className="question"> {currentQuestion + 1}/{questions.length}: {questions[currentQuestion]}</h2>
          <input
            type="text"
            className="quiz-input"
            value={answers[questions[currentQuestion]] || ""}
            onChange={handleChange}
          />
          <div className="button-group">
            <button className="quiz-button" onClick={handleNext}>
              {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
            </button>
            <button className="quiz-button restart" onClick={handleRestart}>Restart Quiz</button>
          </div>
        </div>
      ) : (
        <div className="quiz-box">
          <h2 className="question">Prediction Result:</h2>
          {prediction ? <p>{prediction}</p> : <p>Processing...</p>}
          <button className="quiz-button restart" onClick={handleRestart}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
