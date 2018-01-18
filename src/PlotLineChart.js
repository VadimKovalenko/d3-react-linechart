import React, { Component } from 'react'
import './App.css'
import * as d3 from 'd3';
import {event as currentEvent} from 'd3';
import { scaleLinear } from 'd3-scale'
import { max } from 'd3-array'
import { select, selectAll } from 'd3-selection'
import { timeParse }  from 'd3-time-format'
import { scaleTime }  from 'd3-scale'
import line from 'd3-shape/src/area'
import extent from 'd3-array/src/extent'
import { axisBottom, axisLeft } from 'd3-axis'
import { tsv } from 'd3'
import zoom from 'd3-zoom/src/zoom'
import transform from 'd3-zoom/src/transform'


// example - https://bl.ocks.org/deristnochda/1ffe16ccf8bed2035ea5091ab9bb53fb

var chartData = require('./data.tsv');

class LineChart extends Component {
   constructor(props){
      super(props)
      this.createLineChart = this.createLineChart.bind(this)
   }
   componentDidMount() {
      this.createLineChart()
   }
   componentDidUpdate() {
      this.createLineChart()
   }
   createLineChart() {
      const node = this.node
      const margin = {top: 20, right: 20, bottom: 30, left: 50}
      const width = node.width.baseVal.value - margin.left - margin.right
      const height = node.height.baseVal.value - margin.top - margin.bottom
      const xAxis = axisBottom(x);
      const yAxis = axisLeft(y);
      const parseTime = timeParse("%d-%b-%y");

      const x = scaleTime()
      .rangeRound([0, width]);
      const y = scaleLinear()
      .rangeRound([height, 0]);

      //Prepare function to parse data
      const chartLine = line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.close); });


   tsv(chartData, function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
      return d;
      }, function(error, data) {
      if (error) throw error;

      x.domain(extent(data, function(d) { return d.date; }));
      y.domain(extent(data, function(d) { return d.close; }));   

      const gX = select(node).append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")").append("g")
         .attr("transform", "translate(0," + height + ")")
         .call(axisBottom(x));

      const gY = select(node).append("g")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")").append("g")
         .attr("class", "axis axis--y")
         .attr("y", 6)
         .attr("dy", "0.71em")
         .attr("text-anchor", "end")
         .text("Price ($)")
         .call(axisLeft(y));

      //Zooming functionality
      const zoomChart = zoom()
      .scaleExtent([1, 40])
      .extent([[100, 100], [width-100, height-100]])
      .on("zoom", zoomed);

      function zoomed() {
         selectAll(".charts")
         .attr("transform", d3.event.transform);
         d3.selectAll('.line').style("stroke-width", 2/d3.event.transform.k);
         gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
         gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
      }
      /*/////////////*/
      const svg = select(node) 
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom)
         .call(zoomChart)
         .append("g")
           .attr("transform", "translate(" + margin.left + "," + margin.top + ")");      


      // Line chart   
      svg.append("g")
         .attr("class", "charts")
         .append("path")
         .datum(data)
         .attr("class", "line")
         .attr("fill", "none")
         .attr("stroke-linejoin", "round")
         .attr("stroke-linecap", "round")
         .attr("stroke", "steelblue")
         .attr("stroke-width", 1.5)
         .attr("d", function(d) { return chartLine(d); });
   })
}

render() {
      return <svg ref={node => this.node = node}
      width={800} height={500}>
      </svg>
   }
}
export default LineChart