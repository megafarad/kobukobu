import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { fit } from 'furigana';
import { connect } from 'react-redux';
import Button from '../../../components/button';

const makeMapStateToProps = () => {
  return (state) => ({
    dictionaryEntries: state.get('dictionary').entries,
    word: state.get('dictionary').word,
  });
};
export default @connect(makeMapStateToProps)
@injectIntl
class DictionaryModal extends React.PureComponent {

  static propTypes = {
    dictionaryEntries: ImmutablePropTypes.list,
    word: ImmutablePropTypes.map,
    onClose: PropTypes.func,
    intl: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentEntry: 0,
    };
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }

  render() {
    const { dictionaryEntries } = this.props;
    const dictionaryEntry = dictionaryEntries.toJS()[this.state.currentEntry];

    return (
      <div className='modal-root__modal dictionary-modal'>
        <div className='dictionary-modal__container'>
          {(dictionaryEntry) ? <React.Fragment>{this.furigana(dictionaryEntry.k_ele, dictionaryEntry.r_ele)}
            <div className='dictionary-modal__gloss'>
              <ol className='dictionary-modal__ol'>
                {dictionaryEntry.sense.flatMap((sense, i) => sense.gloss.map((gloss, j) => <li key={i * 10 + j}>{gloss.content}</li>))}
              </ol>
            </div></React.Fragment> : <div className='dictionary-modal__none_found'>
              <FormattedMessage id='dictionary_modal.none_found' defaultMessage='No entries found for {word}' values={{ word: this.props.word.get('word') }} />
            </div>}
        </div>
        <div className='dictionary-modal__action-bar'>
          <Button onClick={this.handlePrev} disabled={this.state.currentEntry === 0 || this.props.dictionaryEntries.size === 0}>
            <FormattedMessage id='dictionary_modal.previous' defaultMessage='Previous' />
          </Button>
          <Button onClick={this.handleNext} disabled={this.state.currentEntry === this.props.dictionaryEntries.size - 1 || this.props.dictionaryEntries.size === 0}>
            <FormattedMessage id='dictionary_modal.next' defaultMessage='Next' />
          </Button>
          <Button onClick={this.handleClose} className='dictionary-modal__close-button'>
            <FormattedMessage id='dictionary_modal.close' defaultMessage='Close' />
          </Button>
        </div>
      </div>
    );
  }
  handleNext = () => {
    this.setState({ currentEntry: this.state.currentEntry + 1 });
  };

  handlePrev = () => {
    this.setState({ currentEntry: this.state.currentEntry - 1 });
  };

  handleClose = () => {
    this.props.onClose();
  };
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
