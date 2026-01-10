import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-4 mt-auto z-0">
      <div className="container ">
        <div className="row">
          {/* Company Info */}
          <div className="col-md-4 mb-4 ">
            <h5 className="fw-bold mb-3">SecureLife Insurance</h5>
            <p className="text-white">
              Protecting your future with reliable insurance solutions since
              2005. We offer comprehensive coverage tailored to your unique
              needs.
            </p>
            <div className="d-flex mt-4">
              <a href="#" className="text-white me-3">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-white me-3">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-white me-3">
                <FaLinkedin size={20} />
              </a>
              <a href="#" className="text-white">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  Claims
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Insurance Products */}
          <div className="col-md-2 mb-4">
            <h5 className="fw-bold mb-3">Our Products</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  Life Insurance
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  Health Insurance
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  Auto Insurance
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  Home Insurance
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-decoration-none text-white">
                  Travel Insurance
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-3 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 text-primary" />
                <span className="text-white">Safe City, Copenhagen 2450</span>
              </li>
              <li className="mb-3 d-flex align-items-center">
                <FaPhone className="me-2 text-primary" />
                <span className="text-white">+45 44 12 34 57</span>
              </li>
              <li className="d-flex align-items-center">
                <FaEnvelope className="me-2 text-primary" />
                <span className="text-white">info@securelife.example</span>
              </li>
            </ul>

            <div className="mt-4">
              <h6 className="fw-bold">Newsletter</h6>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Your email"
                  aria-label="Email"
                />
                <button className="btn btn-primary" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary mt-0" />

        {/* Copyright */}
        <div className="row">
          <div className="col-md-6 mb-2 mb-md-0">
            <p className="text-white mb-0">
              &copy; {new Date().getFullYear()} SecureLife Insurance. All rights
              reserved.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <ul className="list-inline mb-0">
              <li className="list-inline-item">
                <a href="#" className="text-decoration-none text-white">
                  Privacy Policy
                </a>
              </li>
              <li className="list-inline-item mx-2">|</li>
              <li className="list-inline-item">
                <a href="#" className="text-decoration-none text-white">
                  Terms of Service
                </a>
              </li>
              <li className="list-inline-item mx-2">|</li>
              <li className="list-inline-item">
                <a href="#" className="text-decoration-none text-white">
                  Sitemap
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
