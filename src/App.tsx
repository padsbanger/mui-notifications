import { useMemo, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import { NotificationsProvider, useNotifications } from 'mui-notifications'

type DemoEvent = {
  id: string
  label: string
}



function DemoPanel() {
  const { show, close } = useNotifications()
  const [persistentKey, setPersistentKey] = useState<string | null>(null)
  const [events, setEvents] = useState<DemoEvent[]>([])

  const addEvent = (label: string, id: string) => {
    setEvents((current) => [{ id, label }, ...current].slice(0, 6))
  }

  const scenarios = useMemo(
    () => [
      {
        label: 'Success',
        icon: <CheckCircleRoundedIcon />,
        color: 'success' as const,
        run: () => {
          const id = show('Invoice synced successfully.', {
            severity: 'success',
            autoHideDuration: 2500,
          })
          addEvent('Success toast fired', id)
        },
      },
      {
        label: 'Info',
        icon: <InfoOutlinedIcon />,
        color: 'info' as const,
        run: () => {
          const id = show('Nightly import is still running in the background.', {
            severity: 'info',
            autoHideDuration: 3500,
          })
          addEvent('Info toast fired', id)
        },
      },
      {
        label: 'Warning',
        icon: <WarningAmberRoundedIcon />,
        color: 'warning' as const,
        run: () => {
          const id = show('Storage is reaching its project quota.', {
            severity: 'warning',
            actionText: 'Review',
            onAction: () => {
              const followUpId = show('Quota settings opened from custom action.', {
                severity: 'info',
              })
              addEvent('Warning action clicked', followUpId)
            },
          })
          addEvent('Warning toast with action fired', id)
        },
      },
      {
        label: 'Error',
        icon: <ErrorOutlineRoundedIcon />,
        color: 'error' as const,
        run: () => {
          const id = show('Deployment failed on the verification step.', {
            severity: 'error',
            autoHideDuration: 5000,
          })
          addEvent('Error toast fired', id)
        },
      },
    ],
    [show],
  )

  const openPersistent = () => {
    const id = show('New release ready. This toast stays until you close it.', {
      key: 'persistent-release-toast',
      severity: 'success',
      autoHideDuration: null as never,
      actionText: 'Dismiss',
      onAction: () => close('persistent-release-toast'),
    })
    setPersistentKey(id)
    addEvent('Persistent toast opened', id)
  }

  const closePersistent = () => {
    if (!persistentKey) {
      return
    }

    close(persistentKey)
    addEvent('Persistent toast closed manually', persistentKey)
    setPersistentKey(null)
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Stack spacing={3}>
        <Card
          sx={{
            overflow: 'hidden',
            background:
              'linear-gradient(135deg, rgba(15,118,110,0.12), rgba(251,146,60,0.08) 45%, rgba(255,253,248,0.96) 100%)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={3}>
              <Chip
                icon={<NotificationsActiveRoundedIcon />}
                label="Material UI notifications demo"
                color="primary"
                sx={{ alignSelf: 'flex-start', px: 1 }}
              />
              <Box>
                <Typography variant="h2" sx={{ fontSize: { xs: 38, md: 64 } }}>
                  Demo app for `useNotifications`
                </Typography>
                <Typography sx={{ maxWidth: 720, mt: 2, fontSize: { xs: 16, md: 18 } }}>
                  This page imports the library through the package export, which resolves to the
                  built files in `dist`, then showcases severities, actions, queueing, and manual
                  close behavior.
                </Typography>
              </Box>
              <Alert severity="info" sx={{ alignItems: 'center' }}>
                Library usage: `&lt;NotificationsProvider&gt;` wraps the app and components call
                `const {'{'} show, close {'}'} = useNotifications()`.
              </Alert>
            </Stack>
          </CardContent>
        </Card>

        <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="stretch">
          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Typography variant="h5">Severity examples</Typography>
                <Typography color="text.secondary">
                  Each button triggers `show(message, options)` with a different severity.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
                  {scenarios.map((scenario) => (
                    <Button
                      key={scenario.label}
                      variant="contained"
                      color={scenario.color}
                      startIcon={scenario.icon}
                      onClick={scenario.run}
                    >
                      {scenario.label}
                    </Button>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Typography variant="h5">Advanced behavior</Typography>
                <Typography color="text.secondary">
                  These examples cover custom keys, queued messages, and programmatic close.
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap">
                  <Button variant="outlined" onClick={openPersistent}>
                    Open persistent toast
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={closePersistent}>
                    Close persistent toast
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Card>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Recent notification events</Typography>
              <Typography color="text.secondary">
                Generated keys from `show(...)` are logged here so the manual close flow is easy to
                inspect.
              </Typography>
              <Divider />
              <List dense disablePadding>
                {events.length === 0 ? (
                  <ListItem disableGutters>
                    <ListItemText
                      primary="No notifications fired yet."
                      secondary="Click any demo button to start exercising the library."
                    />
                  </ListItem>
                ) : (
                  events.map((event) => (
                    <ListItem key={`${event.id}-${event.label}`} disableGutters>
                      <ListItemText primary={event.label} secondary={`key: ${event.id}`} />
                    </ListItem>
                  ))
                )}
              </List>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  )
}

function App() {
  return (
    <>
      <CssBaseline />
      <NotificationsProvider
        slotProps={{
          snackbar: {
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'right',
            },
          },
        }}
      >
        <DemoPanel />
      </NotificationsProvider>
    </>
  )
}

export default App
