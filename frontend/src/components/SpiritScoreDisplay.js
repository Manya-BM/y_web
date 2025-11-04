import React, { useState, useEffect } from 'react';
import { Table, Card, Badge, Spinner, Alert } from 'react-bootstrap';
import api from '../utils/api';

const SpiritScoreDisplay = ({ teamId, tournamentId }) => {
  const [scores, setScores] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpiritScores = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/spirit-scores/team/${teamId}`);
        setScores(response.data.scores);
        setAverageScore(response.data.averageScore);
        setLoading(false);
      } catch (err) {
        setError('Failed to load spirit scores');
        setLoading(false);
      }
    };

    if (teamId) {
      fetchSpiritScores();
    }
  }, [teamId]);

  const getSpiritBadgeColor = (score) => {
    if (score >= 16) return 'success';
    if (score >= 12) return 'primary';
    if (score >= 8) return 'warning';
    return 'danger';
  };

  const getCategoryLabel = (category, score) => {
    const labels = {
      0: 'Very Poor',
      1: 'Poor',
      2: 'Good',
      3: 'Very Good',
      4: 'Excellent'
    };
    return `${score} - ${labels[score]}`;
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (scores.length === 0) {
    return <Alert variant="info">No spirit scores available for this team yet.</Alert>;
  }

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Spirit Scores</h5>
        <Badge bg={getSpiritBadgeColor(averageScore)} className="fs-6">
          Average: {averageScore}/20
        </Badge>
      </Card.Header>
      <Card.Body>
        <Table striped responsive>
          <thead>
            <tr>
              <th>Match Date</th>
              <th>Submitted By</th>
              <th>Rules</th>
              <th>Fouls</th>
              <th>Fair</th>
              <th>Attitude</th>
              <th>Comm</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score) => (
              <tr key={score._id}>
                <td>{new Date(score.match.date).toLocaleDateString()}</td>
                <td>{score.submittedBy.name}</td>
                <td title={getCategoryLabel('rules', score.rulesKnowledge)}>{score.rulesKnowledge}</td>
                <td title={getCategoryLabel('fouls', score.foulsAndBody)}>{score.foulsAndBody}</td>
                <td title={getCategoryLabel('fair', score.fairMindedness)}>{score.fairMindedness}</td>
                <td title={getCategoryLabel('attitude', score.positiveAttitude)}>{score.positiveAttitude}</td>
                <td title={getCategoryLabel('communication', score.communication)}>{score.communication}</td>
                <td>
                  <Badge bg={getSpiritBadgeColor(score.totalScore)}>
                    {score.totalScore}/20
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default SpiritScoreDisplay;