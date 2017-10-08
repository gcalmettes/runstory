import React, { Component } from 'react';

import {scaleTime as d3scaleTime} from 'd3-scale'

// import moment from 'moment';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import YearRunDistance from './YearRunDistance.js';
import YearRunDistanceMovingSum from './YearRunDistanceMovingSum.js';
import YearRunDistanceMovingSumMask from './YearRunDistanceMovingSumMask.js';

//extending moment.js with moment-range.js
const moment = extendMoment(Moment);


const margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;


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
      maskArray: []
    };

    this.addSvgMaskDefs = this.addSvgMaskDefs.bind(this)
  }

  componentWillMount(){

    const data = this.props.allRuns.filter(d => d.date.year() === this.props.year)
    data.forEach(d => {
      d.distanceMi = d.distanceKm * this.state.kmToMiles
      d.elevationUpFt = d.elevationUpM * this.state.mToFt
      d.elevationDownFt = d.elevationDownM * this.state.mToFt
    })
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
    })

  }

  addSvgMaskDefs(array){
    this.setState({
      maskArray: array
    })
  }


  render() {

    return (
      <svg width={width} height={height}> 
        <YearRunDistanceMovingSumMask maskArray={this.state.maskArray} {...this.state}/>
        <YearRunDistanceMovingSum translate={[width/2, height/2]} addSvgMaskDefs={this.addSvgMaskDefs} {...this.state}/>
        <YearRunDistance translate={[width/2, height/2]} {...this.state}/>
      </svg>
    );
  }

}

export default YearRunSummary;