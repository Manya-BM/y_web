import React, { useState } from 'react';
import { Tab, Tabs, Card, Table, Button, Form, Row, Col, Badge, Alert, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import api from '../utils/api';

const CoachingDashboard = () => {
  // Mock data for children
  const [children, setChildren] = useState([
    { id: 1, name: 'John Doe', age: 12, gender: 'Male', active: true, attendance: 85 },
    { id: 2, name: 'Jane Smith', age: 13, gender: 'Female', active: true, attendance: 90 },
    { id: 3, name: 'Mike Johnson', age: 11, gender: 'Male', active: false, attendance: 60 },
    { id: 4, name: 'Sarah Williams', age: 14, gender: 'Female', active: true, attendance: 95 },
  ]);

  // Mock data for attendance records
  const [attendanceRecords, setAttendanceRecords] = useState([
    { id: 1, childName: 'John Doe', date: '2023-06-01', present: true },
    { id: 2, childName: 'Jane Smith', date: '2023-06-01', present: true },
    { id: 3, childName: 'Mike Johnson', date: '2023-06-01', present: false },
    { id: 4, childName: 'Sarah Williams', date: '2023-06-01', present: true },
  ]);

  // Mock data for LSAS assessments
  const [lsasRecords, setLsasRecords] = useState([
    { id: 1, childName: 'John Doe', date: '2023-05-15', score: 85, notes: 'Good progress' },
    { id: 2, childName: 'Jane Smith', date: '2023-05-15', score: 92, notes: 'Excellent performance' },
    { id: 3, childName: 'Mike Johnson', date: '2023-05-15', score: 65, notes: 'Needs improvement' },
  ]);

  // Mock data for home visits
  const [homeVisits, setHomeVisits] = useState([
    { id: 1, childName: 'John Doe', date: '2023-05-10', notes: 'Met with parents, discussed progress' },
    { id: 2, childName: 'Mike Johnson', date: '2023-05-12', notes: 'Discussed attendance issues with guardian' },
  ]);
  
  // Form states
  const [attendanceForm, setAttendanceForm] = useState({
    childName: '',
    date: new Date().toISOString().split('T')[0],
    session: 'Morning',
    present: true
  });
  
  const [lsasForm, setLsasForm] = useState({
    childName: '',
    date: new Date().toISOString().split('T')[0],
    score: 0,
    notes: ''
  });
  
  const [homeVisitForm, setHomeVisitForm] = useState({
    childName: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  
  // Success messages
  const [showAttendanceSuccess, setShowAttendanceSuccess] = useState(false);
  const [showLsasSuccess, setShowLsasSuccess] = useState(false);
  const [showHomeVisitSuccess, setShowHomeVisitSuccess] = useState(false);
  
  // Modal states
  const [showChildModal, setShowChildModal] = useState(false);
  const [showEditChildModal, setShowEditChildModal] = useState(false);
  const [showEditAttendanceModal, setShowEditAttendanceModal] = useState(false);
  const [showEditLsasModal, setShowEditLsasModal] = useState(false);
  const [showEditHomeVisitModal, setShowEditHomeVisitModal] = useState(false);
  const [editingChild, setEditingChild] = useState(null);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [editingLsas, setEditingLsas] = useState(null);
  const [editingHomeVisit, setEditingHomeVisit] = useState(null);
  
  // Child form state
  const [childForm, setChildForm] = useState({
    name: '',
    age: '',
    gender: 'male',
    community: '',
    active: true
  });

  // Calculate statistics
  const totalChildren = children.length;
  const activeChildren = children.filter(child => child.active).length;
  const maleChildren = children.filter(child => child.gender === 'Male').length;
  const femaleChildren = children.filter(child => child.gender === 'Female').length;
  const genderRatio = totalChildren > 0 ? (maleChildren / totalChildren * 100).toFixed(1) : 0;
  const avgAttendance = children.length > 0 ? 
    (children.reduce((sum, child) => sum + child.attendance, 0) / children.length).toFixed(1) : 0;
    
  // Form handlers
  const handleAttendanceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAttendanceForm({
      ...attendanceForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleLsasChange = (e) => {
    const { name, value } = e.target;
    setLsasForm({
      ...lsasForm,
      [name]: name === 'score' ? Number(value) : value
    });
  };
  
  const handleHomeVisitChange = (e) => {
    const { name, value } = e.target;
    setHomeVisitForm({
      ...homeVisitForm,
      [name]: value
    });
  };
  
  const handleChildFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setChildForm({
      ...childForm,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Edit handlers
  const handleEditChild = (child) => {
    setEditingChild(child);
    setChildForm({
      name: child.name || '',
      age: child.age || '',
      gender: child.gender?.toLowerCase() || 'male',
      community: child.community || '',
      active: child.active !== undefined ? child.active : true
    });
    setShowEditChildModal(true);
  };
  
  const handleEditAttendance = (record) => {
    setEditingAttendance(record);
    setAttendanceForm({
      childName: record.childName || '',
      date: record.date || new Date().toISOString().split('T')[0],
      session: record.session || 'Morning',
      present: record.present !== undefined ? record.present : true
    });
    setShowEditAttendanceModal(true);
  };
  
  const handleEditLsas = (record) => {
    setEditingLsas(record);
    setLsasForm({
      childName: record.childName || '',
      date: record.date || new Date().toISOString().split('T')[0],
      score: record.score || 0,
      notes: record.notes || ''
    });
    setShowEditLsasModal(true);
  };
  
  const handleEditHomeVisit = (visit) => {
    setEditingHomeVisit(visit);
    setHomeVisitForm({
      childName: visit.childName || '',
      date: visit.date || new Date().toISOString().split('T')[0],
      notes: visit.notes || ''
    });
    setShowEditHomeVisitModal(true);
  };
  
  // Update handlers
  const updateChild = () => {
    if (!editingChild) return;
    
    const updatedChildren = children.map(child => 
      child.id === editingChild.id 
        ? { ...child, ...childForm, age: Number(childForm.age) }
        : child
    );
    setChildren(updatedChildren);
    setShowEditChildModal(false);
    setEditingChild(null);
    toast.success('Child updated successfully!');
  };
  
  const updateAttendance = () => {
    if (!editingAttendance) return;
    
    const updatedRecords = attendanceRecords.map(record =>
      record.id === editingAttendance.id
        ? { ...record, ...attendanceForm }
        : record
    );
    setAttendanceRecords(updatedRecords);
    setShowEditAttendanceModal(false);
    setEditingAttendance(null);
    setAttendanceForm({
      childName: '',
      date: new Date().toISOString().split('T')[0],
      session: 'Morning',
      present: true
    });
    toast.success('Attendance record updated successfully!');
  };
  
  const updateLsas = () => {
    if (!editingLsas) return;
    
    const updatedRecords = lsasRecords.map(record =>
      record.id === editingLsas.id
        ? { ...record, ...lsasForm, score: Number(lsasForm.score) }
        : record
    );
    setLsasRecords(updatedRecords);
    setShowEditLsasModal(false);
    setEditingLsas(null);
    setLsasForm({
      childName: '',
      date: new Date().toISOString().split('T')[0],
      score: 0,
      notes: ''
    });
    toast.success('LSAS assessment updated successfully!');
  };
  
  const updateHomeVisit = () => {
    if (!editingHomeVisit) return;
    
    const updatedVisits = homeVisits.map(visit =>
      visit.id === editingHomeVisit.id
        ? { ...visit, ...homeVisitForm }
        : visit
    );
    setHomeVisits(updatedVisits);
    setShowEditHomeVisitModal(false);
    setEditingHomeVisit(null);
    setHomeVisitForm({
      childName: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    toast.success('Home visit updated successfully!');
  };
  
  // Add new child handler
  const addNewChild = () => {
    const newChild = {
      id: children.length > 0 ? Math.max(...children.map(c => c.id)) + 1 : 1,
      ...childForm,
      age: Number(childForm.age),
      attendance: 0
    };
    setChildren([...children, newChild]);
    setShowChildModal(false);
    setChildForm({
      name: '',
      age: '',
      gender: 'male',
      community: '',
      active: true
    });
    toast.success('Child added successfully!');
  };
  
  // Form submission handlers
  const submitAttendance = (e) => {
    e.preventDefault();
    
    // Create new attendance record
    const newRecord = {
      id: attendanceRecords.length + 1,
      childName: attendanceForm.childName,
      date: attendanceForm.date,
      session: attendanceForm.session,
      present: attendanceForm.present
    };
    
    // Update state
    setAttendanceRecords([...attendanceRecords, newRecord]);
    
    // Reset form
    setAttendanceForm({
      childName: '',
      date: new Date().toISOString().split('T')[0],
      session: 'Morning',
      present: true
    });
    
    // Show success message
    setShowAttendanceSuccess(true);
    setTimeout(() => setShowAttendanceSuccess(false), 3000);
  };
  
  const submitLsasAssessment = (e) => {
    e.preventDefault();
    
    // Create new LSAS assessment
    const newAssessment = {
      id: lsasRecords.length + 1,
      childName: lsasForm.childName,
      date: lsasForm.date,
      score: lsasForm.score,
      notes: lsasForm.notes
    };
    
    // Update state
    setLsasRecords([...lsasRecords, newAssessment]);
    
    // Reset form
    setLsasForm({
      childName: '',
      date: new Date().toISOString().split('T')[0],
      score: 0,
      notes: ''
    });
    
    // Show success message
    setShowLsasSuccess(true);
    setTimeout(() => setShowLsasSuccess(false), 3000);
  };
  
  const submitHomeVisit = (e) => {
    e.preventDefault();
    
    // Create new home visit record
    const newVisit = {
      id: homeVisits.length + 1,
      childName: homeVisitForm.childName,
      date: homeVisitForm.date,
      notes: homeVisitForm.notes
    };
    
    // Update state
    setHomeVisits([...homeVisits, newVisit]);
    
    // Reset form
    setHomeVisitForm({
      childName: '',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    
    // Show success message
    setShowHomeVisitSuccess(true);
    setTimeout(() => setShowHomeVisitSuccess(false), 3000);
  };

  return (
    <div className="coaching-dashboard">
      <h1 className="mb-4">Coaching Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="statistics mb-4">
        <Row>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Total Children</Card.Title>
                <h2>{totalChildren}</h2>
                <Card.Text>
                  <small className="text-muted">Active: {activeChildren}</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Gender Ratio</Card.Title>
                <h2>{genderRatio}% Male</h2>
                <Card.Text>
                  <small className="text-muted">M: {maleChildren} | F: {femaleChildren}</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>Avg. Attendance</Card.Title>
                <h2>{avgAttendance}%</h2>
                <Card.Text>
                  <small className="text-muted">Last 30 days</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>LSAS Progress</Card.Title>
                <h2>+12%</h2>
                <Card.Text>
                  <small className="text-muted">Last quarter</small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultActiveKey="children" className="mb-4">
        {/* Children Tab */}
        <Tab eventKey="children" title="Children">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Children List</h5>
              <Button variant="primary" size="sm" onClick={() => setShowChildModal(true)}>Add New Child</Button>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Status</th>
                    <th>Attendance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {children.map(child => (
                    <tr key={child.id}>
                      <td>{child.id}</td>
                      <td>{child.name}</td>
                      <td>{child.age}</td>
                      <td>{child.gender}</td>
                      <td>
                        {child.active ? 
                          <Badge bg="success">Active</Badge> : 
                          <Badge bg="secondary">Inactive</Badge>
                        }
                      </td>
                      <td>{child.attendance}%</td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEditChild(child)}>Edit</Button>
                        <Button variant="outline-info" size="sm">View</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Attendance Tab */}
        <Tab eventKey="attendance" title="Attendance">
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Record Attendance</h5>
            </Card.Header>
            <Card.Body>
              {showAttendanceSuccess && (
                <Alert variant="success" onClose={() => setShowAttendanceSuccess(false)} dismissible>
                  Attendance record added successfully!
                </Alert>
              )}
              <Form onSubmit={submitAttendance}>
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Child Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="childName" 
                        value={attendanceForm.childName} 
                        onChange={handleAttendanceChange}
                        placeholder="Enter child name" 
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control 
                        type="date" 
                        name="date" 
                        value={attendanceForm.date} 
                        onChange={handleAttendanceChange} 
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Session</Form.Label>
                      <Form.Select 
                        name="session" 
                        value={attendanceForm.session} 
                        onChange={handleAttendanceChange}
                      >
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={3} className="d-flex align-items-end">
                    <Button variant="primary" type="submit" className="w-100">Record Attendance</Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Check 
                      type="checkbox" 
                      label="Present" 
                      name="present" 
                      checked={attendanceForm.present} 
                      onChange={handleAttendanceChange} 
                    />
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Attendance Records</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Child Name</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map(record => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.childName}</td>
                      <td>{record.date}</td>
                      <td>
                        {record.present ? 
                          <Badge bg="success">Present</Badge> : 
                          <Badge bg="danger">Absent</Badge>
                        }
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => handleEditAttendance(record)}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* LSAS Assessment Tab */}
        <Tab eventKey="lsas" title="LSAS Assessment">
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Record LSAS Assessment</h5>
            </Card.Header>
            <Card.Body>
              {showLsasSuccess && (
                <Alert variant="success" onClose={() => setShowLsasSuccess(false)} dismissible>
                  LSAS assessment added successfully!
                </Alert>
              )}
              <Form onSubmit={submitLsasAssessment}>
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Child Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="childName" 
                        value={lsasForm.childName} 
                        onChange={handleLsasChange}
                        placeholder="Enter child name" 
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control 
                        type="date" 
                        name="date" 
                        value={lsasForm.date} 
                        onChange={handleLsasChange} 
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Score</Form.Label>
                      <Form.Control 
                        type="number" 
                        name="score" 
                        value={lsasForm.score} 
                        onChange={handleLsasChange} 
                        min="0" 
                        max="100" 
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} className="d-flex align-items-end">
                    <Button variant="primary" type="submit" className="w-100">Record Assessment</Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Notes</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="notes" 
                        value={lsasForm.notes} 
                        onChange={handleLsasChange} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent LSAS Assessments</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Child Name</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lsasRecords.map(record => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.childName}</td>
                      <td>{record.date}</td>
                      <td>{record.score}</td>
                      <td>{record.notes}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => handleEditLsas(record)}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Home Visits Tab */}
        <Tab eventKey="homeVisits" title="Home Visits">
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Record Home Visit</h5>
            </Card.Header>
            <Card.Body>
              {showHomeVisitSuccess && (
                <Alert variant="success" onClose={() => setShowHomeVisitSuccess(false)} dismissible>
                  Home visit record added successfully!
                </Alert>
              )}
              <Form onSubmit={submitHomeVisit}>
                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Child Name</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="childName" 
                        value={homeVisitForm.childName} 
                        onChange={handleHomeVisitChange}
                        placeholder="Enter child name" 
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control 
                        type="date" 
                        name="date" 
                        value={homeVisitForm.date} 
                        onChange={handleHomeVisitChange} 
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4} className="d-flex align-items-end">
                    <Button variant="primary" type="submit" className="w-100">Record Visit</Button>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Notes</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        name="notes" 
                        value={homeVisitForm.notes} 
                        onChange={handleHomeVisitChange} 
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Home Visits</h5>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Child Name</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {homeVisits.map(visit => (
                    <tr key={visit.id}>
                      <td>{visit.id}</td>
                      <td>{visit.childName}</td>
                      <td>{visit.date}</td>
                      <td>{visit.notes}</td>
                      <td>
                        <Button variant="outline-primary" size="sm" onClick={() => handleEditHomeVisit(visit)}>Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Add Child Modal */}
      <Modal show={showChildModal} onHide={() => setShowChildModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={childForm.name}
                onChange={handleChildFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={childForm.age}
                onChange={handleChildFormChange}
                min="1"
                max="18"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={childForm.gender}
                onChange={handleChildFormChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Community</Form.Label>
              <Form.Control
                type="text"
                name="community"
                value={childForm.community}
                onChange={handleChildFormChange}
                required
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Active"
              name="active"
              checked={childForm.active}
              onChange={handleChildFormChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChildModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={addNewChild}>Add Child</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Child Modal */}
      <Modal show={showEditChildModal} onHide={() => setShowEditChildModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Child</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={childForm.name}
                onChange={handleChildFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={childForm.age}
                onChange={handleChildFormChange}
                min="1"
                max="18"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select
                name="gender"
                value={childForm.gender}
                onChange={handleChildFormChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Community</Form.Label>
              <Form.Control
                type="text"
                name="community"
                value={childForm.community}
                onChange={handleChildFormChange}
                required
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Active"
              name="active"
              checked={childForm.active}
              onChange={handleChildFormChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditChildModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={updateChild}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Attendance Modal */}
      <Modal show={showEditAttendanceModal} onHide={() => setShowEditAttendanceModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Attendance Record</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Child Name</Form.Label>
              <Form.Control
                type="text"
                name="childName"
                value={attendanceForm.childName}
                onChange={handleAttendanceChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={attendanceForm.date}
                onChange={handleAttendanceChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Session</Form.Label>
              <Form.Select
                name="session"
                value={attendanceForm.session}
                onChange={handleAttendanceChange}
              >
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </Form.Select>
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Present"
              name="present"
              checked={attendanceForm.present}
              onChange={handleAttendanceChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditAttendanceModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={updateAttendance}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit LSAS Modal */}
      <Modal show={showEditLsasModal} onHide={() => setShowEditLsasModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit LSAS Assessment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Child Name</Form.Label>
              <Form.Control
                type="text"
                name="childName"
                value={lsasForm.childName}
                onChange={handleLsasChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={lsasForm.date}
                onChange={handleLsasChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Score</Form.Label>
              <Form.Control
                type="number"
                name="score"
                value={lsasForm.score}
                onChange={handleLsasChange}
                min="0"
                max="100"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={lsasForm.notes}
                onChange={handleLsasChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditLsasModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={updateLsas}>Update</Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Home Visit Modal */}
      <Modal show={showEditHomeVisitModal} onHide={() => setShowEditHomeVisitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Home Visit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Child Name</Form.Label>
              <Form.Control
                type="text"
                name="childName"
                value={homeVisitForm.childName}
                onChange={handleHomeVisitChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={homeVisitForm.date}
                onChange={handleHomeVisitChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notes</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="notes"
                value={homeVisitForm.notes}
                onChange={handleHomeVisitChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditHomeVisitModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={updateHomeVisit}>Update</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoachingDashboard;