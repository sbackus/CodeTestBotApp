// Source: http://bl.ocks.org/kerryrodden/7090426
export default Ember.Component.extend({

  sunburst: function() {

    // Dimensions of sunburst.
    var width = 750;
    var height = 600;
    var radius = Math.min(width, height) / 2;

    // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
    var b = {
      w: 75, h: 30, s: 3, t: 10
    };

    // Mapping of step names to colors.
    var colors = {
      "Ruby": "#AB0000",
      "Java": "#8B008B",

      "Junior": "#1BD176",
      "Mid": "#F5B916",
      "Senior": "#0D7586",
      "Tech Lead": "#F51637",

      "Score 0": "#5687d1",
      "Score 1": "#7b615c",
      "Score 2": "#de783b",
      "Score 3": "#6ab975",
      "Score 4": "#a173d1",
      "Score 5": "#bbbbbb"
    };

    // Total size of all segments; we set this later, after loading the data.
    var totalSize = 0; 

    var vis = d3.select("#analytics-chart").append("svg:svg")
        .attr("width", width)
        .attr("height", height)
        .append("svg:g")
        .attr("id", "container")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var partition = d3.layout.partition()
        .size([2 * Math.PI, radius * radius])
        .value(function(d) { return d.size; });

    var arc = d3.svg.arc()
        .startAngle(function(d) { return d.x; })
        .endAngle(function(d) { return d.x + d.dx; })
        .innerRadius(function(d) { return Math.sqrt(d.y); })
        .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

    // Use d3.text and d3.csv.parseRows so that we do not need to have a header
    // row, and can receive the csv as an array of arrays.
    var data = this.get('data');
    var hierarchy = buildHierarchy(data.content);
    createVisualization(hierarchy);

    // Main function to draw and set up the visualization, once we have the data.
    function createVisualization(hierarchy) {

      // Basic setup of page elements.
      initializeBreadcrumbTrail();

      // Bounding circle underneath the sunburst, to make it easier to detect
      // when the mouse leaves the parent g.
      vis.append("svg:circle")
          .attr("r", radius)
          .style("opacity", 0);

      // For efficiency, filter nodes to keep only those large enough to see.
      var nodes = partition.nodes(hierarchy)
          .filter(function(d) {
          return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
          });

      var path = vis.data([hierarchy]).selectAll("path")
          .data(nodes)
          .enter().append("svg:path")
          .attr("display", function(d) { return d.depth ? null : "none"; })
          .attr("d", arc)
          .attr("fill-rule", "evenodd")
          .style("fill", function(d) { return colors[d.name]; })
          .style("opacity", 1)
          .on("mouseover", mouseover);

      // Add the mouseleave handler to the bounding circle.
      d3.select("#svg-container").on("mouseleave", mouseleave);

      // Get total size of the tree = value of root node from partition.
      totalSize = path.node().__data__.value;
     }

    function numberRelativeToTotalString(d_value, totalSize) {
      return "(" + d_value + " of " + totalSize + ")";
    }

    function percentageExplanation(d) {
      var pe;
      if (1 === d.depth) {
        pe = " " + d.name + " code tests";
      }
      else if (2 === d.depth) {
        pe = " " + d.name + " " + d.parent.name + " code tests";
      }
      else {
        pe = " " + d.parent.name + " " + d.parent.parent.name + " code tests had an average " + d.name;
      }
      return pe;
    }

    // Fade all but the current sequence, and show it in the breadcrumb trail.
    function mouseover(d) {

      var percentage = (100 * d.value / totalSize).toPrecision(3);
      var percentageString = percentage + "% " + numberRelativeToTotalString(d.value, totalSize);
      if (percentage < 0.1) {
        percentageString = "< 0.1% " + numberRelativeToTotalString(d.value, totalSize);
      }


      d3.select("#analytics-percentage")
          .text(percentageString);
      d3.select("#percentage-explain")
          .text(percentageExplanation(d));

      d3.select("#analytics-explanation")
          .style("visibility", "");

      var sequenceArray = getAncestors(d);
      updateBreadcrumbs(sequenceArray, percentageString);

      // Fade all the segments.
      d3.selectAll("path")
          .style("opacity", 0.3);

      // Then highlight only those that are an ancestor of the current segment.
      vis.selectAll("path")
          .filter(function(node) {
                    return (sequenceArray.indexOf(node) >= 0);
                  })
          .style("opacity", 1);
    }

    // Restore everything to full opacity when moving off the visualization.
    function mouseleave() {

      // Hide the breadcrumb trail
      d3.select("#trail")
          .style("visibility", "hidden");

      // Deactivate all segments during transition.
      d3.selectAll("path").on("mouseover", null);

      // Transition each segment to full opacity and then reactivate it.
      d3.selectAll("path")
          .transition()
          .duration(1000)
          .style("opacity", 1)
          .each("end", function() {
                  d3.select(this).on("mouseover", mouseover);
                });

      d3.select("#analytics-explanation")
          .style("visibility", "hidden");
    }

    // Given a node in a partition layout, return an array of all of its ancestor
    // nodes, highest first, but excluding the root.
    function getAncestors(node) {
      var path = [];
      var current = node;
      while (current.parent) {
        path.unshift(current);
        current = current.parent;
      }
      return path;
    }

    function initializeBreadcrumbTrail() {
      // Add the svg area.
      var trail = d3.select("#analytics-sequence").append("svg:svg")
          .attr("width", width)
          .attr("height", 40)
          .attr("id", "trail");
      // Add the label at the end, for the percentage.
      trail.append("svg:text")
        .attr("id", "endlabel")
        .style("fill", "#000");
    }

    // Generate a string that describes the points of a breadcrumb polygon.
    function breadcrumbPoints(d, i) {
      var points = [];
      points.push("0,0");
      points.push(b.w + ",0");
      points.push(b.w + b.t + "," + (b.h / 2));
      points.push(b.w + "," + b.h);
      points.push("0," + b.h);
      if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
        points.push(b.t + "," + (b.h / 2));
      }
      return points.join(" ");
    }

    // Update the breadcrumb trail to show the current sequence and percentage.
    function updateBreadcrumbs(nodeArray, percentageString) {

      // Data join; key function combines name and depth (= position in sequence).
      var g = d3.select("#trail")
          .selectAll("g")
          .data(nodeArray, function(d) { return d.name + d.depth; });

      // Add breadcrumb and label for entering nodes.
      var entering = g.enter().append("svg:g");

      entering.append("svg:polygon")
          .attr("points", breadcrumbPoints)
          .style("fill", function(d) { return colors[d.name]; });

      entering.append("svg:text")
          .attr("x", (b.w + b.t) / 2)
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(function(d) { return d.name; });

      // Set position for entering and updating nodes.
      g.attr("transform", function(d, i) {
        return "translate(" + i * (b.w + b.s) + ", 0)";
      });

      // Remove exiting nodes.
      g.exit().remove();

      // Now move and update the percentage at the end.
      d3.select("#trail").select("#endlabel")
          .attr("x", (nodeArray.length + 0.75) * (b.w + b.s))
          .attr("y", b.h / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "middle")
          .text(percentageString);

      // Make the breadcrumb trail visible, if it's hidden.
      d3.select("#trail")
          .style("visibility", "");

    }

    function addChild(node, searchTerm, leaf) {
      var childNode = null;
      for (var i = 0; i < node.children.length; i++) {
        if (node.children[i].name === searchTerm) {
          childNode = node.children[i];
          break;
        }
      }

      if (childNode == null) {
        if (leaf) {
          childNode = {"name": searchTerm, "size": 0};
        }
        else {
          childNode = {"name": searchTerm, "children": []};
        }
        node.children.push(childNode);
      }

      return childNode;
    }

    function truncatedScore(score) {
      if (score == null) return "Score 0";
      return "Score " + Math.floor( score );
    }

    // Attach appropriate information to json hierarchy.
    // Build up counts of sequence occurences.
    function buildHierarchy(analytics) {
      var root = {"name": "root", "children": []};

      for (var i = 0; i < analytics.length; i++) {
        var datum = analytics[i];
        var lang = datum.get('language');
        var level = datum.get('level');
        
        var lang_node = addChild(root, lang.get('name'), false);
        var level_node = addChild(lang_node, level.get('text'), false);
        var score_node = addChild(level_node, truncatedScore(datum.get('averageScore')), true);
        score_node.size += 1;
      }
      return root;
    }
  },

  didInsertElement: function(){
    this.sunburst();
  }
});
