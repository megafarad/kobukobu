import React from 'react';
import { fit } from 'furigana';
import { toHiragana, isJapanese, isKana, isKatakana } from 'wanakana';
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
          !isJapanese(word.get('word')) || !isKana(word.get('transcription')) ? word.get('word') :
            (<KobuKobuWord
              key={i} wordNumber={i} word={word} lang={kobukobu.get('language')} dictionaryLookup={dictionaryLookup}
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

    if (lang === 'ja') {
      if (this.furigana() && !isKatakana(this.props.word.get('word'))){
        return (<a
          onClick={onDictionaryLookup(this.props.word)} onMouseDown={this.toggleHighlight} onMouseUp={this.toggleHighlight}
          className={this.state.highlighted ? 'kobukobu__selected' : ''}
        >{this.furigana().map((match) => match.w === match.r ? match.r : <ruby key={match.w}>{match.w}<rt>{match.r}</rt></ruby>)}</a>);
      } else {
        return (<a
          onClick={onDictionaryLookup(this.props.word)} onMouseDown={this.toggleHighlight} onMouseUp={this.toggleHighlight}
          className={this.state.highlighted ? 'kobukobu__selected' : ''}
        >{word.get('word')}</a>);
      }
    } else {
      return (<span>{word.get('word')}</span>);
    }
  }

  furigana() {
    return fit(this.props.word.get('word'), toHiragana(this.props.word.get('transcription'), { passRomaji: true }), { type: 'object' });
  }

  toggleHighlight = () => {
    this.setState({ highlighted: !this.state.highlighted });
  };

}

export default KobuKobuContent;
