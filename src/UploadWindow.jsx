import React, { Component, PropTypes } from 'react';
import Radium from 'radium';

import UploadItem from './UploadItem';

function scrollBottom(element) {
  if (typeof window !== 'undefined') {
    var scrollArea = document.getElementById(element);
    if (scrollArea) scrollArea.scrollTop = scrollArea.scrollHeight;
  }
}

class UploadWindow extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      loaded: PropTypes.number.isRequired,
      total: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired
    })),
    background: PropTypes.string,
    fontFamily: PropTypes.string
  }

  style = {
    window: {
      fontFamily: this.props.fontFamily || 'Roboto,sans-serif',
      position: 'fixed',
      fontSize: 13,
      bottom: 0,
      right: this.props.right || 65,
      width: this.props.width || '30%',
      minWidth: '200px'
    },
    header: {
      backgroundColor: this.props.background || '#2b2b2b',
      padding: '5px 3px 5px 10px',
      color: this.props.color || '#fff',
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2
    },
    list: {
      borderLeft: '1px solid #e5e5e5',
      borderRight: '1px solid #e5e5e5',
      padding: 0,
      margin: 0,
      listStyleType: 'none'
    },
    button: {
      margin: '-3px 0',
      background: 'inherit',
      border: '1px solid #2b2b2b',
      color: '#fff',
      borderRadius: '1px',
      height: '22px',
      width: '22px',
      textAlign: 'center',
      padding: 1,
      float: 'right',
      ':hover': {
        border: '1px solid #fff'
      },
      ':focus': {
        outline: 'none'
      }
    }
  }

  constructor(props) {
    super(props);

    this.renderMax = this.renderMax.bind(this);
    this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this);

    this.state = {
      maximize: true,
      cancel: false
    }
  }

  componentDidMount() {
    if (this.props.items.length) scrollBottom('upload-list');
  }

  componentWillReceiveProps(nextProps) {
    // We want to make sure window is showing when new files get uploaded. Since component improperly receives next props (weird error, let me tell you), we have to work around to check for when new files come through. When a new file is sent, the current loading files all have the same loaded amount because the prop update freezes (or something, I really should look further into this). So we check for when all the loading files have the same total loaded amount as before.

    const thisSum = this.props.items.filter((item) => item.status === 'loading').reduce((totalLoaded, item) => totalLoaded + item.loaded, 0);
    const nextSum = nextProps.items.filter((item) => item.status === 'loading').reduce((totalLoaded, item) => totalLoaded + item.loaded, 0);
    if ((thisSum === nextSum)) {
      console.log('new file!');
      if (this.state.cancel) this.setState({ cancel: false });
      if (!this.state.maximize) this.setState({ maximize: true });
      scrollBottom('upload-list');
    }
  }

  toggleMax() {
    this.setState({
      maximize: !this.state.maximize
    })
  }

  setCancel() {
    this.setState({
      cancel: true
    })
  }

  render() {

    if (this.state.cancel) return null;

    if (!this.props.items.length) return null;

    const max = this.state.maximize ? this.renderMax() : '';

    return (
      <section style={this.style.window}>
        <header style={this.style.header}>
          Uploads processing<button key='one' onClick={::this.setCancel} style={this.style.button}>&#10005;</button><button key='two' onClick={::this.toggleMax} style={this.style.button}>&#65343;</button>
        </header>
        {max}
      </section>
    );
  }

  renderMax() {

    const { items }  = this.props;


    const uploadItems = items.map((item, i) => <UploadItem key={item.key + '500'} borderTop={(i > 0)} {...item} />);

    // height = 53px for each upload item ('loading' and 39px for 'success'), 1px for each line
    const height = items.map((item) => {
      if (item.status === 'success') return 38;
      else return 54;
    }).reduce((total, cur) => total + cur) - 1;

    this.style.list.height = height;

    if (height > 269) {
      this.style.list.height = 269;
      this.style.list.overflowY = 'scroll';
    }

    return (
      <ul style={this.style.list} id='upload-list'>
        {uploadItems}
      </ul>
    )
  }
}

export default Radium(UploadWindow);
