import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import ProgressBar from './ProgressBar';

function intToByte(num) {
  for (let bytes = ['B', 'KB', 'MB', 'GB', 'TB'], i = 0; i < 4; i++, num /= 1024.0) {
    if (num < 1024) return `${i > 1 ? num.toFixed(1) : Math.round(num)} ${bytes[i]}`;
  }
}

class UploadItem extends Component {
  static propTypes = {
    borderTop: PropTypes.bool,
    name: PropTypes.string.isRequired,
    loaded: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    status: PropTypes.string.isRequired
  }

  style = {
    item: {
      padding: '7px 10px',
      height: '30px',
      lineHeight: '30px',
      borderTop: this.props.borderTop && '1px solid #e5e5e5',
      listStyleType: 'none',
      clear: 'both',
      zoom: 1
    },
    before: {
      content: '',
      display: 'table',
    },
    after: {
      content: '',
      display: 'table',
      clear: 'both'
    },
    right: {
      float: 'right',
      width: '50%',
      textAlign: 'center'
    }
  }

  constructor(props) {
    super(props);
  }

  render() {
    const { name, loaded, total, status } = this.props;

    const state = status === 'loading' ? this.renderProgress(loaded, total) : status === 'success' ? this.renderSuccess(total) : this.renderError();

    const adjustedName = name.length > 25 ? name.slice(0, 23) + '...' : name;

    return (
      <li style={this.style.item}>
        <div style={this.style.before} />
        <span style={this.style.name}>{adjustedName}</span>
        {' '}
        {state}
        <div style={this.style.after} />
      </li>
    );
  }

  renderProgress(loaded, total) {

    const l = intToByte(loaded);
    const t = intToByte(total);
    const completed = (loaded / total) * 100;

    return (
      <div style={this.style.right}>
        <ProgressBar completed={completed} />
        <span>{l} / {t}</span>
      </div>
    )
  }

  renderSuccess(total) {

    const t = intToByte(total);

    return (
      <div style={this.style.right}>
        <span>{t}</span> Uploaded
      </div>
    )
  }

  renderError(loaded, total) {

    const l = intToByte(loaded);
    const t = intToByte(total);

    return (
      <div style={this.style.right}>
        <span>{l} / {t}</span> Error
      </div>
    )
  }
}

export default Radium(UploadItem);
