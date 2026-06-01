import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Wind, Flame, Droplets, ArrowRight, AlertTriangle } from 'lucide-react';
import './Recommendations.css';

const planData = {
  Vata: {
    color: '#e0f2fe', border: '#0ea5e9', text: '#0369a1', emoji: '🌬️',
    desc: 'Vata imbalance causes dry, irregular breathing patterns and anxiety-triggered asthma.',
    diet: ['Warm, moist, oily foods', 'Sesame oil, ghee, warm milk', 'Cooked vegetables & grains', 'Ginger & cinnamon tea', 'Avoid cold, dry, raw foods'],
    yoga: ['Nadi Shodhana (Alternate Nostril)', 'Bhramari (Humming Bee)', 'Gentle Surya Namaskar', 'Child\'s Pose (Balasana)', 'Savasana with warm blanket'],
    herbs: ['Ashwagandha', 'Shatavari', 'Licorice root', 'Tulsi (Holy Basil)', 'Triphala'],
    routine: ['Wake up by 6 AM', 'Warm oil self-massage (Abhyanga)', 'Avoid cold showers', 'Sleep by 10 PM', 'Avoid screen time before bed'],
  },
  Pitta: {
    color: '#fef3c7', border: '#f59e0b', text: '#92400e', emoji: '🔥',
    desc: 'Pitta imbalance causes inflammatory, heat-triggered asthma with yellow mucus.',
    diet: ['Cooling, sweet, bitter foods', 'Coconut water, cucumber, mint', 'Pomegranate, amla, coriander', 'Avoid spicy, fried, acidic foods', 'Avoid alcohol and caffeine'],
    yoga: ['Sheetali (Cooling Breath)', 'Chandra Bhedana (Moon Breath)', 'Forward bends & twists', 'Moon Salutation', 'Meditation & mindfulness'],
    herbs: ['Brahmi', 'Neem', 'Amla (Indian Gooseberry)', 'Shatavari', 'Guduchi'],
    routine: ['Avoid midday sun exposure', 'Cool showers in morning', 'Eat lunch as largest meal', 'Avoid overworking', 'Practice gratitude journaling'],
  },
  Kapha: {
    color: '#dcfce7', border: '#22c55e', text: '#166534', emoji: '🌊',
    desc: 'Kapha imbalance causes mucus accumulation, congestion, and sluggish breathing.',
    diet: ['Light, warm, spicy foods', 'Honey, ginger, black pepper', 'Tulsi tea, warm water', 'Avoid dairy, cold foods, sweets', 'Avoid heavy meals at night'],
    yoga: ['Kapalabhati (Skull Shining)', 'Bhastrika (Bellows Breath)', 'Sun Salutation (vigorous)', 'Warrior poses', 'Inversions (Sarvangasana)'],
    herbs: ['Trikatu (3 peppers)', 'Vasaka (Malabar Nut)', 'Pippali (Long Pepper)', 'Tulsi', 'Sitopaladi Churna'],
    routine: ['Wake up before 6 AM', 'Dry brushing before shower', 'Steam inhalation with eucalyptus', 'Avoid daytime naps', 'Evening walk after dinner'],
  }
};

const severityConfig = {
  Mild: { color: '#dcfce7', text: '#166534', border: '#22c55e', icon: '🟢', advice: 'Your symptoms are mild. Consistent Ayurvedic lifestyle changes can significantly improve your condition.' },
  Moderate: { color: '#fef3c7', text: '#92400e', border: '#f59e0b', icon: '🟡', advice: 'Moderate symptoms detected. Follow the plan diligently and consider consulting an Ayurvedic practitioner.' },
  Severe: { color: '#fee2e2', text: '#991b1b', border: '#ef4444', icon: '🔴', advice: 'Severe symptoms detected. Please consult a doctor immediately alongside following this plan.' },
};

