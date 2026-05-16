import { useState, useCallback } from 'react';
import Step0_Landing from './components/Step0_Landing';
import Step1_Search from './components/Step1_Search';
import Step2_ProfileConfirm from './components/Step2_ProfileConfirm';
import Step3_Hacking from './components/Step3_Hacking';
import Step4_Dashboard from './components/Step4_Dashboard';
import Step5_Sales from './components/Step5_Sales';
import { fetchProfileForSearch } from './services/api';
import './index.css';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [username, setUsername] = useState('');
  const [profileSnapshot, setProfileSnapshot] = useState(null);

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const goToStep = (stepIndex) => setCurrentStep(stepIndex);

  const handleSearchProfile = useCallback(async (rawInput) => {
    const snapshot = await fetchProfileForSearch(rawInput);
    setUsername(snapshot.username);
    setProfileSnapshot(snapshot);
    setCurrentStep(2);
  }, []);

  return (
    <div className={`app-container${currentStep === 4 ? ' app-container--step4' : ''}`}>
      {currentStep === 0 && <Step0_Landing nextStep={nextStep} />}
      {currentStep === 1 && <Step1_Search onSearchProfile={handleSearchProfile} />}
      {currentStep === 2 && (
        <Step2_ProfileConfirm
          nextStep={nextStep}
          prevStep={() => goToStep(1)}
          username={username}
          profileSnapshot={profileSnapshot}
        />
      )}
      {currentStep === 3 && (
        <Step3_Hacking nextStep={nextStep} username={username} profileSnapshot={profileSnapshot} />
      )}
      {currentStep === 4 && (
        <Step4_Dashboard nextStep={nextStep} username={username} profileSnapshot={profileSnapshot} />
      )}
      {currentStep === 5 && <Step5_Sales prevStep={() => goToStep(4)} username={username} profileSnapshot={profileSnapshot} />}
    </div>
  );
}

export default App;
