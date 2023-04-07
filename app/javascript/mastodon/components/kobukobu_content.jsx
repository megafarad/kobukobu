import React from 'react';
import { fit } from 'furigana';
import { toHiragana, isJapanese, isKatakana } from 'wanakana';
import { FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';

@injectIntl
class KobuKobuContent extends React.PureComponent {

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
          !isJapanese(word.get('word'), /[0-9]/) || /^[0-9]+$/.test(word.get('word')) ? word.get('word') :
            (<KobuKobuWord
              key={i} word={word} lang={kobukobu.get('language')} dictionaryLookup={dictionaryLookup}
            />),
        )}
      </p>);
    } else {
      return (<div><FormattedMessage id='kobukobu.unavailable' defaultMessage='KobuKobu Unavailable' /></div>);
    }
  }

}

class KobuKobuWord extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      highlighted: false,
    };

    this.toggleHighlight = this.toggleHighlight.bind(this);
  }
  static propTypes = {
    lang: PropTypes.string,
    word: ImmutablePropTypes.map,
    dictionaryLookup: PropTypes.func,
  };

  render() {
    const { lang, word, dictionaryLookup } = this.props;

    const onDictionaryLookup = (word) => (e) => {
      e.preventDefault();
      dictionaryLookup(word);
    };

    const wordLemma = !isKatakana(word.get('transcription')) ? word.get('word') : word.get('lemma');

    if (lang === 'ja' && (word.get('partOfSpeech') !== 'Symbol')) {
      const displayWord = (this.furigana() && !isKatakana(word.get('word'))) ?
        this.furigana().map((match, i) => match.w === match.r ? match.r : <ruby key={i}>{match.w}<rt>{match.r}</rt></ruby>) :
        word.get('word');
      return (<a
        onClick={onDictionaryLookup(word)} onMouseDown={this.toggleHighlight} onMouseUp={this.toggleHighlight}
        className={this.state.highlighted ? 'kobukobu__selected' : 'status-link unhandled-link'} href={'/dictionary/' + wordLemma}
        title={wordLemma}
      >{displayWord}</a>);
    } else {
      return (<span>{word.get('word')}</span>);
    }
  }

  furigana() {
    try {
      return fit(this.props.word.get('word'), toHiragana(this.props.word.get('transcription'), { passRomaji: true }), { type: 'object' });
    } catch (e) {
      return undefined;
    }

  }

  toggleHighlight = () => {
    this.setState({ highlighted: !this.state.highlighted });
  };

}

export default KobuKobuContent;
