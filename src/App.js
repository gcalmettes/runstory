import React, { Component } from 'react';
import './App.css';

import { range as d3range} from 'd3-array';

import Moment from 'moment';
import { extendMoment } from 'moment-range';

import runningData from './data/stravaAll.json';
import racesData from './data/races.json'
import YearRunSummary from './components/YearRunSummary.js';

//extending moment.js with moment-range.js
const moment = extendMoment(Moment);

class App extends Component {
  render() {

    const years = d3range(2012, 2018)
    
    const runs = runningData.allActivities
    runs.forEach(d => {
      d.date = moment(d.date)
      d.id = +d.id
      d.xDay = d.date.format("MM-DD")
    })
    runs.sort((a, b) => a.date-b.date)
    
    racesData.forEach(d => {
      d.date = moment(d.date)
    })

    const runningYears = years.map(year => {
      return (
          <YearRunSummary allRuns={runs} allRaces={racesData} year={year} key={`graphYear${year}`}/>
        )
    });

     // console.log(runs)

    return (

      <div className="App">
        <div className="App-header">
          <h2>runStory</h2>
        </div>
        {runningYears}
      </div>
    );
  }
}

export default App;
