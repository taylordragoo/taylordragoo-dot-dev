import React, { Component } from 'react';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsmobile from '../aws-exports.js';
import * as mutations from "../graphql/mutations";
import * as subscriptions from "../graphql/subscriptions";

Amplify.configure(awsmobile);

class Header extends Component {

   render() {

      if(this.props.data){
         var name = this.props.data.name;
         var occupation= this.props.data.occupation;
         var description= this.props.data.description;
         var city= this.props.data.address.city;
         var networks= this.props.data.social.map(function(network){
         return <li key={network.name}><a href={network.url} target="_blank" rel="noreferrer"><i className={network.className}></i></a></li>
         })
      }

      document.addEventListener("DOMContentLoaded", function () {
         init();
      });

      const init = function createUpdateCounters() {
         console.log("this has been called")
         const countersToUpdate = document.querySelectorAll(`[data-counter-id]`);
         const counterHitIdSet = new Set();

         countersToUpdate.forEach((counter) => {
               counterHitIdSet.add(counter.dataset.counterId);
               console.log(counter.dataset.hits)
         })

         counterHitIdSet.forEach((id) => {
               hitCounter(id);
         });
      }

      /*
      Send a mutation to your GraphQL to let it know we hit it.
      This also means we get back the current count, including our own hit.
      */
      async function hitCounter(id) {
      const counter = await API.graphql(graphqlOperation(mutations.hit, { input: { id } }));
         updateText(counter.data.hit)
         subscribeCounter(id)
      }

      function updateText(counter) {
      const countersToUpdate = document.querySelectorAll(`[data-counter-id=${counter.id}]`);
      countersToUpdate.forEach(function (elem) {
         elem.innerHTML = counter.hits;
         console.log(counter.hits)
      })
      }

      /*
      Subscribe via WebSockets to all future updates for the counters
      we have on this page.
      */
      function subscribeCounter(id) {
         const subscription = API.graphql(
                  graphqlOperation(subscriptions.hits, { id })
            ).subscribe({
                  next: (counter) => updateText(counter.value.data.hits)
            }
         );
      }

      return (
         <header id="home">

         <nav id="nav-wrap">

            <a className="mobile-btn" href="#nav-wrap" title="Show navigation">Show navigation</a>
            <a className="mobile-btn" href="#home" title="Hide navigation">Hide navigation</a>

            <ul id="nav" className="nav">
               <li className="current"><a className="smoothscroll" href="#home">Home</a></li>
               <li><a className="smoothscroll" href="#about">About</a></li>
               <li><a className="smoothscroll" href="#resume">Resume</a></li>
               <li><a className="smoothscroll" href="#portfolio">Works</a></li>
            </ul>

         </nav>

         <div className="row banner">
            <div className="banner-text">
               <h1 className="responsive-headline">I'm {name}.</h1>
               <h3>I'm a {city} based <span>{occupation}</span>. {description}.</h3>
               <hr />
               <ul className="social">
                  {networks}
                  <div data-counter-id="test">Loading...</div>
               </ul>
            </div>
         </div>

         <p className="scrolldown">
            <a className="smoothscroll" href="#about"><i className="icon-down-circle"></i></a>
         </p>

      </header>
      );
   }
}

export default Header;
