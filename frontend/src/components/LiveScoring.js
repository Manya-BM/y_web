import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Alert, Spinner } from 'react-bootstrap';
import api from '../utils/api';
import { useSelector } from 'react-redux';

const LiveScoring = ({ matchId }) => {
  const [match, setMatch] = useState(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [scoringTeam, setScoringTeam] = useState('');
  const [scoringPlayer, setScoringPlayer] = useState('');
  const [team1Players, setTeam1Players] = useState([]);
  const [team2Players, setTeam2Players] = useState([]);

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    try {
      const { data } = await api.get(`/matches/${matchId}`);
      setMatch(data);
      setScore1(data.score1);
      setScore2(data.score2);
      setLoading(false);
      
      // Fetch team players
      fetchTeamPlayers(data.team1._id, 'team1');
      fetchTeamPlayers(data.team2._id, 'team2');
    } catch (error) {
      setError('Failed to load match details');
      setLoading(false);
    }
  };

  const fetchTeamPlayers = async (teamId, teamKey) => {
    try {
      const { data } = await api.get(`/teams/${teamId}`);
      if (teamKey === 'team1') {
        setTeam1Players(data.players);
      } else {
        setTeam2Players(data.players);
      }
    } catch (error) {
      console.error(`Failed to load ${teamKey} players`);
    }
  };

  const updateScoreHandler = async () => {
    setUpdating(true);
    setError('');
    setSuccess('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.put(`/matches/${matchId}/score`, {
        score1,
        score2,
        status: match.status === 'scheduled' ? 'in_progress' : match.status
      });

      setMatch(data);
      setSuccess('Score updated successfully');
      setUpdating(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setUpdating(false);
    }
  };

  const addScoringEventHandler = async () => {
    if (!scoringTeam || (scoringPlayer === '' && scoringTeam)) {
      setError('Please select both team and player');
      return;
    }

    setUpdating(true);
    setError('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await api.post(`/matches/${matchId}/score-event`, {
        team: scoringTeam,
        player: scoringPlayer,
        time: new Date(),
        points: 1
      });

      // Refresh match data
      fetchMatchDetails();
      setSuccess('Scoring event added');
      setScoringTeam('');
      setScoringPlayer('');
      setUpdating(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setUpdating(false);
    }
  };

  const completeMatchHandler = async () => {
    setUpdating(true);
    setError('');
    
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await api.put(`/matches/${matchId}/score`, {
        score1,
        score2,
        status: 'completed'
      });

      setMatch(data);
      setSuccess('Match marked as completed');
      setUpdating(false);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!match) {
    return <Alert variant="danger">Match not found</Alert>;
  }

  return (
    <Card className="my-3">
      <Card.Body>
        <Card.Title>Live Scoring</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <div className="text-center mb-4">
          <h3>
            {match.team1.name} vs {match.team2.name}
          </h3>
          <p>
            {new Date(match.startTime).toLocaleDateString()} at{' '}
            {new Date(match.startTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p>
            Field: {match.field} #{match.fieldNumber}
          </p>
          <div className="d-flex justify-content-center align-items-center">
            <div className="text-center mx-3">
              <h4>{match.team1.name}</h4>
              <div className="score-display">{score1}</div>
              <Button
                variant="outline-primary"
                onClick={() => setScore1(score1 + 1)}
                disabled={match.status === 'completed'}
                className="mt-2"
              >
                +1
              </Button>
            </div>
            <div className="text-center mx-3">
              <h4>VS</h4>
            </div>
            <div className="text-center mx-3">
              <h4>{match.team2.name}</h4>
              <div className="score-display">{score2}</div>
              <Button
                variant="outline-primary"
                onClick={() => setScore2(score2 + 1)}
                disabled={match.status === 'completed'}
                className="mt-2"
              >
                +1
              </Button>
            </div>
          </div>

          <div className="mt-3">
            <Button
              variant="primary"
              onClick={updateScoreHandler}
              disabled={updating || match.status === 'completed'}
              className="mx-2"
            >
              {updating ? 'Updating...' : 'Update Score'}
            </Button>
            <Button
              variant="success"
              onClick={completeMatchHandler}
              disabled={updating || match.status === 'completed'}
              className="mx-2"
            >
              {updating ? 'Processing...' : 'Complete Match'}
            </Button>
          </div>
        </div>

        {match.status !== 'completed' && (
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Record Scoring Event</Card.Title>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Scoring Team</Form.Label>
                    <Form.Select
                      value={scoringTeam}
                      onChange={(e) => setScoringTeam(e.target.value)}
                    >
                      <option value="">Select Team</option>
                      <option value={match.team1._id}>{match.team1.name}</option>
                      <option value={match.team2._id}>{match.team2.name}</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Scoring Player</Form.Label>
                    <Form.Select
                      value={scoringPlayer}
                      onChange={(e) => setScoringPlayer(e.target.value)}
                      disabled={!scoringTeam}
                    >
                      <option value="">Select Player</option>
                      {scoringTeam === match.team1._id
                        ? team1Players.map((player) => (
                            <option key={player._id} value={player._id}>
                              {player.name} (#{player.jerseyNumber || 'N/A'})
                            </option>
                          ))
                        : team2Players.map((player) => (
                            <option key={player._id} value={player._id}>
                              {player.name} (#{player.jerseyNumber || 'N/A'})
                            </option>
                          ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4} className="d-flex align-items-end">
                  <Button
                    variant="primary"
                    onClick={addScoringEventHandler}
                    disabled={updating || !scoringTeam || !scoringPlayer}
                    className="mb-3 w-100"
                  >
                    {updating ? 'Adding...' : 'Add Score'}
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {match.scoringHistory && match.scoringHistory.length > 0 && (
          <div className="mt-4">
            <h4>Scoring History</h4>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Team</th>
                    <th>Player</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {match.scoringHistory.map((event, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(event.time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td>
                        {event.team === match.team1._id
                          ? match.team1.name
                          : match.team2.name}
                      </td>
                      <td>{event.player ? event.player.name : 'Unknown'}</td>
                      <td>{event.points}</td>
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

export default LiveScoring;