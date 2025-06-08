 
// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'

/*
const { nodeProfilingIntegration } = require('@sentry/profiling-node')
/Sentry.init({
  dsn: 'https://320198cb3ae45ff18d61e67b2b654a17@o4509373255516160.ingest.de.sentry.io/4509373256958032',
  integrations: [nodeProfilingIntegration()],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,
  profileLifecycle: 'trace',

  profilesSampleRate: 1,

  // Setting this option to t rue will print useful information to the console while you're setting up Sentry.
  debug: false,
})
*/
