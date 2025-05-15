import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RestaurantList from '../pages/Restaurant'

const RouteConfig = () => {
  return (
    <Routes>
      <Route path="/" element={<RestaurantList />} />
    </Routes>
  )
}

export default RouteConfig