export default function Recommendations() {
  const { recommendations, user } = useAuth();
  const navigate = useNavigate();

  if (!recommendations) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20, padding: 20 }}>
        <AlertTriangle size={48} color="#f59e0b" />
        <h2>No Assessment Data Found</h2>
        <p style={{ color: 'var(--gray-500)' }}>Please complete the assessment first to get your personalized plan.</p>
        <Link to="/assessment"><button className="btn-primary">Start Assessment</button></Link>
      </div>
    );
  }

  const { severity, dosha } = recommendations;
  const plan = planData[dosha] || planData.Kapha;
  const sevConfig = severityConfig[severity] || severityConfig.Mild;

  return (
    <div className="reco-page">
      <div className="reco-container">
        {/* Header */}
        <div className="reco-header">
          <div className="reco-greeting">
            <h1>Your Personalized Plan, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 🌿</h1>
            <p>Based on your AI analysis — here's your complete Ayurvedic lifestyle framework</p>
          </div>
          <div className="reco-badges">
            <div className="result-badge" style={{ background: plan.color, borderColor: plan.border, color: plan.text }}>
              <span>{plan.emoji}</span>
              <div>
                <div className="badge-label">Dominant Dosha</div>
                <div className="badge-value">{dosha}</div>
              </div>
            </div>
            <div className="result-badge" style={{ background: sevConfig.color, borderColor: sevConfig.border, color: sevConfig.text }}>
              <span>{sevConfig.icon}</span>
              <div>
                <div className="badge-label">Severity Level</div>
                <div className="badge-value">{severity}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Severity Alert */}
        <div className="severity-alert" style={{ background: sevConfig.color, borderColor: sevConfig.border, color: sevConfig.text }}>
          <strong>AI Assessment:</strong> {sevConfig.advice}
        </div>

        {/* Dosha Description */}
        <div className="dosha-desc card" style={{ borderLeft: `4px solid ${plan.border}` }}>
          <h3>{plan.emoji} {dosha} Dosha Profile</h3>
          <p>{plan.desc}</p>
        </div>

        {/* Plan Grid */}
        <div className="plan-grid">
          <PlanCard title="🥗 Diet Recommendations" items={plan.diet} color={plan.color} border={plan.border} text={plan.text} />
          <PlanCard title="🧘 Yoga & Pranayama" items={plan.yoga} color={plan.color} border={plan.border} text={plan.text} />
          <PlanCard title="🌿 Herbal Remedies" items={plan.herbs} color={plan.color} border={plan.border} text={plan.text} />
          <PlanCard title="☀️ Daily Routine" items={plan.routine} color={plan.color} border={plan.border} text={plan.text} />
        </div>

        {/* Steam Therapy */}
        <div className="steam-card card">
          <h3>💨 Steam Therapy Protocol</h3>
          <div className="steam-steps">
            {['Boil water and add 3-4 drops of eucalyptus oil', 'Cover head with towel and inhale steam for 10 minutes', 'Perform twice daily — morning and before bed', 'Follow with warm tulsi tea for best results'].map((s, i) => (
              <div key={i} className="steam-step">
                <div className="steam-num">{i + 1}</div>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Precautions */}
        <div className="env-card card">
          <h3>🌍 Environmental Precautions</h3>
          <div className="env-grid">
            {['Wear N95 mask in polluted areas', 'Use air purifier indoors', 'Avoid dusty environments', 'Keep windows closed during high pollen', 'Maintain indoor humidity 40-60%', 'Avoid strong perfumes & chemicals'].map((e, i) => (
              <div key={i} className="env-item">
                <span className="env-check">✓</span>
                <span>{e}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="reco-actions">
          <button onClick={() => navigate('/dashboard')} className="btn-primary action-btn">
            View Progress Dashboard <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/assessment')} className="btn-secondary action-btn">
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
}

function PlanCard({ title, items, color, border, text }) {
  return (
    <div className="plan-card card" style={{ borderTop: `4px solid ${border}` }}>
      <h3 style={{ color: text }}>{title}</h3>
      <ul className="plan-list">
        {items.map((item, i) => (
          <li key={i} className="plan-item">
            <span className="plan-dot" style={{ background: border }} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
