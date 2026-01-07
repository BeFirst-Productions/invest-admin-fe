// ============================================================
// SystemInfo.jsx (Professional CMS Version)
// ============================================================

import { Card, Row, Col, Badge, ProgressBar } from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { useLayoutContext } from "@/context/useLayoutContext";
import { getStorageUsage } from "@/api/apis";
import { useEffect, useState } from "react";

export default function SystemInfo() {


    const [data, setData] = useState(null);
const [loadingStorage, setLoadingStorage] = useState(true);
const [storageError, setStorageError] = useState(null);

useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      setLoadingStorage(true);
      const res = await getStorageUsage();
      if (mounted) {
        setData(res);
      }
    } catch (err) {
      if (mounted) {
        setStorageError(err.message);
      }
    } finally {
      if (mounted) setLoadingStorage(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, []);

  const systemData = {
    name: "Reback CMS",
    version: "1.0.0",
    buildDate: "15 Jan 2025",
    environment: "Production",
    apiStatus: "Operational",
    dbStatus: "Connected",
    security: "Secure",
    uptime: "15 days 4 hours"
  };

  const stats = {
    totalUsers: 248,
    totalBlogs: 156,
    totalEnquiries: 892,
    storageUsed: 68
  };
  const { theme, changeTheme } = useLayoutContext();
const isDark = theme === "dark";




  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h4 className="fw-semibold mb-1">System Settings</h4>
        <p className="text-muted mb-0">
          Platform overview, system health, and storage usage
        </p>
      </div>

      {/* System Overview */}
      <Card className="mb-4 border-primary">
        <Card.Body className="text-center py-4">
          <IconifyIcon icon="bx:cog" className="fs-1 text-primary mb-3" />
          <h3 className="fw-bold mb-1">{systemData.name}</h3>
          <h6 className="text-primary mb-2">v{systemData.version}</h6>
          <Badge bg="success" className="mb-2">
            {systemData.environment}
          </Badge>
          <p className="text-muted small mb-0">
            Last deployed on {systemData.buildDate}
          </p>
        </Card.Body>
      </Card>

      {/* Key Stats */}
      {/* <Row className="mb-4">
        {[
          {
            label: "System Uptime",
            value: systemData.uptime,
            icon: "bx:time-five",
            color: "success"
          },
          {
            label: "Total Users",
            value: stats.totalUsers,
            icon: "bx:user",
            color: "primary"
          },
          {
            label: "Blog Posts",
            value: stats.totalBlogs,
            icon: "bx:edit",
            color: "warning"
          },
          {
            label: "Enquiries",
            value: stats.totalEnquiries,
            icon: "bx:message-dots",
            color: "info"
          }
        ].map((item, idx) => (
          <Col md={6} lg={3} key={idx} className="mb-3">
            <Card className="h-100">
              <Card.Body className="text-center">
                <IconifyIcon
                  icon={item.icon}
                  className={`fs-1 text-${item.color} mb-2`}
                />
                <h6 className="text-muted mb-1">{item.label}</h6>
                <h5 className="fw-semibold mb-0">{item.value}</h5>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row> */}

      {/* System Health (NEW PROFESSIONAL SECTION) */}
      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">
            <IconifyIcon icon="bx:shield-quarter" className="me-2 text-primary" />
            System Health
          </h5>

          <Row>
            {[
              {
                label: "API Status",
                value: systemData.apiStatus,
                status: "success"
              },
              {
                label: "Database",
                value: systemData.dbStatus,
                status: "success"
              },
      
              {
                label: "Environment",
                value: systemData.environment,
                status: "success"
              }
            ].map((item, idx) => (
              <Col md={6} lg={3} key={idx} className="mb-3">
                <div className="d-flex align-items-center justify-content-between border rounded px-3 py-2 h-100">
                  <span className="text-muted">{item.label}</span>
                  <Badge bg={item.status}>{item.value}</Badge>
                </div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
{/* ===================================================== */}
{/* USER PREFERENCES */}
{/* ===================================================== */}

<Card className="mt-4">
  <Card.Body>
    <h5 className="mb-3">
      <IconifyIcon icon="bx:paint" className="me-2 text-primary" />
      Appearance
    </h5>

<Row className="align-items-center mb-3">
  <Col>
    <h6 className="mb-1">Dark Mode</h6>
    <p className="text-muted mb-0 small">
      Toggle dark mode on/off
    </p>
  </Col>
  <Col xs="auto">
    <div className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        checked={isDark}
        onChange={() => changeTheme(isDark ? "light" : "dark")}
      />
    </div>
  </Col>
</Row>


    {/* <Row className="align-items-center">
      <Col>
        <h6 className="mb-1">Custom Font</h6>
        <p className="text-muted mb-0 small">
          Choose a custom font for the app
        </p>
      </Col>
      <Col xs="auto">
        <select className="form-select form-select-sm">
          <option>Sans-serif</option>
          <option>Serif</option>
          <option>Monospace</option>
        </select>
      </Col>
    </Row> */}
    
  </Card.Body>
</Card>

{/* <Card className="mt-4">
  <Card.Body>
    <h5 className="mb-3">
      <IconifyIcon icon="bx:bell" className="me-2 text-primary" />
      Notifications
    </h5>

    <Row className="align-items-center mb-3">
      <Col>
        <h6 className="mb-1">Enable Notifications</h6>
        <p className="text-muted mb-0 small">
          Receive notifications from the system
        </p>
      </Col>
      <Col xs="auto">
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" defaultChecked />
        </div>
      </Col>
    </Row>

    <Row className="align-items-center">
      <Col>
        <h6 className="mb-1">Notification Sound</h6>
        <p className="text-muted mb-0 small">
          Play sound for new notifications
        </p>
      </Col>
      <Col xs="auto">
        <div className="form-check form-switch">
          <input className="form-check-input" type="checkbox" />
        </div>
      </Col>
    </Row>
  </Card.Body>
</Card> */}

      {/* Storage Usage */}
<Card>
  <Card.Body>
    <h5 className="mb-3 d-flex align-items-center">
      <IconifyIcon icon="bx:hdd" className="me-2 text-primary fs-4" />
      Storage Usage
    </h5>

    {/* Used space row */}
    <div className="d-flex justify-content-between align-items-center mb-2">
      <span className="text-muted">Used Space</span>

      {data ? (
        <span className="fw-semibold">
          {data.display.value} {data.display.unit}
          <span className="text-muted ms-1">
            / {data.limitMB} MB
          </span>
        </span>
      ) : (
        <span className="text-muted small">Loading storage data…</span>
      )}
    </div>

    {/* Progress bar */}
    <ProgressBar
      now={data?.percentage ?? 0}
      animated={!data}
      variant={
        data?.percentage >= 90
          ? "danger"
          : data?.percentage >= 70
          ? "warning"
          : "primary"
      }
      style={{ height: "8px" }}
    />

    {/* Helper text */}
    <div className="d-flex justify-content-between align-items-center mt-2">
      <small className="text-muted">
        {data
          ? `${data.percentage.toFixed(1)}% of storage used`
          : "Fetching MongoDB storage details"}
      </small>

      <small className="text-muted">
        MongoDB Atlas Free Tier
      </small>
    </div>

    {/* Empty / error fallback */}
    {!data && (
      <small className="text-warning d-block mt-2">
        Storage metrics unavailable at the moment
      </small>
    )}
  </Card.Body>
</Card>


    </div>
  );
}
