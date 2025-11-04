import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Alert, Image, Spinner } from 'react-bootstrap';
import api from '../utils/api';

const MatchPhotoUpload = ({ matchId }) => {
  const [match, setMatch] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (matchId) {
      fetchMatchData();
    }
  }, [matchId]);

  const fetchMatchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/matches/${matchId}`);
      setMatch(data);
      setPhotos(data.photos || []);
      setLoading(false);
    } catch (error) {
      setError('Failed to load match data');
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await api.post(`/matches/${matchId}/photos`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess('Photo uploaded successfully');
      // Handle both response formats
      const newPhoto = data.photo || (data.photos ? data.photos[data.photos.length - 1] : data);
      setPhotos([...photos, newPhoto]);
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('photoUpload');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Upload failed. Please try again.'
      );
    }
    setUploading(false);
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await api.delete(`/matches/${matchId}/photos/${photoId}`);
      setPhotos(photos.filter(photo => photo._id !== photoId));
      setSuccess('Photo deleted successfully');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to delete photo'
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center py-3">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card className="my-3">
      <Card.Body>
        <Card.Title>Match Photos</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {match && (
          <div className="mb-4">
            <h5>
              {match.team1?.name} vs {match.team2?.name}
            </h5>
            <p className="text-muted">
              {new Date(match.startTime).toLocaleDateString()} - Field {match.field} #{match.fieldNumber}
            </p>
          </div>
        )}

        <Form>
          <Form.Group controlId="photoUpload" className="mb-3">
            <Form.Label>Upload Match Photo</Form.Label>
            <Form.Control 
              type="file" 
              onChange={handleFileChange}
              accept="image/*"
            />
            <Form.Text className="text-muted">
              Max file size: 5MB. Supported formats: JPG, PNG, GIF
            </Form.Text>
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleUpload}
            disabled={uploading || !selectedFile}
          >
            {uploading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Uploading...
              </>
            ) : (
              'Upload Photo'
            )}
          </Button>
        </Form>

        <hr />

        <h5 className="mt-4">Match Gallery</h5>
        {photos.length === 0 ? (
          <p className="text-muted">No photos uploaded for this match yet.</p>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4 mt-2">
            {photos.map((photo, index) => (
              <Col key={photo._id || index}>
                <Card>
                  <Card.Img
                    variant="top"
                    src={photo.url}
                    alt={`Match photo ${index + 1}`}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {new Date(photo.uploadedAt).toLocaleDateString()}
                    </small>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeletePhoto(photo._id)}
                    >
                      Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default MatchPhotoUpload;