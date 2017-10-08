import React, { Component } from 'react';

import {scaleLinear as d3scaleLinear} from 'd3-scale'

class YearRunAxes extends Component {

  componentWillMount(){
    const radiusScale = d3scaleLinear()
        .domain([0, 180])
        .range([this.props.height/3.8, this.props.height/2.1])
    
    //radial projection, with start position at Pi/2
    const xScale = (day, distance) => Math.cos(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)
    const yScale = (day, distance) => Math.sin(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)
   
    const monthArray = Array.from(this.props.yearTimeRange.by("month"))
    const shift = -20

    this.monthLabels = monthArray.map(month => {
      let shiftedMonth = month.clone().add(15, "days")
      return (
        <text 
          x={xScale(shiftedMonth, radiusScale.domain()[1]+shift)} 
          y={yScale(shiftedMonth, radiusScale.domain()[1]+shift)} 
          style={{textAnchor: "middle", fontSize: "1em"}} 
          className="monthLabel" 
          key={`${month.format("MMM")}Label`}>
          {month.format("MMM")}
        </text>
        )
    })

    this.monthLines = monthArray.map(month => {
      return (
        <line 
          x1={xScale(month, -100)}
          x2={xScale(month, radiusScale.domain()[1]+shift)}
          y1={yScale(month, -100)}
          y2={yScale(month, radiusScale.domain()[1]+shift)}
          className="monthLine"
          key={`${month.format("MMM")}line`}
        />
        )
    })

  }

  render() {

    

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
        {this.monthLabels}
        {this.monthLines}
      </g>
    );
  }

}

export default YearRunAxes;