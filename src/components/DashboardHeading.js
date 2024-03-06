import React from 'react'

function DashboardHeading(props) {
  return (
    <div className="alert alert-dark" role="alert">
        {props.text}
  </div>
  )
}

export default DashboardHeading