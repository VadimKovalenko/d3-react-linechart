import React, { Component } from 'react'
import './App.css'
import BarChart from './BarChart'
import LineChart from './LineChart'
import PlotLineChartOneGraph from './PlotLineChartOneGraph'
import PlotLineChart from './PlotLineChart'

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            currency: 'GZB'
        };
        this.handleChangeCurrency = this.handleChangeCurrency.bind(this)
    }

    handleChangeCurrency(e) {
        this.setState({
            currency: e.target.value
        })
    }

   render() {
   return (
      <div className='App'>
      <div className='App-header'>
      <h2>d3ia dashboard</h2>
      </div>
      <div>
      {/*<BarChart data={[5,10,1,3]} size={[500,500]} />*/}
      {/*<LineChart data={''} size={[500,800]} />*/}
      <select name="currency" id="" onChange={this.handleChangeCurrency}>
          <option value="GZB">Gigzi Black</option>
          <option value="GZS">Gigzi Silver</option>
          <option value="GZG">Gigzi Gold</option>
          <option value="GZP">Gigzi Platinum</option>
      </select>
      <PlotLineChartOneGraph currency={this.state.currency} data={''} />
      </div>
      </div>
   )
   }
}

export default App;
