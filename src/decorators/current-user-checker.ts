// write a current user checker decorator for routing conntroller
// this is a decorator that will give you the current user from the request

import { Action, createParamDecorator } from 'routing-controllers';

export const CurrenUserChecker = (action: Action) => {
  return action.request.user;
}
