import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Spinner, Alert } from 'react-bootstrap';
import api from '../utils/api';

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tournaments');
        setTournaments(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load tournaments');
        setLoading(false);
      }
    };

    fetchTournaments();
  }, []);

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

  return (
    <div className="tournament-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Tournaments</h1>
        <Link to="/tournaments/create" className="btn btn-primary">
          Create Tournament
        </Link>
      </div>

      {tournaments.length === 0 ? (
        <Alert variant="info">
          No tournaments available. Create one to get started!
        </Alert>
      ) : (
        <div className="row">
          {tournaments.map((tournament) => (
            <div key={tournament._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{tournament.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{tournament.location}</h6>
                <p className="card-text">
                  <strong>Date:</strong> {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
                  <br />
                  <strong>Teams:</strong> {tournament.teams?.length || 0}
                  <br />
                  <strong>Status:</strong> <span className={`badge ${tournament.status === 'upcoming' ? 'bg-primary' : tournament.status === 'ongoing' ? 'bg-success' : 'bg-secondary'}`}>{tournament.status}</span>
                </p>
                <Link to={`/tournaments/${tournament._id}`} className="btn btn-outline-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

export default TournamentList;