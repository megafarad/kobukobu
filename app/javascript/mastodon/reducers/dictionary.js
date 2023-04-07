import { DICTIONARY_LOOKUP_SUCCESS } from '../actions/dictionary';
import { fromJS as ConvertToImmutable, List as ImmutableList, Map as ImmutableMap } from 'immutable';

const initialState = ImmutableMap({
  entries: ImmutableList([]),
  word: ImmutableMap([]),
});

export default function dictionary(state = initialState, action) {
  if (action.type === DICTIONARY_LOOKUP_SUCCESS) {
    state = ImmutableMap({
      entries: ConvertToImmutable(action.entries),
      word: ConvertToImmutable(action.word),
    });
  }
  return state;
}



