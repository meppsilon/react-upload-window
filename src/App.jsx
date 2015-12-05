import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import UploadWindow from './src/UploadWindow';

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const testItems = ['1', '2', '3', '4', '5', '6'].map((i) => ({key: i, name: 'classical.wav', status: 'loading', loaded: 10000, total: 20000}));

    return <UploadWindow items={testItems} />;
  }
}
