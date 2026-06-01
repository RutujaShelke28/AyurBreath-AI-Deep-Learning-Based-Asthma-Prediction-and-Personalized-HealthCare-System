import React, { useState } from 'react';
import axios from 'axios';
import './Prediction.css';

const defaultInputs = {
  age: '',
  bmi: '',
  smoking: '0',
  exercise_level: '1',
  fev1_pct: '',
  fvc_pct: '',
  fev1_fvc_ratio: '',
  wheezing: '0',
};

// AQI fields are hidden from user — set to neutral defaults internally
const AQI_DEFAULTS = { pm25: 50, pm10: 80, no2: 20, so2: 15, aqi: 100 };

const fields = [
  { key: 'age',           label: 'Age',            unit: 'yrs',   hint: 'Patient age (1–120)',                  min: 1,   max: 120,  step: 1    },
  { key: 'bmi',           label: 'BMI',            unit: 'kg/m²', hint: 'Body Mass Index (10–60)',              min: 10,  max: 60,   step: 0.1  },
  { key: 'fev1_pct',      label: 'FEV1 %',         unit: '%',     hint: 'Forced Expiratory Volume % (20–120)',  min: 20,  max: 120,  step: 0.1  },
  { key: 'fvc_pct',       label: 'FVC %',          unit: '%',     hint: 'Forced Vital Capacity % (20–130)',     min: 20,  max: 130,  step: 0.1  },
  { key: 'fev1_fvc_ratio',label: 'FEV1/FVC Ratio', unit: '',      hint: 'Ratio (0.3–1.0)',                      min: 0.3, max: 1.0,  step: 0.01 },
];

const selectFields = [
  { key: 'smoking',        label: 'Smoking',        options: [{ value: '0', label: 'Non-smoker' }, { value: '1', label: 'Smoker' }] },
  { key: 'exercise_level', label: 'Exercise Level', options: [{ value: '0', label: 'Sedentary (None)' }, { value: '1', label: 'Moderate (1-3x/week)' }, { value: '2', label: 'Active (4+/week)' }] },
  { key: 'wheezing',       label: 'Wheezing',       options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] },
];

const severityColors = {
  'Mild Intermittent':   { bg: '#dcfce7', border: '#22c55e', text: '#166534', icon: '🟢' },
  'Mild Persistent':     { bg: '#d1fae5', border: '#10b981', text: '#065f46', icon: '🟡' },
  'Moderate Persistent': { bg: '#fef3c7', border: '#f59e0b', text: '#92400e', icon: '🟠' },
  'Severe Persistent':   { bg: '#fee2e2', border: '#ef4444', text: '#991b1b', icon: '🔴' },
};

const samplePresets = [
  { label: '🟢 Mild Example',     values: { age: 28, bmi: 22,  smoking: '0', exercise_level: '2', fev1_pct: 88, fvc_pct: 95,  fev1_fvc_ratio: 0.78, wheezing: '0' } },
  { label: '🟠 Moderate Example', values: { age: 45, bmi: 27,  smoking: '1', exercise_level: '1', fev1_pct: 65, fvc_pct: 78,  fev1_fvc_ratio: 0.62, wheezing: '1' } },
  { label: '🔴 Severe Example',   values: { age: 60, bmi: 32,  smoking: '1', exercise_level: '0', fev1_pct: 42, fvc_pct: 58,  fev1_fvc_ratio: 0.51, wheezing: '1' } },
];

const MODEL_OPTIONS = [
  { id: 'ensemble', label: 'Ensemble (All Models)' },
  { id: 'random_forest', label: 'Random Forest' },
  { id: 'xgboost', label: 'XGBoost' },
  { id: 'logistic_regression', label: 'Logistic Regression' },
  { id: 'bilstm', label: 'BiLSTM' },
  { id: 'ann', label: 'ANN' },
];

