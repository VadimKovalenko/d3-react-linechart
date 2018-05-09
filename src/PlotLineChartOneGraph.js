import React, { Component } from 'react'
import './App.css'
import * as d3 from 'd3';
// example - http://blockbuilder.org/EfratVil/92f894ac0ba265192411e73f633a3e2f
let chartData = require('./export-TxGrowth.csv');

class PlotLineChartFixed extends Component {
    constructor(props){
        super(props);
        this.createLineChart = this.createLineChart.bind(this)
    }

    componentDidMount() {
        this.createLineChart(this.props.currency)
    }

    componentWillReceiveProps(nextProps) {
        // we have to handle the DOM ourselves now
        if (nextProps.currency !== this.props.currency) {
            this.createLineChart(nextProps.currency)
        }
    }

    createLineChart(currency) {

        console.log("@@", this.props.currency)

        const node = this.node;
        let svg = d3.select(node),
            margin = {top: 20, right: 20, bottom: 110, left: 60},
            margin2 = {top: 430, right: 20, bottom: 30, left: 60},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            height2 = +svg.attr("height") - margin2.top - margin2.bottom;

        let parseDate = d3.timeParse("%m/%d/%Y %H:%M");

        let x = d3.scaleTime().range([0, width]),
            x2 = d3.scaleTime().range([0, width]),
            y = d3.scaleLinear().range([height, 0]),
            y2 = d3.scaleLinear().range([height2, 0]);

        let xAxis = d3.axisBottom(x),
            xAxis2 = d3.axisBottom(x2),
            yAxis = d3.axisLeft(y);

        let brush = d3.brushX()
            .extent([[0, 0], [width, height2]])
            .on("brush end", brushed);

        let zoom = d3.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [width, height]])
            .extent([[0, 0], [width, height]])
            .on("zoom", zoomed);

        let line = d3.line()
            .x(function (d) { return x(d.Date); })
            .y(function (d) { return y(d[currency]); });

        let line2 = d3.line()
            .x(function (d) { return x2(d.Date); })
            .y(function (d) { return y2(d[currency]); });

        let clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);


        let Line_chart = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("clip-path", "url(#clip)");


        let focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");


        d3.csv(chartData, type, function (error, data) {
            if (error) throw error;

            x.domain(d3.extent(data, function(d) { return d.Date; }));
            y.domain([0, d3.max(data, function (d) { return d[currency]; })]);
            x2.domain(x.domain());
            y2.domain(y.domain());


            focus.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

            focus.append("g")
                .attr("class", "axis axis--y")
                .call(yAxis);

            Line_chart.append("path")
                .datum(data)
                .attr("class", "line")
                .style("fill", "none")
                .style("stroke", "steelblue")
                .style("stroke-width", "1.5px")
                .attr("d", line);

            context.append("path")
                .datum(data)
                .attr("class", "line")
                .style("fill", "none")
                .style("stroke", "steelblue")
                .style("stroke-width", "1.5px")
                .attr("d", line2);


            context.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height2 + ")")
                .call(xAxis2);

            context.append("g")
                .attr("class", "brush")
                .call(brush)
                .call(brush.move, x.range());

            svg.append("rect")
                .attr("class", "zoom")
                .style("fill", "none")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(zoom)
        });

        function brushed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            let s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));
            Line_chart.select(".line").attr("d", line);
            focus.select(".axis--x").call(xAxis);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                .scale(width / (s[1] - s[0]))
                .translate(-s[0], 0));
        }

        function zoomed() {
            if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            let t = d3.event.transform;
            x.domain(t.rescaleX(x2).domain());
            Line_chart.select(".line").attr("d", line);
            focus.select(".axis--x").call(xAxis);
            context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
        }

        function type(d) {
            d.Date = new Date(d.Date);
            d[currency] = +d[currency];
            return d;
        }
    }

    render() {
        return <svg ref={node => this.node = node}
                    width={960} height={500}>
        </svg>
    }
}
export default PlotLineChartFixed