import { Link, useLocation } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import bootstrapIcons from "./assets/bootstrap-icons.svg";
import { useUserContext } from "./App";

function AppNav() {
  const location = useLocation();
  const { user } = useUserContext();
  return (
    <Nav variant="pills" defaultActiveKey={location.pathname} as="ul" className="d-flex flex-column flex-shrink-0 p-3 bg-body-tertiary border-end min-vh-100 position-sticky" style={{ width: 280 }}>
      <Nav.Item as="li" className="text-secondary fw-bold mb-2">
        Purchase
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link eventKey="/orders" as={Link} to="/orders">
          <svg className="bi pe-none me-2" width={16} height={16} fill="currentColor">
            <use xlinkHref={`${bootstrapIcons}#cart`} />
          </svg>
          Requests
        </Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link eventKey="/menuitems" as={Link} to="/menuitems">
          <svg className="bi pe-none me-2" width={16} height={16} fill="currentColor">
            <use xlinkHref={`${bootstrapIcons}#journal-text`} />
          </svg>
          Products
        </Nav.Link>
      </Nav.Item>
      {user?.isAdmin && (
        <Nav.Item as="li">
          <Nav.Link eventKey="/user" as={Link} to="/user">
            <svg className="bi pe-none me-2" width={16} height={16} fill="currentColor">
              <use xlinkHref={`${bootstrapIcons}#people`} />
            </svg>
            Vendors
          </Nav.Link>
        </Nav.Item>
      )}
      <Nav.Item as="li">
        <Nav.Link eventKey="/categories" as={Link} to="/categories">
          <svg className="bi pe-none me-2" width={16} height={16} fill="currentColor">
            <use xlinkHref={`${bootstrapIcons}#clipboard2`} />
          </svg>
          Users
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}
export default AppNav;
