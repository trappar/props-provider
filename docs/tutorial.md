# Tutorial

For this tutorial we'll be building an extensible component which takes a hex color code as a property and then turns that into individual decimal RGB values.

Let's start with what you should already be fairly familiar with:

```jsx
import React from 'react';

const DisplayColorValues = props => {
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

const DisplayColorValues = props => {
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

Great! We've got a slightly more interesting arbitrary example. But wait, what if we want to be able to display the colors using **both** methods? Put both sets of code into the component and control which way it renders using another prop? What if we want to add a third way to render the results? A fourth? Things quickly get out of hand. **We need to separate the computational aspects of the component from the presentational aspects of the component.** *But how?*
 
### Enter PropsProvider!

Code first, then explanation:

```jsx
import React from 'react';
import PropsProvider from 'props-provider';

const HexToRGB = props => {
  let bigint = parseInt(props.color, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return <PropsProvider r={r} g={g} b={b}>{props.children}</PropsProvider>
};
```

Now let's render this new component:

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

PropsProvider is passing all properties given to it on to all its children, which in this case is a function which renders a specific presentation of those props. If we want to change the presentational code, we can do so without touching the computation component:

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

We can also separate the presentational code into its own component:

```jsx
import React from 'react';

const DisplayRGBSquares = props => {
  const baseStyle = {display: 'inline-block', width: 50, height: 50, color: 'white'};
  const {r, g, b} = props;
  
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
  <DisplayRGBSquares/>
</HexToRGB>
```