import React from 'react';
import { fit } from "furigana";
import { toHiragana, isJapanese, isKana, isKanji } from "wanakana";
import Linkify from "linkify-react";
import ImmutablePropTypes from "react-immutable-proptypes";

class KobuKobuContent extends React.PureComponent {

  static propTypes = {
    kobukobu: ImmutablePropTypes.map,
  }
  render() {

    const { kobukobu } = this.props;

    const kobukobuJS = kobukobu.toJS();

    return(<Linkify tagName='p' >
      {kobukobuJS.words.map((word, i) =>
        word.transcription === '*' || !isJapanese(word.word) || !isKana(word.transcription) ? word.word :
        fit(word.word, toHiragana(word.transcription, { passRomaji: true }), {type: 'object'}).map((match, j) => match.w === match.r ? match.r : <ruby>{match.w}<rt>{match.r}</rt></ruby>)
         )}
    </Linkify>)
  }

}

export default KobuKobuContent;
