import ReactIconOn from '../../../assets/icons/examples/react-option2-on.svg?react';
import ReactIconOff from '../../../assets/icons/examples/react-option2-off.svg?react';
import { type CustomSVGIconType } from '../../../type';

const ReactIconOption2: CustomSVGIconType = ({ variant, className }) => {
  return variant === 'on' ? (
    <ReactIconOn className={className} />
  ) : (
    <ReactIconOff className={className} />
  );
};

export default ReactIconOption2;
