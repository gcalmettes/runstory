import React, { Component } from 'react';

import moment from 'moment';

import {scaleLinear as d3scaleLinear} from 'd3-scale'
import {line as d3line,
        curveCatmullRom as d3curveCatmullRom} from 'd3-shape'


class YearRunAxes extends Component {

  componentWillMount(){
    const radiusScale = d3scaleLinear()
        .domain([0, 180])
        .range([this.props.height/3.8, this.props.height/2.15])
    
    //radial projection, with start position at Pi/2
    const xScale = (day, distance) => Math.cos(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)
    const yScale = (day, distance) => Math.sin(this.props.angleScale(day)-Math.PI/2)*radiusScale(distance)
   
    const monthArray = Array.from(this.props.yearTimeRange.by("month"))
    const labelShift = 3

    this.monthLabels = monthArray.map(month => {
      let shiftedMonth = month.clone().add(15, "days")
      return (
        <text 
          x={xScale(shiftedMonth, radiusScale.domain()[1]+labelShift)} 
          y={yScale(shiftedMonth, radiusScale.domain()[1]+labelShift)} 
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
          x2={xScale(month, radiusScale.domain()[1]+labelShift)}
          y1={yScale(month, -100)}
          y2={yScale(month, radiusScale.domain()[1]+labelShift)}
          className="monthLine"
          key={`${month.format("MMM")}line`}
        />
        )
    })


    //scale circles
    const scaleAxis = [30, 60, 90, 120, 150]
    const pathAxis = scaleAxis.map(d => {
      return Array.from(this.props.yearTimeRange.by("days"))
        .map(day => {return {date: day, distanceMi: d} })
    })

    const lineGenerator = d3line()
      .x(d => xScale(d.date, d.distanceMi))
      .y(d => yScale(d.date, d.distanceMi))
      .curve(d3curveCatmullRom)

    this.scaleLines = pathAxis.map(threshold => {
      return (
        <path 
          d={lineGenerator(threshold)}
          className="scaleLine"
          key={`threshold${threshold[0].distanceMi}line`}
        />
        )
    })

    this.scaleLabels = scaleAxis.map(threshold => {
      let xDate = moment(`${this.props.year}-12-31`)
      let xShift = 3,
          yShift = 2
      return (
        <text 
          x = {xScale(xDate, threshold) + xShift}
          y = {yScale(xDate, threshold) + yShift}
          transform = {`rotate(-10, ${xScale(xDate, threshold) + xShift}, ${yScale(xDate, threshold) + yShift})`}
          d={lineGenerator(threshold)}
          className="scaleLabel"
          key={`threshold${threshold}label`}
        >
        {`${threshold}mi`}
        </text>
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
        {this.scaleLines}
        {this.scaleLabels}
      </g>
    );
  }

}

export default YearRunAxes;