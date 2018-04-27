import React, { Component } from 'react'
import './App.css'
import BarChart from './BarChart'
import LineChart from './LineChart'
import PlotLineChartOneGraph from './PlotLineChartOneGraph'
import PlotLineChart from './PlotLineChart'

class App extends Component {
   render() {
   return (
      <div className='App'>
      <div className='App-header'>
      <h2>d3ia dashboard</h2>
      </div>
      <div>
      {/*<BarChart data={[5,10,1,3]} size={[500,500]} />*/}
      {/*<LineChart data={''} size={[500,800]} />*/}
      <PlotLineChartOneGraph data={''} />
      </div>
      </div>
   )
   }
}

export default App;
