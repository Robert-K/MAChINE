import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import api from '../api'
import Chart from 'react-apexcharts'
import { useTheme } from '@mui/material'

const socket = io(`ws://${api.getServerAddress()}:${api.getServerPort()}`)

export default function ChartsTestPage() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [lastPong, setLastPong] = useState(null)
  const [data, setData] = useState([100, 100])

  const theme = useTheme()

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('pong', () => {
      setLastPong(new Date().toISOString())
    })

    socket.on('data', () => {
      console.log('data')
    })

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('pong')
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      // const val = Math.floor(Math.random() * 100) // Random values
      const prev = data[data.length - 1]
      const val = (Math.random() * 0.5 + 0.5) * prev
      const array = [...data, val]
      // array.shift() // Shift removes the first element, resulting in scrolling rather than accumulation
      setData(array)
    }, 1000)
    return () => {
      window.clearInterval(interval)
    }
  }, [data])

  const sendPing = () => {
    socket.emit('ping')
  }

  return (
    <div>
      <p>Connected: {'' + isConnected}</p>
      <p>Last pong: {lastPong || '-'}</p>
      <button onClick={sendPing}>Send ping</button>
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
          xaxis: {
            labels: { show: false },
          },
          yaxis: {
            min: 0,
            max: 100,
            labels: {
              formatter(val, opts) {
                return val.toFixed(0)
              },
            },
          },
        }}
        series={[
          {
            data,
          },
        ]}
        width="800"
        type="area"
      />
    </div>
  )
}
