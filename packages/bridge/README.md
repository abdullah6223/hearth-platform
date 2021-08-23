# `@open-hearth/bridge`
> A library that allows the client of your mini-application to communicate with the main user's hearth client on different devices, using a common bridge API


## Table of contents
[Installation](#installation)\
[Usage](#usage)\
[API Reference](#api-reference)

## Installation
To install package simply run the following command if you're using npm as your package manager:
```bash
npm i @open-hearth/bridge
```
or it's yarn alternative
```bash
yarn add @open-hearth/bridge
```

## Usage
You can access and use the bridge as follows:
```typescript
import bridge from '@open-hearth/bridge'

// Send event
bridge.send('<event-name>')

// Send event with args
bridge.send('<event-name>', { someArg: 'some value' })

// Send event and process response
bridge.send('<event-name>', { someArg: 'some value' })
    .then((response) => {
        // successful state processing
    }).catch((error) => {
        // error processing        
    })
```
You can also use the bridge in the browser environment:
```html
<script src="https://unpkg.com/@open-hearth/bridge/dist/browser.min.js"></script>
<script>
    hearthBridge.send('<event-name>')
</script>
```

## API Reference
### `bridge.send(method[, params])`

Sends a message to main client and returns the `Promise` object with response data

**Parameters**

- `method` _required_ The method of Hearth Bridge
- `params` _optional_ Object containing method args. Make sure you are not sending sensitive data!

**Example**

```typescript
// Sending event to client
bridge
  .send('HearthWebAppResizeWindow', { height: 800 })
  .then(data => {
    // Handling response
    console.log(data.height)
  })
  .catch(error => {
    // Handling an error
  });
```

Since `bridge.send` returns a Promise you can use `async / await` flow for handling events:

```typescript

try {
    const response = await bridge.send('HearthWebAppResizeWindow', { height: 800 })
    // Handling response
    console.log(response.height)
} catch (err) {
    // Handling error
}
```

### `bridge.subscribe(listener)`

Subscribes listener to all incoming events and responses.

**Parameters**

- `listener` _required_ Function handling events

**Example**

```typescript
// Subscribing to receive events
bridge.subscribe((event) => {
    const { type, data } = event
    if (type === 'HearthWebAppResizeWindowResult') {
        // Processing event result
        console.log(data.height)
    } else if (type === 'HearthWebAppResizeWindowError') {
        // Processing event error
        const { errorType, errorMessage } = data
    }
})
```

### `bridge.unsubscribe(listener)`

Unsubscribes a function from event listening

**Parameters**

- `listener` _required_ Function handling events

**Example**

```typescript
import bridge from "@open-hearth/bridge";

const myListener = (event) => {
    logger.info(event)
}

// Subscribing
bridge.subscribe(myListener)

// Unsubscribing
bridge.unsubscribe(myListener)
```

### `bridge.supports(method)`

Checks if the main client (runtime environment) supports this method

**Parameters**

- `method` _required_ The method of Hearth Bridge

**Example**

```typescript
// Checking if event is available
if (bridge.supports('HearthWebAppResizeWindow')) {
    // Then sending actual event
    bridge.send('HearthWebAppResizeWindow', { height: document.body.scrollHeight })
}
```
