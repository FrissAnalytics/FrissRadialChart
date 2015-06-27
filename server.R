shinyServer(function(input, output, session) {
  
  RV <- reactiveValues(Data = RadialData)

  observeEvent(input$UpdateData,{
    if(input$UpdateData == 0) return()
    SelectedRows <- sample(1:nrow(RadialData))[1:20]
    RV$Data <- RadialData[SelectedRows,]
  })
  
  output$Agent <- renderUI({
    selectInput("SelectAgent", "select agent", choices = RadialData$gem, width = "200px")
  })
  
  # chart
  output$Chart1 <- renderFrissRadialChart({ 
    return(RV$Data)
  })
  
  # observe selected index Radial Chart on circle click
  observeEvent(input$Index,{
    cat("\nSelected index:", input$Index)
    
    SelectedAgent <- RadialData$gem[input$Index+1]
    updateSelectInput(session,inputId = "SelectAgent",selected = SelectedAgent)
  })
  
  ###
  ### send custom messages
  ###
  
  observe({
    if(is.null(input$SelectAgent)) return()
    
    mIndex <- which(RV$Data$gem == input$SelectAgent)
    
    cat("\nselected agent",input$SelectAgent,"index",mIndex)
    
    # zero based for d3
    mIndex <- mIndex - 1

    session$sendCustomMessage(type = "myCallbackHandler1", mIndex)
  })
  
  observeEvent(input$Size,{
    if(input$Size == 0) return()
    session$sendCustomMessage(type = "myCallbackHandler2", input$Size)
  })

  observeEvent(input$Collapse,{
    if(input$Collapse == 0) return()
    session$sendCustomMessage(type = "myCallbackHandler3", input$Collapse)
  })

  observeEvent(input$Reset,{
    if(input$Reset == 0) return()
    session$sendCustomMessage(type = "myCallbackHandler4", input$Reset)
  })
  
})