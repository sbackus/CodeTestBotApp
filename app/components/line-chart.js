// Sources: 
// http://bl.ocks.org/mbostock/3884955
// https://gist.github.com/ZJONSSON/3918369#file-thumbnail-png (legend)
import Ember from 'ember';

export default Ember.Component.extend({

  linechart: function() {
    var canvas_width = 850;
    var canvas_height = 550;

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        svg_width = canvas_width - margin.left - margin.right,
        svg_height = canvas_height - margin.top - margin.bottom;

    var format = d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
    var totalName = "Total";

    var x = d3.time.scale()
        .range([0, svg_width]);

    var y = d3.scale.linear()
        .range([svg_height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(8);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .interpolate("basis")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.count); });

    var svg = d3.select("#line-chart").append("svg")
        .attr("chart-name", 'linechart')
        .attr("width", svg_width + margin.left + margin.right)
        .attr("height", svg_height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var levels = [];
    var data = this.get('data');

    var grouped = groupDataByDate(data.content);
    levels = accumulateLevels(data);
    buildTimeSeries(grouped);

    function accumulateLevels(data) {
      var levelsSet = {};
      data.forEach(function(d) {
        var level = d.get('level').get('text');
        levelsSet[level] = level;
      });
      return Ember.$.map(levelsSet, function(v) { return v; });
    }

    function groupDataByDate(data) {
      var groups = {};

      data.forEach(function(d) {
        var level = d.get('level').get('text');
        var key_name = d.get('createdAt') + "_" + level;

        if (key_name in groups) {
          groups[key_name].count++;
        }
        else {
          groups[key_name] = {
            date: format.parse(d.get('createdAt')),
            key: level,
            count: 1
          };
        }
      });

      return Ember.$.map(groups, function(v) { return v; });
    }

    function buildDateRange(data) {
      var extent = d3.extent(data, function(d) { return d.date; });
      return d3.time.week.range(
        d3.time.day.offset(extent[0], -7), 
        d3.time.day.offset(extent[1], 7)
      );
    }

    function iterateRange(all_dates) {
      // Iterate and build a hash to accumulate values into
      // where keys combine data from the date and level
      var dataOverRange = {};
      all_dates.forEach(function(d) {
        levels.forEach(function(level) {
          dataOverRange[d + "_" + level] = {
            date: d,
            key: level,
            count: 0
          };
        });

        dataOverRange[d + "_all"] = {
          date: d,
          key: totalName,
          count: 0
        };
      });

      return dataOverRange;
    }

    function countDateLevels(dataOverRange, data) {
      // Now fill in the values for each.
      data.forEach(function(d) {
        var week = d3.time.week.round(d.date);
        var key = week + "_" + d.key;
        var overall_key = week + "_all";

        dataOverRange[key].count += d.count;
        dataOverRange[overall_key].count += d.count;
      });      
    }

    function fillInDateRange(data) {
      var all_dates = buildDateRange(data);
      var dataOverRange = iterateRange(all_dates, data);
      countDateLevels(dataOverRange, data);

      return Ember.$.map(dataOverRange, function(v) { return v; });
    }

    function addDataPoint(submissions, dataPoint) {
      submissions.forEach(function(sub) {
        if (sub.name === dataPoint.key) {
          sub.values.push(dataPoint);
        }
      });
    }

    function createSubmissionData(data) {
      var submissions = color.domain().map(function(name) {
        return {
          name: name,
          values: []
        };
      });

      data.forEach(function(d) {
        addDataPoint(submissions, d);
      });

      return submissions;      
    }

    function buildTimeSeries(data) {
      data = fillInDateRange(data);

      var level_names = levels;
      level_names.push(totalName);

      color.domain(level_names);
      var submissions = createSubmissionData(data);

      x.domain(d3.extent(data, function(d) { return d.date; }));

      y.domain([
        d3.min(submissions, function(c) { return d3.min(c.values, function(v) { return v.count; }); }),
        d3.max(submissions, function(c) { return d3.max(c.values, function(v) { return v.count; }); })
      ]);

      appendLineChartSvg(level_names, submissions);
    }

    function appendLineChartSvg(level_names, submissions) {
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + svg_height + ")")
          .call(xAxis);

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Submission count");

      var submit_type = svg.selectAll(".submit-type")
          .data(submissions)
        .enter().append("g")
          .attr("class", "submit-type");

      submit_type.append("path")
          .attr("class", "line")
          .attr("d", function(d) { return line(d.values); })
          .attr("data-legend",function(d) { return d.name; })
          .style("stroke", function(d) { return color(d.name); });

      svg.append("g")
          .attr("class","legend")
          .attr("transform","translate(" + (svg_width - 75) + ",20)")
          .style("font-size","12px")
          .call(d3_legend);
    }

    function d3_legend(g) {
      g.each(function() {
        var g= d3.select(this),
            items = {},
            svg = d3.select(g.property("nearestViewportElement")),
            legendPadding = g.attr("data-style-padding") || 5,
            lb = g.selectAll(".legend-box").data([true]),
            li = g.selectAll(".legend-items").data([true]);
     
        lb.enter().append("rect").classed("legend-box",true);
        li.enter().append("g").classed("legend-items",true);
     
        svg.selectAll("[data-legend]").each(function() {
            var self = d3.select(this);
            items[self.attr("data-legend")] = {
              pos : self.attr("data-legend-pos") || this.getBBox().y,
              legend_color : self.attr("data-legend-color") !== null ? self.attr("data-legend-color") : self.style("fill") !== 'none' ? self.style("fill") : self.style("stroke")
            };
          });
     
        items = d3.entries(items).sort(function(a,b) { return a.value.pos-b.value.pos; });
        
        li.selectAll("text")
            .data(items,function(d) { return d.key;})
            .call(function(d) { d.enter().append("text");})
            .call(function(d) { d.exit().remove();})
            .attr("y",function(d,i) { return i+"em";})
            .attr("x","1em")
            .text(function(d) { return d.key;});
        
    li.selectAll("rect")
        .data(items,function(d) { 
          return d.key; 
        })
        .call(function(d) { d.enter().append("rect"); })
        .call(function(d) { d.exit().remove(); })
        .attr("y",function(d,i) { return i-0.675+"em"; })
        .attr("x",0)
        .attr("width","0.6em")
        .attr("height","0.6em")
        .style("fill",function(d) {
          return d.value.legend_color;
        });
        
        // Reposition and resize the box
        var lbbox = li[0][0].getBBox();
        lb.attr("x",(lbbox.x-legendPadding))
            .attr("y",(lbbox.y-legendPadding))
            .attr("height",(lbbox.height+2*legendPadding))
            .attr("width",(lbbox.width+2*legendPadding));
      });
      return g;
    }
  },

  didInsertElement: function(){
    this.linechart();
  }  
});
