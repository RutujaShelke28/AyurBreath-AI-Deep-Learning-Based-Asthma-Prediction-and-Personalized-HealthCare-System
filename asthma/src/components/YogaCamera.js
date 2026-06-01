'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Camera, AlertCircle, CheckCircle2, Scan } from 'lucide-react';
import './YogaCamera.css';

export default function YogaCamera() {
  const videoRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState('Position yourself in the frame');
  const [feedbackType, setFeedbackType] = useState('info'); // 'info', 'success', 'warning'

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720, facingMode: "user" } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setIsActive(true);
        setIsAnalyzing(true);
        startSimulation();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please ensure you have granted camera permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    setIsAnalyzing(false);
    setFeedback('Camera stopped');
    setFeedbackType('info');
  };

  const startSimulation = () => {
    let step = 0;
    const messages = [
      { text: "Scanning posture...", type: 'info', delay: 2000 },
      { text: "Straighten your back a little", type: 'warning', delay: 4000 },
      { text: "Hold the pose...", type: 'info', delay: 2000 },
      { text: "Excellent posture! Keep breathing deeply.", type: 'success', delay: 5000 },
      { text: "Analyzing movement...", type: 'info', delay: 2000 },
      { text: "Good steady breath.", type: 'success', delay: 4000 }
    ];

    const runStep = () => {
      if (step >= messages.length) step = 0;
      setFeedback(messages[step].text);
      setFeedbackType(messages[step].type);
      
      const nextDelay = messages[step].delay;
      step++;
      
      window.simTimeout = setTimeout(() => {
        if (isActive) runStep();
      }, nextDelay);
    };

    clearTimeout(window.simTimeout);
    runStep();
  };

  useEffect(() => {
    return () => {
      stopCamera();
      clearTimeout(window.simTimeout);
    };
  }, []);

  return (
    <div className="yoga-camera-container">
      <div className="yoga-camera-header">
        <div className="camera-title-group">
          <Camera size={24} className="camera-icon" />
          <h2>AI Pose Tracker</h2>
        </div>
        {!isActive ? (
          <button className="camera-btn start-btn" onClick={startCamera}>
            Enable Camera
          </button>
        ) : (
          <button className="camera-btn stop-btn" onClick={stopCamera}>
            Stop Camera
          </button>
        )}
      </div>

      <div className={`video-wrapper ${isActive ? 'active' : ''}`}>
        {!isActive && (
          <div className="camera-placeholder">
            <Camera size={48} className="text-gray-400 mb-4" />
            <p>Turn on your camera for real-time AI posture feedback</p>
          </div>
        )}
        
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="webcam-video"
        ></video>

        {isActive && isAnalyzing && (
          <div className="ai-overlay">
            <div className="scanning-line"></div>
            <div className="bounding-box">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            <div className={`feedback-badge ${feedbackType}`}>
              {feedbackType === 'info' && <Scan size={18} className="animate-spin-slow" />}
              {feedbackType === 'warning' && <AlertCircle size={18} />}
              {feedbackType === 'success' && <CheckCircle2 size={18} />}
              <span>{feedback}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
