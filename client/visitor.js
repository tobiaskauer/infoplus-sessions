

let visitorData = {
    id: null,
    start: Date.now(),
    browserOrigin: Intl.DateTimeFormat().resolvedOptions().timeZone,
    browserLanguage: navigator.language, 
    category: null, //TODO
    duration: null //TODO
}

function sendVisitorData(id) {
    const method = "POST";
    let url = "http://localhost:3001/api/visitor";
    url+= (id) ? "/"+id : ""

    const xhr =  new XMLHttpRequest(); //TODo: rewrite to $.ajax (were using jq anyway)
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-type', 'application/json');

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const status = xhr.status;
            if (status === 0 || (status >= 200 && status < 400)) {
                let response = JSON.parse(xhr.responseText)
                if(!id) visitorData.id = response._id
            } else {
                console.log(xhr.responseText);
            }
        }
    };
    xhr.send(JSON.stringify({
        browserOrigin: visitorData.browserOrigin,
        browserLanguage: visitorData.browserLanguage,
        duration: visitorData.duration,
        category: visitorData.category
    }));

    setInterval(() => {
        updateVisitor()
    }, 5000);
}


const updateVisitor = () => {
    visitorData.duration = Date.now() - visitorData.start 
    sendVisitorData(visitorData.id) 
}

sendVisitorData() //initial data query


const getVisitorData = () => {
    $.ajax({
        type: 'GET',
        dataType:"json",
        url: 'http://localhost:3001/api/visitor',
        contentType: "application/json; charset=utf-8",

        success: function (data, status, xhr) {
          const nodes = renderNodes(data)
          renderVis(nodes)
        },

        error: function(error, status, xhr) {
            console.log(error, status, xhr)
        }
      });
}

getVisitorData()

const renderNodes = (data) => {
    
    let radiusScale = d3.scaleLinear().domain(d3.extent(data, visit => visit.duration)).range([5,10])
    let colorScale = d3.scaleOrdinal().domain(["practitioner","educator","researcher"]).range(["red","green","blue"])
    let nodes = data.map(node => {
        console.log(node.category)
        return {
            radius: node.duration ? radiusScale(node.duration) : 1,
            color: node.category ? colorScale(node.category) : "black"
        }
    })

    

    return nodes
}

const renderVis = (nodes) => {

    console.log(nodes)
    

    const svg = d3.select("#vis").append("svg").attr("width",400).attr("height",400)

    var simulation = d3.forceSimulation(nodes)
  .force('charge', d3.forceManyBody().strength(1))
  .force('center', d3.forceCenter(400 / 2, 400 / 2))
  .force('collision', d3.forceCollide().radius(function(d) {
    return d.radius
  }))
  .on('tick', ticked);

    function ticked() {
        var u = d3.select('svg')
          .selectAll('circle')
          .data(nodes)
      
        u.enter()
          .append('circle')
          .attr('r', function(d) {
            return d.radius
          })
          .merge(u)
          .attr('cx', function(d) {
            return d.x
          })
          .attr('cy', function(d) {
            return d.y
          })
          .attr("fill", "black")
      
        u.exit().remove()
      }
}