import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Footer.css';

function Footer() {
  return (
    <div className="footer-card">
      <footer className="footer-content">
        <div className="footer-columns">
       
          <div className="footer-column">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4IhRx_6BDacy2lFV-ksrZilplLIGBUP0BWw&s" alt="Logo" className="footer-logo" />
            <div className="footer-links">
              <Link to="https://www.atlassian.com/company">Company</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/events">Events</Link>
              <Link to="/blogs">Blogs</Link>
              <Link to="/investor-relations">Investor Relations</Link>
              <Link to="/atlassian-foundation">Atlassian Foundation</Link>
              <Link to="/contact-us">Contact us</Link>
            </div>
          </div>

          <div className="footer-column">
            <p className="footer-column-heading">PRODUCTS</p>
            <div className="footer-links">
              <Link to="/rovo">Rovo</Link>
              <Link to="/jira">Jira</Link>
              <Link to="/jira-align">Jira Align</Link>
              <Link to="/jira-service-management">Jira Service Management</Link>
              <Link to="/confluence">Confluence</Link>
              <Link to="/trello">Trello</Link>
              <Link to="/bitbucket">Bitbucket</Link>
              <Link to="/products">See all products →</Link>
            </div>
          </div>


          <div className="footer-column">
            <p className="footer-column-heading">RESOURCES</p>
            <div className="footer-links">
              <Link to="/technical-support">Technical support</Link>
              <Link to="/purchasing-licensing">Purchasing & licensing</Link>
              <Link to="/atlassian-community">Atlassian Community</Link>
              <Link to="/knowledge-base">Knowledge base</Link>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/my-account">My account</Link>
              <Link to="/create-support-ticket">Create support ticket →</Link>
            </div>
          </div>

          <div className="footer-column">
            <p className="footer-column-heading">LEARN</p>
            <div className="footer-links">
              <Link to="/partners">Partners</Link>
              <Link to="/training-certification">Training & certification</Link>
              <Link to="/documentation">Documentation</Link>
              <Link to="/developer-resources">Developer resources</Link>
              <Link to="/enterprise-services">Enterprise services</Link>
              <Link to="/learn">See all resources →</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">Copyright © 2025 Atlassian</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/impressum">Impressum</Link>
            <select className="footer-language-select">
              <option>English </option>
              <option>Hindi </option>
              <option>Marathi</option>
            </select>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
