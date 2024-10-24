import React, { useState } from 'react';

const QuestionFeedback = ({ questionId, userEmail, handleSuccess = () => {} }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFeedback('');
    setErrorMessage('');
    // Track when feedback modal is opened
    logFeedbackEvent('feedback_modal_opened', questionId);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFeedback('');
    setErrorMessage('');
    setCharCount(0);
  };

  const handleFeedbackChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setFeedback(text);
      setCharCount(text.length);
      setErrorMessage('');
    }
  };

  const logFeedbackEvent = async (eventType, questionId) => {
    try {
      await fetch('/api/log-feedback-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType,
          questionId,
          userEmail,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error logging feedback event:', error);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      setErrorMessage('Please provide feedback before submitting');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/submit-question-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          userEmail,
          feedback: feedback.trim(),
          submittedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      // Log successful feedback submission
      await logFeedbackEvent('feedback_submitted', questionId);
      
      handleSuccess();
      handleCloseModal();
    } catch (error) {
      setErrorMessage('Failed to submit feedback. Please try again later.');
      // Log failed feedback submission
      await logFeedbackEvent('feedback_submission_failed', questionId);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="question-feedback-container">
      {/* Flag Question Button */}
      <button
        id={`flag-question-${questionId}`}
        onClick={handleOpenModal}
        className="flag-question-btn"
      >
        Flag Question
      </button>

      {/* Feedback Modal */}
      {isModalOpen && (
        <div 
          id="feedback-modal-overlay"
          className="feedback-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="feedback-modal">
            <div className="feedback-modal-header">
              <h2>Report Question Issue</h2>
              <button
                id="close-feedback-modal"
                onClick={handleCloseModal}
                className="close-modal-btn"
              >
                ×
              </button>
            </div>

            <div className="feedback-modal-content">
              <p>Please describe the issue with this question:</p>
              <textarea
                id={`feedback-text-${questionId}`}
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Describe any errors, unclear wording, or suggested improvements..."
                rows="5"
                maxLength={MAX_CHARS}
              />
              <div className="char-counter">
                {charCount}/{MAX_CHARS} characters
              </div>
              
              {errorMessage && (
                <div 
                  id="feedback-error-message"
                  className="error-message"
                >
                  {errorMessage}
                </div>
              )}

              <div className="feedback-modal-actions">
                <button
                  id="cancel-feedback"
                  onClick={handleCloseModal}
                  className="cancel-btn"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  id="submit-feedback"
                  onClick={handleSubmitFeedback}
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionFeedback;