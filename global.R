rm(list = ls())

library(shiny)
library(jsonlite)
library(leaflet)

FrissHeader <- list(
  singleton(includeScript("www/d3.js")),
  tags$img(src="friss.svg", id = "FrissLogo"),
  singleton(includeCSS("www/Friss.css")),
  singleton(includeScript("www/underscore.js")),
  singleton(includeScript("www/jquery-ui.js")),
  singleton(includeScript("www/style.js")),
  singleton(includeCSS("www/app.css"))
)

source("FrissRadialChart.R")

# data
load("RadialData.RData")

# add agent id 
RadialData$gem <- paste("Agent",sprintf("%02d",1:nrow(RadialData)),sep="_")

r_colors <- rgb(t(col2rgb(colors()) / 255))
names(r_colors) <- colors()