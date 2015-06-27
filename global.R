rm(list = ls())

source("FrissRadialChart.R")

# data
load("RadialData.RData")

# update data
RadialData$gem <- paste("Agent",1:nrow(RadialData),sep="_")