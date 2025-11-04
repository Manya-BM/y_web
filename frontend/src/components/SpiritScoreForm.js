import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import api from '../utils/api';

const SpiritScoreForm = ({ match, teamId, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    rulesKnowledge: 2,
    foulsAndBody: 2,
    fairMindedness: 2,
    positiveAttitude: 2,
    communication: 2,
    comments: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { rulesKnowledge, foulsAndBody, fairMindedness, positiveAttitude, communication, comments } = formData;
  
  const totalScore = rulesKnowledge + foulsAndBody + fairMindedness + positiveAttitude + communication;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === 'comments' ? value : Number(value) });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const matchIdToSend = typeof match === 'string' ? match : match?._id;

    if (!matchIdToSend || !teamId) {
      setLoading(false);
      setError('Please select both a match and a team to submit.');
      return;
    }
    
    try {
      const response = await api.post('/spirit-scores', {
        matchId: matchIdToSend,
        submittedForTeamId: teamId,
        ...formData
      });
      
      setSuccess(true);
      setLoading(false);
      if (onSubmitSuccess) {
        onSubmitSuccess(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit spirit score');
      setLoading(false);
    }
  };
  
  const scoreDescriptions = {
    0: 'Very Poor',
    1: 'Poor',
    2: 'Good (Standard)',
    3: 'Very Good',
    4: 'Excellent'
  };
  
  const renderScoreOptions = () => {
    return [0, 1, 2, 3, 4].map(score => (
      <option key={score} value={score}>
        {score} - {scoreDescriptions[score]}
      </option>
    ));
  };
  
  if (success) {
    return (
      <Alert variant="success">
        Spirit score submitted successfully! Total score: {totalScore}/20
      </Alert>
    );
  }
  
  return (
    <Card className="mb-4">
      <Card.Header as="h5">Submit Spirit Score</Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Rules Knowledge & Use (0-4)</Form.Label>
                <Form.Text className="d-block text-muted mb-2">
                  Did the opposing team know & apply the rules properly?
                </Form.Text>
                <Form.Select 
                  name="rulesKnowledge" 
                  value={rulesKnowledge} 
                  onChange={handleChange}
                >
                  {renderScoreOptions()}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4} className="d-flex align-items-center">
              <div className="score-display text-center w-100">
                <span className="fs-4">{rulesKnowledge}/4</span>
              </div>
            </Col>
          </Row>
          
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Fouls & Body Contact (0-4)</Form.Label>
                <Form.Text className="d-block text-muted mb-2">
                  Did the team avoid fouls, play safely, and resolve contact fairly?
                </Form.Text>
                <Form.Select 
                  name="foulsAndBody" 
                  value={foulsAndBody} 
                  onChange={handleChange}
                >
                  {renderScoreOptions()}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4} className="d-flex align-items-center">
              <div className="score-display text-center w-100">
                <span className="fs-4">{foulsAndBody}/4</span>
              </div>
            </Col>
          </Row>
          
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Fair-Mindedness (0-4)</Form.Label>
                <Form.Text className="d-block text-muted mb-2">
                  Did the team show respect and fair attitude in contentious situations?
                </Form.Text>
                <Form.Select 
                  name="fairMindedness" 
                  value={fairMindedness} 
                  onChange={handleChange}
                >
                  {renderScoreOptions()}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4} className="d-flex align-items-center">
              <div className="score-display text-center w-100">
                <span className="fs-4">{fairMindedness}/4</span>
              </div>
            </Col>
          </Row>
          
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Positive Attitude & Self-Control (0-4)</Form.Label>
                <Form.Text className="d-block text-muted mb-2">
                  Did players stay respectful regardless of scoreline or intensity?
                </Form.Text>
                <Form.Select 
                  name="positiveAttitude" 
                  value={positiveAttitude} 
                  onChange={handleChange}
                >
                  {renderScoreOptions()}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4} className="d-flex align-items-center">
              <div className="score-display text-center w-100">
                <span className="fs-4">{positiveAttitude}/4</span>
              </div>
            </Col>
          </Row>
          
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Communication (0-4)</Form.Label>
                <Form.Text className="d-block text-muted mb-2">
                  Did the team communicate clearly and effectively, especially in resolving disputes?
                </Form.Text>
                <Form.Select 
                  name="communication" 
                  value={communication} 
                  onChange={handleChange}
                >
                  {renderScoreOptions()}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={4} className="d-flex align-items-center">
              <div className="score-display text-center w-100">
                <span className="fs-4">{communication}/4</span>
              </div>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Comments (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              name="comments"
              value={comments}
              onChange={handleChange}
              placeholder="Add any additional comments about spirit..."
              rows={3}
              maxLength={500}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-between align-items-center">
            <div className="total-score">
              <h5>Total Spirit Score: <span className="text-primary">{totalScore}/20</span></h5>
            </div>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Spirit Score'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default SpiritScoreForm;