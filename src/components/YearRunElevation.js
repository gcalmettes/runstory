import React, { Component } from 'react';

import {scaleLinear as d3scaleLinear} from 'd3-scale'

class YearRunElevation extends Component {


  render() {

    const data = this.props.data

    const radiusScale = d3scaleLinear()
        .domain([0, 40000])
        .range([this.props.height/3.6, this.props.height/7])
    
    //radial projection, with start position at Pi/2
    const xScale = (day, distance) => Math.cos(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)
    const yScale = (day, distance) => Math.sin(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)

    const elevationLines = data.map((d,i) => {
      return (
        <line 
          x1={xScale(d.date, 0)}
          x2={xScale(d.date, d.elevationUpFt)}
          y1={yScale(d.date, 0)}
          y2={yScale(d.date, d.elevationUpFt)}
          className="activityElevation"
          key={`lineElevation${this.props.year}-${i}`}
        />
        )
    })

    return (
      <g transform={`translate(${this.props.translate})`}>
        {elevationLines}
      </g>
    );
  }

}

export default YearRunElevation;