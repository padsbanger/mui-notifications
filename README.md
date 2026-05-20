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
import { NotificationsProvider } from '@toolpad/core/useNotifications';

function App({ children }) {
  return <NotificationsProvider>{children}</NotificationsProvider>;
}
```

Now you can get acess to the notifications APIs through the **useNotifications** hook.

```tsx
import { useNotifications } from '@toolpad/core/useNotifications';

function MyApp() {
  const notifications = useNotifications();
  // ...
}
```

### Basic notification

You can notify your users with a neutral message by calling notifications.show. To have the notification automatically hide, add the autoHideDuration option. This expresses the time in milliseconds after which to close the notification.

```tsx
notifications.show('Consider yourself notified!', {
  autoHideDuration: 3000,
});
```