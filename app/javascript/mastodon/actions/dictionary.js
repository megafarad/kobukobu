import api from '../api';
import { openModal } from './modal';

export const DICTIONARY_LOOKUP_REQUEST = 'DICTIONARY_LOOKUP_REQUEST';
export const DICTIONARY_LOOKUP_SUCCESS = 'DICTIONARY_LOOKUP_SUCCESS';
export const DICTIONARY_LOOKUP_FAIL ='DICTIONARY_LOOKUP_FAIL';

export const dictionaryLookup = query  => (dispatch, getState) => {
  dispatch(dictionaryLookupRequest(query));

  api(getState).get(`/dictionary/${query}`).then(response => {
    dispatch(dictionaryLookupSuccess(query, response.data));
    dispatch(openModal('DICTIONARY'));
  }).catch(error => {
    dispatch(dictionaryLookupFail(query, error));
  });
};
export const dictionaryLookupRequest = query => ({
  type: DICTIONARY_LOOKUP_REQUEST,
  query,
});

export const dictionaryLookupSuccess = (query, entries) => ({
  type: DICTIONARY_LOOKUP_SUCCESS,
  query,
  entries,
});

export const dictionaryLookupFail = (query, error) => ({
  type: DICTIONARY_LOOKUP_FAIL,
  query,
  error,
});
