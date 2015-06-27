rm(list = ls())
library(jsonlite)

source("FrissRadialChart.R")

# data
load("RadialData.RData")

# add agent id 
RadialData$gem <- paste("Agent",sprintf("%02d",1:nrow(RadialData)),sep="_")