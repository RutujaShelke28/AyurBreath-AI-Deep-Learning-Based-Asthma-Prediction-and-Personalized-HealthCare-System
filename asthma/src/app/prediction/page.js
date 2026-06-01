'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/lib/AuthContext';
import './Prediction.css';

const defaultInputs = {
  patient_name: '',
  age: '',
  bmi: '',
  smoking: '0',
  exercise_level: '1',
  fev1_pct: '',
  fvc_pct: '',
  fev1_fvc_ratio: '',
  wheezing: '0',
};

const AQI_DEFAULTS = { pm25: 50, pm10: 80, no2: 20, so2: 15, aqi: 100 };

const fields = [
  { key: 'patient_name',  label: 'Patient Name',   unit: '',      hint: 'Enter Patient Name',                   type: 'text' },
  { key: 'age',           label: 'Age',            unit: 'yrs',   hint: 'Patient age',                          type: 'number', step: 1 },
  { key: 'bmi',           label: 'BMI',            unit: 'kg/m²', hint: 'Body Mass Index',                      type: 'number', step: 0.1 },
  { key: 'fev1_pct',      label: 'FEV1 %',         unit: '%',     hint: 'Forced Expiratory Volume %',           type: 'number', step: 0.1 },
  { key: 'fvc_pct',       label: 'FVC %',          unit: '%',     hint: 'Forced Vital Capacity %',              type: 'number', step: 0.1 },
  { key: 'fev1_fvc_ratio',label: 'FEV1/FVC Ratio', unit: '',      hint: 'Ratio',                                type: 'number', step: 0.01 },
];

