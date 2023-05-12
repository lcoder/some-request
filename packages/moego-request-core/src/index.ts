import { MeogoRequest } from './moego-request';
import { AjaxError } from './adapters/xhr/errors';
import { AjaxResponse } from './adapters';

export type { MoegoPlugin } from './types/moego-plugin';

export type { ReqConfig } from './config-type';

export type { AjaxResponse };

export type { AjaxErrorCtor } from './adapters/xhr/errors';

export { Method } from './type';

export {
  MeogoRequest,
  AjaxError,
};
