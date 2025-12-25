import React, { useState } from 'react';
import styles from './Auth.module.css';

interface ProfileQuestionnaireProps {
  onComplete: (profile: any) => void;
  onSkip: () => void;
  onBack: () => void;
  loading?: boolean;
}

export default function ProfileQuestionnaire({
  onComplete,
  onSkip,
  onBack,
  loading,
}: ProfileQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState({
    programming_experience: '',
    python_proficiency: '',
    ros_experience: '',
    ai_ml_experience: '',
    robotics_hardware_experience: '',
    sensor_integration: '',
    electronics_knowledge: '',
    primary_interests: [] as string[],
    time_commitment: '',
  });

  const steps = [
    {
      title: 'Software Background',
      questions: [
        {
          key: 'programming_experience',
          label: 'Programming Experience',
          options: [
            { value: 'beginner', label: 'Beginner - Just starting out' },
            { value: 'intermediate', label: 'Intermediate - Comfortable with basics' },
            { value: 'advanced', label: 'Advanced - Can build complex systems' },
            { value: 'expert', label: 'Expert - Professional developer' },
          ],
        },
        {
          key: 'python_proficiency',
          label: 'Python Proficiency',
          options: [
            { value: 'never', label: 'Never used Python' },
            { value: 'basic', label: 'Basic - Can write simple scripts' },
            { value: 'intermediate', label: 'Intermediate - Comfortable with OOP' },
            { value: 'advanced', label: 'Advanced - Expert in Python' },
          ],
        },
        {
          key: 'ros_experience',
          label: 'ROS (Robot Operating System) Experience',
          options: [
            { value: 'never_heard', label: "Never heard of it" },
            { value: 'heard', label: 'Heard of it, never used' },
            { value: 'beginner', label: 'Beginner - Basic tutorials' },
            { value: 'intermediate', label: 'Intermediate - Built simple robots' },
            { value: 'advanced', label: 'Advanced - Complex robotics projects' },
          ],
        },
        {
          key: 'ai_ml_experience',
          label: 'AI/ML Experience',
          options: [
            { value: 'none', label: 'No experience' },
            { value: 'theoretical', label: 'Theoretical knowledge only' },
            { value: 'pretrained', label: 'Used pre-trained models' },
            { value: 'custom', label: 'Trained custom models' },
            { value: 'production', label: 'Deployed ML in production' },
          ],
        },
      ],
    },
    {
      title: 'Hardware Background',
      questions: [
        {
          key: 'robotics_hardware_experience',
          label: 'Robotics Hardware Experience',
          options: [
            { value: 'none', label: 'No experience' },
            { value: 'hobbyist', label: 'Hobbyist - DIY projects' },
            { value: 'educational', label: 'Educational - School/university projects' },
            { value: 'industrial', label: 'Industrial - Professional work' },
            { value: 'research', label: 'Research - Academic/R&D' },
          ],
        },
        {
          key: 'sensor_integration',
          label: 'Sensor Integration Experience',
          options: [
            { value: 'never', label: 'Never worked with sensors' },
            { value: 'basic', label: 'Basic - Simple sensors (temp, distance)' },
            { value: 'advanced', label: 'Advanced - Complex sensors (cameras, lidar)' },
            { value: 'fusion', label: 'Fusion - Multi-sensor integration' },
          ],
        },
        {
          key: 'electronics_knowledge',
          label: 'Electronics Knowledge',
          options: [
            { value: 'none', label: 'No knowledge' },
            { value: 'basic', label: 'Basic - Can read schematics' },
            { value: 'intermediate', label: 'Intermediate - Can design circuits' },
            { value: 'advanced', label: 'Advanced - PCB design, embedded systems' },
          ],
        },
      ],
    },
    {
      title: 'Learning Goals',
      questions: [
        {
          key: 'primary_interests',
          label: 'Primary Interests (Select all that apply)',
          type: 'multiselect',
          options: [
            { value: 'autonomous_navigation', label: 'Autonomous Navigation' },
            { value: 'computer_vision', label: 'Computer Vision' },
            { value: 'manipulation', label: 'Manipulation & Grasping' },
            { value: 'human_robot_interaction', label: 'Human-Robot Interaction' },
            { value: 'simulation', label: 'Simulation & Testing' },
            { value: 'physical_ai', label: 'Physical AI & Embodied Intelligence' },
          ],
        },
        {
          key: 'time_commitment',
          label: 'Time Commitment',
          options: [
            { value: 'casual', label: 'Casual - Few hours per week' },
            { value: 'regular', label: 'Regular - 5-10 hours per week' },
            { value: 'intensive', label: 'Intensive - 10+ hours per week' },
          ],
        },
      ],
    },
  ];

  const currentQuestions = steps[currentStep].questions;

  const handleSelect = (key: string, value: string, isMultiselect?: boolean) => {
    if (isMultiselect) {
      setProfile(prev => {
        const current = prev[key] as string[];
        const updated = current.includes(value)
          ? current.filter(v => v !== value)
          : [...current, value];
        return { ...prev, [key]: updated };
      });
    } else {
      setProfile(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(profile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const isStepComplete = () => {
    // Allow skipping any question
    return true;
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      <h2 className={styles.formTitle}>{steps[currentStep].title}</h2>
      <p className={styles.formSubtitle}>
        Help us personalize your learning experience (Step {currentStep + 1} of {steps.length})
      </p>

      <div className={styles.questionnaireForm}>
        {currentQuestions.map((question) => (
          <div key={question.key} className={styles.questionGroup}>
            <label className={styles.questionLabel}>{question.label}</label>
            <div className={styles.optionsGrid}>
              {question.options.map((option) => {
                const isSelected = question.type === 'multiselect'
                  ? (profile[question.key] as string[]).includes(option.value)
                  : profile[question.key] === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(question.key, option.value, question.type === 'multiselect')}
                    className={`${styles.optionButton} ${
                      isSelected ? styles.optionButtonSelected : ''
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.buttonGroup}>
        <button
          type="button"
          onClick={handlePrevious}
          className={styles.secondaryButton}
        >
          {currentStep === 0 ? 'Back to Credentials' : 'Previous'}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className={styles.skipButton}
        >
          Skip & Complete
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!isStepComplete() || loading}
          className={styles.submitButton}
        >
          {currentStep === steps.length - 1
            ? loading
              ? 'Creating Account...'
              : 'Complete Signup'
            : 'Next'}
        </button>
      </div>
    </div>
  );
}
