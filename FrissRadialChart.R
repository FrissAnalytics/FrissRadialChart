library(shiny)

FrissRadialChartOutput <- function(inputId, width="100%", height="100px") {
  style <- sprintf("width: %s; height: %s;",
    validateCssUnit(width), validateCssUnit(height))
  
  tagList(
    singleton(
      tags$head(
        tags$link(rel="stylesheet", type="text/css", href="FrissRadialChart.css"),
    	  tags$script(src="d3.js"),
        tags$script(src="FrissRadialChart.js")
      )
    ),
    
    div(id=inputId, class="FrissRadialChart", style=style)
  )
}

renderFrissRadialChart <- function(expr, env=parent.frame(), quoted=FALSE) {

  installExprFunction(expr, "func", env, quoted)

  function() {
    Data <- func()

    return(toJSON(Data))
  }
}
  