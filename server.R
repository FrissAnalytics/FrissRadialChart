shinyServer(function(input, output, session) {
  
  RV <- reactiveValues(Data = RadialData)

  # chart
  output$Chart1 <- renderFrissRadialChart({ 
    return(RV$Data)
  })
  
  # observe selected index Radial Chart on circle click
  observeEvent(input$Index,{
    cat("\nSelected index:", input$Index)
  })
  
  ###
  ### send custom messages
  ###
  
  observeEvent(input$SelectAgent,{
    if(is.null(input$SelectAgent)) return()
    session$sendCustomMessage(type = "myCallbackHandler1", input$SelectAgent)
  })
  
  observeEvent(input$Size,{
    if(input$Size == 0) return()
    session$sendCustomMessage(type = "myCallbackHandler2", input$Size)
  })

  observeEvent(input$Collapse,{
    if(input$Collapse == 0) return()
    session$sendCustomMessage(type = "myCallbackHandler3", input$Collapse)
  })

})