import { type CustomSVGIconType } from '../../../type';
import ReactIconSingle from '../../../assets/icons/examples/react-option1-single.svg?react';

const ReactIconOption1: CustomSVGIconType = ({ variant, className }) => {
  return (
    <ReactIconSingle
      className={className}
      fill={variant === 'on' ? '#ff00FF' : '#00D8FF'}
    />
  );
};

export default ReactIconOption1;
