import api from "../api";
import {response} from "express";
export const DICTIONARY_LOOKUP_REQUEST = 'DICTIONARY_LOOKUP_REQUEST';
export const DICTIONARY_LOOKUP_SUCCESS = 'DICTIONARY_LOOKUP_SUCCESS';
export const DICTIONARY_LOOKUP_FAIL ='DICTIONARY_LOOKUP_FAIL';

export const dictionaryLookup = query  => (dispatch, getState) => {
  dispatch(dictionaryLookupRequest(query));

  api(getState).get(`/dictionary/${query}`).then(response => {
    dispatch(dictionaryLookupSuccess(query, response.data));
  }).catch(error => {
    dispatch(dictionaryLookupFail(query, error));
  });
}
export const dictionaryLookupRequest = query => ({
  type: DICTIONARY_LOOKUP_REQUEST,
  query,
});

export const dictionaryLookupSuccess = (query, words) => ({
  type: DICTIONARY_LOOKUP_SUCCESS,
  query,
  words,
});

export const dictionaryLookupFail = (query, error) => ({
  type: DICTIONARY_LOOKUP_FAIL,
  query,
  error
});
