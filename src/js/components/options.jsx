import React from 'react';
import ReactDOM from 'react-dom';


const OptionsList = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
  },

  getInitialState() {
    return {
      optionsVisible: false,
    };
  },

  componentWillMount() {
    document.addEventListener('click', this.onDocumentClick, false);
  },

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick, false);
  },

  onDocumentClick(e) {
    if (ReactDOM.findDOMNode(this).contains(e.target)) {
      this.toggleOptions();
    } else {
      this.hideOptions();
    }
  },

  toggleOptions() {
    this.setState({ optionsVisible: !this.state.optionsVisible });
  },

  hideOptions() {
    this.setState({ optionsVisible: false });
  },

  render() {
    let style = {
      display: this.state.optionsVisible ? 'block' : 'none',
    };
    return (
      <div className="argument-options">
        <span className="argument-options-toggle">
          <i className="fa fa-ellipsis-v"></i>
        </span>
        <ul className="argument-options-list" style={style}>
          {this.props.children}
        </ul>
      </div>
    );
  },
});


const Option = React.createClass({
  propTypes: {
    icon: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired,
    onClick: React.PropTypes.func,
  },

  render() {
    let cssClass = 'fa fa-' + this.props.icon;
    return (
      <li className="argument-option" onClick={this.props.onClick}>
        <i className={cssClass}></i>
        {this.props.children}
      </li>
    );
  },
});

export { OptionsList, Option };
