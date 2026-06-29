import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import "./Footer.css";

const footerLinks = {
  "ABOUT": [
    { label: "Contact Us", href: "/" },
    { label: "About Us", href: "/" },
    { label: "Careers", href: "/" },
    { label: "Flipkart Stories", href: "/" },
    { label: "Press", href: "/" },
    { label: "Flipkart Wholesale", href: "/" },
    { label: "Corporate Information", href: "/" },
  ],
  "HELP": [
    { label: "Payments", href: "/" },
    { label: "Shipping", href: "/" },
    { label: "Cancellation & Returns", href: "/" },
    { label: "FAQ", href: "/" },
    { label: "Report Infringement", href: "/" },
  ],
  "CONSUMER POLICY": [
    { label: "Cancellation & Returns", href: "/" },
    { label: "Terms Of Use", href: "/" },
    { label: "Security", href: "/" },
    { label: "Privacy", href: "/" },
    { label: "Sitemap", href: "/" },
    { label: "Grievance Redressal", href: "/" },
    { label: "EPR Compliance", href: "/" },
  ],
  "SOCIAL": [
    { label: "Facebook", href: "/", icon: <FaFacebook /> },
    { label: "Twitter", href: "/", icon: <FaTwitter /> },
    { label: "YouTube", href: "/", icon: <FaYoutube /> },
    { label: "Instagram", href: "/", icon: <FaInstagram /> },
  ],
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-grid">
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section} className="footer-col">
              <h4 className="footer-heading">{section}</h4>
              <ul className="footer-list">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="footer-link">
                      {link.icon && <span className="footer-icon">{link.icon}</span>}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Mail Us */}
          <div className="footer-col">
            <h4 className="footer-heading">MAIL US</h4>
            <p className="footer-address">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103,<br />
              Karnataka, India
            </p>
          </div>

          {/* Registered Office */}
          <div className="footer-col">
            <h4 className="footer-heading">REGISTERED OFFICE ADDRESS</h4>
            <p className="footer-address">
              Flipkart Internet Private Limited,<br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,<br />
              Outer Ring Road, Devarabeesanahalli Village,<br />
              Bengaluru, 560103, Karnataka, India<br />
              <strong>CIN</strong>: U51109KA2012PTC066107<br />
              <strong>Telephone</strong>: <a href="tel:044-45614700" className="footer-link">044-45614700</a>
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-mid-divider" />

      {/* Bottom Row */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          {/* Payment */}
          <div className="footer-bottom-links">
            <span className="footer-bottom-item">🛡️ &nbsp;Sell on Flipkart</span>
            <span className="footer-bottom-separator">|</span>
            <span className="footer-bottom-item">🛒 &nbsp;Advertise</span>
            <span className="footer-bottom-separator">|</span>
            <span className="footer-bottom-item">🎁 &nbsp;Gift Cards</span>
            <span className="footer-bottom-separator">|</span>
            <span className="footer-bottom-item">❓ &nbsp;Help Center</span>
          </div>
          <p className="footer-copyright">
            © 2007-2024 Flipkart.com — Clone for Educational Purposes
          </p>

          {/* App Badges */}
          <div className="footer-app-badges">
            <span className="app-badge">📱 App Store</span>
            <span className="app-badge">🤖 Google Play</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
