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

function validate(element) {
  let error = null;
  if (element) {
    if (Array.isArray(element)) {
      element.forEach((subElement) => {
        if (!error) { // Short circuit the forEach if we have found an error
          const result = validate(subElement);
          if (result) {
            error = result;
          }
        }
      });
    } else if (!React.isValidElement(element) && typeof element !== 'function') {
      error = new Error(
        'Children passed to PropProvider must be a React element, function, or a nested array ' +
        `containing exclusively those elements. "${typeof element}" given.`
      );
    }
  }
  return error;
}

export default function PropsProvider(props) {
  return render(props.children, props);
}

PropsProvider.propTypes = {
  children: ({ children }) => validate(children),
};
