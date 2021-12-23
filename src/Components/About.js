import React, { Component } from 'react';

class About extends Component {
  render() {

    if(this.props.data){
      var name = this.props.data.name;
      var profilepic= "images/"+this.props.data.image;
      var bio = this.props.data.bio;
      var bio2 = this.props.data.bio2;
      var bio3 = this.props.data.bio3;
      var street = this.props.data.address.street;
      var city = this.props.data.address.city;
      var state = this.props.data.address.state;
      var zip = this.props.data.address.zip;
      var phone= this.props.data.phone;
      var email = this.props.data.email;
      var pdfresumeDownload = this.props.data.pdfresumedownload;
      var docresumeDownload = this.props.data.docresumedownload;
    }

    return (
      <section id="about">
      <div className="row">
         <div className="three columns">
            <img className="profile-pic"  src={profilepic} alt="Taylor Dragoo Profile Pic" />
         </div>
         <div className="nine columns main-col">
            <p>{bio}</p>
            <div className="row">
               <div className="columns contact-details">
                  <h2>Contact Details</h2>
                  <p className="address">
                      <span>{name}</span><br />
                      <span>{phone}</span><br />
                      <span>{email}</span>
                  </p>
               </div>
               <div className="columns download">
                  <p>
                     <a href={pdfresumeDownload} className="button" target="_blank" rel="noreferrer"><i className="fa fa-download"></i>Resume .PDF</a>
                  </p>
               </div>
            </div>
         </div>
      </div>

   </section>
    );
  }
}

export default About;
