shinyUI(
  
  fluidPage(
  
    
    fluidRow(
      column(2,
        uiOutput("Agent"),
        selectInput("Size", "size", choices = c("Similarity","Size"), width = "200px"),
        actionButton("Collapse",label = "collapse"),
        actionButton("Reset",label = "reset")
      ),
      column(5,
        FrissRadialChartOutput("Chart1",width="100%", height="950px")
      ),
      
      column(5,
        FrissRadialChartOutput("Chart2",width="100%", height="950px")
      )
    )
  )
)
