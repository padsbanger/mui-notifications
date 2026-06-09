# MUI Notifications

Application notifications component using Material UI. Imperative APIs to show and interact with application notifications.

#[[Demo](http://michal-lach.pl/mui-notifications/)]

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
  const { show, close, closeAll } = useNotifications();
  // ...
}
```

Provider options:

- `maxSnack?: number`
  Maximum number of notifications shown at the same time. Defaults to `1`.
- `anchorOrigin?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' }`
  Where notifications are stacked. Defaults to MUI Snackbar's bottom-left placement.
- `defaultSeverity?: 'info' | 'warning' | 'error' | 'success'`
  Default severity for notifications that do not pass a `severity`.
- `defaultAutoHideDuration?: number | null`
  Default auto-hide duration for notifications that do not pass `autoHideDuration`.

```tsx
<NotificationsProvider
  maxSnack={3}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  defaultSeverity="info"
  defaultAutoHideDuration={4000}
>
  {children}
</NotificationsProvider>
```

### `useNotifications` API

`useNotifications()` returns an object with three methods:

```tsx
const { show, close, closeAll } = useNotifications();
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
- `autoHideDuration?: number | null`
  Time in milliseconds before the notification closes automatically. Use `null` for a persistent notification.
- `actionText?: React.ReactNode`
  Label for the action button shown when `onAction` is provided.
- `onAction?: () => void`
  Callback fired when the action button is clicked.

`close(key)`

- `key: string`
  Closes a notification by its key.

`closeAll()`

- Closes the currently visible notification and clears any queued notifications.

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

closeAll();
```
