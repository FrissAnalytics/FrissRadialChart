shinyUI(
  
navbarPage(id="main", windowTitle = "Friss radial agent chart", position = "fixed-top", title = NULL,
           
  header = FrissHeader,
  
  tabPanel("dashboard", icon = icon("dashboard"),
  
    includeCSS("www/FrissStyle.css"),
    
    
    h1("Friss radial agent charts", class = "FrissTitle"),
    
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
    ),

    div( style = "margin: 0 200px;", hr()),
    
    div( class = "FrissDark", 
        
        hr(),
         
        br(),
        
        h3("Friss colors", style = "text-align: center; color: white"),
        
        fluidRow(
          column(6,offset = 1, uiOutput("Agent3")),
          column(5,selectInput("Size3", "radius", choices = c("Similarity","Size"), width = "200px"))
        ),
        
        FrissRadialChartOutput("Chart3",width="100%", height="1000px")
        
    ),
    
    br(),br(),br()
          
  )
))