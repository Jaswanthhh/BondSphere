import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';

export const SecurityVerification = ({ onVerificationComplete, onClose }) => {
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, verified, failed
  const [securityScore, setSecurityScore] = useState(0);
  const [verificationSteps, setVerificationSteps] = useState([
    { id: 1, title: 'ID Verification', status: 'pending' },
    { id: 2, title: 'Face Verification', status: 'pending' },
    { id: 3, title: 'Phone Verification', status: 'pending' },
    { id: 4, title: 'Email Verification', status: 'pending' }
  ]);

  const handleVerification = async (stepId) => {
    // Simulate verification process
    const updatedSteps = verificationSteps.map(step => {
      if (step.id === stepId) {
        return { ...step, status: 'completed' };
      }
      return step;
    });
    setVerificationSteps(updatedSteps);

    // Calculate security score
    const completedSteps = updatedSteps.filter(step => step.status === 'completed').length;
    const newScore = (completedSteps / verificationSteps.length) * 100;
    setSecurityScore(newScore);

    // Check if all steps are completed
    if (completedSteps === verificationSteps.length) {
      setVerificationStatus('verified');
      onVerificationComplete(true);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">Security Verification</h2>
        </div>
      </div>

      {/* Security Score */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Security Score</span>
          <span className="text-sm font-semibold">{securityScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${securityScore}%` }}
          />
        </div>
      </div>

      {/* Verification Steps */}
      <div className="space-y-4">
        {verificationSteps.map((step) => (
          <div
            key={step.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(step.status)}
              <span className="font-medium">{step.title}</span>
            </div>
            {step.status === 'pending' && (
              <button
                onClick={() => handleVerification(step.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Verify
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Security Status */}
      {verificationStatus === 'verified' && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-green-700 font-medium">
            Your account is now verified and secure!
          </span>
        </div>
      )}
    </div>
  );
};

SecurityVerification.propTypes = {
  onVerificationComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
}; 