import React, { Component } from 'react';

import {scaleLinear as d3scaleLinear} from 'd3-scale'
import {line as d3line,
        curveCatmullRom as d3curveCatmullRom} from 'd3-shape'


class YearRunDistanceMovingSumMask extends Component {


  render() {

    const radiusScale = d3scaleLinear()
        .domain([0, 180])
        .range([140, this.props.height/2])
    
    //radial projection, with start position at Pi/2
    const xScale = (day, distance) => Math.cos(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)
    const yScale = (day, distance) => Math.sin(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)

    const lineGenerator = d3line()
      .x(d => xScale(d.date, d.distanceMi))
      .y(d => yScale(d.date, d.distanceMi))
      .curve(d3curveCatmullRom)

    return (
      <defs>
        <mask id={`maskMovingSum${this.props.year}`}>
        <path 
          d = {lineGenerator(this.props.maskArray)}
          fill="#fff"
        />
        </mask>
      </defs>
    );
  }

}

export default YearRunDistanceMovingSumMask;