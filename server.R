shinyServer(function(input, output, session) {

  RV <- reactiveValues(Data = RadialData)

  # chart 1
  output$Chart1 <- renderFrissRadialChart({ 
    list(Data = RV$Data, Options = list(selectedAgent = 1))
  })
  
  # chart 2
  output$Chart2 <- renderFrissRadialChart({ 
    
    Options = list(selectedAgent          = 61, 
                   centralCircleColor     = "purple",
                   barOffsetX             = -50,
                   barTextColor           = "blue",
                   barTextAlign           = "left-align",
                   barColor               = "purple",
                   circleGuideTextColor   = "#91B6D4",
                   circleGuideTextSize    = "11px",
                   circleGuideOffset      = "40%",
                   circleGuideFill        = "gray",
                   circleGuideStroke      = "white",
                   circleGuideOpacity     = 0.1,
                   circleGuideStrokeWidth = "5px")
    
    list(Data = RV$Data, Options = Options)
  })

  # agent 1 selector
  output$Agent1 <- renderUI({
    selectInput("SelectAgent1", "select agent", choices = RadialData$gem, width = "200px")
  })
  
  # agent 2 selector
  output$Agent2 <- renderUI({
    selectInput("SelectAgent2", "select agent", choices = RadialData$gem, width = "200px")
  })
  
  # returned click index chart 1 
  observeEvent(input$Chart1_index,{
    cat("\nchart 1 clicked on index:",input$Chart1_index)
    updateSelectInput(session,inputId = "SelectAgent1" , selected = RV$Data$gem[input$Chart1_index+1])
  })

  # returned click index chart 2 
  observeEvent(input$Chart2_index,{
    cat("\nchart 2 clicked on index:",input$Chart2_index)
    updateSelectInput(session,inputId = "SelectAgent2" , selected = RV$Data$gem[input$Chart2_index+1])
  })
  
  # custom message to select agent in chart 1
  observe({
    if(is.null(input$SelectAgent1)) return()
    ind <- which(RV$Data$gem == input$SelectAgent1)
    session$sendCustomMessage(type = "Chart1_callbackCity", ind - 1)
  })
  
  # custom message to select agent in chart 2
  observe({
    if(is.null(input$SelectAgent2)) return()
    ind <- which(RV$Data$gem == input$SelectAgent2)
    session$sendCustomMessage(type = "Chart2_callbackCity", ind - 1)
  })
  
  # custom message to select size in chart 1
  observe({
    if(is.null(input$Size1)) return()
    cat("\nSize 1",input$Size1)
    session$sendCustomMessage(type = "Chart1_callbackSize", input$Size1)
  })
  
  # custom message to select size in chart 2
  observe({
    if(is.null(input$Size2)) return()
    cat("\nSize 2",input$Size2)
    session$sendCustomMessage(type = "Chart2_callbackSize", input$Size2)
  })

  
})