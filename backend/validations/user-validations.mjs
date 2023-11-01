import * as validation from './validation.mjs';

export const userId = validation.validate(['params'], {
  userId: validation.objectId, // params
});

export const updateOwnUser = validation.validate(['body'], {
  firstname: { ...validation.name, optional: true }, // body
  lastname: { ...validation.name, optional: true }, // body
  email: { ...validation.email, optional: true }, // body
});
