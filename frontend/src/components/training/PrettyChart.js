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
        colors: [theme.palette.primary.main],
        yaxis: {
          min: -2,
          max: 2,
          forceNiceScale: true,
          decimalsInFloat: 3,
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
