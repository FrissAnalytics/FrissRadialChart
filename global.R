rm(list = ls())
library(jsonlite)
library(leaflet)

source("FrissRadialChart.R")

# data
load("RadialData.RData")

# add agent id 
RadialData$gem <- paste("Agent",sprintf("%02d",1:nrow(RadialData)),sep="_")

r_colors <- rgb(t(col2rgb(colors()) / 255))
names(r_colors) <- colors()