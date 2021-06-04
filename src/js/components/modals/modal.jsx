import React from 'react';
import Modal from 'react-modal';
import ModalSelector from './modal-selector';
import { hideModal } from '../../actions/app';
import { bootstrapApp } from '../../actions/async';
import { MODAL_DATAPOLICY } from '../../constants';
import API from '../../api';


const ModalContent = React.createClass({
  propTypes: {
    discussion: React.PropTypes.object,
    discussion_list: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
    app: React.PropTypes.object.isRequired,
    modal: React.PropTypes.object.isRequired,
    user: React.PropTypes.object,
    customer: React.PropTypes.object,
    statementId: React.PropTypes.number,
  },

  closeModal: function closeModal() {
    let { dispatch, modal } = this.props;
    dispatch(hideModal());
    if (modal.modal === MODAL_DATAPOLICY) {
      API.logout();
      dispatch(bootstrapApp());
    }
  },

  render() {
    let { modal, statementId, user, discussion, discussion_list, customer, dispatch } = this.props;
    return (
      <Modal
        isOpen={!modal.hidden}
        onRequestClose={this.closeModal}
        closeTimeoutMS={200}
        style={{
          content: {
            top: '10%',
            bottom: '10%',
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)',
            height: '100%',
          },
        }}
      >
        <span className="close-button" onClick={this.closeModal}>✕</span>
        <div>
          <ModalSelector
            modal={modal}
            user={user}
            customer={customer}
            statementId={statementId}
            discussion={discussion || modal.data.discussion}
            discussion_list={discussion_list}
            dispatch={dispatch}
          />
        </div>
      </Modal>
    );
  },
});

export default ModalContent;
