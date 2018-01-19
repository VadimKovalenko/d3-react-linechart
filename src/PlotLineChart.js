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
import { csv } from 'd3'
import zoom from 'd3-zoom/src/zoom'
import transform from 'd3-zoom/src/transform'


// example - http://bl.ocks.org/natemiller/7dec148bb6aab897e561

var chartData = require('./climate4.csv');

class PlotLineChart extends Component {
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
      const margin = {top: 10, right: 10, bottom: 100, left: 40}
      const margin2 = {top: 430, right: 10, bottom: 20, left: 40}
      const width = 960 - margin.left - margin.right
      const height = 500 - margin.top - margin.bottom
      const height2 = 500 - margin2.top - margin2.bottom

      const color = d3.scaleOrdinal(d3.schemeCategory10);

      const parseTime = timeParse("%Y%m");

      const x = scaleTime().range([0, width]),
            x2 = scaleTime().range([0, width]),
            y = scaleLinear().range([height, 0]),
            y2 = scaleLinear().range([height2, 0]);

      const xAxis = axisBottom(x);
      const xAxis2 = axisBottom(x2);
      const yAxis = axisLeft(y);

      let chartLine = line()
                  .defined(function(d) { return !isNaN(d.temperature); })
                  .curve(d3.curveBasis)
                  .x(function(d) { return x(d.date); })
                  .y(function(d) { return y(d.temperature); });

      let chartLine2 = line()
                  .defined(function(d) { return !isNaN(d.temperature); })
                  .curve(d3.curveBasis)
                  .x(function(d) { return x2(d.date); })
                  .y(function(d) { return y2(d.temperature); });

      const svg = select(node) 
         .attr("width", width + margin.left + margin.right)
         .attr("height", height + margin.top + margin.bottom); 


   csv(chartData, function(error, data) {

      if (error) throw error;

      let brush = d3.brushX()
      .on("end", brushed)

      // Line chart   
      svg.append("defs").append("clipPath")
         .attr("id", "clip")
         .append("rect")
            .attr("width", width)
            .attr("height", height);

      const focus = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
      const context = svg.append("g")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

      color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
       
      data.forEach(function(d) {
         d.date = parseTime(d.date);
      });

      let sources = color.domain().map(function(name) {
         return {
            name: name,
            values: data.map(function(d) {
               return {date: d.date, temperature: +d[name]};
            })
         };
      });

      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([d3.min(sources, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
              d3.max(sources, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); }) ]);
      x2.domain(x.domain());
      y2.domain(y.domain());

      let focuslineGroups = focus.selectAll("g")
                                 .data(sources)
                                 .enter().append("g");

      let focuslines = focuslineGroups.append("path")
                                       .attr("class","line")
                                       .attr("d", function(d) { return chartLine(d.values); })
                                       .style("stroke", function(d) {return color(d.name);})
                                       .attr("clip-path", "url(#clip)");

      focus.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

      focus.append("g")
            .attr("class", "y axis")
         .selectAll("rect")
            .attr("height", 60)
            .call(yAxis);

      let contextlineGroups = context.selectAll("g")
                                       .data(sources)
                                       .enter().append("g");

      let contextLines = contextlineGroups.append("path")
                                          .attr("class", "line")
                                          .attr("d", function(d) { return chartLine2(d.values); })
                                          .style("stroke", function(d) {return color(d.name);})
                                          .attr("clip-path", "url(#clip)");

      context.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height2 + ")")
               .call(xAxis2);

      context.append("g")
               .attr("class", "x brush") 
               .call(brush)   

      function brushed() {
         /*If brush is removed, show all data. Else - show only in selected domain */
         x.domain(/*select("brush").call(brush.move, null) ? x2.domain() : */d3.event.selection);
         focus.selectAll("path.line").attr("d",  function(d) {return chartLine(d.values)});
         focus.select(".x.axis").call(xAxis);
         focus.select(".y.axis").call(yAxis);
         //console.log(select(".brush").call(brush.move, null))
         //console.log(x2.domain())
      }

   })
}

render() {
      return <svg ref={node => this.node = node}
      width={800} height={500}>
      </svg>
   }
}
export default PlotLineChart