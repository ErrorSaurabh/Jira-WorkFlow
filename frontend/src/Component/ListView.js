import React from "react"
import '../css/ListView.css';
const ListView = ({ issues }) => {
  return (
    <div className="table-container">
      <table className="issues-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Name</th>
            <th>Key</th>
            <th>Description</th>
            <th>Category</th>
            <th>Lead</th>
            <th>Members</th>
            <th>Time</th>
            <th className="settings-icon">⚙</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 ? (
            <tr className="no-results">
              <td colSpan="10">
                <div className="no-results-content">
                  <p>No issues were found matching your search</p>
                </div>
              </td>
            </tr>
          ) : (
            issues.map((issue, index) => (
              <tr key={index}>
                <td><input type="checkbox" /></td>
                <td>{issue.name}</td>
                <td>{issue.key}</td>
                <td>{issue.description}</td>
                <td>{issue.category}</td>
                <td>{issue.lead}</td>
                <td>{issue.member}</td>
                <td>{issue.time}</td>
                <td className="settings-icon">⋮</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ListView