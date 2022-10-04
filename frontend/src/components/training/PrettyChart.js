import Chart from 'react-apexcharts'
import React from 'react'
import { useTheme } from '@mui/material'
import propTypes from 'prop-types'

export default function PrettyChart({ data, maxLength }) {
  const theme = useTheme()
  const displayedData = data || [{ data: [] }]
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
  maxLength: propTypes.any,
}

PrettyChart.defaultProps = {
  maxLength: 10,
}
