import React from 'react';
import * as d3 from 'd3';

class DonutChart extends React.Component {
    render() {
        d3.selectAll('.' + this.props.className + ' *').remove();
        let data = [
            {name: 'cats', count: this.props.percent, state: true, color: this.props.color},
            {name: 'dogs', count: 100, state: false, color: '#e7e7e7'},
        ];
        let data1 = [
            {name: 'cats', count: this.props.percent, state: true, color: this.props.color},
            {name: 'dogs', count: 100, state: true, color: 'transparent'}
        ];
          
        let width = window.innerWidth > 767 ? 400 : 200,
            height = window.innerWidth > 767 ? 300 : 200,
            radius = height / 2;
      
        let arc = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius - 40);
        let arcLarge = d3.arc()
            .outerRadius(radius - 5)
            .innerRadius(radius - 45);

        let pie = d3.pie()
            .sort(null)
            .value(function(d) {
                return d.count;
            });

        let svg = d3.selectAll('.' + this.props.className)
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      
        svg.append('image')
            .attr('xlink:href', this.props.image)
            .attr('x', -(width - (window.innerWidth < 768 ? 60 : 160)) / 2)
            .attr('y', -(height - 60) / 2)
            .attr('width', width - (window.innerWidth < 768 ? 60 : 160))
            .attr('height', height - 60)
            .style('border-radius', '50%');

        svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .append("path")
            .attr("d", arc)
            .style("fill", function(d,i) {
                return d.data.color;
            });

        svg.selectAll(".arc")
            .data(pie(data1))
            .enter().append("g")
            .append("path")
            .attr("d", arcLarge)
            .style("fill", function(d,i) {
                return d.data.color;
            });
            
        return <svg className={this.props.className}></svg>;
    }
}

export default DonutChart;