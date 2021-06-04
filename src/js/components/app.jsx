import React from 'react';
import Cookie from 'tiny-cookie';
import { connect } from 'react-redux';
import Header from './header';
import DetailView from './detail-view';
import ListContainer from './list-view';
import UserMessage from './user-message';
import ModalContent from './modals/modal';
import { hideNotification, showModal } from '../actions/app';
import { bootstrapApp, getDiscussionList } from '../actions/async';
import { DiscussionButton } from './discussion';
import { MODAL_DATAPOLICY } from '../constants';
import i18next from 'i18next';


export const App = React.createClass({

  propTypes: {
    notification: React.PropTypes.object,
    user: React.PropTypes.object,
    app: React.PropTypes.object,
    customer: React.PropTypes.object,
    discussion_list: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
    translators: React.PropTypes.object,
  },

  componentDidMount() {
    // this.props.dispatch(loadTrans());
    // if (document.cookie.indexOf('brabbl-token') === -1) {}
    let { app, dispatch } = this.props;
    dispatch(bootstrapApp());
    if (app.view === 'list') {
      dispatch(getDiscussionList(window.location.href));
    }
  },

  componentWillReceiveProps(nextProps) {
    // make sure the open class for react-modal gets also added to the root html element
    let root = document.getElementsByTagName('html')[0];
    let modalOpenClass = 'ReactModal__Body--open';
    if (!nextProps.modal.hidden) {
      root.classList.add(modalOpenClass);
    } else {
      root.classList.remove(modalOpenClass);
    }
    let { user: oldUser } = this.props;
    let { user, dispatch } = nextProps;
    // show data privacy modal if user hasn't confirmed yet
    let userChanged = (
      user && !oldUser && !user.has_accepted_current_data_policy ||
      user && oldUser && user.id !== oldUser.id && !user.has_accepted_current_data_policy
    );
    if (userChanged) {
      dispatch(showModal(MODAL_DATAPOLICY));
    }
  },

  render() {
    let mainContent,
      branding,
      listLink;
    let { app, user, notification, dispatch, customer } = this.props;
    let isDetailView = app.view === 'detail';
    if (window.location.hash.indexOf('token') !== -1) {
      let params = window.location.hash.split('&');
      for (let i = 0; i < params.length; i++) {
        let pare = params[i].split('=');
        if (pare[0] === 'token' || pare[0] === '#token') {
          Cookie.set('brabbl-token', 'Token ' + pare[1]);
        }
      }
      window.location.hash = '#brabbl-widget';
    }

    if (app.loading) {
      return (
        <div className="spinner">
          <i className="fa fa-spinner fa-spin"></i>
        </div>
      );
    }

    if (isDetailView) {
      mainContent = (
        <DetailView
          articleId={app.articleId}
          argumentId={app.argumentId}
          statementId={app.statementId}
          {...this.props}
        />
    );
    } else {
      mainContent = (
        <ListContainer {...this.props} />
      );
    }

    if (!app.isDiscussed && isDetailView) {
      mainContent = (
        <div className="discussion-create-button">
          <DiscussionButton {...this.props} />
        </div>
      );
    } else {
      let link = '/discussion',
        title = i18next.t('All discussions');
      if (customer.default_back_link) {
        link = customer.default_back_link;
      }
      if (customer.default_back_title) {
        title = customer.default_back_title;
      }
      if (isDetailView) {
        listLink = (
          <p className="brabbl-list-link">
            <a href={ link }>
              { title } »
            </a>
          </p>
        );
      }
      branding = (
        <div className="footer-links">
          <p className="powered-by">
            { i18next.t('powered by') }
            <a href="http://www.brabbl.com"> brabbl</a>
          </p>
          {listLink}
        </div>
      );
    }
    return (
      <div key={user} className={isDetailView ? 'discussion-widget' : 'discussion-list-widget'}>
        <Header
          currentView={app.view}
          isVisible={app.isDiscussed || !isDetailView}
          {...this.props}
        />
        {
          notification.text &&
            <UserMessage
              hidden={notification.hidden}
              message={notification.text}
              closeHandler={() => dispatch(hideNotification())}
            />
        }
        {mainContent}
        {branding}
        <div className="clearfix"></div>
        <ModalContent
          statementId={app.statementId}
          {...this.props}
        />
      </div>
    );
  },
});


const mapStateToProps = (state) => ({
  modal: state.modal,
  notification: state.notification,
  discussion: state.discussion,
  discussion_list: state.discussion_list,
  app: state.app,
  user: state.user,
  customer: state.customer,
});

export default connect(mapStateToProps)(App);
