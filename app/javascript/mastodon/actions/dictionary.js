import api from '../api';
import { openModal } from './modal';

export const DICTIONARY_LOOKUP_REQUEST = 'DICTIONARY_LOOKUP_REQUEST';
export const DICTIONARY_LOOKUP_SUCCESS = 'DICTIONARY_LOOKUP_SUCCESS';
export const DICTIONARY_LOOKUP_FAIL = 'DICTIONARY_LOOKUP_FAIL';

export const dictionaryLookup = word => (dispatch, getState) => {
  dispatch(dictionaryLookupRequest(word));

  api(getState).get(`/dictionary/${word.get('lemma').replace('*', '')}`).then(response => {
    dispatch(dictionaryLookupSuccess(word, response.data));
    dispatch(openModal('DICTIONARY'));
  }).catch(error => {
    dispatch(dictionaryLookupFail(word, error));
  });
};
export const dictionaryLookupRequest = word => ({
  type: DICTIONARY_LOOKUP_REQUEST,
  word,
});

export const dictionaryLookupSuccess = (word, entries) => ({
  type: DICTIONARY_LOOKUP_SUCCESS,
  word,
  entries,
});

export const dictionaryLookupFail = (word, error) => ({
  type: DICTIONARY_LOOKUP_FAIL,
  word,
  error,
});
