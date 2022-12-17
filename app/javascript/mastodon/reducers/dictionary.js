import { DICTIONARY_LOOKUP_SUCCESS } from "../actions/dictionary";
import { fromJS as ConvertToImmutable } from "immutable";
import  { List as ImmutableList } from 'immutable';

const initialState = ImmutableList([]);

export default function dictionary(state = initialState, action) {
  if (action.type === DICTIONARY_LOOKUP_SUCCESS) {
    state = ConvertToImmutable(action.entries);
  }
  return state;
}



