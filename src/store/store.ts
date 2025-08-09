import { claimMetadataApi } from "@/services/ClaimMetaDataApi";
import { InsuracePolicyApi } from "@/services/InsurancePolicySlice";
import { userApi } from "@/services/UserApiSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [InsuracePolicyApi.reducerPath]: InsuracePolicyApi.reducer,
    [claimMetadataApi.reducerPath]: claimMetadataApi.reducer,
  },
  middleware: (GetDefaultMiddleware) =>
    GetDefaultMiddleware().concat(
      userApi.middleware,
      InsuracePolicyApi.middleware,
      claimMetadataApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
