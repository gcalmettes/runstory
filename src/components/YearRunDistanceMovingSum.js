import React, { Component } from 'react';

import {scaleLinear as d3scaleLinear} from 'd3-scale'
import {line as d3line,
        arc as d3arc,
        curveCatmullRom as d3curveCatmullRom} from 'd3-shape'
import {sum as d3sum} from 'd3-array'

// import moment from 'moment';
import Moment from 'moment';
import { extendMoment } from 'moment-range';

//extending moment.js with moment-range.js
const moment = extendMoment(Moment);


class YearRunDistanceMovingSum extends Component {
  constructor(props){
    super(props)

    this.getTimeRange = this.getTimeRange.bind(this);
    this.getTimeRangeActivities = this.getTimeRangeActivities.bind(this);
    this.getMovingSum = this.getMovingSum.bind(this);
  }

  //calculate moving sum distance array
  getTimeRange(day, n, type="days"){
    let startInterval = day.clone().subtract(n, type)
    return moment.range(startInterval, day)
  }

  getTimeRangeActivities(data, range){
    return data.filter(d => range.contains(d.date))
  }

  getMovingSum(day, data, n=6, type="days", variable="distanceKm"){
    let timeRange = this.getTimeRange(day, n, type)
    let timeRangeActivities = this.getTimeRangeActivities(data, timeRange)
    return d3sum(timeRangeActivities, d => d[variable])
  }

  componentWillMount(){

    //calculate moving sum for distance and elevation
    this.movingSumArray = Array.from(this.props.yearTimeRange.by("day")).map(d => {
      return {date: d,
              distanceKm: this.getMovingSum(d, this.props.data, undefined, undefined,"distanceKm"),
              elevationUpM: this.getMovingSum(d, this.props.data, undefined, undefined, "elevationUpM")
              }
      })

    //detect zones of weekly distance
    let zonesIndices = {low: [],
                        sweet: [],
                        danger: []
                        }

    //add distance in Mi/feet and populate zoneIndices array
    this.movingSumArray.forEach((d,i) => {
      d.distanceMi = d.distanceKm * this.props.kmToMiles
      d.elevationUpFt = d.elevationUpM * this.props.mToFt
      d.elevationDownFt = d.elevationDownM * this.props.mToFt

      if (d.distanceMi >= this.props.dangerDist) zonesIndices.danger.push(i)
      if (d.distanceMi < this.props.dangerDist && d.distanceMi >= this.props.sweetDist) zonesIndices.sweet.push(i)
      else zonesIndices.low.push(i)
    })

    const radiusScale = d3scaleLinear()
        .domain([0, 180])
        .range([140, this.props.height/2])
    
    //radial projection, with start position at Pi/2
    const xScale = (day, distance) => Math.cos(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)
    const yScale = (day, distance) => Math.sin(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)

    this.lineGenerator = d3line()
      .x(d => xScale(d.date, d.distanceMi))
      .y(d => yScale(d.date, d.distanceMi))
      .curve(d3curveCatmullRom)

    //send the movingSumArray to parent so svg defs can be created
    this.props.addSvgMaskDefs(this.movingSumArray)

    //gather consecutive indices
    for (let i=0; i<Object.keys(zonesIndices).length; i++) {
      let array = zonesIndices[Object.keys(zonesIndices)[i]]
      let result = [], temp = [], difference;
      for (let i = 0; i < array.length; i += 1) {
        if (difference !== (array[i] - i)) {
          if (difference !== undefined) {
            result.push(temp);
            temp = [];
          }
          difference = array[i] - i;
        }
        temp.push(array[i]);
      }
      if (temp.length) {
        result.push(temp);
      }
      zonesIndices[Object.keys(zonesIndices)[i]] = result
    }

    this.arcZones = Object.keys(zonesIndices).map(zoneName => 
        zonesIndices[zoneName].map((indicesArray,i) => {
          let limits = [indicesArray[0], indicesArray[indicesArray.length-1]]
          if (limits[0]!==0) limits[0]=limits[0]-1
          let arcZone = d3arc()
            .innerRadius(radiusScale(0))
            .outerRadius(radiusScale(radiusScale.domain()[1]))
            .startAngle(this.props.angleScale(this.movingSumArray[limits[0]].date))
            .endAngle(this.props.angleScale(this.movingSumArray[limits[1]].date));

          return (
            <path
              className = {`${zoneName}ZoneArc`}
              d = {arcZone()}
              key = {`${zoneName}Arc${i}`}
              mask = {`url(#maskMovingSum${this.props.year})`}
            />
            )
        })
      );

  }


  render() {
    return (
      <g transform={`translate(${this.props.translate})`}>
        {this.arcZones}
        <path 
          d = {this.lineGenerator(this.movingSumArray)}
          className="movingSumDistance"
        />
      </g>
    );
  }

}

export default YearRunDistanceMovingSum;