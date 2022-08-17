import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import api from '../api'

const socket = io(`ws://${api.getServerAddress()}:${api.getServerPort()}`)

export default function SocketTestPage() {
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [lastPong, setLastPong] = useState(null)

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

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('pong')
    }
  }, [])

  const sendPing = () => {
    socket.emit('ping')
  }

  return (
    <div>
      <p>Connected: {'' + isConnected}</p>
      <p>Last pong: {lastPong || '-'}</p>
      <button onClick={sendPing}>Send ping</button>
    </div>
  )
}
