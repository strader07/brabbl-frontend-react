import React from 'react';
import UserLogin from './login';
import i18next from 'i18next';

let Header = (props) => {
  let { currentView, isVisible } = props;
  let headline;
  if (currentView === 'detail') {
    headline = i18next.t('DISCUSSION');
  } else if (props.discussion_list && props.discussion_list.name) {
    headline = props.discussion_list.name;
  } else {
    headline = i18next.t('All discussions');
  }

  if (!isVisible) {
    return <div />;
  } else {
    return (
      <div className="discussion-header">
        <h1>{ headline }</h1>
        <UserLogin {...props} />
      </div>
    );
  }
};

Header.propTypes = {
  isVisible: React.PropTypes.bool.isRequired,
  discussion: React.PropTypes.object,
  discussion_list: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
  currentView: React.PropTypes.string.isRequired,
  translators: React.PropTypes.object,
};

export default Header;
