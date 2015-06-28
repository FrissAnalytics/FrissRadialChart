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
                   barTextColor           = "black",
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
  
  # chart 3
  output$Chart3 <- renderFrissRadialChart({ 
    
    Options = list(selectedAgent          = 100, 
                   centralCircleColor     = "#f39100",
                   barOffsetX             = -50,
                   barTextColor           = "white",
                   barTextAlign           = "left-align",
                   barColor               = "#e7318a",
                   circleGuideTextColor   = "white",
                   circleGuideTextSize    = "11px",
                   circleGuideOffset      = "40%",
                   circleGuideFill        = "black",
                   circleGuideStroke      = "white",
                   circleGuideOpacity     = 0.1,
                   circleGuideStrokeWidth = "2px",
                   CircleColorArray       = c("#10baed", "#62368c", "#e7318a","#273583"),
                   CircleColorDomain      = c(1,20, 30,50),
                   SelectedAgentTextColor = "white"
                )
    
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
  
  # agent 3 selector
  output$Agent3 <- renderUI({
    selectInput("SelectAgent3", "select agent", choices = RadialData$gem, width = "200px")
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
  
  # returned click index chart 3 
  observeEvent(input$Chart3_index,{
    cat("\nchart 3 clicked on index:",input$Chart3_index)
    updateSelectInput(session,inputId = "SelectAgent3" , selected = RV$Data$gem[input$Chart3_index+1])
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
  
  # custom message to select agent in chart 3
  observe({
    if(is.null(input$SelectAgent3)) return()
    ind <- which(RV$Data$gem == input$SelectAgent3)
    session$sendCustomMessage(type = "Chart3_callbackCity", ind - 1)
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
  
  # custom message to select size in chart 3
  observe({
    if(is.null(input$Size3)) return()
    cat("\nSize 3",input$Size3)
    session$sendCustomMessage(type = "Chart3_callbackSize", input$Size3)
  })

  
})