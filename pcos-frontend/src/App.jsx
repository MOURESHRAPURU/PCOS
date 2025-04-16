import React, { useState } from "react";
import "./App.css";
import Quiz from "./components/Quiz.jsx";

function App() {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizSubmit = async (answers) => {
    console.log("User responses:", answers);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {  // ✅ FIXED PORT
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      const data = await response.json();
      alert(`Prediction Result: ${data.prediction}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  return (
    <div className="container">
      {!showQuiz ? (
        <>
          <button className="start-quiz" onClick={() => setShowQuiz(true)}>
            Start Your Quiz
          </button>
        </>
      ) : (
        <Quiz onSubmit={handleQuizSubmit} />
      )}
    </div>
  );
}

export default App;