export default function Prediction() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedModel, setSelectedModel] = useState('ensemble');

  const handleChange = (e) => { setInputs({ ...inputs, [e.target.name]: e.target.value }); setResult(null); };
  const applyPreset  = (p)  => { setInputs({ ...p.values }); setResult(null); setError(''); };
  const handleReset  = ()   => { setInputs(defaultInputs); setResult(null); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true); setResult(null);
    try {
      // Merge user inputs with neutral AQI defaults
      const payload = { ...AQI_DEFAULTS };
      Object.entries(inputs).forEach(([k, v]) => { payload[k] = parseFloat(v); });
      const aiBase = process.env.REACT_APP_AI_URL || 'http://localhost:5002';
      const res = await axios.post(`${aiBase}/predict-direct`, { ...payload, model: selectedModel }, { timeout: 30000 });
      setResult(res.data);
    } catch (err) {
      if (!err.response) {
        setError('AI Service is offline. Start: cd ai-service && uvicorn app:app --port 5002');
      } else {
        setError(err.response?.data?.message || 'Prediction failed.');
      }
    } finally { setLoading(false); }
  };

  const sevConfig = result ? (severityColors[result.severity_detail] || severityColors['Moderate Persistent']) : null;

  return (
    <div className="pred-page">
      <div className="pred-container">

        {/* Header */}
        <div className="pred-header">
          <div className="pred-header-icon">🧠</div>
          <div>
            <h1>AI Model Prediction</h1>
            <p>RF · XGBoost · Logistic · ANN · BiLSTM ensemble from your trained Colab models</p>
          </div>
        </div>

        {/* Presets */}
        <div className="preset-bar">
          <span className="preset-label">Quick Fill:</span>
          {samplePresets.map(p => (
            <button key={p.label} className="preset-btn" onClick={() => applyPreset(p)}>{p.label}</button>
          ))}
          <button className="preset-btn reset-btn" onClick={handleReset}>↺ Reset</button>
        </div>

        <div className="pred-layout">
          {/* Input Form */}
          <form className="pred-form card" onSubmit={handleSubmit}>
            <h3>📊 Patient Clinical Input</h3>
            <p className="form-subtitle">8 patient features — BiLSTM model (MProject Notebook 3)</p>

            <div className="fields-section">
              <div className="section-tag">👤 Patient Profile</div>
              <div className="fields-grid">
                {fields.slice(0, 2).map(f => (
                  <FieldInput key={f.key} field={f} value={inputs[f.key]} onChange={handleChange} />
                ))}
                {selectFields.slice(0, 2).map(f => (
                  <SelectInput key={f.key} field={f} value={inputs[f.key]} onChange={handleChange} />
                ))}
              </div>
            </div>

            <div className="fields-section">
              <div className="section-tag">🫁 Pulmonary Function</div>
              <div className="fields-grid">
                {fields.slice(2).map(f => (
                  <FieldInput key={f.key} field={f} value={inputs[f.key]} onChange={handleChange} />
                ))}
                <SelectInput field={selectFields[2]} value={inputs.wheezing} onChange={handleChange} />
              </div>
            </div>

            {error && <div className="pred-error">{error}</div>}

            <button type="submit" className="btn-primary pred-submit" disabled={loading}>
              {loading ? <><span className="spinner" /> Analyzing...</> : '🔬 Run BiLSTM Prediction'}
            </button>
          </form>

          {/* Result Panel */}
          <div className="pred-result-panel">
            {!result && !loading && (
              <div className="pred-placeholder">
                <div className="placeholder-icon">🤖</div>
                <h3>Awaiting Input</h3>
                <p>Fill in the patient values and click <strong>Run BiLSTM Prediction</strong> to see the model output.</p>
                <div className="model-info">
                  <div className="model-info-title">Model Architecture</div>
                  <div className="model-info-row"><span>Type</span><span>BiLSTM</span></div>
                  <div className="model-info-row"><span>Layers</span><span>BiLSTM(64) → BiLSTM(32) → Dense(16) → Dense(4)</span></div>
                  <div className="model-info-row"><span>Input Shape</span><span>(13 timesteps, 1)</span></div>
                  <div className="model-info-row"><span>Output</span><span>4-class severity</span></div>
                  <div className="model-info-row"><span>Dataset</span><span>MProject (10,000 samples)</span></div>
                </div>
              </div>
            )}

            {loading && (
              <div className="pred-placeholder">
                <div className="loading-orb">🧠</div>
                <h3>Running BiLSTM Model...</h3>
                <p>Processing features through the Bidirectional LSTM network</p>
              </div>
            )}

            {result && sevConfig && (
              <div className="pred-result">
                <div className="result-main" style={{ background: sevConfig.bg, borderColor: sevConfig.border }}>
                  <div className="result-icon">{sevConfig.icon}</div>
                  <div className="result-label" style={{ color: sevConfig.text }}>Predicted Severity</div>
                  <div className="result-severity" style={{ color: sevConfig.text }}>{result.severity_detail}</div>
                  {result.confidence && (
                    <div className="result-confidence" style={{ color: sevConfig.text }}>
                      Confidence: <strong>{result.confidence}%</strong>
                    </div>
                  )}
                  {result.source && (
                    <div className="result-source">
                      Source: <span className={result.source === 'bilstm_model' ? 'source-ann' : 'source-fallback'}>
                        {result.source === 'bilstm_model' ? '✅ BiLSTM Model' : '⚠️ Rule-based Fallback'}
                      </span>
                    </div>
                  )}
                </div>

                {result.probabilities && (
                  <div className="prob-section">
                    <h4>Class Probabilities</h4>
                    {Object.entries(result.probabilities)
                      .sort((a, b) => b[1] - a[1])
                      .map(([label, pct]) => {
                        const cfg = severityColors[label] || severityColors['Moderate Persistent'];
                        return (
                          <div key={label} className="prob-row">
                            <span className="prob-label">{label}</span>
                            <div className="prob-bar-wrap">
                              <div className="prob-bar-fill" style={{ width: `${pct}%`, background: cfg.border }} />
                            </div>
                            <span className="prob-pct">{pct}%</span>
                          </div>
                        );
                      })}
                  </div>
                )}

                <div className="feature-summary">
                  <h4>Input Summary</h4>
                  <div className="feature-grid">
                    {Object.entries(inputs).map(([k, v]) => (
                      <div key={k} className="feature-chip">
                        <span className="chip-key">{k}</span>
                        <span className="chip-val">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  return (
    <div className="field-item">
      <label>{field.label} {field.unit && <span className="unit">({field.unit})</span>}</label>
      <input type="number" name={field.key} value={value} onChange={onChange}
        placeholder={field.hint} min={field.min} max={field.max} step={field.step}
        required className="input-field" />
    </div>
  );
}

function SelectInput({ field, value, onChange }) {
  return (
    <div className="field-item">
      <label>{field.label}</label>
      <select name={field.key} value={value} onChange={onChange} className="input-field" required>
        {field.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
