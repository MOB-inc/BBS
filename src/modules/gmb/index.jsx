import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

const Posts = React.lazy(() => import('./posts'));
const Reviews = React.lazy(() => import('./reviews'));
const NewPost = React.lazy(() => import('./posts/new'));

function PostReply() {
  return (
    <Switch>
      <Route path="/gmb/posts/new" component={NewPost} />
      <Route path="/gmb/posts" component={Posts} />
      <Route path="/gmb/reviews" component={Reviews} />
      <Redirect from="/gmb" to="/gmb/reviews" />
    </Switch>
  );
}

export default PostReply;
