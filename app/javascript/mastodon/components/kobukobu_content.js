import React from 'react';
import { fit } from 'furigana';
import { toHiragana, isJapanese, isKana, isKatakana } from 'wanakana';
import { FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

@injectIntl
class KobuKobuContent extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      chosenWord: undefined,
    };
  }
  static propTypes = {
    kobukobu: ImmutablePropTypes.map,
    dictionaryLookup: PropTypes.func,
    intl: PropTypes.object,
  };

  render() {

    const { kobukobu, dictionaryLookup } = this.props;

    if (kobukobu.get('language') === 'ja') {
      return(<p>
        {kobukobu.get('words').map((word, i) =>
          !isJapanese(word.get('word')) || !isKana(word.get('transcription')) ? word.get('word') :
            (<KobuKobuWord key={i} word={word} lang={kobukobu.get('language')} dictionaryLookup={dictionaryLookup} active={i === this.state.chosenWord} />),
        )}
      </p>);
    } else {
      return (<div><FormattedMessage /></div>);
    }
  };

}

class KobuKobuWord extends React.PureComponent {

  static propTypes = {
    lang: PropTypes.string,
    word: ImmutablePropTypes.map,
    dictionaryLookup: PropTypes.func,
    active: PropTypes.bool,
  };


  render() {
    const { lang, word, dictionaryLookup } = this.props;

    const onDictionaryLookup = (word) => () => {
      dictionaryLookup(word);
    };

    if (lang === 'ja') {
      if (this.furigana() && !isKatakana(this.props.word.get('word'))){
        return (<span onClick={onDictionaryLookup(this.props.word)}>{
          this.furigana().map((match) => match.w === match.r ? match.r : <ruby key={match.w}>{match.w}<rt>{match.r}</rt></ruby>)
        }</span>);
      } else {
        return (<span onClick={onDictionaryLookup(this.props.word)}>{word.get('word')}</span>);
      }
    } else {
      return (<span>{word.get('word')}</span>);
    }
  }

  furigana() {
    return fit(this.props.word.get('word'), toHiragana(this.props.word.get('transcription'), { passRomaji: true }), { type: 'object' });
  }



}

export default KobuKobuContent;
