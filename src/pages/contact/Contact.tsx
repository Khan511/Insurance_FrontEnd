import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  Headphones,
  Building,
  Globe,
  Award,
} from "lucide-react";
import "./Contact.css";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    insuranceType: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    setIsSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        insuranceType: "",
      });
    }, 3000);
  };

  // Contact methods
  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      description: "Speak directly with our insurance experts",
      details: "+45 70 20 20 20",
      action: "Call Now",
      color: "from-blue-600 to-cyan-500",
      gradient: "bg-gradient-to-br from-blue-600 to-cyan-500",
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "Get a detailed response within 24 hours",
      details: "support@insurancecompany.com",
      action: "Send Email",
      color: "from-emerald-600 to-teal-500",
      gradient: "bg-gradient-to-br from-emerald-600 to-teal-500",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Live Chat",
      description: "Instant help from our support team",
      details: "Available 24/7",
      action: "Start Chat",
      color: "from-violet-600 to-purple-500",
      gradient: "bg-gradient-to-br from-violet-600 to-purple-500",
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: "Schedule Call",
      description: "Book a consultation at your convenience",
      details: "Choose your time slot",
      action: "Book Now",
      color: "from-amber-600 to-orange-500",
      gradient: "bg-gradient-to-br from-amber-600 to-orange-500",
    },
  ];

  // Office locations
  const offices = [
    {
      city: "Copenhagen",
      address: "Insurance Street 123, 1550 Copenhagen",
      phone: "+45 33 12 34 56",
      email: "cph@insurancecompany.com",
      hours: "Mon-Fri: 8:00-18:00",
    },
    {
      city: "Aarhus",
      address: "Business Avenue 45, 8000 Aarhus",
      phone: "+45 86 12 34 56",
      email: "aarhus@insurancecompany.com",
      hours: "Mon-Fri: 9:00-17:00",
    },
    {
      city: "Odense",
      address: "Finance Road 78, 5000 Odense",
      phone: "+45 66 12 34 56",
      email: "odense@insurancecompany.com",
      hours: "Mon-Fri: 8:30-17:30",
    },
  ];

  // FAQ items
  const faqs = [
    {
      question: "What information should I have ready before contacting?",
      answer:
        "Have your policy number, personal details, and specific questions ready for faster service.",
    },
    {
      question: "How long does it take to get a response?",
      answer:
        "Email: within 24 hours. Phone & Live Chat: immediate during business hours. Emergency claims: 24/7 support.",
    },
    {
      question: "Can I get help in multiple languages?",
      answer:
        "Yes, we offer support in English, Danish, German, and Swedish through our multilingual team.",
    },
  ];

  return (
    <div className="contact-page">
      {/* Background Effects */}
      <div className="contact-background">
        <div className="contact-shape shape-1"></div>
        <div className="contact-shape shape-2"></div>
        <div className="contact-shape shape-3"></div>
      </div>

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <div className="contact-badge">
              <Sparkles className="w-4 h-4" />
              <span>Always Here to Help</span>
            </div>

            <h1 className="contact-hero-title">
              Get in <span className="contact-gradient-text">Touch</span>
            </h1>

            <p className="contact-hero-description">
              Our dedicated team is ready to assist you with any questions about
              your insurance, claims, or new policies. Reach out through any
              channel that works best for you.
            </p>

            {/* Quick Stats */}
            <div className="contact-stats">
              <div className="contact-stat">
                <div className="contact-stat-icon">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="contact-stat-content">
                  <div className="contact-stat-value">24/7</div>
                  <div className="contact-stat-label">Support Available</div>
                </div>
              </div>
              <div className="contact-stat">
                <div className="contact-stat-icon">
                  <Users className="w-5 h-5" />
                </div>
                <div className="contact-stat-content">
                  <div className="contact-stat-value">98%</div>
                  <div className="contact-stat-label">Satisfaction Rate</div>
                </div>
              </div>
              <div className="contact-stat">
                <div className="contact-stat-icon">
                  <Shield className="w-5 h-5" />
                </div>
                <div className="contact-stat-content">
                  <div className="contact-stat-value">2min</div>
                  <div className="contact-stat-label">Avg. Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="contact-methods-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              Choose Your Preferred Way to Connect
            </h2>
            <p className="section-subtitle">
              Multiple channels, one exceptional service experience
            </p>
          </div>

          <div className="contact-methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="contact-method-card">
                <div className={`contact-method-icon ${method.gradient}`}>
                  {method.icon}
                </div>
                <h3 className="contact-method-title">{method.title}</h3>
                <p className="contact-method-description">
                  {method.description}
                </p>
                <div className="contact-method-details">
                  <span>{method.details}</span>
                </div>
                <button className={`contact-method-button ${method.gradient}`}>
                  {method.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="contact-main">
        <div className="container">
          <div className="contact-content-grid">
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="contact-form-header">
                <h2 className="contact-form-title">Send Us a Message</h2>
                <p className="contact-form-subtitle">
                  Fill out the form below and we'll get back to you promptly
                </p>
              </div>

              {isSubmitted ? (
                <div className="success-message">
                  <div className="success-icon">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="success-title">Message Sent Successfully!</h3>
                  <p className="success-description">
                    Thank you for contacting us. Our team will get back to you
                    within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="Name..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-input"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="+45 12 34 56 78"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="insuranceType" className="form-label">
                        Insurance Type
                      </label>
                      <select
                        id="insuranceType"
                        name="insuranceType"
                        value={formData.insuranceType}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select an option</option>
                        <option value="auto">Auto Insurance</option>
                        <option value="life">Life Insurance</option>
                        <option value="property">Property Insurance</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="form-textarea"
                      placeholder="Please provide details about your inquiry..."
                    />
                  </div>

                  <div className="form-footer">
                    <div className="privacy-notice">
                      <Shield className="w-4 h-4" />
                      <span>Your information is secure and protected</span>
                    </div>

                    <button
                      type="submit"
                      className="submit-button"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Info Sidebar */}
            <div className="contact-info-sidebar">
              {/* Office Locations */}
              <div className="office-section">
                <div className="office-header">
                  <Building className="w-6 h-6" />
                  <h3 className="office-title">Our Offices</h3>
                </div>

                <div className="office-list">
                  {offices.map((office, index) => (
                    <div key={index} className="office-card">
                      <div className="office-city">{office.city}</div>
                      <div className="office-details">
                        <div className="office-detail">
                          <MapPin className="w-4 h-4" />
                          <span>{office.address}</span>
                        </div>
                        <div className="office-detail">
                          <Phone className="w-4 h-4" />
                          <span>{office.phone}</span>
                        </div>
                        <div className="office-detail">
                          <Mail className="w-4 h-4" />
                          <span>{office.email}</span>
                        </div>
                        <div className="office-detail">
                          <Clock className="w-4 h-4" />
                          <span>{office.hours}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="faq-section">
                <div className="faq-header">
                  <MessageCircle className="w-6 h-6" />
                  <h3 className="faq-title">Quick Questions</h3>
                </div>

                <div className="faq-list">
                  {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                      <div className="faq-question">{faq.question}</div>
                      <div className="faq-answer">{faq.answer}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="emergency-section">
                <div className="emergency-card">
                  <div className="emergency-icon">
                    <Headphones className="w-8 h-8" />
                  </div>
                  <h4 className="emergency-title">Emergency Claims</h4>
                  <p className="emergency-description">
                    24/7 emergency claims hotline for urgent assistance
                  </p>
                  <div className="emergency-number">+45 80 20 20 20</div>
                  <button className="emergency-button">
                    Call Emergency Line
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Support */}
      <section className="global-support-section">
        <div className="container">
          <div className="global-support-card">
            <div className="global-support-content">
              <div className="global-support-icon">
                <Globe className="w-10 h-10" />
              </div>
              <div>
                <h2 className="global-support-title">Global Support Network</h2>
                <p className="global-support-description">
                  Wherever you are in the world, our international support team
                  is ready to assist you in multiple languages.
                </p>
              </div>
            </div>
            <div className="global-support-features">
              <div className="global-feature">
                <Award className="w-5 h-5" />
                <span>24/7 International Hotline</span>
              </div>
              <div className="global-feature">
                <Users className="w-5 h-5" />
                <span>Multilingual Support Team</span>
              </div>
              <div className="global-feature">
                <Shield className="w-5 h-5" />
                <span>Global Claims Processing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Time Promise */}
      <section className="response-promise-section">
        <div className="container">
          <div className="response-promise">
            <div className="response-promise-content">
              <h2 className="response-promise-title">Our Response Promise</h2>
              <p className="response-promise-description">
                We guarantee a response to all inquiries within our service
                level agreements
              </p>
            </div>
            <div className="response-times">
              <div className="response-time">
                <div className="response-time-icon">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div className="response-time-info">
                  <div className="response-time-value">15 min</div>
                  <div className="response-time-label">Live Chat</div>
                </div>
              </div>
              <div className="response-time">
                <div className="response-time-icon">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="response-time-info">
                  <div className="response-time-value">2 min</div>
                  <div className="response-time-label">Phone Calls</div>
                </div>
              </div>
              <div className="response-time">
                <div className="response-time-icon">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="response-time-info">
                  <div className="response-time-value">24 hours</div>
                  <div className="response-time-label">Email Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
