import React from 'react';
import ReactDOM from 'react-dom';


const DropDownItem = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
    onSelect: React.PropTypes.func,
    select: React.PropTypes.func,
  },

  handleClick() {
    this.props.onSelect();
    this.props.select(this);
  },

  render() {
    return (
      <li className="dropdown-item" onClick={this.handleClick}>{this.props.children}</li>
    );
  },
});


const DropDown = React.createClass({
  propTypes: {
    children: React.PropTypes.node.isRequired,
    default_children_index: React.PropTypes.number,
    fixedActiveItem: React.PropTypes.object,
    className: React.PropTypes.string,
  },

  getInitialState() {
    return {
      isOpen: false,
      activeItem: this.props.default_children_index ? this.props.children[this.props.default_children_index]
        : this.props.children[0] || this.props.children,
    };
  },

  componentWillMount() {
    document.addEventListener('click', this.onDocumentClick, false);
  },

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick, false);
  },

  onDocumentClick(e) {
    if (!ReactDOM.findDOMNode(this).contains(e.target)) {
      this.closeDropdown();
    }
  },

  select(item) {
    this.setState({ activeItem: item });
    this.closeDropdown();
  },

  toggleDropdown() {
    this.setState({ isOpen: !this.state.isOpen });
  },

  closeDropdown() {
    this.setState({ isOpen: false });
  },

  _addSelectHandler(el) {
    if (el) {
      return React.cloneElement(el, { select: this.select.bind(this, el) });
    }
  },

  render() {
    let { activeItem, isOpen } = this.state;
    let { children, className, fixedActiveItem } = this.props;
    let activeText;
    if (fixedActiveItem) {
      activeText = fixedActiveItem;
    } else {
      activeText = activeItem.props.children;
    }
    let dropdownChildren = React.Children.map(children, this._addSelectHandler);
    return (
      <div className={'dropdown-select ' + className}>
        <a className="dropdown-active" onClick={this.toggleDropdown}>
          {activeText} <i className="fa fa-sort-desc"></i>
        </a>
        <ul className={isOpen ? ' open' : ' closed'}>
          {dropdownChildren}
        </ul>
      </div>
    );
  },
});

export { DropDown, DropDownItem };
