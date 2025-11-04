import React, { useState, useEffect } from 'react';
import { Card, Table, Nav, Spinner } from 'react-bootstrap';
import api from '../utils/api';

const Leaderboards = ({ tournamentId }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('standings');

  useEffect(() => {
    fetchTeams();
  }, [tournamentId]);

  const fetchTeams = async () => {
    try {
      const { data } = await api.get(`/tournaments/${tournamentId}`);
      if (data.teams) {
        // Sort teams by wins (descending)
        const sortedTeams = [...data.teams].sort((a, b) => {
          // First by wins
          if (b.statistics.wins !== a.statistics.wins) {
            return b.statistics.wins - a.statistics.wins;
          }
          // Then by point differential
          const aDiff = a.statistics.goalsScored - a.statistics.goalsConceded;
          const bDiff = b.statistics.goalsScored - b.statistics.goalsConceded;
          if (bDiff !== aDiff) {
            return bDiff - aDiff;
          }
          // Then by goals scored
          return b.statistics.goalsScored - a.statistics.goalsScored;
        });
        setTeams(sortedTeams);
      }
      setLoading(false);
    } catch (error) {
      setError('Failed to load tournament data');
      setLoading(false);
    }
  };

  // Calculate team points (3 for win, 1 for draw)
  const calculatePoints = (team) => {
    return team.statistics.wins * 3 + team.statistics.draws;
  };

  // Calculate goal differential
  const calculateDifferential = (team) => {
    return team.statistics.goalsScored - team.statistics.goalsConceded;
  };

  // Calculate average spirit score
  const calculateAverageSpirit = (team) => {
    if (!team.statistics.matchesPlayed) return 0;
    return (team.statistics.spiritScore / team.statistics.matchesPlayed).toFixed(1);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card className="my-3">
      <Card.Body>
        <Card.Title>Tournament Standings</Card.Title>
        
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'standings'} 
              onClick={() => setActiveTab('standings')}
            >
              Standings
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'stats'} 
              onClick={() => setActiveTab('stats')}
            >
              Team Stats
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === 'spirit'} 
              onClick={() => setActiveTab('spirit')}
            >
              Spirit Scores
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : teams.length === 0 ? (
          <div className="alert alert-info">No teams found in this tournament</div>
        ) : (
          <div className="table-responsive">
            {activeTab === 'standings' && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>W</th>
                    <th>L</th>
                    <th>D</th>
                    <th>Points</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team, index) => (
                    <tr key={team._id}>
                      <td>{index + 1}</td>
                      <td>{team.name}</td>
                      <td>{team.statistics.wins}</td>
                      <td>{team.statistics.losses}</td>
                      <td>{team.statistics.draws}</td>
                      <td><strong>{calculatePoints(team)}</strong></td>
                      <td>{team.statistics.goalsScored}</td>
                      <td>{team.statistics.goalsConceded}</td>
                      <td>{calculateDifferential(team)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

            {activeTab === 'stats' && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Team</th>
                    <th>Matches</th>
                    <th>Win %</th>
                    <th>Goals/Game</th>
                    <th>Goals Against/Game</th>
                    <th>Goal Diff/Game</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((team) => {
                    const matches = team.statistics.matchesPlayed || 1;
                    return (
                      <tr key={team._id}>
                        <td>{team.name}</td>
                        <td>{team.statistics.matchesPlayed}</td>
                        <td>
                          {team.statistics.matchesPlayed
                            ? ((team.statistics.wins / team.statistics.matchesPlayed) * 100).toFixed(1)
                            : 0}%
                        </td>
                        <td>{(team.statistics.goalsScored / matches).toFixed(1)}</td>
                        <td>{(team.statistics.goalsConceded / matches).toFixed(1)}</td>
                        <td>{(calculateDifferential(team) / matches).toFixed(1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            )}

            {activeTab === 'spirit' && (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Team</th>
                    <th>Spirit Score</th>
                    <th>Matches</th>
                  </tr>
                </thead>
                <tbody>
                  {[...teams]
                    .sort((a, b) => calculateAverageSpirit(b) - calculateAverageSpirit(a))
                    .map((team, index) => (
                      <tr key={team._id}>
                        <td>{index + 1}</td>
                        <td>{team.name}</td>
                        <td>{calculateAverageSpirit(team)}</td>
                        <td>{team.statistics.matchesPlayed}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Leaderboards;