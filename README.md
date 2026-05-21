# MUI Notifications

Application notifications component using Material UI. Imperative APIs to show and interact with application notifications.

### Install

Make sure you have **@mui/material** in your project, then:

```js
npm install mui-notifications
```

### Usage

Install the NotificationsProvider.

```tsx
import { NotificationsProvider } from 'mui-notifications';

function App({ children }) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}
```

Now you can get access to the notifications APIs through the `useNotifications` hook.

```tsx
import { useNotifications } from 'mui-notifications';

function MyApp() {
  const { show, close } = useNotifications();
  // ...
}
```

### `useNotifications` API

`useNotifications()` returns an object with two methods:

```tsx
const { show, close } = useNotifications();
```

`show(message, options?)`

- `message: React.ReactNode`
  The notification content to display.
- `options?: ShowNotificationOptions`
  Additional configuration for the notification.
- Returns: `string`
  The notification key. You can store it and pass it to `close(key)` later.

Available `show` options:

- `key?: string`
  Custom unique key for the notification. If omitted, one is generated automatically.
- `severity?: 'info' | 'warning' | 'error' | 'success'`
  Renders the notification as a MUI `Alert` with the selected severity. If omitted, a default snackbar layout is used.
- `autoHideDuration?: number`
  Time in milliseconds before the notification closes automatically.
- `actionText?: React.ReactNode`
  Label for the action button shown when `onAction` is provided.
- `onAction?: () => void`
  Callback fired when the action button is clicked.

`close(key)`

- `key: string`
  Closes a notification by its key.

### Basic notification

You can notify your users with a neutral message by calling `show`. To have the notification automatically hide, add the `autoHideDuration` option. This expresses the time in milliseconds after which to close the notification.

```tsx
show('Consider yourself notified!', {
  autoHideDuration: 3000,
});
```

### Action example

```tsx
const key = show('Storage is reaching its project quota.', {
  severity: 'warning',
  actionText: 'Open settings',
  onAction: () => {
    console.log('Open settings');
  },
});

close(key);
```
