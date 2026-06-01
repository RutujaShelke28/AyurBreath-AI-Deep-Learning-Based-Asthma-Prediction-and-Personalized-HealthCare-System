import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import './Assessment.css';

const doshaQuestions = [
  {
    id: 'dq1', question: 'Your body frame is naturally:',
    options: [
      { text: 'A) Thin, lanky, or very tall/short', dosha: 'vata' },
      { text: 'B) Medium, athletic, and well-proportioned', dosha: 'pitta' },
      { text: 'C) Large, broad, or sturdy', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq2', question: 'Your skin is generally:',
    options: [
      { text: 'A) Dry, thin, or prone to roughness', dosha: 'vata' },
      { text: 'B) Oily, warm, and sensitive (redness/freckles)', dosha: 'pitta' },
      { text: 'C) Thick, smooth, and naturally moist', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq3', question: 'Your hair is best described as:',
    options: [
      { text: 'A) Dry, curly, or frizzy', dosha: 'vata' },
      { text: 'B) Fine, straight, or thinning/prematurely gray', dosha: 'pitta' },
      { text: 'C) Thick, lustrous, and oily', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq4', question: 'Your eyes are:',
    options: [
      { text: 'A) Small, active, or sunken', dosha: 'vata' },
      { text: 'B) Medium-sized with a sharp, penetrating gaze', dosha: 'pitta' },
      { text: 'C) Large, wide, and calm with thick lashes', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq5', question: 'Your teeth and smile are:',
    options: [
      { text: 'A) Irregular, crooked, or thin lips', dosha: 'vata' },
      { text: 'B) Medium-sized, yellowish tint, or reddish gums', dosha: 'pitta' },
      { text: 'C) Large, white, and even with full lips', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq6', question: 'Your hands and feet are usually:',
    options: [
      { text: 'A) Cold to the touch; you prefer warm weather', dosha: 'vata' },
      { text: 'B) Warm; you sweat easily and prefer cool weather', dosha: 'pitta' },
      { text: 'C) Cool and clammy; you dislike damp/cold weather', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq7', question: 'Regarding weight, you:',
    options: [
      { text: 'A) Struggle to gain weight and stay thin', dosha: 'vata' },
      { text: 'B) Can gain or lose weight easily if you try', dosha: 'pitta' },
      { text: 'C) Gain weight easily and find it very hard to lose', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq8', question: 'Your appetite is:',
    options: [
      { text: "A) Irregular; you often forget to eat or snack randomly", dosha: 'vata' },
      { text: "B) Strong and intense; you get 'hangry' if a meal is missed", dosha: 'pitta' },
      { text: 'C) Steady but low; you can comfortably skip meals', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq9', question: 'Your digestion is prone to:',
    options: [
      { text: 'A) Bloating, gas, or constipation', dosha: 'vata' },
      { text: 'B) Acidity, heartburn, or loose stools', dosha: 'pitta' },
      { text: 'C) Heaviness, sluggishness, or slow metabolism', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq10', question: 'Your sleep is typically:',
    options: [
      { text: 'A) Light and easily disturbed; you wake up often', dosha: 'vata' },
      { text: 'B) Moderate (6-7 hours) and sound', dosha: 'pitta' },
      { text: "C) Deep and long; you find it hard to wake up", dosha: 'kapha' }
    ]
  },
  {
    id: 'dq11', question: 'Your physical energy level is:',
    options: [
      { text: 'A) High in bursts, but you tire out very quickly', dosha: 'vata' },
      { text: 'B) Moderate and goal-oriented; you push yourself hard', dosha: 'pitta' },
      { text: 'C) Steady and high endurance, but you move slowly', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq12', question: 'You sweat:',
    options: [
      { text: 'A) Very little, even during exercise', dosha: 'vata' },
      { text: 'B) Profusely, and it may have a strong odour', dosha: 'pitta' },
      { text: 'C) Moderately, but only after sustained effort', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq13', question: 'When learning something new, you:',
    options: [
      { text: 'A) Grasp it very quickly but forget it just as fast', dosha: 'vata' },
      { text: 'B) Learn logically and remember it for a long time', dosha: 'pitta' },
      { text: 'C) Learn slowly but never forget it once mastered', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq14', question: 'Under stress, your first reaction is:',
    options: [
      { text: 'A) Anxiety, worry, or fear', dosha: 'vata' },
      { text: 'B) Irritability, anger, or impatience', dosha: 'pitta' },
      { text: 'C) Withdrawal, silence, or stubbornness', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq15', question: 'Your speech style is:',
    options: [
      { text: 'A) Fast, talkative, and sometimes scattered', dosha: 'vata' },
      { text: 'B) Sharp, convincing, and decisive', dosha: 'pitta' },
      { text: 'C) Slow, melodious, and thoughtful', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq16', question: 'Your personality is best described as:',
    options: [
      { text: 'A) Creative, enthusiastic, and spontaneous', dosha: 'vata' },
      { text: 'B) Ambitious, competitive, and focused', dosha: 'pitta' },
      { text: 'C) Calm, loyal, and nurturing', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq17', question: 'Your memory is best for:',
    options: [
      { text: 'A) Short-term facts or recent events', dosha: 'vata' },
      { text: 'B) Logical patterns and professional data', dosha: 'pitta' },
      { text: 'C) Long-term childhood memories and faces', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq18', question: 'Your spending habits are:',
    options: [
      { text: 'A) Impulsive; you spend on small, frequent items', dosha: 'vata' },
      { text: 'B) Calculated; you buy high-quality or luxury goods', dosha: 'pitta' },
      { text: 'C) Conservative; you prefer to save and accumulate', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq19', question: 'Your dreams are often about:',
    options: [
      { text: 'A) Flying, falling, or running (movement)', dosha: 'vata' },
      { text: 'B) Conflict, fire, or problem-solving (intensity)', dosha: 'pitta' },
      { text: 'C) Water, romance, or peaceful nature (serenity)', dosha: 'kapha' }
    ]
  },
  {
    id: 'dq20', question: 'Your decision-making style is:',
    options: [
      { text: 'A) Changeable; you often second-guess yourself', dosha: 'vata' },
      { text: 'B) Quick and confident', dosha: 'pitta' },
      { text: 'C) Slow; you need a lot of time to consider', dosha: 'kapha' }
    ]
  },
];

const healthQuestions = [
  {
    id: 'hq1',
    question: 'How often do you experience daytime symptoms (wheezing, cough, or chest tightness)?',
    options: ['A) Less than twice a week', 'B) Two or more times a week', 'C) Every single day']
  },
  {
    id: 'hq2',
    question: "How many times a week do you use your 'rescue' (quick-relief) inhaler?",
    options: ['A) 0 to 1 time', 'B) 2 to 3 times', 'C) 4 or more times']
  },
  {
    id: 'hq3',
    question: 'In the last month, how often have you woken up at night due to asthma?',
    options: ['A) Never', 'B) Once or twice', 'C) Three or more times']
  },
  {
    id: 'hq4',
    question: 'When you exercise or exert yourself, what happens to your breathing?',
    options: ['A) Nothing, I feel fine', 'B) I get a bit winded but recover quickly', 'C) I have to stop or use my inhaler immediately']
  },
  {
    id: 'hq5',
    question: 'How would you describe your ability to perform daily activities (work, school, chores)?',
    options: ['A) Completely normal', 'B) Occasionally limited by my breathing', 'C) Frequently limited; I have to stay home or rest']
  },
  {
    id: 'hq6',
    question: 'Which of these environments triggers your symptoms the most?',
    options: ['A) Cold air or sudden weather changes', 'B) Dust, pets, or strong perfumes', 'C) Exercise or physical stress', 'D) None of the above']
  },
  {
    id: 'hq7',
    question: "How often do you forget to take your 'preventer' (daily controller) inhaler?",
    options: ["A) Never, I'm 100% consistent", 'B) Once or twice a week', 'C) I only take it when I feel sick']
  },
  {
    id: 'hq8',
    question: 'Have you ever been hospitalized or gone to the ER for asthma?',
    options: ['A) Never', 'B) Once, a long time ago', 'C) Recently (within the last year)']
  },
  {
    id: 'hq9',
    question: 'Do you experience symptoms like a runny nose, itchy eyes, or skin rashes?',
    options: ['A) No, never', 'B) Yes, seasonally (like during spring/pollen season)', 'C) Yes, almost all year round']
  },
  {
    id: 'hq10',
    question: 'How often do you check your lung function using a Peak Flow Meter?',
    options: ['A) Daily, as part of my routine', 'B) Only when I start feeling symptomatic', "C) I don't own one / I don't know how to use it"]
  },
  {
    id: 'hq11',
    question: 'Does your breathing change when you are stressed, upset, or laughing hard?',
    options: ["A) No, my emotions don't affect my breathing", 'B) Occasionally, I might cough a little', 'C) Yes, strong emotions often trigger a full flare-up']
  },
  {
    id: 'hq12',
    question: 'Do symptoms get worse after taking specific meds (like Aspirin or Ibuprofen)?',
    options: ["A) No, I haven't noticed any reaction", "B) I'm not sure, I haven't tracked it", 'C) Yes, my breathing gets noticeably tighter']
  },
];

const DOSHA_PER_PAGE = 5;
const HEALTH_PER_PAGE = 4;

// Steps: 0 = dosha pages (0..3), last step = health assessment
const DOSHA_PAGES = Math.ceil(doshaQuestions.length / DOSHA_PER_PAGE); // 4
const HEALTH_PAGES = Math.ceil(healthQuestions.length / HEALTH_PER_PAGE); // 3
const TOTAL_STEPS = DOSHA_PAGES + HEALTH_PAGES; // 7

export default function Assessment() {
  const navigate = useNavigate();
  const { user, setRecommendations } = useAuth();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isDoshaStep = step < DOSHA_PAGES;
  const currentQuestions = isDoshaStep
    ? doshaQuestions.slice(step * DOSHA_PER_PAGE, (step + 1) * DOSHA_PER_PAGE)
    : healthQuestions.slice((step - DOSHA_PAGES) * HEALTH_PER_PAGE, (step - DOSHA_PAGES + 1) * HEALTH_PER_PAGE);

  const isComplete = currentQuestions.every(q => answers[q.id]);
  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const handleAnswer = (qId, val) => setAnswers(prev => ({ ...prev, [qId]: val }));

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) { setStep(step + 1); window.scrollTo(0, 0); }
    else handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true); setError('');
    try {
      let result;
      try {
        const res = await API.post('/assessment/analyze', { answers });
        result = res.data;
      } catch {
        result = simulateAI(answers);
      }
      setRecommendations(result);
      navigate('/recommendations');
    } catch {
      setError('Analysis failed. Please try again.');
    } finally { setLoading(false); }
  };

  const sectionLabel = isDoshaStep
    ? `Dosha Quiz — Page ${step + 1} of ${DOSHA_PAGES}`
    : `Health Assessment — Page ${step - DOSHA_PAGES + 1} of ${HEALTH_PAGES}`;

  const sectionIcon = isDoshaStep ? '🔮' : '🫁';
  const sectionTitle = isDoshaStep ? 'Dosha Prakriti Quiz' : 'Asthma Health Assessment';

  return (
    <div className="assessment-page">
      <div className="assessment-container">

        {/* Progress Bar */}
        <div className="assessment-header">
          <div className="assess-meta">
            <span className="assess-icon">{sectionIcon}</span>
            <div>
              <div className="assess-section-label">{sectionLabel}</div>
              <div className="assess-section-title">{sectionTitle}</div>
            </div>
            <div className="assess-progress-text">{progress}% complete</div>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          {/* Step dots */}
          <div className="step-dots">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`step-dot-mini ${i < step ? 'done' : i === step ? 'active' : ''}`} />
            ))}
          </div>
        </div>

        {/* Question Card */}
        <div className="question-card card">
          <h2 className="section-title" style={{ marginBottom: 28 }}>{sectionTitle}</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="questions-list">
            {currentQuestions.map((q, qi) => (
              <div key={q.id} className="question-item">
                <p className="question-text">
                  <span className="q-num">Q{isDoshaStep ? step * DOSHA_PER_PAGE + qi + 1 : (step - DOSHA_PAGES) * HEALTH_PER_PAGE + qi + 1}.</span> {q.question}
                </p>
                <div className="options-grid">
                  {q.options.map(opt => {
                    const optText = typeof opt === 'object' ? opt.text : opt;
                    const optVal = typeof opt === 'object' ? opt.text : opt;
                    return (
                      <button
                        key={optText}
                        className={`option-btn ${answers[q.id] === optVal ? 'selected' : ''}`}
                        onClick={() => handleAnswer(q.id, optVal)}
                      >
                        {optText}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="assessment-nav">
            <button className="btn-secondary nav-btn" onClick={() => { setStep(step - 1); window.scrollTo(0, 0); }} disabled={step === 0}>
              <ChevronLeft size={18} /> Previous
            </button>
            <button className="btn-primary nav-btn" onClick={handleNext} disabled={!isComplete || loading}>
              {loading ? <span className="spinner" /> : step === TOTAL_STEPS - 1 ? '🔬 Analyze Now' : <>Next <ChevronRight size={18} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function simulateAI(answers) {
  // Dosha scoring
  const votes = { vata: 0, pitta: 0, kapha: 0 };
  doshaQuestions.forEach(q => {
    const ans = answers[q.id];
    const opt = q.options.find(o => o.text === ans);
    if (opt) votes[opt.dosha]++;
  });
  const dosha = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
  const doshaLabel = dosha.charAt(0).toUpperCase() + dosha.slice(1);

  // Severity scoring from health questions
  const severityMap = { 'A)': 0, 'B)': 1, 'C)': 2 };
  let score = 0;
  healthQuestions.forEach(q => {
    const ans = answers[q.id] || '';
    const key = ans.substring(0, 2);
    score += severityMap[key] || 0;
  });
  const severity = score <= 6 ? 'Mild' : score <= 14 ? 'Moderate' : 'Severe';

  return { dosha: doshaLabel, severity, score, answers };
}
