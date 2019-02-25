import React from 'react';
import * as topojson from 'topojson';
import * as d3 from 'd3';
import worldmapjson from'./static/worldmapjson';
import * as _ from 'lodash';
import * as $ from 'jquery';

class MapChart extends React.Component {
    constructor(props) {
				super(props);
				this.state = {
						world: worldmapjson,
						selectedCountry: this.props.selectedCountry,
						center: this.props.center,
						prevMapFocus: [270,100],
				}
				this.props.showTooltip(false);
		}
	
		shouldComponentUpdate(nextProps) {
				return !_.isEqual(this.props, nextProps);
		}

    render() {
        if (!this.state.world) {
            return <p>Loading animation goes here</p>;
        }

				if (!this.props.tooltipFlag) {
						d3.selectAll(".arcs").remove();
						d3.selectAll(".feature").remove();
				
						const colors = ['#009cec', '#ff9600', '#00cf92', '#de0063', '#009cde'];
						const svg = d3.select(this.refs.anchor),
								{ width, height } = this.props;

						let offset = this.props.center;
						const projection = d3.geoMercator()
								.scale(window.innerWidth < 768 ? 70 : 200)
								.translate([0,(height * 4/9)]);
								
						offset = projection(offset);
						projection.translate([0,(height/2)]);
						
						const scaleFactor = 1;
						let zoomX = width*2.5/7-offset[0];
						if (offset[0] < -100) {
								zoomX = width*1/7-offset[0];
						} else if (offset[0] > 150) {
								zoomX = width*4/7-offset[0];
						}
						let zoomY = (height/2)-offset[1]-100;
						if (offset[1] > 200) {
								zoomY = (height/2)-offset[1]+100;
						} else if (offset[1] > 150 && offset[1] < 200) {
								zoomY = (height/2)-offset[1];
						}

						svg.transition()
								.ease(d3.easeCubic) 
								.duration(1500)
								.attr("transform", "scale(" + scaleFactor + ")" + "translate(" + zoomX + "," + zoomY + ")");
				
						let countryCentroid = this.props.center;
						const path = d3.geoPath(projection);
						const world = this.state.world;
						const links = this.props.trade_links;
						const that = this;

						if (links.length > 0) {
								$('.unavailableText').hide();
						} else {
								$('.unavailableText').show();
						}
				
						svg.selectAll(".feature")
								.data(topojson.feature(world, world.objects.countries).features)
								.enter().append("path")
								.attr("d", path)
								.attr("class", "feature")
								.style("fill", "#90d4f7");

						const zoom = d3.zoom().on("zoom", zoomFunction);
						function zoomFunction() {
							if (d3.event.transform.k >= 0.5 && d3.event.transform.k <= 2) {
								svg.attr("transform", "scale(" + d3.event.transform.k + ")" + "translate(" + (zoomX * d3.event.transform.k + d3.event.transform.x) + "," + (zoomY * d3.event.transform.k + d3.event.transform.y) + ")");
							}							
						};
						svg.selectAll("rect").remove();
						svg.append("rect")
							.attr("class", "zoom")
							.attr("width", width * 2)
							.attr("height", height * 2)
							.attr('transform', 'translate('+(-zoomX-width/2)+', '+(-zoomY-height/2)+')')
							.call(zoom);
				
						let maxVal = 0;
						links.forEach(l => {
								maxVal = parseFloat(l.value) > maxVal ? l.value : maxVal;
						});
						let isShow = false;
						svg.selectAll(".arcs")
								.data(links)
								.enter().append("path")
								.attr('class','arcs')
								.attr("d", function(c) {
										var d = {
												source: projection(countryCentroid),
												target: projection(c.coordinates),
										};
										if (d.target[1]) {
												var dx = d.target[0] - d.source[0],
														dy = d.target[1] - d.source[1],
														dr = Math.sqrt(dx * dx + dy * dy);
												return "M" + d.source[0] + "," + d.source[1] + "A" + dr + "," + dr +
														" 0 0,1 " + d.target[0] + "," + d.target[1];
										}
								})
								.style("stroke", colors[this.props.year - 2013])
								.style("opacity", function(d) {
										return maxVal * 0.5 / d.value;
								})
								.style("stroke-width", function(d) { 
										return 30 * d.value / maxVal > 1 ? 30 * d.value / maxVal : 1; 
								})
								.style("fill", "none")
								.style('cursor', 'pointer')
								.on('mouseover', function(d) {
										that.props.showMapTooltip(d3.event.offsetX + 'px', d3.event.offsetY + 'px', d.country);
								})
								.on('mouseout', function(d) {
										that.props.hideMapTooltip();
								})
								.transition()
								.duration(2000)
								.attrTween("stroke-dasharray", function() {
										var len = this.getTotalLength();
										return function(t) {
												return (d3.interpolateString("0," + len, len + ",0"))(t)
										};
								})
								.on('end', function(d,i) {
										if (!isShow && i === links.length - 1 && !that.props.tooltipFlag) {
												isShow = true;
												that.props.showTooltip(true);
										}
								});
				}
        return <g ref="anchor" />;
    }
}

export default MapChart;
