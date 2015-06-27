shinyUI(
  
  fluidPage(
    
    br(),
    
    fluidRow(
      column(2,
        actionButton("Collapse",label = "Collapse"),
        actionButton("SelectAgent",label = "Agent"),
        selectInput("Size", "Size", choices = c("Similarity","Size"), width = "200px")
      ),
      column(10,
        FrissRadialChartOutput("Chart1",width="100%", height="950px")
      )
    )
  )
)
