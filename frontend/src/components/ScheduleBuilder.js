import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import api from '../utils/api';

const ScheduleBuilder = ({ tournamentId }) => {
  const [scheduleType, setScheduleType] = useState('round-robin');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [matchDuration, setMatchDuration] = useState(60);
  const [dailyStartTime, setDailyStartTime] = useState('09:00');
  const [dailyEndTime, setDailyEndTime] = useState('17:00');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [generatedMatches, setGeneratedMatches] = useState([]);

  const userInfo = JSON.parse(localStorage.getItem('user')) || null;

  useEffect(() => {
    // Set default dates (today and tomorrow)
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    setStartDate(today.toISOString().split('T')[0]);
    setEndDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  const generateScheduleHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.post(`/tournaments/${tournamentId}/schedule`, {
        scheduleType,
        startDate,
        endDate,
        matchDuration: parseInt(matchDuration),
        dailyStartTime,
        dailyEndTime,
      });

      setGeneratedMatches(data);
      setSuccess(true);
      setLoading(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setLoading(false);
    }
  };

  return (
    <Card className="my-3 p-3 rounded">
      <Card.Body>
        <Card.Title>Schedule Builder</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            Schedule generated successfully! {generatedMatches.length} matches created.
          </Alert>
        )}

        <Form onSubmit={generateScheduleHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Schedule Type</Form.Label>
            <Form.Select
              value={scheduleType}
              onChange={(e) => setScheduleType(e.target.value)}
            >
              <option value="round-robin">Round Robin</option>
              <option value="bracket">Bracket/Elimination</option>
            </Form.Select>
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Match Duration (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  value={matchDuration}
                  onChange={(e) => setMatchDuration(e.target.value)}
                  min="30"
                  max="180"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Daily Start Time</Form.Label>
                <Form.Control
                  type="time"
                  value={dailyStartTime}
                  onChange={(e) => setDailyStartTime(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Daily End Time</Form.Label>
                <Form.Control
                  type="time"
                  value={dailyEndTime}
                  onChange={(e) => setDailyEndTime(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="mt-3"
          >
            {loading ? 'Generating...' : 'Generate Schedule'}
          </Button>
        </Form>

        {generatedMatches.length > 0 && (
          <div className="mt-4">
            <h4>Generated Matches</h4>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead>
                  <tr>
                    <th>Teams</th>
                    <th>Field</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Round</th>
                  </tr>
                </thead>
                <tbody>
                  {generatedMatches.map((match) => (
                    <tr key={match._id}>
                      <td>
                        {match.team1.name} vs {match.team2.name}
                      </td>
                      <td>
                        {match.field} #{match.fieldNumber}
                      </td>
                      <td>{new Date(match.startTime).toLocaleDateString()}</td>
                      <td>
                        {new Date(match.startTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {new Date(match.endTime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>{match.round}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ScheduleBuilder;