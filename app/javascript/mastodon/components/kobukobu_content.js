import React from 'react';
import { fit } from 'furigana';
import { toHiragana, isJapanese, isKana, isKatakana } from 'wanakana';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

class KobuKobuContent extends React.PureComponent {

  static propTypes = {
    kobukobu: ImmutablePropTypes.map,
    userLanguage: PropTypes.string,
    dictionaryLookup: PropTypes.func,
  };

  render() {

    const { kobukobu, dictionaryLookup } = this.props;

    const kobukobuJS = kobukobu.toJS();

    if (kobukobuJS.language === 'ja') {
      return(<p>
        {kobukobuJS.words.map((word, i) =>
            !isJapanese(word.word) || !isKana(word.transcription) ? word.word :
            <KobuKobuWord key={word.word + i} word={word} lang={kobukobuJS.language} dictionaryLookup={dictionaryLookup} />,
          )}
      </p>);
    } else {
      return (<div>KobuKobu Unavailable</div>);
    }
  };

}

class KobuKobuWord extends React.PureComponent {

  static propTypes = {
    lang: PropTypes.string,
    word: PropTypes.object,
    dictionaryLookup: PropTypes.func,
  };


  render() {
    const { lang, word, dictionaryLookup } = this.props;

    const onDictionaryLookup = (word) => () => {
      dictionaryLookup(word);
    };

    if (lang === 'ja') {
      if (this.furigana() && !isKatakana(this.props.word.word)){
        return (<span onClick={onDictionaryLookup(this.props.word)}>{
          this.furigana().map((match) => match.w === match.r ? match.r : <ruby key={match.w}>{match.w}<rt>{match.r}</rt></ruby>)
        }</span>);
      } else {
        return (<span onClick={onDictionaryLookup(this.props.word)}>{word.word}</span>);
      }
    } else {
      return (<span>{word.word}</span>);
    }


  }

  furigana() {
    return fit(this.props.word.word, toHiragana(this.props.word.transcription, { passRomaji: true }), { type: 'object' });
  }



}

export default KobuKobuContent;
