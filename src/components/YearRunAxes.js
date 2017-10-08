import React, { Component } from 'react';

import {scaleLinear as d3scaleLinear} from 'd3-scale'

class YearRunAxes extends Component {


  render() {

    const radiusScale = d3scaleLinear()
        .domain([0, 180])
        .range([this.props.height/2, this.props.height/3.6])
    
    //radial projection, with start position at Pi/2
    const xScale = (day, distance) => Math.cos(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)
    const yScale = (day, distance) => Math.sin(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)

    // const elevationLines = data.map((d,i) => {
    //   return (
    //     <line 
    //       x1={xScale(d.date, 0)}
    //       x2={xScale(d.date, d.elevationUpFt)}
    //       y1={yScale(d.date, 0)}
    //       y2={yScale(d.date, d.elevationUpFt)}
    //       className="activityElevation"
    //       key={`lineElevation${this.props.year}-${i}`}
    //     />
    //     )
    // })

    return (
      <g transform={`translate(${this.props.translate})`}>
        <text x={0} y={0} style={{textAnchor: "middle", fontSize: "2em"}} className="axisLabel">{this.props.year}</text>
        <text x={0} y={20} style={{textAnchor: "middle", fontSize: "0.8em"}} className="axisLabel">{`${this.props.summaryTotalDistanceMi} miles`}</text>
        <text x={0} y={35} style={{textAnchor: "middle", fontSize: "0.8em"}} className="axisLabel">{`${this.props.summaryTotalElevationFt} feet`}</text>
      </g>
    );
  }

}

export default YearRunAxes;