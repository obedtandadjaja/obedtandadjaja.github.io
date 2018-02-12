$(document).ready(function() {

  var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  var current = 0;
  var current_delete = "A";
  var nodes = [];
  var nodes_dictionary = {};
  var links = [];
  var links_dictionary = {};
  var last_clicks = [];
  var upper_bound = 1024;

  var $ = go.GraphObject.make;
  myDiagram = $(go.Diagram, "myDiagramDiv", {initialContentAlignment: go.Spot.Center, "undoManager.isEnabled": true, "animationManager.isEnabled": false});
  myDiagram.nodeTemplate =
    $(go.Node, "Auto", new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, "Circle", { strokeWidth: 0},
        new go.Binding("fill", "color")
      ),
      $(go.TextBlock,
        { margin: 8 },
        new go.Binding("text", "key")
      ),
      {
        click: function(e, node) {
          last_clicks.unshift(node.data.key);
        }
      },
      {
        mouseHold: function(e, node) {
          deleteNode(node);
        }
      }
    );
  myDiagram.linkTemplate =
    $(go.Link,
      $(go.Shape), { curve: go.Link.Bezier },
      $(go.Shape, { toArrow: "Standard" }),
      $(go.TextBlock,
        new go.Binding("text", "text")),
      {
        doubleClick: function(e, link) {
          deleteLink(link);
        }
      },
      {
        deletable: false
      }
    );
  myDiagram.model = new go.GraphLinksModel(nodes, links);

  add_accepted_node = document.getElementById('add_accepted_node');
  add_rejected_node = document.getElementById('add_rejected_node');
  add_link_0 = document.getElementById('add_link_0');
  add_link_1 = document.getElementById('add_link_1');
  evaluate = document.getElementById('evaluate');
  evaluate2 = document.getElementById('evaluate2');
  accepted = document.getElementById('accepted');
  rejected = document.getElementById('rejected');
  refresh = document.getElementById('refresh');

  add_accepted_node.addEventListener('click', function() {
    random_x = Math.floor((Math.random() * 100) + 1)+150;
    random_y = Math.floor((Math.random() * 100) + 1)+150;
    nodes.push({ key: alphabet[current], color: 'green', loc: random_x+" "+random_y });
    nodes_dictionary[alphabet[current]] = true; // true = accepted
    drawDiagram(nodes, links);
    current++;
  });
  add_rejected_node.addEventListener('click', function() {
    random_x = Math.floor((Math.random() * 100) + 1)+150;
    random_y = Math.floor((Math.random() * 100) + 1)+150;
    nodes.push({ key: alphabet[current], color: 'red', loc: random_x+" "+random_y });
    nodes_dictionary[alphabet[current]] = false; // false = rejected
    drawDiagram(nodes, links);
    current++;
  });
  add_link_0.addEventListener('click', function() {
    if(last_clicks.length == 1) {
      links.push({ from: last_clicks[0], to: last_clicks[0], text: "0" })
      if(links_dictionary[last_clicks[0]] == undefined) {
        links_dictionary[last_clicks[0]] = {};
      }
      links_dictionary[last_clicks[0]]["0"] = last_clicks[0];
    } else {
      links.push({ from: last_clicks[1], to: last_clicks[0], text: "0" })
      if(links_dictionary[last_clicks[1]] == undefined) {
        links_dictionary[last_clicks[1]] = {};
      }
      links_dictionary[last_clicks[1]]["0"] = last_clicks[0];
    }
    drawDiagram(nodes, links);
  });
  add_link_1.addEventListener('click', function() {
    if(last_clicks.length == 1) {
      links.push({ from: last_clicks[0], to: last_clicks[0], text: "1" })
      if(links_dictionary[last_clicks[0]] == undefined) {
        links_dictionary[last_clicks[0]] = {};
      }
      links_dictionary[last_clicks[0]]["1"] = last_clicks[0];
    } else {
      links.push({ from: last_clicks[1], to: last_clicks[0], text: "1" })
      if(links_dictionary[last_clicks[1]] == undefined) {
        links_dictionary[last_clicks[1]] = {};
      }
      links_dictionary[last_clicks[1]]["1"] = last_clicks[0];
    }
    drawDiagram(nodes, links);
  });
  evaluate.addEventListener('click', function() {
    window.onerror=function(){
      alert('You have not considered all possibilities!');
    }
    accepted.innerHTML = "";
    rejected.innerHTML = "";
    current_delete = getCurrentDeleteAlphabet();
    for(x = 0; x < upper_bound; x++) {
      binaryString = ('0000000000'+toBinary(x)).slice(-10);
      current_state = current_delete;
      for(y = 0; y < 10; y++) {
        current_state = links_dictionary[current_state][binaryString[y]];
      }
      if(nodes_dictionary[current_state]) {
        accepted.innerHTML += binaryString+", ";
      } else {
        rejected.innerHTML += binaryString+", ";
      }
    }
    alert('Test done! Review the results below!');
  });
  evaluate2.addEventListener('click', function() {
    window.onerror=function(){
      alert('You have not considered all possibilities!');
    }
    accepted.innerHTML = "";
    rejected.innerHTML = "";
    current_delete = getCurrentDeleteAlphabet();
    for(x = 0; x < upper_bound; x++) {
      binaryString = toBinary(x);
      current_state = current_delete;
      for(y = 0; y < binaryString.length; y++) {
        current_state = links_dictionary[current_state][binaryString[y]];
      }
      if(nodes_dictionary[current_state]) {
        accepted.innerHTML += binaryString+", ";
      } else {
        rejected.innerHTML += binaryString+", ";
      }
    }
    alert('Test done! Review the results below!');
  });
  refresh.addEventListener('click', function() {
    drawDiagram(nodes, links);
  });

  function getCurrentDeleteAlphabet() {
    for(i = 0; i < alphabet.length; i++) {
      if(nodes_dictionary[alphabet[i]] != null) return alphabet[i];
    }
  }
  function drawDiagram(nodes, links) {
    myDiagram.model = new go.GraphLinksModel(nodes, links);
  }
  function toBinary(int) {
    return (int >>> 0).toString(2);
  }
  function deleteNode(node) {
    temp1 = [];
    for(var i = nodes.length - 1; i >= 0; i--) {
      if(nodes[i].key != node.data.key) {
        temp1.push(nodes[i]);
      }
    }
    nodes = temp1;
    temp2 = [];
    for(var i = links.length - 1; i >= 0; i--) {
      if(links[i].to != node.data.key && links[i].from != node.data.key) {
        temp2.push(links[i]);
      }
    }
    links = temp2;
    nodes_dictionary[node.data.key] = null;
    links_dictionary[node.data.key] = null;
    drawDiagram(nodes, links);
  }
  function deleteLink(link) {
    console.log(link);
    console.log(links);
    temp = [];
    for(var i = links.length - 1; i >= 0; i--) {
      if(links[i] != link.data) {
        temp.push(links[i]);
      }
    }
    links = temp;
    links_dictionary[link.data.from][link.data.text] = null;
    console.log(links);
    drawDiagram(nodes, links);
  }

});
