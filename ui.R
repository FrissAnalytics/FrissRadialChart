shinyUI(
  
  fluidPage(
    
    br(),
    
    fluidRow(
      column(2,
        uiOutput("Agent"),
        selectInput("Size", "size", choices = c("Similarity","Size"), width = "200px"),
        actionButton("Collapse",label = "collapse"),
        actionButton("Reset",label = "reset"),
        actionButton("UpdateData",label = "update data")
      ),
      column(10,
        FrissRadialChartOutput("Chart1",width="100%", height="950px")
      )
    )
  )
)
