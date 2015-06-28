shinyUI(
  
  fluidPage(
  
    br(),
    
    fluidRow(
      column(6,
        fluidRow(
          column(6,uiOutput("Agent1")),
          column(6,selectInput("Size1", "radius", choices = c("Similarity","Size"), width = "200px"))
        ),
        FrissRadialChartOutput("Chart1",width="100%", height="850px")
      ),
      column(6,
        fluidRow(
          column(6,uiOutput("Agent2")),
          column(6,selectInput("Size2", "radius", choices = c("Similarity","Size"), width = "200px"))
        ),
        FrissRadialChartOutput("Chart2",width="100%", height="850px")
      )
    )
  )
)
