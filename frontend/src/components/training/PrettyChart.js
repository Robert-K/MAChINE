import React from 'react'
import { useTheme } from '@mui/material'
import propTypes from 'prop-types'
import Chart from 'react-apexcharts'

// PrettyChart is a wrapper around the react-apexcharts library
// It is used to display the charts in the training page
export default function PrettyChart({ data }) {
  const theme = useTheme()
  const displayedData = data || [{ data: [] }]
  // xLength causes the chart to render differently and more efficiently if there are a lot of data points
  const xLength = displayedData.loss ? displayedData.loss.length : 10
  return (
    <Chart
      options={{
        stroke: { curve: xLength > 100 ? 'straight' : 'smooth' },
        dataLabels: { enabled: false },
        fill: {
          type: 'gradient',
          gradient: {
            shade: theme.apexcharts.shade,
            type: 'diagonal2',
            shadeIntensity: 1,
            opacityFrom: 0.2,
            opacityTo: 0.5,
            stops: [0, 90, 100],
          },
        },
        theme: { mode: theme.apexcharts.shade },
        chart: {
          background: 'transparent',
          toolbar: { show: false },
          animations: {
            enabled: xLength < 70,
            easing: 'linear',
            dynamicAnimation: {
              speed: 290,
            },
          },
        },
        colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
        xaxis: {
          min: 1,
          tickAmount: xLength > 30 ? 25 : 10,
        },
        yaxis: {
          forceNiceScale: true,
          decimalsInFloat: 2,
        },
      }}
      series={displayedData}
      width="100%"
      type="area"
    />
  )
}

PrettyChart.propTypes = {
  data: propTypes.array,
}

PrettyChart.defaultProps = {
  maxLength: 10,
}
