import Chart from 'react-apexcharts'
import React from 'react'
import { useTheme } from '@mui/material'
import propTypes from 'prop-types'

export default function PrettyChart({ data }) {
  const theme = useTheme()
  const displayedData = data || [{ data: [] }]
  return (
    <Chart
      options={{
        stroke: { curve: 'smooth' },
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
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000,
            },
          },
        },
        colors: ['#2E93fA', '#66DA26', '#546E7A', '#E91E63', '#FF9800'],
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
