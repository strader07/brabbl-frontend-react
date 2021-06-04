/* eslint-env node, mocha */
import React from 'react';
import { shallow } from 'enzyme';
import { App } from '../src/js/components/app';
import { DiscussionButton } from '../src/js/components/discussion';
import { staffUser, initialState } from './mocks';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import i18next from 'i18next';

chai.use(chaiEnzyme());


describe('App-View', () => {
  initialState.app.view = 'detail';
  initialState.app.loading = true;
  it('renders the spinner if no discussion(s) could be fetched', () => {
    const wrapper = shallow(<App {...initialState} />);
    expect(wrapper.find('.spinner')).to.have.length(1);
  });
});

describe('App-View', () => {
  let state = { ...initialState };
  state.app = { view: 'list', loading: false };
  it('renders the list-view if requested', () => {
    const wrapper = shallow(<App {...state} />);
    expect(wrapper.hasClass('discussion-list-widget')).to.equal(true);
  });
});

describe('App-View', () => {
  let state = { ...initialState };
  state.app = { view: 'detail', loading: false, articleId: '123' };
  it('renders the detail-view if requested', () => {
    const wrapper = shallow(<App {...state} />);
    expect(wrapper.hasClass('discussion-widget')).to.equal(true);
  });
});


describe('App-View', () => {
  let state = { ...initialState };
  state.app = { view: 'detail', loading: false };
  it('renders the create button container if no discussion is given', () => {
    const wrapper = shallow(<App {...state} />);
    expect(wrapper.find('.discussion-create-button')).to.have.length(1);
  });
});

describe('DiscussionButton', () => {
  it('hides the create button if the user lacks permissions', () => {
    const wrapper = shallow(<DiscussionButton />);
    expect(wrapper.find('div')).to.not.have.html('<button />');
  });
});

describe('DicussionButton', () => {
  it('shows the create button if the user is staff or admin', () => {
    const wrapper = shallow(<DiscussionButton user={staffUser} />);
    expect(wrapper.find('button')).to.contain.text(i18next.t('Create discussion'));
  });
});
