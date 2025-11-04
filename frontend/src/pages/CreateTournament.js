import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa';

const CreateTournament = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    rules: '',
    startDate: '',
    endDate: '',
    location: '',
    address: '',
    maxTeams: '',
    registrationDeadline: '',
    banner: '',
    spiritScoreEnabled: true,
    sponsors: [],
    fields: [],
  });

  const [sponsorForm, setSponsorForm] = useState({ name: '', logo: '', website: '' });
  const [fieldForm, setFieldForm] = useState({ name: '', fieldNumber: '', location: '', capacity: '' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSponsorChange = (e) => {
    setSponsorForm({ ...sponsorForm, [e.target.name]: e.target.value });
  };

  const handleFieldChange = (e) => {
    setFieldForm({ ...fieldForm, [e.target.name]: e.target.value });
  };

  const addSponsor = () => {
    if (sponsorForm.name) {
      setFormData({
        ...formData,
        sponsors: [...formData.sponsors, { ...sponsorForm }],
      });
      setSponsorForm({ name: '', logo: '', website: '' });
    }
  };

  const removeSponsor = (index) => {
    setFormData({
      ...formData,
      sponsors: formData.sponsors.filter((_, i) => i !== index),
    });
  };

  const addField = () => {
    if (fieldForm.name) {
      setFormData({
        ...formData,
        fields: [...formData.fields, { 
          ...fieldForm, 
          fieldNumber: Number(fieldForm.fieldNumber) || 0,
          capacity: Number(fieldForm.capacity) || 0,
          schedule: []
        }],
      });
      setFieldForm({ name: '', fieldNumber: '', location: '', capacity: '' });
    }
  };

  const removeField = (index) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((_, i) => i !== index),
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/tournaments', {
        ...formData,
        maxTeams: formData.maxTeams ? Number(formData.maxTeams) : undefined,
      });

      if (response.data) {
        toast.success('Tournament created successfully!');
        navigate(`/tournaments/${response.data._id}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create tournament';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-gradient">Create Tournament</h1>
        <Button variant="outline-secondary" onClick={() => navigate('/tournaments')}>
          Cancel
        </Button>
      </div>

      <Form onSubmit={onSubmit}>
        <Card className="modern-card p-4 mb-4">
          <h4 className="mb-3">Basic Information</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Tournament Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Asia Oceanic Championship 2024"
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rules & Regulations</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              placeholder="Tournament rules and regulations..."
            />
          </Form.Group>
        </Card>

        <Card className="modern-card p-4 mb-4">
          <h4 className="mb-3">Date & Location</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Start Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>End Date *</Form.Label>
                <Form.Control
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Location *</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
        </Card>

        <Card className="modern-card p-4 mb-4">
          <h4 className="mb-3">Registration Settings</h4>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Maximum Teams</Form.Label>
                <Form.Control
                  type="number"
                  name="maxTeams"
                  value={formData.maxTeams}
                  onChange={handleChange}
                  min="1"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Registration Deadline</Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Check
            type="checkbox"
            label="Enable Spirit Score"
            name="spiritScoreEnabled"
            checked={formData.spiritScoreEnabled}
            onChange={handleChange}
          />
        </Card>

        <Card className="modern-card p-4 mb-4">
          <h4 className="mb-3">Sponsors</h4>
          <Row className="mb-3">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Sponsor Name"
                name="name"
                value={sponsorForm.name}
                onChange={handleSponsorChange}
              />
            </Col>
            <Col md={4}>
              <Form.Control
                type="url"
                placeholder="Logo URL"
                name="logo"
                value={sponsorForm.logo}
                onChange={handleSponsorChange}
              />
            </Col>
            <Col md={4}>
              <div className="d-flex gap-2">
                <Form.Control
                  type="url"
                  placeholder="Website URL"
                  name="website"
                  value={sponsorForm.website}
                  onChange={handleSponsorChange}
                />
                <Button variant="primary" onClick={addSponsor} type="button">
                  <FaPlus />
                </Button>
              </div>
            </Col>
          </Row>
          {formData.sponsors.map((sponsor, index) => (
            <Alert key={index} variant="light" className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{sponsor.name}</strong>
                {sponsor.website && <span className="ms-2 text-muted">({sponsor.website})</span>}
              </div>
              <Button variant="outline-danger" size="sm" onClick={() => removeSponsor(index)}>
                <FaTrash />
              </Button>
            </Alert>
          ))}
        </Card>

        <Card className="modern-card p-4 mb-4">
          <h4 className="mb-3">Playing Fields</h4>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Field Name"
                name="name"
                value={fieldForm.name}
                onChange={handleFieldChange}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Field #"
                name="fieldNumber"
                value={fieldForm.fieldNumber}
                onChange={handleFieldChange}
              />
            </Col>
            <Col md={3}>
              <Form.Control
                type="text"
                placeholder="Location"
                name="location"
                value={fieldForm.location}
                onChange={handleFieldChange}
              />
            </Col>
            <Col md={2}>
              <Form.Control
                type="number"
                placeholder="Capacity"
                name="capacity"
                value={fieldForm.capacity}
                onChange={handleFieldChange}
              />
            </Col>
            <Col md={2}>
              <Button variant="primary" onClick={addField} type="button" className="w-100">
                <FaPlus />
              </Button>
            </Col>
          </Row>
          {formData.fields.map((field, index) => (
            <Alert key={index} variant="light" className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{field.name}</strong> {field.fieldNumber && `(#${field.fieldNumber})`}
                {field.location && <span className="ms-2 text-muted">{field.location}</span>}
              </div>
              <Button variant="outline-danger" size="sm" onClick={() => removeField(index)}>
                <FaTrash />
              </Button>
            </Alert>
          ))}
        </Card>

        <Card className="modern-card p-4 mb-4">
          <Form.Group className="mb-3">
            <Form.Label>Banner Image URL</Form.Label>
            <Form.Control
              type="url"
              name="banner"
              value={formData.banner}
              onChange={handleChange}
              placeholder="https://example.com/banner.jpg"
            />
          </Form.Group>
        </Card>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate('/tournaments')}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading} className="btn-modern">
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creating...
              </>
            ) : (
              <>
                <FaSave className="me-2" /> Create Tournament
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateTournament;

