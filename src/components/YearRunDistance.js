import React, { Component } from 'react';

import {scaleLinear as d3scaleLinear} from 'd3-scale'

class YearRunDistance extends Component {


  render() {

    const data = this.props.data

    const radiusScale = d3scaleLinear()
        .domain([0, 180])
        .range([this.props.height/3.8, this.props.height/2.1])
    
    //radial projection, with start position at Pi/2
    const xScale = (day, distance) => Math.cos(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)
    const yScale = (day, distance) => Math.sin(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)

    const distanceLines = data.map((d,i) => {
      return (
        <line 
          x1={xScale(d.date, 0)}
          x2={xScale(d.date, d.distanceMi)}
          y1={yScale(d.date, 0)}
          y2={yScale(d.date, d.distanceMi)}
          className="activityDistance"
          key={`lineDistance${this.props.year}-${i}`}
        />
        )
    })

    return (
      <g transform={`translate(${this.props.translate})`}>
        {distanceLines}
      </g>
    );
  }

}

export default YearRunDistance;