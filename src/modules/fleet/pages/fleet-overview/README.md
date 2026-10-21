# Fleet overview

Route: `/`. No authentication or route parameters. Server-rendered initial snapshot is optional so upstream failures can recover through the client query.

Hooks: `useFleetSnapshot`, `useFilterOptions`, and `useVehicle`. UI state is supplied by `FleetStoreProvider`, with a separate store instance for each mounted page. Filtering and pagination are pure derived values, not duplicate stored API state.
