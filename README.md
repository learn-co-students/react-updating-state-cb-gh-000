# React Updating State

## Overview

In this lesson, we'll discuss updating state in React. 

## Objectives

1. Update state in React by using `this.setState()` and passing in an object
2. Describe what happens when state is updated
3. Explain the difference between changing state and changing props


## Updatingi state
![Unknown state](https://media.giphy.com/media/fFIaNdVhdvoOc/giphy.gif)

While a React component can have initial state, the real power is in updating its state — after all, if we didn't need to update the state, the component shouldn't _have_ any state. State is only reserved for data that _changes_ in our component and is visible in the UI.

Instead of directly modifying the state using `this.state`, we use `this.setState()`. This is a function available to all React components, and allows us to let React know that the component state has changed. This way the components knows it should re-render, because its state has changed and its UI will most likely also change. Using a setter function like this is very performant. While other frameworks like Angular.js use "dirty checking" (continuously checking for changes in an object) to see if a property has changed, React _already knows_ because we use a built-in function to let it know what changes we'd like to make!

Please feel free to follow along with the lesson using the src folder in this project's code. To run the code, make sure to `npm install & npm start` in the terminal.

For example, let's say we have a component with a button, and a bit of text to indicate whether that button has been pressed yet:

```js
// src/components/ClickityClick.js
import React from 'react';

class ClickityClick extends React.Component {
  constructor() {
    super();
    
    // Define the initial state:
    this.state = {
      hasBeenClicked: false,
    };
  }
  
  handleClick = () => {
    // Update our state here...
  }

  render() {
    return (
      <div>
        <p>I have {this.state.hasBeenClicked ? null : 'not'} been clicked!</p>
        <button onClick={this.handleClick}>Click me!</button>
      </div>
    );
  }
}

export default ClickityClick;

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';

import ClickityClick from './components/ClickityClick';

ReactDOM.render(
  <ClickityClick />,
  document.getElementById('root')
);
```

To update our state, we use `this.setState()` and pass in an object. This object will get merged with the current state. When the state has been updated, our component re-renders automatically. Handy!

```js
// src/components/ClickityClick.js 
...

handleClick = () => {
  this.setState({
    hasBeenClicked: true
  })
}

...
```

## How state gets merged
When updating state, we don't have to pass in the entire state, just the property we want to update. For example, consider the following state for our component:

```js
{
  hasBeenClicked: false,
  currentTheme: 'blue',
}
```

If we updated the `hasBeenClicked` using `this.setState()` like we did above, it would _merge_ the new state with the existing state, resulting in this new state:

```js
{
  hasBeenClicked: true,
  currentTheme: 'blue',
}
```

One super important thing to note is that it only merges things on the first level. Let's say we're working on a component that lets a user fill in an address, and the component's state is structured like this:

```js
{
  theme: 'blue',
  addressInfo: {
    street: null,
    number: null,
    city: null,
    country: null
  },
}
```

If we wanted to update the `addressInfo.city` field, you might think we can update it like this:

```js
this.setState({
  addressInfo: {
    city: 'New York City',
  },
});
```

**However**, this would result in the following state shape:

```js
{
  theme: 'blue',
  addressInfo: {
    city: 'New York City',
  },
}
```

See what happened there? It _merged_ the state, but any objects get overwritten, because it doesn't _deeply_ merge the state with the object you pass into `this.setState()`. A deep merge means that the merge will happen recursively, leaving any unchanged properties intact. For example, consider the following code sample:

```js
const house = {
  kitchen: {
    cabinets: 'white',
    table: {
      legs: 4
    }
  }
};

// Note: `deepMerge()` isn't actually a built-in function
const updatedHouse = deepMerge(house, {
  kitchen: {
    table: {
      legs: 8
    }
  }
});
```

Deeply merging like this would only update the `legs` property with a value of `8`, but the rest of the `kitchen` and `house` objects' structure will remain intact.
 
 
 We can solve this using `Object.assign()` by merging the `addressInfo` object with the new data ourselves:

```js
this.setState({
  addressInfo: Object.assign({}, this.state.addressInfo, {
    city: 'New York City',
  }),
});
```

**Or**, we could do this using the proposed object spread operator in the next version of JS: **RECOMMENDED**

```js
this.setState({
  addressInfo: {
    ...this.state.addressInfo,
    city: 'New York City',
  },
});
```

Both of these would result in the state updating to this shape:

```js
{
  theme: 'blue',
  addressInfo: {
    street: null,
    number: null,
    city: 'New York City',
    country: null
  },
}
```

Perfect! Just what we needed.

## Setting state is not synchronous
One thing to keep in mind is that setting state is _not_ synchronous. For all intents and purposes, it might seem that way, since our components update right away. State updates, however, are _batched_ internally and then executed simultaneously whenever React feels it's appropriate. This might result in some unexpected behavior. Going back to our `ClickityClick` component above, let's log the state after we've set it using `this.setState()`:

```js
// src/components/ClickityClick.js 

...

handleClick = () => {
  this.setState({
    hasBeenClicked: true
  })
  console.log(this.state.hasBeenClicked); // prints false
}

...
```

The console output says `false`... but we just set it to `true`! What is this madness?

State changes, however instant they might appear, happen _asynchronously_. If we want to access our new state after it has been updated, we can optionally add a callback as a second argument to the `this.setState()` function. This callback will fire once the state has been updated, ensuring that `this.state` is now the new, shiny updated state. In code:

```js
// src/components/ClickityClick.js 

...

handleClick = () => {
  this.setState({
    hasBeenClicked: true
  }, () => console.log(this.state.hasBeenClicked)) // prints true
}

...
```

## State changes vs. prop changes
![Not the same thing!](http://4.bp.blogspot.com/-YpCHzw3WdTo/UzNBI3BzYKI/AAAAAAAAJoY/S34pUkXKhUU/s1600/aaa.png)

It's important to note the difference between changes in state and changes in props. Changes in state and/or props will both trigger a re-render of our React component. However, changes in state can only happen _internally_ due to components changing their own state. Changes in props can only happen _externally_, due to changes in prop values being passed in.

## Resources
- [Transferring props](https://facebook.github.io/react/docs/transferring-props.html)
- [Component API](https://facebook.github.io/react/docs/component-api.html)

<p class='util--hide'>View <a href='https://learn.co/lessons/react-updating-state'>Updating State</a> on Learn.co and start learning to code for free.</p>
