import React from 'react'
import Chart from 'react-apexcharts'
import PropTypes from 'prop-types'
import { useTheme } from '@mui/material'

/**
 * Histogram with react-apexcharts
 * potentially with highlighted element
 * @param data array of string, amount pair objects( [{x: str, y: int}] )
 * @param highlightedIndex index of highlighted column
 * @param title title of the histogram
 * @returns {JSX.Element}
 */
export default function Histogram({ data, highlightedIndex, title }) {
  const theme = useTheme()
  const displayedData = data || []
  return (
    <Chart
      series={[{ data: displayedData }]}
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
        title: {
          text: title,
          style: {
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.fontSize,
            fontWeight: theme.typography.fontWeightRegular,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          type: 'category',
          tickAmount: data.length > 30 ? 25 : 10,
        },
        colors: [
          function ({ dataPointIndex }) {
            if (dataPointIndex === highlightedIndex) {
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
  data: PropTypes.array,
  highlightedIndex: PropTypes.number,
  title: PropTypes.string,
}
