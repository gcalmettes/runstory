import React, { Component } from 'react';


const margin = {top: 50, right: 50, bottom: 50, left: 50},
      width = 600 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;


class YearRunSummary extends Component {
  constructor(props){
    super(props)
    // this.state = {};
  }

  componentWillMount(){
  	const data = this.props.allRuns.filter(d => d.date.year() == this.props.year)
  	const races = this.props.allRaces.filter(d => d.date.year() == this.props.year)
  	
  	console.log(races)


  }

  render() {
    return (
      <svg ref='container' width={width} height={height} />
    );
  }

}

export default YearRunSummary;