const selectFields = [
  { key: 'smoking',        label: 'Smoking',        options: [{ value: '0', label: 'Non-smoker' }, { value: '1', label: 'Smoker' }] },
  { key: 'exercise_level', label: 'Exercise Level', options: [{ value: '0', label: 'Sedentary (None)' }, { value: '1', label: 'Moderate (1-3x/week)' }, { value: '2', label: 'Active (4+/week)' }] },
  { key: 'wheezing',       label: 'Wheezing',       options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
];

const severityColors = {
  'Mild':                { bg: '#dcfce7', border: '#22c55e', text: '#166534', icon: '🟢' },
  'Moderate':            { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '🟠' },
  'Severe':              { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '🔴' },
  'Mild Intermittent':   { bg: '#dcfce7', border: '#22c55e', text: '#166534', icon: '🟢' },
  'Mild Persistent':     { bg: '#d1fae5', border: '#10b981', text: '#065f46', icon: '🟡' },
  'Moderate Persistent': { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '🟠' },
  'Severe Persistent':   { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '🔴' },
};

const samplePresets = [
  // Mild: 0 bad flags (all values healthy)
  { label: '🟢 Mild Example',     values: { patient_name: 'Alice', age: 28, bmi: 22,  smoking: '0', exercise_level: '2', fev1_pct: 90, fvc_pct: 95,  fev1_fvc_ratio: 0.80, wheezing: '0' } },
  // Moderate: 2-3 bad flags (smoking + high AQI → sent via AQI_DEFAULTS override below, + low fev1_fvc_ratio)
  { label: '🟠 Moderate Example', values: { patient_name: 'Bob',   age: 45, bmi: 25,  smoking: '1', exercise_level: '1', fev1_pct: 82, fvc_pct: 90,  fev1_fvc_ratio: 0.65, wheezing: '0' } },
  // Severe: 6+ bad flags (everything unhealthy)
  { label: '🔴 Severe Example',   values: { patient_name: 'Charlie', age: 60, bmi: 32, smoking: '1', exercise_level: '0', fev1_pct: 45, fvc_pct: 55,  fev1_fvc_ratio: 0.55, wheezing: '1' } },
];

const severityDisplayMap = {
  'Mild Intermittent': 'Mild',
  'Mild Persistent': 'Mild',
  'Moderate Persistent': 'Moderate',
  'Severe Persistent': 'Severe',
};




export default function Prediction() {
  const { recommendations, setRecommendations } = useAuth();
  const [inputs, setInputs] = useState(defaultInputs);
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('ensemble');

  const handleChange = (e) => { setInputs({ ...inputs, [e.target.name]: e.target.value }); setResult(null); };
  const applyPreset  = (p)  => { setInputs({ ...p.values }); setResult(null); setError(''); setStep(1); };
  const handleReset  = ()   => { setInputs(defaultInputs); setResult(null); setError(''); setStep(1); };

  const handleNextOrSubmit = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    
    setStep(4);
    setError(''); setLoading(true); setResult(null);
    try {
      const payload = { ...AQI_DEFAULTS };
      Object.entries(inputs).forEach(([k, v]) => { 
        if (k !== 'patient_name') {
          payload[k] = parseFloat(v); 
        }
      });
      
      const res = await axios.post('/api/predict', { ...payload, model: selectedModel }, { timeout: 90000 });
      setResult(res.data);
      setRecommendations({ 
        ...(recommendations || { dosha: 'Kapha' }), 
        severity: res.data.severity_detail 
      });
    } catch (err) {
      if (!err.response) {
        setError('AI Service is offline or taking too long. Please make sure the Python AI service is running.');
      } else {
        setError(err.response?.data?.message || 'Prediction failed.');
      }
    } finally { setLoading(false); }
  };

  const sevConfig = result ? (severityColors[result.severity_detail] || severityColors['Moderate Persistent']) : null;

  return (
    <div className="pred-page">
      <div className="wizard-container">
        
        {/* Left Sidebar Steps */}
        <div className="wizard-sidebar">
          <div className={`wizard-step ${step >= 1 ? 'active' : ''}`}>
            <div className="wizard-step-label">Patient Profile</div>
            <div className="wizard-step-number">1</div>
          </div>
          <div className={`wizard-step ${step >= 2 ? 'active' : ''}`}>
            <div className="wizard-step-label">Vitals & Lifestyle</div>
            <div className="wizard-step-number">2</div>
          </div>
          <div className={`wizard-step ${step >= 3 ? 'active' : ''}`}>
            <div className="wizard-step-label">Pulmonary Function</div>
            <div className="wizard-step-number">3</div>
          </div>
          <div className={`wizard-step ${step >= 4 ? 'active' : ''}`}>
            <div className="wizard-step-label">Prediction Result</div>
            <div className="wizard-step-number">4</div>
          </div>
        </div>

        {/* Right Content */}
        <div className="wizard-content">
          {step < 4 ? (
            <>
              <div className="wizard-header">
                <h2>{step === 1 ? 'Tell us about the Patient' : step === 2 ? 'Enter Vitals Data' : 'Add Lung Function Data'}</h2>
                <div className="presets">
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>Presets:</span>
                  {samplePresets.map(p => (
                    <button key={p.label} type="button" className="preset-btn" onClick={() => applyPreset(p)}>{p.label.split(' ')[1]}</button>
                  ))}
                  <button type="button" className="preset-btn" onClick={handleReset}>↺ Reset</button>
                </div>
              </div>

              <div className="wizard-subnav">
                <div className={`wizard-subnav-item ${step === 1 ? 'active' : ''}`}>General</div>
                <div className={`wizard-subnav-item ${step === 2 ? 'active' : ''}`}>Vitals</div>
                <div className={`wizard-subnav-item ${step === 3 ? 'active' : ''}`}>Pulmonary</div>
              </div>

              {error && <div className="error-msg">{error}</div>}

              <form className="wizard-form" onSubmit={handleNextOrSubmit}>
                {step === 1 && (
                  <div>
                    <FieldInput field={fields[0]} value={inputs.patient_name} onChange={handleChange} />
                    <FieldInput field={fields[1]} value={inputs.age} onChange={handleChange} />
                  </div>
                )}
                
                {step === 2 && (
                  <div>
                    <FieldInput field={fields[2]} value={inputs.bmi} onChange={handleChange} />
                    <SelectInput field={selectFields[0]} value={inputs.smoking} onChange={handleChange} />
                    <SelectInput field={selectFields[1]} value={inputs.exercise_level} onChange={handleChange} />
                  </div>
                )}
                
                {step === 3 && (
                  <div>
                    <FieldInput field={fields[3]} value={inputs.fev1_pct} onChange={handleChange} />
                    <FieldInput field={fields[4]} value={inputs.fvc_pct} onChange={handleChange} />
                    <FieldInput field={fields[5]} value={inputs.fev1_fvc_ratio} onChange={handleChange} />
                    <SelectInput field={selectFields[2]} value={inputs.wheezing} onChange={handleChange} />
                  </div>
                )}

                <div className="wizard-footer">
                  <div className="progress-container">
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
                    </div>
                    <div className="progress-text">{4 - step} steps left</div>
                  </div>
                  
                  <div className="wizard-actions">
                    {step > 1 && (
                      <button type="button" className="btn-prev" onClick={() => setStep(step - 1)}>
                        ← PREVIOUS
                      </button>
                    )}
                    <button type="submit" className="btn-next" disabled={loading}>
                      {step < 3 ? 'NEXT →' : 'PREDICT →'}
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <div className="result-container">
              {loading && <div className="loading-spinner">🧠</div>}
              {error && <div className="error-msg">{error}</div>}
              
              {result && sevConfig && (
                <div className="result-card" style={{ borderColor: sevConfig.border, background: sevConfig.bg }}>
                  <div className="result-icon">{sevConfig.icon}</div>
                  <div className="result-title" style={{ color: sevConfig.text }}>Predicted Severity</div>
                  <div className="result-severity" style={{ color: sevConfig.text }}>
                    {severityDisplayMap[result.severity_detail] || result.severity_detail}
                  </div>
                  {result.confidence && (
                    <div style={{ color: sevConfig.text, fontSize: '14px', marginBottom: '16px' }}>
                      Confidence: <strong>{result.confidence}%</strong>
                    </div>
                  )}
                  <button type="button" className="btn-next" style={{ margin: '0 auto', background: sevConfig.text }} onClick={handleReset}>
                    New Prediction ↺
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  return (
    <div className="form-row">
      <div className="form-label">
        {field.label} {field.unit && <span style={{opacity:0.6, fontWeight:400}}>({field.unit})</span>}
      </div>
      <div className="form-input-container">
        <input 
          type={field.type || 'number'} 
          name={field.key} 
          value={value} 
          onChange={onChange}
          placeholder={field.hint} 
          min={field.min} 
          max={field.max} 
          step={field.step}
          required 
          className="form-input" 
        />
      </div>
    </div>
  );
}

function SelectInput({ field, value, onChange }) {
  return (
    <div className="form-row">
      <div className="form-label">{field.label}</div>
      <div className="form-input-container">
        <select 
          name={field.key} 
          value={value} 
          onChange={onChange} 
          className="form-input" 
          required
        >
          {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}
