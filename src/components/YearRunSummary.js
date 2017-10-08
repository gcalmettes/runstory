import React, { Component } from 'react';

import {scaleTime as d3scaleTime} from 'd3-scale'
import {sum as d3sum} from 'd3-array'

// import moment from 'moment';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import YearRunDistance from './YearRunDistance.js';
import YearRunElevation from './YearRunElevation.js';
import YearRunDistanceMovingSum from './YearRunDistanceMovingSum.js';
import YearRunDistanceMovingSumMask from './YearRunDistanceMovingSumMask.js';
import YearRunAxes from './YearRunAxes.js';

//extending moment.js with moment-range.js
const moment = extendMoment(Moment);


const margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;


class YearRunSummary extends Component {
  constructor(props){
    super(props)

    this.state = {
      width: width,
      height: height,
      year: this.props.year,
      data: [],
      races: [],
      yearTimeRange: [],
      angleScale: [],
      lowDist: 0, //in miles
      sweetDist: 40, //in miles
      dangerDist: 95, //in miles
      kmToMiles: 0.621371,
      mToFt: 3.28084,
      maskArray: [],
      summaryTotalDistanceMi: 0,
      summaryTotalElevationFt: 0
    };

    this.addSvgMaskDefs = this.addSvgMaskDefs.bind(this)
    this.adjustThresholdSweet = this.adjustThresholdSweet.bind(this)
    this.adjustThresholdDanger = this.adjustThresholdDanger.bind(this)
  }

  componentWillMount(){

    const data = this.props.allRuns.filter(d => d.date.year() === this.props.year)
    data.forEach(d => {
      d.distanceMi = d.distanceKm * this.state.kmToMiles
      d.elevationUpFt = d.elevationUpM * this.state.mToFt
      d.elevationDownFt = d.elevationDownM * this.state.mToFt
    })

  const totalDistanceMi = Math.floor(d3sum(data, d => d.distanceMi))
  const totalElevationFt = Math.floor(d3sum(data, d => d.elevationUpFt))

  	const races = this.props.allRaces.filter(d => d.date.year() === this.props.year)

    const yearTimeRange = moment.range(new Date(this.props.year, 0, 1), new Date(this.props.year, 11, 31))

    //scales definitions and radial projection
    const angleScale = d3scaleTime()
      .domain([moment(new Date(this.props.year, 0, 1)), moment(new Date(this.props.year, 11, 31))])
      .range([0, 2*Math.PI])

    this.setState({
      data: data,
      races: races,
      yearTimeRange: yearTimeRange,
      angleScale: angleScale,
      summaryTotalDistanceMi: totalDistanceMi,
      summaryTotalElevationFt: totalElevationFt
    })

  }

  addSvgMaskDefs(array){
    this.setState({
      maskArray: array
    })
  }

  adjustThresholdSweet(event){
    this.setState({sweetDist: event.target.value});
  }

  adjustThresholdDanger(event){
    this.setState({dangerDist: event.target.value});
  }


  render() {

    return (
      <div style={{paddingTop: "30px", paddingLeft: "30px", paddingRight: "30px", display: "inline-block"}}>
        <div>
          <span>
            <svg width={35} height={12}>
              <rect x={0} y={0} width={12} height={12} className="lowZone" />
              <line x1={14} y1={12} x2={16} y2={0} style={{stroke: "black"}}/>
              <rect x={18} y={0} width={12} height={12} className="sweetZone" />
            </svg>
            transition
          </span>
          <input type="range" min={this.state.lowDist} max={this.state.dangerDist} value={this.state.sweetDist} step="1" onChange={this.adjustThresholdSweet} />
          <span>{`${this.state.sweetDist} miles/week`}</span>
        </div>
        <div>
          <span>
            <svg width={35} height={12}>
              <rect x={0} y={0} width={12} height={12} className="sweetZone" />
              <line x1={14} y1={12} x2={16} y2={0} style={{stroke: "black"}}/>
              <rect x={18} y={0} width={12} height={12} className="dangerZone" />
            </svg>
            transition
          </span>
          <input type="range" min={this.state.sweetDist} max="300" value={this.state.dangerDist} step="1" onChange={this.adjustThresholdDanger} />
          <span>{`${this.state.dangerDist} miles/week`}</span>
        </div>
        <svg width={width} height={height}> 
          <YearRunDistanceMovingSumMask maskArray={this.state.maskArray} {...this.state}/>
          <YearRunDistanceMovingSum translate={[width/2, height/2]} addSvgMaskDefs={this.addSvgMaskDefs} {...this.state}/>
          <YearRunDistance translate={[width/2, height/2]} {...this.state}/>
          <YearRunElevation translate={[width/2, height/2]} {...this.state}/>
          <YearRunAxes translate={[width/2, height/2]} {...this.state}/>
        </svg>
      </div>
    );
  }

}

export default YearRunSummary;