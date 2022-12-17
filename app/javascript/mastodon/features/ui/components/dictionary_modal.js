import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { fit } from 'furigana';
import { connect } from 'react-redux';

const makeMapStateToProps = () => {
  return (state) => ({
    dictionaryEntries: state.get('dictionary'),
  });
};
export default @connect(makeMapStateToProps)
@injectIntl
class DictionaryModal extends React.PureComponent {

  static propTypes = {
    dictionaryEntries: ImmutablePropTypes.list,
    intl: PropTypes.object,
  };

  render() {
    const { dictionaryEntries } = this.props;
    const dictionaryEntriesJS = dictionaryEntries.toJS().slice(0, 10);

    return (
      <div className='modal-root__modal dictionary-modal'>
        <div className='dictionary-modal__container'>
          {dictionaryEntriesJS.map((entry) =>
            (<React.Fragment>
              {this.furigana(entry.k_ele, entry.r_ele)}
              <div className='dictionary-modal__gloss'>
                <ol className='dictionary-modal__ol'>
                  {entry.sense.flatMap((sense) => sense.gloss.map((gloss) => <li>{gloss.content}</li>))}
                </ol>
              </div>
            </React.Fragment>))}
        </div>
      </div>
    );
  }

  furigana(k_ele, r_ele) {
    try {
      if (k_ele) {
        return (<div className='dictionary-modal__word'>
          {fit(k_ele[0].keb, r_ele[0].reb, { type: 'object' }).map(
            (match) => match.w === match.r ? match.r : (<ruby key={match.w}>{match.w}<rt>{match.r}</rt></ruby>),
          )}
        </div>);
      } else {
        return (<div className='dictionary-modal__word'>{r_ele[0].reb}</div>);
      }
    } catch (exception) {
      console.error('FIT error: ', exception);
      return (<div className='dictionary-modal__word'>{r_ele[0].reb}</div>);
    }
  };

}
