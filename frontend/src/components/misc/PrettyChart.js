import Chart from 'react-apexcharts'
import React from 'react'
import { useTheme } from '@mui/material'
import propTypes from 'prop-types'

export default function PrettyChart({ data }) {
  const theme = useTheme()
  const displayedData = data || [{ data: [] }]
  console.log(displayedData)
  return (
    <Chart
      options={{
        stroke: { curve: 'smooth' },
        dataLabels: { enabled: false },
        fill: {
          type: 'gradient',
          gradient: {
            shade: theme.apexcharts.shade,
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
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
        colors: [theme.palette.primary.main],
        yaxis: {
          labels: {
            formatter(val, opts) {
              return val !== undefined ? val.toFixed(3) : 0
            },
          },
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
