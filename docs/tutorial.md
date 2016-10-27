# Tutorial

For this tutorial we'll be building a component which takes a hex color code as a property and then turns that into individual decimal RGB values.

Let's start with what you should already be fairly familiar with:

```jsx
import React from 'react';

const DisplayColorValues = (props) => {
  let bigint = parseInt(props.color, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return (
    <div>
      <div>Red: {r}</div>
      <div>Green: {g}</div>
      <div>Blue: {b}</div>
    </div>
  );
};
```

Then we can render it like:

```jsx
<DisplayColorValues color="fa3c9d"/>
```

And we get the following output:

```
Red: 250
Green: 60
Blue: 157
```

It does what we want in this specific scenario, but what if we wanted to have a slightly more visually interesting appearance? Ok let's change it:

```jsx
import React from 'react';

const DisplayColorValues = (props) => {
  let bigint = parseInt(props.color, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const baseStyle = {display: 'inline-block', width: 50, height: 50, color: 'white'};
  
  return (
    <div>
      <div style={{...baseStyle, backgroundColor: `rgb(${r}, 0, 0)`}}>{r}</div>
      <div style={{...baseStyle, backgroundColor: `rgb(0, ${g}, 0)`}}>{g}</div>
      <div style={{...baseStyle, backgroundColor: `rgb(0, 0, ${b})`}}>{b}</div>
    </div>
  );
};
```

Now we get the following:

<img width="172" src="https://cloud.githubusercontent.com/assets/525726/19749957/2fd93988-9ba2-11e6-8481-eef46c20a183.png">

Great! Our component is looking... well... like an example. But wait, what if we want to be able to display the colors using **both** methods?

There of course many ways to accomplish this goal. We can:

Create two separate components and have them share a function for converting the hex color to RGB.

or...

Put both sets of code into the component and control which way it renders using another prop.
 
But what if we want to add a third way to render the results? Things quickly get out of hand. With the separate components approach now we have three components which share a certain amount of boilerplate. It would be easy to mistakenly update one of these but not another and introduce a bug. Alternatively, with controlling which rendering method is used inside a single component we don't have that problem. Instead that component will progressively become more difficult to work on as specific implementation details pile up inside it.

**We need to separate the computational aspects of the component from the presentational aspects of the component.** *But how?*
 
### Enter PropsProvider!

Here we have extracted just the computational aspects of the component, but what's with the return value?

```jsx
import React from 'react';
import PropsProvider from 'props-provider';

const HexToRGB = (props) => {
  let bigint = parseInt(props.color, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return <PropsProvider r={r} g={g} b={b}>{props.children}</PropsProvider>
};
```

`PropsProvider` enables us to have the values computed in the `HexToRGB` component blindly passed off to `HexToRGB`'s children. We don't need to know how they will be used when writing `HexToRGB` - that detail is left up to the specific use case:

```jsx
<HexToRGB color="fa3c9d">
  {({r, g, b}) => (
    <div>
      <div>Red: {r}</div>
      <div>Green: {g}</div>
      <div>Blue: {b}</div>
    </div>
  )}
</HexToRGB>
```

### What's going on?

PropsProvider is passing all props given to it on to all its children, which in this case is a function which renders a specific presentation of those props. If we want to change the presentational code, we can do so without touching the computation component:

```jsx
<HexToRGB color="fa3c9d">
  {({r, g, b}) => {
    const baseStyle = {display: 'inline-block', width: 50, height: 50, color: 'white'};
    
    return (
      <div>
        <div style={{...baseStyle, backgroundColor: `rgb(${r}, 0, 0)`}}>{r}</div>
        <div style={{...baseStyle, backgroundColor: `rgb(0, ${g}, 0)`}}>{g}</div>
        <div style={{...baseStyle, backgroundColor: `rgb(0, 0, ${b})`}}>{b}</div>
      </div>
    );
  }}
</HexToRGB>
```

`PropsProvider` also allows us to separate the presentational code into its own component:

```jsx
import React from 'react';

const RGBSquares = (props) => {
  const {r, g, b} = props;
  const baseStyle = {display: 'inline-block', width: 50, height: 50, color: 'white'};
  
  return (
    <div>
      <div style={{...baseStyle, backgroundColor: `rgb(${r}, 0, 0)`}}>{r}</div>
      <div style={{...baseStyle, backgroundColor: `rgb(0, ${g}, 0)`}}>{g}</div>
      <div style={{...baseStyle, backgroundColor: `rgb(0, 0, ${b})`}}>{b}</div>
    </div>
  );
};
```

And now rendering becomes a simple composition of the computation component and the presentation component:

```jsx
<HexToRGB color="fa3c9d">
  <RGBSquares/>
</HexToRGB>
```

We now have two components:

* `HexToRGB` - Accepts a hex color and converts it into individual RGB values
* `RGBSquares` - Displays RGB values inside squares

Either of these components can be used in different contexts. `RGBSquares` can even be used totally independently of `HexToRGB`!