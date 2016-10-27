import React from 'react';

function render(element, props, keyStack = '') {
  if (!element) {
    return element;
  } else if (Array.isArray(element)) {
    return (
      <div key={keyStack}>
        {element.map((innerElement, index) =>
          render(innerElement, props, keyStack + index)
        )}
      </div>
    );
  } else if (React.isValidElement(element)) {
    return React.cloneElement(element, { ...props, ...element.props, key: keyStack });
  }

  return React.cloneElement(element(props), { key: keyStack });
}

function validate(element, propName, componentName, stack=false) {
  stack = stack || [propName];
  let error = null;
  if (element) {
    if (Array.isArray(element)) {
      element.forEach((subElement, i) => {
        if (!error) { // Short circuit the forEach if we have found an error
          const result = validate(subElement, propName, componentName, [...stack, `[${i}]`]);
          if (result) {
            error = result;
          }
        }
      });
    } else if (!React.isValidElement(element) && typeof element !== 'function') {
      error = new Error(
        `${propName} prop of ${componentName} must be a React element, function, or a nested array ` +
        `containing exclusively those elements. '${typeof element}' was found in '${stack.join('')}'.`
      );
    }
  }
  return error;
}

export default function PropsProvider(props) {
  return render(props.children, props);
}
PropsProvider.PropType = (props, propName, componentName) => validate(props[propName], propName, componentName);
PropsProvider.propTypes = {
  children: PropsProvider.PropType,
};
