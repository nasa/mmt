/**
Find all accordions on the additional information panel and create a table of
contents out of them
*/

function createTableOfContentsFromAccordians(tag) {
  let accordianPanel = $("#"+tag+"-panel")
  if (accordianPanel.length>0) {
    let toc_identifier = tag + "-toc";
    accordianPanel.prepend($("<div/>", {id:toc_identifier}))
    let toc = $("#"+toc_identifier)
    toc.append("<h3>Table of Contents</h3>")
    toc.append("<ul>")
    $(".eui-accordion__title").each(function(i){
      let topic = $(this).text().replace(/[^\w]/g, " ")
      let topic_name = topic.replace(/\s/g, "_")
      $(this).parent().prepend($("<a/>", {name:topic_name}))
      
      //which is more readable

      //toc.append("<li><a href=\"#"+topic_name+"\">"+topic+"</a></li>");
      
      /*let link = $("<a>")
      link.attr("href", "#"+topic_name)
      link.attr("title", "Jump to " + topic)
      link.text(topic)*/
      
      let link = $("<a>", {href:"#"+topic_name, title:"Jump to "+topic, text:topic})
      
      toc.append($("<li>").append(link));
    })
    toc.append("</ul>")
  }  
}

$(document).ready(function(){
  createTableOfContentsFromAccordians("additional-information");
});
