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
      const countersToUpdate = document.querySelectorAll(`[data-counter-id]`);
      const counterHitIdSet = new Set();

      countersToUpdate.forEach((counter) => {
            counterHitIdSet.add(counter.dataset.counterId);
      })

      counterHitIdSet.forEach((id) => {
            hitCounter(id);
      });
    }

    async function hitCounter(id) {
    const counter = await API.graphql(graphqlOperation(mutations.hit, { input: { id } }));
        updateText(counter.data.hit)
    }

    function updateText(counter) {
      const countersToUpdate = document.querySelectorAll(`[data-counter-id=${counter.id}]`);
      countersToUpdate.forEach(function (elem) {
          elem.innerHTML = counter.hits;
      })
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
