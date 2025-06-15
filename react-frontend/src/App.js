import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    Study_Hours_per_Week: '',
    Attendance_Rate: '',
    Past_Exam_Scores: '',
    Final_Exam_Score: '',
    Internet_Access_at_Home: 'Yes',
    Extracurricular_Activities: 'Yes'
  });

  const [errors, setErrors] = useState({});
  const [prediction, setPrediction] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

const validateFields = () => {
  const newErrors = {};

  Object.entries(formData).forEach(([key, value]) => {
    if (value === '') {
      newErrors[key] = 'This field is required.';
    } else {
      const numberValue = parseFloat(value);

      if (numberValue < 0) {
        newErrors[key] = 'Cannot be negative.';
      } else {
        if (key === 'Study_Hours_per_Week' && numberValue > 168) {
          newErrors[key] = 'Cannot exceed 168 hours in a week.';
        }
        if (key === 'Attendance_Rate' && numberValue > 100) {
          newErrors[key] = 'Attendance rate cannot exceed 100%.';
        }
        if ((key === 'Past_Exam_Scores' || key === 'Final_Exam_Score') && numberValue > 100) {
          newErrors[key] = 'Score cannot exceed 100.';
        }
      }
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



  const handleSubmit = async () => {
    if (!validateFields()) {
      setPrediction('');
      setSuggestion('');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!data.Prediction) {
        setPrediction('An error occurred.');
        setSuggestion('');
        return;
      }

      setPrediction(data.Prediction);
      setSuggestion(
        data.Prediction === 'Pass'
          ? '🎉 Great job! Keep up the consistent study habits and stay focused.'
          : '💡 Don’t give up! Try reviewing past lessons, increasing study time, and improving your exam strategies. You got this!'
      );
    } catch (err) {
      setPrediction('Error contacting backend.');
      setSuggestion('');
    }
  };

  return (
    <div className="container">
      <h1>🎓 Student Performance Predictor</h1>
      <div className="card">
        <div className="form-section">
          <label>Study Hours per Week:</label>
          <input
            type="number"
            name="Study_Hours_per_Week"
            value={formData.Study_Hours_per_Week}
            onChange={handleChange}
          />
          {errors.Study_Hours_per_Week && <p className="error">{errors.Study_Hours_per_Week}</p>}

          <label>Attendance Rate (%):</label>
          <input
            type="number"
            name="Attendance_Rate"
            value={formData.Attendance_Rate}
            onChange={handleChange}
          />
          {errors.Attendance_Rate && <p className="error">{errors.Attendance_Rate}</p>}

          <label>Past Exam Scores:</label>
          <input
            type="number"
            name="Past_Exam_Scores"
            value={formData.Past_Exam_Scores}
            onChange={handleChange}
          />
          {errors.Past_Exam_Scores && <p className="error">{errors.Past_Exam_Scores}</p>}

          <label>Final Exam Score:</label>
          <input
            type="number"
            name="Final_Exam_Score"
            value={formData.Final_Exam_Score}
            onChange={handleChange}
          />
          {errors.Final_Exam_Score && <p className="error">{errors.Final_Exam_Score}</p>}

          <label>Internet Access at Home:</label>
          <select
            name="Internet_Access_at_Home"
            value={formData.Internet_Access_at_Home}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.Internet_Access_at_Home && <p className="error">{errors.Internet_Access_at_Home}</p>}

          <label>Extracurricular Activities:</label>
          <select
            name="Extracurricular_Activities"
            value={formData.Extracurricular_Activities}
            onChange={handleChange}
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
          {errors.Extracurricular_Activities && <p className="error">{errors.Extracurricular_Activities}</p>}

          <button onClick={handleSubmit}>Predict</button>
        </div>

        <div className="result-section">
          <h2>Result:</h2>
          <p className={prediction === 'Pass' ? 'pass' : prediction === 'Fail' ? 'fail' : 'error'}>
            {prediction}
          </p>
          {prediction === 'Pass' || prediction === 'Fail' ? (
            <p className="suggestion">{suggestion}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
