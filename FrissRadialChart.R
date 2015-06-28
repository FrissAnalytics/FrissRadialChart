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
    L       <- func()
    Data    <- toJSON(L$Data)
    Options <- L$Options

    Default <- list(selectedAgent          = 1, 
                    centralCircleColor     = "red",
                    barOffsetX             = -50,
                    barTextColor           = "#91B6D4",
                    barTextAlign           = "left-align",
                    barColor               = "#C0CCD5",
                    circleGuideTextColor   = "#91B6D4",
                    circleGuideTextSize    = "11px",
                    circleGuideOffset      = "40%",
                    circleGuideFill        = "none",
                    circleGuideStroke      = "#91B6D4",
                    circleGuideOpacity     = 0.6,
                    circleGuideStrokeWidth = "1px",
                    CircleColorArray       = c("#ADDD8E", "#41415F", "#193244"),
                    CircleColorDomain      = c(1, 20, 74),
                    SelectedAgentTextColor = "#000", 
                    SelectedAgentFontSize  = "24px"
                  )

    Missing <- setdiff(names(Default),names(Options))
    
    if(length(Missing) > 0){
      
      m <- match(Missing,names(Default))
      
      Options <- c(Options,Default[m])
    }

    return(list(Data = toJSON(L$Data), Options = Options))
  }
}
  