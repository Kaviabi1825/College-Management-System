import React, { Component } from 'react';
import '../styles/Form.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      lastName: '',
      announcement: '',
      lastAddedAnnouncement: '', // Store the last announcement added
      error: null,
      announcements: [
        'Announcement: DAE-BRNS Sponsored National Seminar ADVANCED MATERIALS FOR ENERGY AND ENVIRONMENTAL APPLICATIONS (AMEEA-23) physical mode on (Date: 30.09.2023)',
        'Announcement: Certificate Course on Patent Essentials - 2023 (PAT - ESS 2023) (Department Name - CIPR) on (Date: 11.10.2023)',
        'Announcement: Lean Six Sigma Green Belt Training Programme (Department Name - AU-TVS CQM) on (Date: 19.10.2023)',
      ],
      validationErrors: {
        email: '',
        firstName: '',
        lastName: '',
        announcement: '',
      },
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  validateForm = () => {
    const { email, firstName, lastName, announcement } = this.state;

    const errors = {
      email: '',
      firstName: '',
      lastName: '',
      announcement: '',
    };

    let isValid = true;

    // Validate email
    if (!email.trim()) {
      errors.email = 'Email is required';
      isValid = false;
    }

    // Validate first name
    if (!firstName.trim()) {
      errors.firstName = 'First Name is required';
      isValid = false;
    }

    // Validate last name
    if (!lastName.trim()) {
      errors.lastName = 'Last Name is required';
      isValid = false;
    }

    // Validate announcement
    if (!announcement.trim()) {
      errors.announcement = 'Announcement is required';
      isValid = false;
    }

    this.setState({ validationErrors: errors });
    return isValid;
  };

  handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const { email, firstName, lastName, announcement, announcements } = this.state;

    const newTopic = `Announcement: ${announcement} (Date: ${new Date().toLocaleDateString()})`;

    const updatedAnnouncements = [...announcements, newTopic];
    this.setState({
      announcements: updatedAnnouncements,
      lastAddedAnnouncement: newTopic, // Update the last added announcement
      error: null,
      announcement: '', // Clear the announcement field after adding
      validationErrors: {
        email: '',
        firstName: '',
        lastName: '',
        announcement: '',
      },
    });

    // Construct the request body
    const requestBody = JSON.stringify({
      email,
      firstName,
      lastName,
      announcement,
      date: new Date().toLocaleDateString(), // Include the date in the request
      topic1: newTopic, // Update topic1 with the announcement and date
    });

    // Send a POST request to the server
    fetch('https://backend8-m1tj.onrender.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    })
      .then((response) => {
        if (response.ok) {
          // Handle success (you can add success logic here)
        } else {
          this.setState({
            isAuthenticated: false,
            error: 'Registration failed. User already exists or other error.',
          });
        }
      })
      .catch((error) => {
        console.error('Error sending data to the backend:', error);
        this.setState({
          isAuthenticated: false,
          error: 'An error occurred while communicating with the server',
        });
      });
  }

  handleDelete() {
    const { announcements, lastAddedAnnouncement } = this.state;

    // Check if the last added announcement is in the left container
    if (announcements.includes(lastAddedAnnouncement)) {
      const updatedAnnouncements = [...announcements];
      const index = updatedAnnouncements.indexOf(lastAddedAnnouncement);

      if (index !== -1) {
        updatedAnnouncements.splice(index, 1); // Remove the matching announcement
        this.setState({ announcements: updatedAnnouncements });
      }
    }
  }

  render() {
    const { email, firstName, lastName, announcement, validationErrors, error, announcements } = this.state;

    return (
      <div className="center-container">
        <div className="left-container">
          <h2>Announcements</h2>
          {announcements.map((announcement, index) => (
            <div key={index} className="announcement-item">
              <p>{announcement}</p>
            </div>
          ))}
        </div>
        <div className="login-form-container right-side">
          <div className="right-side">
            <h2>Event Announcements</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => this.setState({ firstName: e.target.value })}
                />
                {validationErrors.firstName && (
                  <p className="error">{validationErrors.firstName}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => this.setState({ lastName: e.target.value })}
                />
                {validationErrors.lastName && (
                  <p className="error">{validationErrors.lastName}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
                {validationErrors.email && (
                  <p className="error">{validationErrors.email}</p>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="announcement">Announcement (with date)</label>
                <input
                  type="text"
                  id="announcement"
                  placeholder="Enter an announcement"
                  value={announcement}
                  onChange={(e) => this.setState({ announcement: e.target.value })}
                />
                {validationErrors.announcement && (
                  <p className="error">{validationErrors.announcement}</p>
                )}
              </div>
              <div className="button-container">
                <button type="submit">Add Announcement</button>
                <button type="button" onClick={this.handleDelete}>
                  Delete Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
