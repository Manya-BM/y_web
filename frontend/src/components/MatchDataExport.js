import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Spinner } from 'react-bootstrap';
import api from '../utils/api';

const MatchDataExport = ({ tournamentId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exportFormat, setExportFormat] = useState('csv');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [tournamentId]);

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

  const handleExport = async () => {
    setExporting(true);
    try {
      // In a real app, this would call an API endpoint to generate the export
      // For now, we'll simulate the export by creating a CSV or JSON file
      
      if (exportFormat === 'csv') {
        generateCSV();
      } else {
        generateJSON();
      }
      
      setExporting(false);
    } catch (error) {
      setError('Failed to export data');
      setExporting(false);
    }
  };

  const generateCSV = () => {
    // Create CSV header
    let csv = 'Match ID,Team 1,Team 2,Score,Date,Status\n';
    
    // Add match data
    matches.forEach(match => {
      csv += `${match._id},${match.team1.name},${match.team2.name},${match.score1}-${match.score2},${new Date(match.startTime).toLocaleString()},${match.status}\n`;
    });
    
    // Create download link
    downloadFile(csv, 'tournament-matches.csv', 'text/csv');
  };

  const generateJSON = () => {
    // Create JSON data
    const jsonData = JSON.stringify(matches, null, 2);
    
    // Create download link
    downloadFile(jsonData, 'tournament-matches.json', 'application/json');
  };

  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Loading match data...</p>
          </div>
        ) : (
          <>
            <p>Export match data for this tournament in your preferred format.</p>
            
            <Form.Group className="mb-3">
              <Form.Label>Export Format</Form.Label>
              <Form.Select 
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value="csv">CSV (Excel compatible)</option>
                <option value="json">JSON</option>
              </Form.Select>
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                onClick={handleExport}
                disabled={exporting || matches.length === 0}
              >
                {exporting ? 'Exporting...' : `Export ${matches.length} Matches`}
              </Button>
            </div>
            
            {matches.length === 0 && !loading && (
              <Alert variant="info" className="mt-3">
                No matches available to export.
              </Alert>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default MatchDataExport;