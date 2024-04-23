import { postsGetTest } from './posts/getPosts.e2e-spec';
import { postsCreateTest } from './posts/createPost.e2e-spec';
import { usersGetTest } from './users/getUsers.e2e-spec';
import { usersCreateTest } from './users/createUser.e2e-spec';

// Run tests
postsGetTest();
postsCreateTest();
usersGetTest();
usersCreateTest();
