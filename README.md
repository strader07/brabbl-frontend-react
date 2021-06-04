Development
-----------
Install the dependencies via `npm install`

Then start the `webpack-dev-sever` via

`npm start`

and navigate to

`http://localhost:3000/`

For testing the different components locally use:

* `/` for the DetailView
* `/create.html` for the Create Discussion-Button and corresponding Dialogue
* `/list.html` for the List View

NOTE: Make sure that a local API server is running (or adjust the config [`/src/js/config/...`]
so that the the staging server is used for development) and adjust the `articleId` and `customerId`
in each template so that they match an existing `Customer` and `Discussion` in the backend.

`customerId` is the `Embed token` which is specified on the detail page of a customer in the backend: `/admin/accounts/customer/<ID>/`
The `articleId` corresponds to to an `External id` of a discussion: `/admin/core/discussion/<ID>/`

Testing
-------

Run the tests via `npm run test`

Deployment
----------

Frontend and Backend are deployed separately.
The frontend deployment includes basically the following steps:
* The frontend is compiled/build on the developer's machine (via `npm run build_ENVIRONMENT`)
* The build-folder (`dist/build/ENVIRONMENT`) is then copied to the target server. (Currently the widget should be copied to the backend server(API-Server/Django-Backend-Server) from where it then gets served to the clients. There is a corresponding entry in the [snippet](https://github.com/brabbl/brabbl-backend#snippet) that gets included on the customer's page.)
* Instead of manually copying the file there is a command (`npm run deploy_ENVIRONMENT`), which first builds the frontend and then copies the file to the desired machine (the correct path needs to be set in `package.json`)

NOTE:

There are two important variables that determine the way the widget is served:

`NODE_ENV`: NODE_ENV is important for dropping the dev tools and minifying React and the widget (https://facebook.github.io/react/downloads.html#npm)

`APP_ENV`: APP_ENV is important for providing the widget with the [correct settings per environment](https://github.com/brabbl/brabbl-frontend/blob/master/src/js/config/index.js):

Both settings are used for configuration in [package.json](https://github.com/brabbl/brabbl-frontend/blob/master/package.json#L12) and the [webpack config](https://github.com/brabbl/brabbl-frontend/blob/master/webpack.production.config.js#L15).
