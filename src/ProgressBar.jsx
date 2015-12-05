import React, { Component } from 'react';

export default class ProgressBar extends Component {
  style = {
    container: {
      border: '1px solid #2b2b2b',
      padding: 1,
      marginBottom: 2
    },
    progress: {
      backgroundColor: this.props.color || '#0BD318',
      width: '0%',
      transition: 'width 200ms',
      height: this.props.height || 10
    }
  }

  constructor(props) {
    super(props);
  }

  render() {

    let { completed } = this.props;

    if (completed < 0) completed = 0;
    if (completed > 100) completed = 100;

    return (
      <div style={this.style.container}>
        <div style={{
            ...this.style.progress,
            width: completed + '%'
          }}></div>
      </div>
    )
  }
}
