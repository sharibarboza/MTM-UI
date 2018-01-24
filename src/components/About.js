import React from 'react';

/**
 * About component shows information about the contact information
 */
export default class About extends React.Component {
  
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <h2>About</h2>
          </div>
          <div className="col-lg-12">
            <p>
              <h4>Michelle</h4>
              <ul>
                <li>Computing Science at University of Alberta</li>
                <li>Graduating: Spring 2018</li>
                <li>BADASS</li>
                <li>Hometown: Grande Prairie</li>
              </ul>

              <h4>Shari</h4>
              <ul>
                <li>Computing Science at University of Alberta</li>
                <li>Graduating: Spring 2018</li>
                <li>SO TRAGIC</li>
                <li>Hometown: Edmonton</li>
              </ul>

            </p>
          </div>
        </div> 
      </div>
    );
  }
  
}