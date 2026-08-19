import React, { useState, useEffect } from 'react';

// Central API Configuration
const API_URL = 'http://localhost:5000/api';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  // Dashboard & Quiz State
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // Clear session data
  const handleLogout = () => {
    localStorage.clear();
    setToken('');
    setUser(null);
    setActiveQuiz(null);
    setQuizResult(null);
  };

  // Submit login/registration to Express API
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister ? { name, email, password, role } : { email, password };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Authentication failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch quizzes when logged in
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => setQuizzes(Array.isArray(data) ? data : []))
        .catch(() => setError('Could not load quizzes from backend.'));
    }
  }, [token]);

  // Handle option selection during quiz
  const handleSelectOption = (questionIndex, optionIndex) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: optionIndex });
  };

  // Submit completed quiz to backend
  const handleSubmitQuiz = async () => {
    try {
      const response = await fetch(`${API_URL}/student/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          quizId: activeQuiz._id,
          answers: selectedAnswers
        })
      });
      const resultData = await response.json();
      setQuizResult(resultData);
    } catch (err) {
      setError('Failed to submit quiz.');
    }
  };

  // 1. Render Login / Register View
  if (!token) {
    return (
      <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <form onSubmit={handleAuthSubmit}>
          {isRegister && (
            <div style={{ marginBottom: '10px' }}>
              <label>Full Name</label>
              <input 
                type="text" 
                style={{ width: '100%', padding: '8px' }} 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
          )}
          <div style={{ marginBottom: '10px' }}>
            <label>Email Address</label>
            <input 
              type="email" 
              style={{ width: '100%', padding: '8px' }} 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '8px' }} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px' }}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <button 
          onClick={() => setIsRegister(!isRegister)} 
          style={{ marginTop: '10px', background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}
        >
          {isRegister ? 'Already have an account? Login' : "Need an account? Register"}
        </button>
      </div>
    );
  }

  // 2. Render Score/Results View
  if (quizResult) {
    return (
      <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif' }}>
        <h2>Quiz Results</h2>
        <p>Your Score: <strong>{quizResult.score}%</strong></p>
        <p>Status: <strong style={{ color: quizResult.passed ? 'green' : 'red' }}>{quizResult.passed ? 'PASSED' : 'FAILED'}</strong></p>
        <button onClick={() => { setActiveQuiz(null); setQuizResult(null); }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  // 3. Render Active Quiz View
  if (activeQuiz) {
    const q = activeQuiz.questions[currentQuestion];
    return (
      <div style={{ maxWidth: '600px', margin: '30px auto', fontFamily: 'sans-serif' }}>
        <h3>{activeQuiz.title}</h3>
        <p>Question {currentQuestion + 1} of {activeQuiz.questions.length}</p>
        <hr />
        <h4>{q.questionText}</h4>

        {q.options.map((option, idx) => (
          <label key={idx} style={{ display: 'block', margin: '8px 0', cursor: 'pointer' }}>
            <input
              type="radio"
              name={`q-${currentQuestion}`}
              checked={selectedAnswers[currentQuestion] === idx}
              onChange={() => handleSelectOption(currentQuestion, idx)}
            />
            {option}
          </label>
        ))}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button 
            disabled={currentQuestion === 0} 
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
          >
            Previous
          </button>
          
          {currentQuestion < activeQuiz.questions.length - 1 ? (
            <button onClick={() => setCurrentQuestion(currentQuestion + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmitQuiz}>Submit Quiz</button>
          )}
        </div>
      </div>
    );
  }

  // 4. Render Student/Admin Main Dashboard View
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>AssessHub Portal</h2>
        <div>
          <span>Welcome, <strong>{user?.name || 'User'}</strong> ({user?.role}) </span>
          <button onClick={handleLogout} style={{ marginLeft: '10px' }}>Logout</button>
        </div>
      </header>
      <hr />

      <h3>Available Assessments</h3>
      {quizzes.length === 0 ? (
        <p>No assessments found or server disconnected.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {quizzes.map((quiz) => (
            <div key={quiz._id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h4>{quiz.title}</h4>
              <p>{quiz.questions?.length || 0} Questions</p>
              <button onClick={() => { setActiveQuiz(quiz); setCurrentQuestion(0); }}>
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}