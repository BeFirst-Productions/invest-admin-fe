import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Spinner, Modal, Form } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllCommonPackages, createCommonPackage, updateCommonPackage, deleteCommonpackage } from '@/api/apis';
import { toast } from 'react-toastify';
import DeleteConfrimModal from '../../Common/DeleteConfrimModal';

const currency = 'AED ';

const unwrap = (res) => {
  if (!res) return null;
  if (res.data && res.data.data !== undefined) return res.data.data;
  if (res.data !== undefined) return res.data;
  return res;
};

const PackageCard = ({ pkg, onEdit, onDelete }) => {
  const points = (pkg.points || []).map(p => typeof p === "string" ? p : p.text);

  return (
    <Card
      className="h-100 border-0 overflow-hidden"
      style={{
        borderRadius: 20,
        boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
        transition: "all 0.35s ease",
        border: pkg.featured ? '2px solid #800020' : 'none'
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <div
        style={{
          height: 80,
          background: pkg.featured ? "#800020" : "linear-gradient(135deg, #1e293b, #0f172a)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        {pkg.featured && <span className="badge bg-light text-dark fw-bold mb-1">Featured Package</span>}
        <span className="badge bg-secondary">Order: {pkg.displayOrder || 0}</span>
      </div>

      <Card.Body className="px-4 d-flex flex-column" style={{ paddingTop: 30 }}>
        <div className="mb-4">
          <h5 className="fw-bold mb-1">{pkg.title}</h5>
          <small className="text-muted">{pkg.description}</small>
        </div>

        <div style={{ background: "#f8f9fa", borderRadius: 14, padding: "14px 16px", marginBottom: 18 }}>
          <div className="text-muted small">Starting from</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: pkg.featured ? "#800020" : "#0d6efd" }}>
            {currency}{pkg.amount}
          </div>
        </div>

        <ul className="list-unstyled mb-4">
          {points.length ? (
            points.map((pt, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", marginBottom: 10, fontSize: 14 }}>
                <IconifyIcon icon="bx:check" className="me-2 text-success" />
                {pt}
              </li>
            ))
          ) : (
            <li className="text-muted small">No features listed</li>
          )}
        </ul>

        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="text-center mb-2">
            <span className="badge bg-secondary w-100 py-2">{pkg.ctaText}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="primary" size="sm" className="w-100" onClick={() => onEdit(pkg)}>Edit</Button>
            <Button variant="outline-danger" size="sm" className="w-100" onClick={() => onDelete(pkg)}>Delete</Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const PackageModal = ({ show, onHide, initial = null, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [points, setPoints] = useState(['']);
  const [ctaText, setCtaText] = useState("Let's Do This");
  const [ctaHref, setCtaHref] = useState("contact-us");
  const [displayOrder, setDisplayOrder] = useState(0);
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setTitle(initial?.title || '');
    setDescription(initial?.description || '');
    setAmount(initial?.amount ?? '');
    
    // Initialize points array or fallback to single empty string
    const initialPoints = (initial?.points || []).map(p => (typeof p === 'string' ? p : p.text));
    setPoints(initialPoints.length ? initialPoints : ['']);
    setCtaText(initial?.ctaText || "Let's Do This");
    setCtaHref(initial?.ctaHref || "contact-us");
    setDisplayOrder(initial?.displayOrder ?? 0);

    setSubmitting(false);
    setErrors({});
  }, [initial, show]);

  const handleSubmit = async () => {
    const newErrors = {};
    const cleanPoints = points.map(s => s.trim()).filter(Boolean);

    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';

    if (amount === '' || Number.isNaN(Number(amount))) {
      newErrors.amount = 'Enter a valid amount';
    }

    if (!cleanPoints.length || cleanPoints.length > 10) {
      newErrors.points = 'Points must be between 1 and 10 items';
    }

    if (!ctaText) newErrors.ctaText = 'CTA Text is required';
    if (!ctaHref) newErrors.ctaHref = 'CTA Link is required';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        id: initial?._id,
        title,
        description,
        amount,
        points: cleanPoints,
        ctaText,
        ctaHref,
        displayOrder
      });
      onHide();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{initial ? 'Edit Package' : 'Create Package'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form noValidate>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  value={title}
                  isInvalid={!!errors.title}
                  onChange={e => {
                    setTitle(e.target.value);
                    setErrors(prev => ({ ...prev, title: null }));
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mt-2">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={description}
                  isInvalid={!!errors.description}
                  onChange={e => {
                    setDescription(e.target.value);
                    setErrors(prev => ({ ...prev, description: null }));
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              </Form.Group>

              <Row className="mt-2">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Amount (AED)</Form.Label>
                    <Form.Control
                      value={amount}
                      isInvalid={!!errors.amount}
                      onChange={e => {
                        setAmount(e.target.value);
                        setErrors(prev => ({ ...prev, amount: null }));
                      }}
                    />
                    <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>CTA Text</Form.Label>
                    <Form.Control
                      value={ctaText}
                      isInvalid={!!errors.ctaText}
                      onChange={e => {
                        setCtaText(e.target.value);
                        setErrors(prev => ({ ...prev, ctaText: null }));
                      }}
                    />
                    <Form.Control.Feedback type="invalid">{errors.ctaText}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
                <Col md={3}>
                  <Form.Group>
                    <Form.Label>CTA Link</Form.Label>
                    <Form.Control
                      value={ctaHref}
                      isInvalid={!!errors.ctaHref}
                      onChange={e => {
                        setCtaHref(e.target.value);
                        setErrors(prev => ({ ...prev, ctaHref: null }));
                      }}
                    />
                    <Form.Control.Feedback type="invalid">{errors.ctaHref}</Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Display Order</Form.Label>
                    <Form.Control
                      type="number"
                      value={displayOrder}
                      onChange={e => setDisplayOrder(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Features / Points</Form.Label>
                    {points.map((pt, idx) => (
                      <div key={idx} className="d-flex mb-2">
                        <Form.Control
                          value={pt}
                          onChange={e => {
                            const newPoints = [...points];
                            newPoints[idx] = e.target.value;
                            setPoints(newPoints);
                            setErrors(prev => ({ ...prev, points: null }));
                          }}
                          placeholder={`Feature ${idx + 1}`}
                        />
                        {points.length > 1 && (
                          <Button 
                            variant="outline-danger" 
                            className="ms-2 d-flex align-items-center" 
                            onClick={() => setPoints(points.filter((_, i) => i !== idx))}
                          >
                            <IconifyIcon icon="bx:trash" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {points.length < 10 && (
                      <Button variant="link" size="sm" onClick={() => setPoints([...points, ''])} className="p-0 text-decoration-none fw-bold mt-1">
                        + Add Feature
                      </Button>
                    )}
                    {errors.points && <div className="text-danger small mt-1">{errors.points}</div>}
                  </Form.Group>
                </Col>
              </Row>



            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [modal, setModal] = useState({ show: false, initial: null });
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await getAllCommonPackages();
      setPackages(unwrap(res) || []);
    } catch (err) {
      console.error(err);
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => setModal({ show: true, initial: null });
  const handleOpenEdit = pkg => setModal({ show: true, initial: pkg });
  const handleCloseModal = () => setModal({ show: false, initial: null });

  const handleSubmit = async data => {
    setFetching(true);
    try {
      let res;
      if (data.id) {
        res = await updateCommonPackage(data.id, data);
      } else {
        res = await createCommonPackage(data);
      }
      await fetchPackages();
      if (res.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(error?.message || "Operation failed");
      throw error; // Prevent modal from closing if error occurs
    } finally {
      setFetching(false);
    }
  };

  const handleDelete = pkg => {
    setDeleteModal(true);
    setSelectedPackage(pkg);
  };

  const confirmDeletePackage = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteCommonpackage(selectedPackage._id);
      if (res.success) {
        setPackages(prev => prev.filter(pkg => pkg._id !== selectedPackage._id));
        toast.success(res.message);
        setDeleteModal(false);
      }
    } catch (error) {
      toast.error(error?.message || "Failed to delete package");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <PageBreadcrumb subName="Pages" title="Packages" />
      <PageMetaData title="Packages" />

      <Row className="align-items-center mb-3">
        <Col>
          <h4>Homepage Packages</h4>
          <p className="text-muted">Manage the 3 packages displayed on the homepage.</p>
        </Col>
        <Col className="text-end">
          <Button className="me-2" variant="outline-secondary" onClick={fetchPackages}>Refresh</Button>
          <Button onClick={handleOpenCreate} disabled={packages.length >= 3}>Add Package</Button>
        </Col>
      </Row>

      {loading ? (
        <Spinner />
      ) : (
        <Row className="g-3">
          {packages.length ? (
            packages.map(pkg => (
              <Col md={4} key={pkg._id}>
                <PackageCard pkg={pkg} onEdit={handleOpenEdit} onDelete={handleDelete} />
              </Col>
            ))
          ) : (
            <Col>
              <p className="text-muted">No packages found.</p>
            </Col>
          )}
        </Row>
      )}

      <PackageModal show={modal.show} initial={modal.initial} onHide={handleCloseModal} onSubmit={handleSubmit} />

      {deleteModal && (
        <DeleteConfrimModal
          confirmDelete={confirmDeletePackage}
          isDeleting={isDeleting}
          handleModal={() => setDeleteModal(false)}
        />
      )}
    </>
  );
};

export default Packages;
