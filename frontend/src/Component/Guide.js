import React from 'react';
import image from '../img/image.jpg';
import img1 from '../img/img1.png';
import img2 from '../img/img2.png';
import img3 from '../img/img3.png';
import img4 from '../img/img4.png';
import '../css/Guide.css'

const Guide = () => {
  return (
    <div className="product">

      <div className="div1">
        <h1>Welcome to Jira</h1>
        <h3 style={{"color":"white"}}>Everything you’ll need to know</h3>
        <p>
          Whether you've used it in a past life, or have never heard of it, we'll help you navigate choosing the right product, setting it up, and learning the best practices. So grab your team and let's go!
        </p>
      </div>

      <div className="div2">
        <h3>What is Jira?</h3>
        <p>
          Jira is the #1 agile project management tool used by teams to plan, track, release, and support world-class software with confidence. It is the single source of truth for your entire development lifecycle, empowering autonomous teams with the context to move quickly while staying connected to the greater business goal. Whether used to manage simple projects or to power your DevOps practices, it makes it easy for teams to move work forward, stay aligned, and communicate in context. Sign up for a live demo of Jira.
        </p>
        <img src={image} alt="Jira Overview" />
      </div>

      <div className="div3">
        <h3>Who uses Jira?</h3>
        <p>
          Jira launched in 2002 as an issue tracking and project management tool for teams. Since then, 300,000+ companies globally have adopted Jira for its flexibility to support any type of project and extensibility to work with thousands of apps and integrations.
        </p>
      </div>

      <div className="div4">
        <h1>Dig into specific features</h1>
        <p>
          Jira supports any agile project management methodology for software development that your team might need. From agile planning to fully customizable Kanban and Scrum boards, Jira gives you the tools you need to estimate, report, and measure velocity with workflows designed to fit your frameworks.
        </p>

        <div className="card1">
          <img src={img1} alt="Scrum and Kanban Boards" />
          <h3>Boards</h3>
          <p>Manage your work with powerful Scrum and Kanban agile boards.</p>
        </div>

        <div className="card2">
          <img src={img2} alt="Timeline View" />
          <h3>Timeline</h3>
          <p>Plan and track work in the timeline view to ensure your team stays in sync and ahead of dependencies.</p>
        </div>

        <div className="card3">
          <img src={img3} alt="Jira Insights" />
          <h3>Insights</h3>
          <p>Out-of-the-box reports in Jira ensure your teams are always up to date and ready.</p>
        </div>

        <div className="card4">
          <img src={img4} alt="Jira Integrations" />
          <h3>Integrations</h3>
          <p>Extend the power of Jira with over 6000+ apps and integrations.</p>
        </div>
      </div>
    </div>
  );
};

export default Guide;