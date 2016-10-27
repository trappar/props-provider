# Usage

The `PropsProvider` component is flexible and easy to use. Any props passed into `PropsProvider` will be recursively given to all of `PropsProvider`'s children. `PropsProvider`'s children can come in many forms:

## Table of Contents

* [Examples of Valid Children](#examples-of-valid-children)
  * [Functions](#functions)
  * [Components](#components)
  * [Multiple Components](#multiple-components)
  * [Arrays of Components](#arrays-of-components)
  * [Arrays of Functions](#arrays-of-functions)
* [Other Usage Information](#other-usage-information)
  * [Overriding PropsProvider Props](#overriding-propsprovider-props)
  * [Custom PropType Validation in Your Components](#custom-proptype-validation-in-your-components)

## Examples of Valid Children

### Functions

Use an inline function which accepts props from the `PropsProvider` as its first argument.

```jsx
<PropsProvider myProp="Hello!">
  {(props) => {
    return (
      <div>{props.myProp}</div>    
    }
  })
</PropsProvider>
```

### Components

Mount props to an existing component.

```jsx
<PropsProvider className="alert">
  <div>I'm an alert!</div>
</PropsProvider>
```

### Multiple Components

When multiple components are passed into `PropsProvider` they all get `PropsProvider`'s props.

```jsx
<PropsProvider className="alert">
  <div>I'm an alert!</div>
  <div>So am I!</div>
</PropsProvider>
```

### Arrays of Components

Works exactly the same as using multiple components. `PropsProvider` just passes its props to all elements in the resulting array.

**Important!** It is required to specify a key for each item in when using this method. Internally `PropsProvider` actually provides its own keys - overriding those that you specify here, but evidently there is a bug in React where it does not see that.

```jsx
<PropsProvider className="alert">
  {['I\'m an alert.','So am I!'].map((item, i) => {
    return <div key={i}>{item}</div>;
  })}
</PropsProvider>
```

### Arrays of Functions

Same idea as with arrays of components, but props are passed into the function instead of passing them directly to the components. 

```jsx
<PropsProvider greeting="Hello">
  {['Fred','Sarah'].map((name) => (props) => {
    return <div>{props.greeting} {name}</div>;
  })}
</PropsProvider>
```

## Other Usage Information

### Overriding PropsProvider Props

When the same prop is specified in both `PropsProvider` and one of its children the value from the child takes precedence.

```jsx
<PropsProvider style={{display: 'none'}}>
  <div style={{display: 'block'}}>I will be displayed</div>
  <div>I will not be displayed</div>
</PropsProvider>
```

### Custom PropType Validation in Your Components

When accepting a prop in your component that will be passed to `PropsProvider` it is recommended to use the `PropsProvider` custom PropType, which you will already have access to if you have imported `PropsProvider`

```jsx
MyComponent.propTypes = {
  children: PropsProvider.PropType
};
```