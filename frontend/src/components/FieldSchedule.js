import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Table, Button, Spinner } from 'react-bootstrap';
import api from '../utils/api';
import { useSelector } from 'react-redux';

const FieldSchedule = ({ tournamentId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [fields, setFields] = useState([]);
  const [dates, setDates] = useState([]);

  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    fetchMatches();
  }, [tournamentId]);

  useEffect(() => {
    if (matches.length > 0) {
      // Extract unique fields
      const uniqueFields = [...new Set(matches.map(match => match.field))];
      setFields(uniqueFields);
      
      // Extract unique dates
      const uniqueDates = [...new Set(matches.map(match => 
        new Date(match.startTime).toISOString().split('T')[0]
      ))];
      setDates(uniqueDates.sort());
      
      // Set default selections
      if (!selectedDate && uniqueDates.length > 0) {
        setSelectedDate(uniqueDates[0]);
      }
      if (!selectedField && uniqueFields.length > 0) {
        setSelectedField(uniqueFields[0]);
      }
    }
  }, [matches]);

  const fetchMatches = async () => {
    try {
      const { data } = await api.get(`/matches?tournament=${tournamentId}`);
      setMatches(data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load matches');
      setLoading(false);
    }
  };

  const updateMatchTime = async (matchId, newStartTime, newEndTime) => {
    try {
      await api.put(`/matches/${matchId}`, {
        startTime: newStartTime,
        endTime: newEndTime
      });

      // Refresh matches
      fetchMatches();
    } catch (error) {
      setError('Failed to update match time');
    }
  };

  const filteredMatches = matches.filter(match => {
    const matchDate = new Date(match.startTime).toISOString().split('T')[0];
    return (!selectedDate || matchDate === selectedDate) && 
           (!selectedField || match.field === selectedField);
  });

  const handleTimeChange = (match, newTime, isStartTime) => {
    const date = new Date(match.startTime).toISOString().split('T')[0];
    const timeValue = newTime;
    
    const newDateTime = new Date(`${date}T${timeValue}`);
    
    if (isStartTime) {
      // Calculate new end time based on match duration
      const currentStart = new Date(match.startTime);
      const currentEnd = new Date(match.endTime);
      const duration = currentEnd - currentStart;
      
      const newEndTime = new Date(newDateTime.getTime() + duration);
      
      updateMatchTime(match._id, newDateTime, newEndTime);
    } else {
      updateMatchTime(match._id, new Date(match.startTime), newDateTime);
    }
  };

  return (
    <Card className="my-3">
      <Card.Body>
        <Card.Title>Field Schedule Management</Card.Title>
        
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Date</Form.Label>
                  <Form.Select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  >
                    <option value="">All Dates</option>
                    {dates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString()}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Select Field</Form.Label>
                  <Form.Select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                  >
                    <option value="">All Fields</option>
                    {fields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {filteredMatches.length === 0 ? (
              <div className="alert alert-info">No matches found for the selected criteria</div>
            ) : (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Teams</th>
                      <th>Field</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMatches.map((match) => (
                      <tr key={match._id}>
                        <td>
                          {match.team1.name} vs {match.team2.name}
                        </td>
                        <td>
                          {match.field} #{match.fieldNumber}
                        </td>
                        <td>
                          <Form.Control
                            type="time"
                            defaultValue={new Date(match.startTime).toTimeString().slice(0, 5)}
                            onChange={(e) => handleTimeChange(match, e.target.value, true)}
                            disabled={match.status === 'completed'}
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="time"
                            defaultValue={new Date(match.endTime).toTimeString().slice(0, 5)}
                            onChange={(e) => handleTimeChange(match, e.target.value, false)}
                            disabled={match.status === 'completed'}
                          />
                        </td>
                        <td>
                          <span className={`badge bg-${match.status === 'completed' ? 'success' : match.status === 'in_progress' ? 'warning' : 'primary'}`}>
                            {match.status}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            href={`/matches/${match._id}`}
                          >
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default FieldSchedule;