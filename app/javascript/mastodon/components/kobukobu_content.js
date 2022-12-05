import React from 'react';
import { fit } from "furigana";
import { toHiragana, isJapanese, isKana, isKatakana } from "wanakana";
import ImmutablePropTypes from "react-immutable-proptypes";
import PropTypes from "prop-types";

class KobuKobuContent extends React.PureComponent {

  static propTypes = {
    kobukobu: ImmutablePropTypes.map,
    userLanguage: PropTypes.string,
  }
  render() {

    const { kobukobu } = this.props;

    const kobukobuJS = kobukobu.toJS();

    if (kobukobuJS.language === 'ja') {
      return(<p>
        {kobukobuJS.words.map((word, i) =>
          !isJapanese(word.word) || !isKana(word.transcription) || isKatakana(word.word) ? word.word : this.furigana(word) ?
            this.furigana(word).map((match, j) =>
              match.w === match.r ? match.r : <ruby>{match.w}<rt>{match.r}</rt></ruby>) : word.word
        )}
      </p>);
    } else {

      return (<div>TBD</div>);
    }
  }

  furigana(word) {
    return fit(word.word, toHiragana(word.transcription, { passRomaji: true }), {type: 'object'});
  }
}

export default KobuKobuContent;
