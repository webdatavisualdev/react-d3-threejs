import React from 'react';
import * as d3 from 'd3';
import * as _ from 'lodash';

class BarChart extends React.Component {

	shouldComponentUpdate(nextProps) {
		return !_.isEqual(this.props, nextProps);
	}

    render() {
    	d3.selectAll(".barAttributes").remove();
    	d3.selectAll(".axis").remove();
    	d3.selectAll(".axis-y").remove();
    	d3.selectAll(".bar-line").remove();

		const { width, height, comps } = this.props;

    	// Define the dimensions
		const dimensions = {
			gWidth: width,
			gHeight: height,
			gMargin: 30,
			gInnerWidth: width-(window.innerWidth > 768 ? 50 : 80),
			gInnerHeight: height-30,
			bMargin: width / 23
		};

		const chart = d3.select(this.refs.anchor);
		
        // Define some sample data
		let data = [];
		if (comps.length > 0 && comps[0].value > comps[comps.length - 1].value) {
			data = comps.reverse();
		} else {
			data = comps;
		}

		// Define the scales
		const xScale = d3.scaleLinear()
			.domain ([0, data.length])
			.range([0, dimensions.gInnerWidth]);

		// Get the max value for the data. This will determine how high our y-scale is
		const maxValue = d3.max(data, function( d ) { return d.value; });
		const minValue = d3.min(data, function( d ) { return d.value; });
		// Now define the yScale, or vertical scale
		const yScale = d3.scaleLinear()
			.domain([0, maxValue])
			.range([0, dimensions.gInnerHeight]);
		// Finally, define the yAxis scale. This is identical to the yScale except that the domain is inverted. This is because the scale is determined from top down, rather than bottom up, and the data would look upside down otherwise.
		const yAxisScale = d3.scaleLinear()
			.domain([maxValue,0])
			.range([0, dimensions.gInnerHeight]);
		
						   
		// Render the y-axis
		const yAxis = d3.axisLeft( yAxisScale )
			// This is to make the horizontal tick lines stretch all the way across the chart
			.tickSizeInner( -dimensions.gInnerWidth )
			// This spaces the tick values slights from the axis
			.tickPadding( 10 )
			.ticks(10);

		chart.append('g')
			.attr('class','axis axis-y')
			.attr( 'transform', 'translate(' + dimensions.gMargin + ', ' + dimensions.gMargin + ')' )
			.call( yAxis );

		chart.append('text')
			.attr('x', 10)
			.attr('y', dimensions.gMargin)
			.text('%');
	
		const that = this;
		const newWidth = (dimensions.gInnerWidth / data.length) - (dimensions.bMargin * 2 );
		chart.append('g')
			.selectAll('.barAttributes')
			.data( data )
			.enter()
			.append('rect')
			.attr( 'class', 'bar-line' )
			.attr('fill', function( d, i ) { return i === data.length - 1 ? '#009cec' : '#ccc' })
			.attr('transform', 'translate(' + dimensions.gMargin + ', ' + dimensions.gMargin + ')')
			.attr('width', newWidth )
			.attr('height', 0)
			.attr('x', function( d, i ) { return (dimensions.gInnerWidth / data.length) * i + dimensions.bMargin; } )
			.attr('y', function( d, i ) { return dimensions.gInnerHeight; })
			.style('cursor', 'pointer')
			.on('mouseover', function(d) {
				that.props.showBarTooltip(d3.event.offsetX, d3.event.offsetY, d.value);
			})
			.on('mouseout', function() {
				that.props.hideBarTooltip();
			})
			.transition()
			.ease(d3.easeCubic)
			.duration(500)
			.delay(function(d,i){ return i*100})//a different delay for each bar
			.attr('y', function( d, i ) {
				return dimensions.gInnerHeight - yScale( Math.max(0, d.value) ); 
			})
			.attr("height", function(d) {
				let value = d.value;
				if (Math.abs(minValue) * 3 > maxValue && d.value < 0) {
					value = d.value / 5;
				}
				return Math.abs(yScale(value) - yScale(0));
			});

		// Define the ticks for the xAxis
		let xTicks = []
		for (var i = 0; i < data.length; i++) {
			xTicks.push( i + 0.5 ); // 0.5 is to ensure the ticks are offset correctly to match the data
		}
		// Render the x-axis
		const xAxis = d3.axisBottom( xScale )
			.tickValues( xTicks )
			.tickFormat(function(d, i) {
				return data[i].label;
			});


		chart.append('g')
			.attr('class', 'axis axis-x')
			.attr( 'transform', 'translate(' + dimensions.gMargin + ', ' + ( dimensions.gMargin + dimensions.gInnerHeight ) + ')' )
			.call( xAxis )
			.selectAll(".tick text")
			.call(wrap, dimensions.gInnerWidth/8);

		function wrap(text, width) {
			text.each(function() {
				var text = d3.select(this),
					words = text.text().split(/\s+/).reverse(),
					word,
					line = [],
					lineNumber = 0,
					lineHeight = 1.1,
					y = text.attr("y"),
					dy = parseFloat(text.attr("dy")),
					tspan = text.text(null).append("tspan").attr("xScale", 0).attr("xScale", y).attr("dy", dy + "em");
				while (word = words.pop()) {
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					}
				}
			});
		}

        return <g ref="anchor" />;
    }
}

export default BarChart;
