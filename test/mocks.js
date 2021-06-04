export const initialState = {
  app: {
    view: 'list',
    articleId: '123',
    loading: true,
    isDiscussed: false,
  },
  discussions: [],
  discussion: null,
  user: null,
  customer: {},
  modal: {
    hidden: true,
  },
  notification: {
    message: '',
  },
};

export const staffUser = {
  username: 'staff-user',
  permissions: ['add_discussion', 'change_discussion', 'add_discussionlist', 'change_discussionlist'],
};

export const discussions = [
  {
    'external_id': '2flcu5fjemi',
    'url': 'http://127.0.0.1:3000/artikel1',
    'created_by': 'andreas',
    'created_at': '2016-02-27T18:47:16.073982Z',
    'image_url': '',
    'last_activity': '2016-02-27T19:03:46.755Z',
    'tags': [],
    'multiple_statements_allowed': false,
    'statement': 'Ich bin ein Test-Statement',
    'has_barometer': false,
    'has_arguments': true,
    'barometer_wording': 2,
    'user_can_add_replies': false,
    'argument_count': 0,
    'statement_count': 0,
    'is_editable': false,
    'is_deletable': false,
  },
  {
    'external_id': 'w1xpjhv9529',
    'url': 'http://127.0.0.1:3000/artikel2',
    'created_by': 'andreas',
    'created_at': '2016-02-28T12:00:43.271376Z',
    'image_url': '',
    'last_activity': '2016-02-28T12:07:59.394Z',
    'tags': [],
    'multiple_statements_allowed': true,
    'statement': 'Ich bin eine Umfrage',
    'has_barometer': true,
    'has_arguments': true,
    'barometer_wording': 2,
    'user_can_add_replies': false,
    'argument_count': 1,
    'statement_count': 4,
    'is_editable': false,
    'is_deletable': false,
  },
];
