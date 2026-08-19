import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api';

const MOCK_QUIZZES = [
  { _id: '1', title: 'JavaScript Fundamentals', questions: [1, 2, 3, 4, 5] },
  { _id: '2', title: 'React Basics & Hooks', questions: [1, 2, 3] },
  { _id: '3', title: 'Node.js & Express API', questions: [1, 2, 3, 4] }
];
export default function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [token] = useState(localStorage.getItem('token') || 'demo-token');

  useEffect(() => {
    fetch(`${API_URL}/quizzes`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setQuizzes(data);
      })
      .catch(() => setQuizzes([]));
  }, [token]);

  const handleStartQuiz = (quiz) => {
    console.log('Starting quiz:', quiz);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '2rem auto', padding: '0 1.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {quizzes.map((quiz) => (
          <div 
            key={quiz._id} 
            style={{
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '1.25rem',
              borderRadius: '16px',
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.8))',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              color: '#f8fafc'
            }}
          >
            <div>
              <h4 style={{ marginTop: '0', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                {quiz.title}
              </h4>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                {quiz.questions?.length || 0} Questions
              </p>
            </div>

            <button 
              onClick={() => handleStartQuiz(quiz)}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #4f46e5, #4338ca)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.4rem',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}