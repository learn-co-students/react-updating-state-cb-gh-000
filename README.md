# React Updating State

## Objectives
1. Explain how to update state in React
2. Describe what happens when state is updated
3. Explain the difference between changing state and changing props


## Updating state
![Unknown state](https://media.giphy.com/media/fFIaNdVhdvoOc/giphy.gif)

While a React component can have initial state, the real power is in updating its state — after all, if we didn't need
to update the state, the component shouldn't _have_ any state. State is only reserved for data that _changes_ in our
component and is visible in the UI.

Instead of directly modifying the state using `this.state`, we use `this.setState()`. This is a function available to
all React components, and allows us to let React know that the component state has changed. This way the components
knows it should re-render, because its state has changed and its UI will most likely also change. Using a setter
function like this is very performant. While other frameworks like Angular.js use "dirty checking" (continuously
checking for changes in an object) to see if a property has changed, React _already knows_ because we use a built-in
function to let it know what changes we'd like to make!

For example, let's say we have a component with a button, and a bit of text to indicate whether that button has been
pressed yet:

```js
class ClickityClick extends React.Component {
  constructor() {
    super();
    
    // Define the initial state:
    this.state = {
      hasBeenClicked: false,
    };
    
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick() {
    // Update our state here...
  }

  render() {
    return (
      <div>
        <p>I have {this.state.hasBeenClicked ? 'not' : null} been clicked yet!</p>
        <button onClick={this.handleClick}>Click me!</button>
      </div>
    );
  }
}
```

To update our state, we use `this.setState()` and pass in an object. This object will get merged with the current state.
When the state has been updated, our component re-renders automatically. Handy!

```js
handleClick() {
  this.setState({
    hasBeenClicked: true,
  });
}
```

## How state gets merged
When updating state, we don't have to pass in the entire state, just the property we want to update. For example,
consider the following state for our component:

```
{
  hasBeenClicked: false,
  currentTheme: 'blue',
}
```

If we updated the `hasBeenClicked` using `this.setState()` like we did above, it would _merge_ the new state with the
existing state, resulting in this new state:

```
{
  hasBeenClicked: true,
  currentTheme: 'blue',
}
```

One super important thing to note is that it only merges things on the first level. Let's say we're working on a
component that lets a user fill in an address, and the component's state is structured like this:

```
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
  address: {
    city: 'New York City',
  },
});
```

**However**, this would result in the following state shape:

```
{
  theme: 'blue',
  addressInfo: {
    city: 'New York City',
  },
}
```

See what happened there? It _merged_ the state, but any objects get overwritten, because it doesn't _deeply_ merge the
state with the object you pass into `this.setState()`. We can solve this using `Object.assign()` by merging the
`addressInfo` object with the new data ourselves:

```js
this.setState({
  addressInfo: Object.assign({}, this.state.addressInfo, {
    city: 'New York City',
  }),
});
```

**Or**, we could do this using the proposed object spread operator in the next version of JS:

```js
this.setState({
  addressInfo: {
    ...this.state.addressInfo,
    city: 'New York City',
  }),
});
```

Note that the object spread operator is not enabled by default in the Babel compilation of this lesson code, so we'll
have to stick with `Object.assign()`. Just be aware that there is another way to do this!

Both of these would result in the state updating to this shape:

```
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
One thing to keep in mind is that setting state is _not_ synchronous. For all intents and purposes, it might seem that
way, since our components update right away. State updates, however, are _batched_ internally and then executed
simultaneously whenever React feels it's appropriate. This might result in some unexpected behavior. Going back to our
`ClickityClick` component above, let's log the state after we've set it using `this.setState()`:

```js
handleClick() {
  this.setState({
    hasBeenClicked: true,
  });
  console.log(this.state.hasBeenClicked); // prints false
}
```

The console output says `false`... but we just set it to `true`! What is this madness?

State changes, however instant they might appear, happen _asynchronously_. If we want to access our new state after it
has been updated, we can optionally add a callback as a second argument to the `this.setState()` function. This callback
will fire once the state has been updated, ensuring that `this.state` is now the new, shiny updated state. In code:

```js
handleClick() {
  this.setState(
    { hasBeenClicked: true },
    function () {
      console.log(this.state.hasBeenClicked); // prints true
    }
  );
}
```

## State changes vs. prop changes
![Not the same thing!](http://4.bp.blogspot.com/-YpCHzw3WdTo/UzNBI3BzYKI/AAAAAAAAJoY/S34pUkXKhUU/s1600/aaa.png)

It's important to note the difference between changes in state and changes in props. Changes in state and/or props will
both trigger a re-render of our React component. However, changes in state can only happen _internally_ due to
components changing their own state. Changes in props can only happen _externally_, due to changes in prop values being
passed in.

## Resources
- [Transferring props](https://facebook.github.io/react/docs/transferring-props.html)
- [Component API](https://facebook.github.io/react/docs/component-api.html)
