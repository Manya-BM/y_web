import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const JerseyVerification = ({ teamId, matchId }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/teams/${teamId}`);
        setPlayers(data.players.map(p => ({
          playerId: p.player._id,
          name: `${p.player.firstName} ${p.player.lastName}`,
          jerseyNumber: p.jerseyNumber || '',
          verified: p.jerseyVerified || false
        })));
        setLoading(false);
      } catch (err) {
        setError('Failed to load team data');
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  const handleJerseyChange = (playerId, jerseyNumber) => {
    setPlayers(players.map(player => 
      player.playerId === playerId 
        ? { ...player, jerseyNumber } 
        : player
    ));
  };

  const handleVerificationChange = (playerId, verified) => {
    setPlayers(players.map(player => 
      player.playerId === playerId 
        ? { ...player, verified } 
        : player
    ));
  };

  const submitVerification = async () => {
    try {
      setLoading(true);
      const playerJerseys = players.map(p => ({
        playerId: p.playerId,
        jerseyNumber: p.jerseyNumber,
        verified: p.verified
      }));

      await api.put(`/teams/${teamId}/verify-jerseys`, { playerJerseys });
      setSuccess(true);
      setLoading(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to verify jerseys');
      setLoading(false);
    }
  };

  if (loading) return <div className="spinner-border" role="status"></div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="jersey-verification card">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">Jersey Verification</h5>
      </div>
      <div className="card-body">
        {success && (
          <div className="alert alert-success">
            Jersey numbers verified successfully!
          </div>
        )}
        
        <p className="card-text">Verify player jersey numbers before the match</p>
        
        <table className="table">
          <thead>
            <tr>
              <th>Player</th>
              <th>Jersey #</th>
              <th>Verified</th>
            </tr>
          </thead>
          <tbody>
            {players.map(player => (
              <tr key={player.playerId}>
                <td>{player.name}</td>
                <td>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    value={player.jerseyNumber}
                    onChange={(e) => handleJerseyChange(player.playerId, e.target.value)}
                    min="0"
                    max="99"
                  />
                </td>
                <td>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={player.verified}
                      onChange={(e) => handleVerificationChange(player.playerId, e.target.checked)}
                      id={`verify-${player.playerId}`}
                    />
                    <label className="form-check-label" htmlFor={`verify-${player.playerId}`}>
                      Verified
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <button 
          className="btn btn-primary mt-3" 
          onClick={submitVerification}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Verify Jersey Numbers'}
        </button>
      </div>
    </div>
  );
};

export default JerseyVerification;