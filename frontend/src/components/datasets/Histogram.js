import React from 'react'
import Chart from 'react-apexcharts'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material'

export default function Histogram({ seriesObject, highlightedIndex }) {
  const theme = useTheme()
  const chartConfig = seriesObject || {
    name: '',
    data: [],
  }
  return (
    <Chart
      series={[chartConfig]}
      width="100%"
      type="bar"
      options={{
        theme: { mode: theme.apexcharts.shade },
        chart: {
          background: 'transparent',
          toolbar: { show: true },
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000,
            },
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: 'category',
          tickAmount: chartConfig.data.length > 30 ? 25 : 10,
        },
        colors: [
          function ({ value, seriesIndex, w }) {
            if (seriesIndex === highlightedIndex) {
              return '#FEB019'
            } else {
              return theme.palette.primary.main
            }
          },
        ],
      }}
    />
  )
}

Histogram.propTypes = {
  seriesObject: PropTypes.object,
  highlightedIndex: PropTypes.number,
}
