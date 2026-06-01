'use client';

import React from 'react';
import { PlayCircle, Wind } from 'lucide-react';
import './Exercises.css';

import YogaCamera from '../../components/YogaCamera';

const asthmaExercises = [
  {
    id: 1,
    title: 'Alternate Nostril Breathing',
    sanskrit: 'Anulom Vilom Pranayama',
    description: 'A breathing technique that involves inhaling through one nostril, retaining the breath, and exhaling through the other in a specific pattern. It clears and balances the respiratory channels.',
    benefits: 'Improves lung capacity, reduces stress, and clears nasal blockages, making it highly effective for asthma patients.',
    videoId: '8VwufJrUhic'
  },
  {
    id: 3,
    title: 'Bridge Pose',
    sanskrit: 'Setu Bandhasana',
    description: 'A backbend that opens the chest, heart, and shoulders. It involves lifting the hips while lying on the back.',
    benefits: 'Expands the chest and lungs to improve respiration, and helps balance the thyroid gland.',
    videoId: 'RDfLCMl1P7k'
  },
  {
    id: 4,
    title: 'Fish Pose',
    sanskrit: 'Matsyasana',
    description: 'A reclining back-bending pose that deeply stretches the chest and neck.',
    benefits: 'Encourages deep breathing and helps alleviate respiratory ailments by fully stretching the lung muscles.',
    videoId: 'sTANio_2E0Q'
  },
  {
    id: 5,
    title: 'Skull Shining Breath',
    sanskrit: 'Kapalabhati Pranayama',
    description: 'A rapid breathing technique characterized by forceful exhalations and passive inhalations.',
    benefits: 'Clears the respiratory tract, strengthens the diaphragm, and improves oxygen supply to the body.',
    videoId: 'v7AYKMP6rOE'
  },
  {
    id: 6,
    title: 'Easy Pose with Deep Breathing',
    sanskrit: 'Sukhasana',
    description: 'A simple cross-legged sitting posture combined with mindful, deep breathing.',
    benefits: 'Calms the mind, reduces anxiety (a common asthma trigger), and promotes steady, controlled breathing patterns.',
    videoId: 'b1H3xO3x_Js'
  }
];

const dailyPlan = [
  {
    time: 'Morning Routine (Empty Stomach)',
    duration: '15-20 Minutes',
    icon: '🌅',
    exercises: [
      { name: 'Sukhasana (Easy Pose)', duration: '2 mins', description: 'Sit quietly and focus on deep, steady breathing to center your mind.' },
      { name: 'Anulom Vilom (Alternate Nostril)', duration: '5-7 mins', description: 'Clears the nasal passages and balances the respiratory system.' },
      { name: 'Kapalabhati', duration: '3-5 mins', description: 'Helps in clearing the lungs and strengthening the diaphragm.' }
    ]
  },
  {
    time: 'Evening Routine (Before Dinner)',
    duration: '10-15 Minutes',
    icon: '🌆',
    exercises: [
      { name: 'Setu Bandhasana (Bridge Pose)', duration: '3 reps', description: 'Opens up the lungs and chest.' },
      { name: 'Matsyasana (Fish Pose)', duration: '2-3 mins', description: 'Stretches the chest muscles and encourages deep breathing.' }
    ]
  }
];

export default function ExercisesPage() {
  return (
    <div className="page-container exercises-page">
      <div className="exercises-header">
        <h1>Asthma Relief <span className="gradient-text">Exercises & Yoga</span></h1>
        <p>Follow along with these highly recommended Yoga poses and Pranayama (breathing exercises) specifically curated to strengthen your lungs and reduce asthma symptoms.</p>
      </div>

      <div className="exercises-top-row">
        <div className="daily-plan-section">
          <h2 className="section-title">Recommended Daily Plan</h2>
          <p className="section-subtitle">A structured routine to help manage and prevent asthma symptoms daily.</p>
        
        <div className="plan-cards-container">
          {dailyPlan.map((plan, index) => (
            <div key={index} className="plan-card">
              <div className="plan-card-header">
                <span className="plan-icon">{plan.icon}</span>
                <div>
                  <h3>{plan.time}</h3>
                  <span className="plan-duration">{plan.duration}</span>
                </div>
              </div>
              <ul className="plan-exercises-list">
                {plan.exercises.map((ex, i) => (
                  <li key={i}>
                    <div className="ex-header">
                      <strong>{ex.name}</strong>
                      <span className="ex-duration">{ex.duration}</span>
                    </div>
                    <p>{ex.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="yoga-camera-wrapper">
        <YogaCamera />
      </div>
    </div>

    <div className="videos-section-header">
        <h2 className="section-title">Exercise References</h2>
        <p className="section-subtitle">Follow these detailed guides to learn the correct postures and breathing techniques for your plan.</p>
      </div>

      <div className="exercises-grid">
        {asthmaExercises.map(exercise => (
          <div key={exercise.id} className="exercise-card">
            <div className="exercise-video-container">
              <iframe 
                src={`https://www.youtube.com/embed/${exercise.videoId}`}
                title={exercise.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="exercise-content">
              <div className="exercise-sanskrit">{exercise.sanskrit}</div>
              <h2 className="exercise-title">
                <Wind size={24} className="text-green-600" style={{ color: 'var(--green-600)' }} />
                {exercise.title}
              </h2>
              <p className="exercise-desc">{exercise.description}</p>
              
              <div className="exercise-benefits">
                <h4>Why it helps Asthma:</h4>
                <p>{exercise.benefits}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
