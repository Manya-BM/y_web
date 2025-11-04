import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import api from '../utils/api';
import JerseyVerification from '../components/JerseyVerification';
import ScheduleBuilder from '../components/ScheduleBuilder';
import FieldSchedule from '../components/FieldSchedule';
import LiveScoring from '../components/LiveScoring';
import Leaderboards from '../components/Leaderboards';
import MatchDataExport from '../components/MatchDataExport';
import MatchPhotoUpload from '../components/MatchPhotoUpload';
import SpiritScoreForm from '../components/SpiritScoreForm';
import SpiritScoreDisplay from '../components/SpiritScoreDisplay';

const TournamentDetails = () => {
  const { id } = useParams();

  // State variables for component selection
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedMatch, setSelectedMatch] = useState('');
  const [selectedSpiritTeam, setSelectedSpiritTeam] = useState('');
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');

  // Fetch tournament data from API
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/tournaments/${id}`);
        setTournament(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tournament');
        setLoading(false);
      }
    };

    fetchTournament();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        {error}
      </Alert>
    );
  }

  if (!tournament) {
    return (
      <Alert variant="warning" className="m-4">
        Tournament not found
      </Alert>
    );
  }

  return (
    <div className="tournament-details">
      <h1>{tournament.name}</h1>
      <div className="badge bg-primary me-2">{tournament.status}</div>
      <p className="lead">{tournament.description}</p>
      
      <div className="row mt-4 mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Location</h5>
              <p className="card-text">{tournament.location}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Dates</h5>
              <p className="card-text">
                {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Teams</h5>
              <p className="card-text">{tournament.teams.length} registered teams</p>
            </div>
          </div>
        </div>
      </div>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            Teams
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Schedule
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'spirit' ? 'active' : ''}`}
            onClick={() => setActiveTab('spirit')}
          >
            Spirit Scores
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'jersey' ? 'active' : ''}`}
            onClick={() => setActiveTab('jersey')}
          >
            Jersey Verification
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'scheduleBuilder' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduleBuilder')}
          >
            Schedule Builder
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'fieldSchedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('fieldSchedule')}
          >
            Field Schedule
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'liveScoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('liveScoring')}
          >
            Live Scoring
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'leaderboards' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaderboards')}
          >
            Leaderboards
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'dataExport' ? 'active' : ''}`}
            onClick={() => setActiveTab('dataExport')}
          >
            Data Export
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'photos' ? 'active' : ''}`}
            onClick={() => setActiveTab('photos')}
          >
            Match Photos
          </button>
        </li>
      </ul>
      
      {activeTab === 'overview' && (
        <div className="overview-tab">
          <h3>Tournament Overview</h3>
          <p>This tournament focuses on promoting the spirit of the game and sportsmanship among all participants.</p>
          <h4>Rules</h4>
          <ul>
            <li>Games are played to 15 points</li>
            <li>Half time occurs when one team reaches 8 points</li>
            <li>Spirit scores must be submitted after each game</li>
            <li>Teams must have at least 3 female-matching players on the field at all times</li>
          </ul>
        </div>
      )}
      
      {activeTab === 'teams' && (
        <div className="teams-tab">
          <h3>Registered Teams</h3>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Team Name</th>
                  <th>Players</th>
                  <th>W-L</th>
                </tr>
              </thead>
              <tbody>
                {tournament.teams && tournament.teams.length > 0 ? (
                  tournament.teams.map(team => (
                    <tr key={team._id}>
                      <td>{team.name}</td>
                      <td>{team.players?.length || 0}</td>
                      <td>{team.statistics?.wins || 0}-{team.statistics?.losses || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">No teams registered yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'schedule' && (
        <div className="schedule-tab">
          <h3>Match Schedule</h3>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Match</th>
                  <th>Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tournament.matches && tournament.matches.length > 0 ? (
                  tournament.matches.map(match => (
                    <tr key={match._id}>
                      <td>{new Date(match.startTime).toLocaleString()}</td>
                      <td>{match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}</td>
                      <td>{match.scores?.team1 || 0} - {match.scores?.team2 || 0}</td>
                      <td>
                        <span className={`badge ${match.status === 'scheduled' ? 'bg-secondary' : match.status === 'in_progress' ? 'bg-warning' : 'bg-success'}`}>
                          {match.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No matches scheduled yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'spirit' && (
        <div className="spirit-tab">
          <h3>Spirit Scores</h3>
          
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h5 className="mb-0">Submit Spirit Score</h5>
                </div>
                 <div className="card-body">
                   <div className="mb-3">
                     <select
                       className="form-select"
                       onChange={(e) => setSelectedMatch(e.target.value)}
                       defaultValue=""
                     >
                       <option value="" disabled>Select a match</option>
                       {tournament.matches && tournament.matches.length > 0 ? (
                         tournament.matches.map(match => (
                           <option key={match._id} value={match._id}>
                             {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'} - {new Date(match.startTime).toLocaleString()}
                           </option>
                         ))
                       ) : (
                         <option disabled>No matches available</option>
                       )}
                     </select>
                   </div>
                   <div className="mb-3">
                     <select
                       className="form-select"
                       onChange={(e) => setSelectedSpiritTeam(e.target.value)}
                       defaultValue=""
                     >
                       <option value="" disabled>Select team to score</option>
                       {tournament.teams && tournament.teams.length > 0 ? (
                         tournament.teams.map(team => (
                           <option key={team._id} value={team._id}>{team.name}</option>
                         ))
                       ) : (
                         <option disabled>No teams available</option>
                       )}
                     </select>
                   </div>
                   {selectedMatch && selectedSpiritTeam && (
                     <SpiritScoreForm 
                       match={selectedMatch} 
                       teamId={selectedSpiritTeam}
                       onSubmitSuccess={() => alert('Spirit score submitted successfully!')}
                     />
                   )}
                 </div>
               </div>
             </div>
            
            <div className="col-md-6">
              <div className="card">
                <div className="card-header bg-success text-white">
                  <h5 className="mb-0">Team Spirit Scores</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <select
                      className="form-select"
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a team</option>
                      {tournament.teams && tournament.teams.length > 0 ? (
                        tournament.teams.map(team => (
                          <option key={team._id} value={team._id}>{team.name}</option>
                        ))
                      ) : (
                        <option disabled>No teams available</option>
                      )}
                    </select>
                  </div>
                  {selectedTeam && <SpiritScoreDisplay teamId={selectedTeam} tournamentId={id} />}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'jersey' && (
        <div className="jersey-tab">
          <h3>Jersey Verification</h3>
          <div className="mb-3">
            <select 
              className="form-select" 
              onChange={(e) => setSelectedTeam(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select a team</option>
              {tournament.teams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
          </div>
          {selectedTeam && <JerseyVerification teamId={selectedTeam} />}
        </div>
      )}

      {activeTab === 'scheduleBuilder' && (
        <div className="schedule-builder-tab">
          <h3>Tournament Schedule Builder</h3>
          <ScheduleBuilder tournamentId={id} />
        </div>
      )}

      {activeTab === 'fieldSchedule' && (
        <div className="field-schedule-tab">
          <h3>Field Schedule Management</h3>
          <FieldSchedule tournamentId={id} />
        </div>
      )}

      {activeTab === 'liveScoring' && (
        <div className="live-scoring-tab">
          <h3>Live Match Scoring</h3>
          <div className="mb-3">
            <select 
              className="form-select" 
              onChange={(e) => setSelectedMatch(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select a match</option>
              {tournament.matches.map(match => (
                <option key={match._id} value={match._id}>
                  {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'} - {new Date(match.startTime).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          {selectedMatch && <LiveScoring matchId={selectedMatch} />}
        </div>
      )}

      {activeTab === 'leaderboards' && (
        <div className="leaderboards-tab">
          <h3>Tournament Leaderboards</h3>
          <Leaderboards tournamentId={id} />
        </div>
      )}

      {activeTab === 'dataExport' && (
        <div className="data-export-tab">
          <h3>Match Data Export</h3>
          <MatchDataExport tournamentId={id} />
        </div>
      )}

      {activeTab === 'photos' && (
        <div className="photos-tab">
          <h3>Match Photos</h3>
          <div className="mb-3">
            <select 
              className="form-select" 
              onChange={(e) => setSelectedMatch(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Select a match</option>
              {tournament.matches.map(match => (
                <option key={match._id} value={match._id}>
                  {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'} - {new Date(match.startTime).toLocaleString()}
                </option>
              ))}
            </select>
          </div>
          {selectedMatch && <MatchPhotoUpload matchId={selectedMatch} />}
        </div>
      )}
    </div>
  );
};

export default TournamentDetails;