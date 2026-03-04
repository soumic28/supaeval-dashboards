import { ApplicationInsights } from "@microsoft/applicationinsights-web";

const rawConnectionString = import.meta.env.VITE_APPINSIGHTS_CONNECTION_STRING;

// Robustly handle connection string format
const connectionString =
  rawConnectionString &&
  !rawConnectionString.includes("InstrumentationKey=") &&
  !rawConnectionString.includes("EndpointSuffix=")
    ? `InstrumentationKey=${rawConnectionString}`
    : rawConnectionString;

export const appInsights = new ApplicationInsights({
  config: {
    connectionString: connectionString,
    enableAutoRouteTracking: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  },
});

if (connectionString) {
  appInsights.loadAppInsights();
} else {
  console.warn(
    "Azure Application Insights connection string is missing. Logging will be disabled.",
  );
}

export const setUserContext = (userId: string) => {
  appInsights.setAuthenticatedUserContext(userId);
};

export const clearUserContext = () => {
  appInsights.clearAuthenticatedUserContext();
};
