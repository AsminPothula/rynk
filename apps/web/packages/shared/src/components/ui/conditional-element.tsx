import React, { Children, ReactElement } from 'react';

interface ConditionalElementProps {
  children: ReactElement | string | (ReactElement | string)[];
}

/**
 * Function that conditionally renders elements based on props.
 * We can use this utility to render the element/string conditionally in JSX element,
 * by replacing the if else statement to render the JSX element.
 * We can use only ConditionalElement.When for single condition similar to if() or,
 * ConditionalElement.When & ConditionalElement.Else similar to if() & else() for multiple conditions or,
 * ConditionalElement.When & ConditionalElement.When & ConditionalElement.Else,
 * similar to if(), elseif() & else() for customized multiple conditions.
 * ConditionalElement.Else is optional.
 * @param {ConditionalElementProps} children - the children elements to be evaluated.
 * @return {ReactElement | string | null} the rendered element to display.
 */
const ConditionalElement = ({ children }: ConditionalElementProps) => {
  let when: ReactElement | string | null = null;
  let otherwise: ReactElement | string | null = null;

  Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const childElement = child as ReactElement;
      if (!(childElement.props.isTrue === undefined)) {
        if (!when && childElement.props.isTrue) {
          when = child;
        } else if (!childElement.props.isTrue) {
          otherwise = child;
        }
      } else {
        otherwise = child;
      }
    } else if (!otherwise && typeof child === 'string') {
      otherwise = child;
    }
  });

  return when || otherwise || null;
};

interface ConditionalElementWhenProps {
  isTrue: boolean;
  children: ReactElement | string;
}

/**
 * Render the children if `isTrue` is true.
 * @param props The component props.
 * @param props.isTrue A boolean indicating whether to render the children.
 * @param props.children The children React elements or strings.
 * @returns The rendered React element or string, or null.
 */
ConditionalElement.When = ({
  isTrue,
  children,
}: ConditionalElementWhenProps) => (isTrue ? children : null);

interface ConditionalElementElseProps {
  children: ReactElement | string;
}
/**
 * Render the children if `isTrue` is false. This component is optional.
 * @param props The component props.
 * @param props.children The children React elements.
 * @returns The rendered React element.
 */
ConditionalElement.Else = ({ children }: ConditionalElementElseProps) =>
  children;

export default ConditionalElement;
