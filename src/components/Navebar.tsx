import {
  useGetCurrenttUserQuery,
  useLogoutMutation,
} from "@/services/UserApiSlice";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useNavigate } from "react-router";

function Navbare() {
  const navigate = useNavigate();
  const { data: currentUser, refetch } = useGetCurrenttUserQuery();
  const [logout, { data }] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      // Clear any cached data
      refetch();
      navigate("/login", { replace: true });

      // Force hard navigation to clear browser cache
      window.location.href = "/login";
    } catch (error) {
      console.log("Logut Error: ", error);

      // Still redirect even if logout fails
      navigate("/login", { replace: true });
    }
  };

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/" className=" p-1 rounded shadow">
          Naji
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/private-policies">Private</Nav.Link>
            <Nav.Link href="/commercial-policies">Commercial</Nav.Link>
            <NavDropdown title="Insurrances" id="collapsible-nav-dropdown">
              <NavDropdown.Item href="/all-insurances">
                All Insurrances
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">Report damage</Nav.Link>
            {currentUser?.status !== 200 && !currentUser?.data.user ? (
              <Nav.Link eventKey={2} href="/login">
                Log in
              </Nav.Link>
            ) : (
              <>
              <Nav.Link onClick={() => handleLogout()}>Logout</Nav.Link>
              <Nav.Link href="/my-page">My Page</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbare;
