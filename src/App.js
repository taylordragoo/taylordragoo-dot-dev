import React, { Component } from 'react';
import ReactGA from 'react-ga';
import $ from 'jquery';
import './App.css';
import Header from './Components/Header';
import Footer from './Components/Footer';
import About from './Components/About';
import Resume from './Components/Resume';
import Portfolio from './Components/Portfolio';
import Amplify, { API, graphqlOperation } from 'aws-amplify';
import awsmobile from './aws-exports.js';
import * as mutations from "./graphql/mutations";
import * as subscriptions from "./graphql/subscriptions";

Amplify.configure(awsmobile);

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      foo: 'bar',
      resumeData: {}
    };

    ReactGA.initialize('UA-110570651-1');
    ReactGA.pageview(window.location.pathname);

  }

  getResumeData(){
    $.ajax({
      url:'/resumeData.json',
      dataType:'json',
      cache: false,
      success: function(data){
        this.setState({resumeData: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
        alert(err);
      }
    });
  }

  componentDidMount(){
    this.getResumeData();
  }

  render() {
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
      <div className="App">
        <Header data={this.state.resumeData.main}/>
        <About data={this.state.resumeData.main}/>
        <Resume data={this.state.resumeData.resume}/>
        <Portfolio data={this.state.resumeData.portfolio}/>
        <Footer data={this.state.resumeData.main}/>
      </div>
    );
  }
}

export default App;
