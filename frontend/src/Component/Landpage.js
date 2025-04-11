import React, { useState } from 'react';
import '../css/Landpage.css';
import Plan from '../img/Board.png';
import Board from '../img/Boards.png';
import Launch from '../img/launch.png';
import Report from '../img/report.png';
import collaborate from '../img/Boards.png';
import devops from '../img/devops.png';
import Lead from '../img/Lead.png';
import {Link} from 'react-router-dom'

function Landpage() {
  const [activeSection, setActiveSection] = useState('plan');

  const handleSectionClick = (section) => {
    setActiveSection(section);
  };

  function openLink() {
    window.open("https://www.atlassian.com/solutions/devops/integrations");
  }

  return (
    <div className="landpage">
      {/* Header Section */}
      <div className="landpage-header">
        <div className="landpage-header-buttons">
          <button
            className={`plan-button ${activeSection === 'plan' ? 'active' : ''}`}
            onClick={() => handleSectionClick('plan')}
          >
            Plan
          </button>
          <button
            className={`track-button ${activeSection === 'track' ? 'active' : ''}`}
            onClick={() => handleSectionClick('track')}
          >
            Track
          </button>
          <button
            className={`launch-button ${activeSection === 'launch' ? 'active' : ''}`}
            onClick={() => handleSectionClick('launch')}
          >
            Launch
          </button>
          <button
            className={`report-button ${activeSection === 'report' ? 'active' : ''}`}
            onClick={() => handleSectionClick('report')}
          >
            Report
          </button>
          <button
            className={`collaborate-button ${activeSection === 'collaborate' ? 'active' : ''}`}
            onClick={() => handleSectionClick('collaborate')}
          >
            Collaborate
          </button>
        </div>
      </div>
      {activeSection === 'plan' && (
        <div className="landpage-content">
          <div className="landpage-plan">
            <h1>Plan</h1>
            <p>Break the big ideas down into manageable chunks across teams with user stories, issues, and tasks.</p>

            <div className="landpage-quote">
              <div className="quote-text">
                <p>“Work becomes a lot more visible when it's all in one place. It makes collaboration a whole lot easier.”</p>
              </div>
              <div className="quote-author">
                <p className="author-name">JEFF LAI</p>
                <p className="author-title">INTERNAL INFRASTRUCTURE, CANVA</p>
              </div>
            </div>
          </div>

          <div className="plan-img">
            <img src={Plan} alt="Jira Plan" />
          </div>
        </div>
      )}

      {activeSection === 'track' && (
        <div className="landpage-content">
          <div className="landpage-plan">
            <h1>Track</h1>
            <p>Align teams, resources, and deliverables to ensure the project hits deadlines and maps to company goals from the start.</p>

            <div className="landpage-quote">
              <div className="quote-text">
                <p>“Tracking progress effectively improves team performance and ensures projects stay on course.”</p>
              </div>
              <div className="quote-author">
                <p className="author-name">SOME TRACKING EXPERT</p>
                <p className="author-title">PROJECT MANAGEMENT GURU</p>
              </div>
            </div>
          </div>

          <div className="plan-img">
            <img src={Board} alt="Jira Board" />
          </div>
        </div>
      )}

{activeSection === 'launch' && (
        <div className="landpage-content">
          <div className="landpage-plan">
            <h1>Launch</h1>
            <p>Connect your go-to-market and software teams with shared release calendars, so launch day goes off without a hitch.</p>

            <div className="landpage-quote">
              <div className="quote-text">
                <p>“A successful launch is the culmination of careful planning, diligent execution, and effective teamwork.”</p>
              </div>
              <div className="quote-author">
                <p className="author-name">LAUNCH STRATEGIST</p>
                <p className="author-title">PRODUCT MARKETING EXPERT</p>
              </div>
            </div>
          </div>

          <div className="plan-img">
            <img src={Launch} alt="Jira Launch" />
          </div>
        </div>
      )}

{activeSection === 'report' && (
        <div className="landpage-content">
          <div className="landpage-plan">
            <h1>Report</h1>
            <p>Gather insights into work - before, during, and after the project - to confirm everything is on track, and pivot when it’s not.</p>

            <div className="landpage-quote">
              <div className="quote-text">
                <p>“Data is the new oil. Reporting turns it into gasoline.”</p>
              </div>
              <div className="quote-author">
                <p className="author-name">REPORTING GURU</p>
                <p className="author-title">BUSINESS INTELLIGENCE ANALYST</p>
              </div>
            </div>
          </div>

          <div className="plan-img">
            <img src={Report} alt="Jira Report" />
          </div>
        </div>
      )}


{activeSection === 'collaborate' && (
        <div className="landpage-content">
          <div className="landpage-plan">
            <h1>Collaborate</h1>
            <p>Turn Jira into your team’s collaboration hub with real-time updates from popular 3rd party apps, commenting, Smart Links, and attachments.</p>

            <div className="landpage-quote">
              <div className="quote-text">
                <p>“Collaboration is the key to unlocking the full potential of any team.”</p>
              </div>
              <div className="quote-author">
                <p className="author-name">COLLABORATION COACH</p>
                <p className="author-title">TEAM DYNAMICS SPECIALIST</p>
              </div>
            </div>
          </div>

          <div className="plan-img">
            <img src={collaborate} alt="Jira Collaborate" />
          </div>
        </div>
      )}
      <div className="jira-devops">
        <div className="jira-diagram">
          <img src={devops} alt="Jira DevOps Diagram" />
        </div>
        <div className="devops-text">
          <h2 style={{"color":"white"}}>Code</h2>
          <p>Developers want to focus on code, not update issues. We get it! Open DevOps makes it easier to do both regardless of the tools you use. Now developers can stay focused and the business can stay aligned.</p>
          <Link to="https://www.atlassian.com/solutions/devops/integrations" className="explore-button">Explore Open DevOps</Link>
        </div>
        <div className="customer-benefits">
          <h3 style={{"color":"white"}}>HOW CUSTOMERS ARE BENEFITING</h3>
          <div className="benefit">
            <span className="benefit-title">Flo</span>
            <p className="benefit-value">900%</p>
            <p className="benefit-description">increase in deployments</p>
          </div>
          <div className="benefit">
            <p className="benefit-value">50%</p>
            <p className="benefit-description">decrease in cycle time</p>
          </div>
        </div>
      </div>
      <div className='lead-img'>
        <img src={Lead} alt="Lead Diagram" />
      </div>
    </div>
  );
}

export default Landpage;