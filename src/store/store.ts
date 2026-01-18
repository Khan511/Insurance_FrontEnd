import { AdminSlice } from "@/services/AdminSlice";
import { ChatbotService } from "@/services/ChatBotService";
import { claimMetadataApi } from "@/services/ClaimMetaDataApi";
import { InsurancePolicySlice } from "@/services/InsurancePolicySlice";
import { InsuranceProductSlice } from "@/services/InsuranceProductSlice";
import { s3Api } from "@/services/s3Api";
import { userApi } from "@/services/UserApiSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [InsuranceProductSlice.reducerPath]: InsuranceProductSlice.reducer,
    [claimMetadataApi.reducerPath]: claimMetadataApi.reducer,
    [s3Api.reducerPath]: s3Api.reducer,
    [InsurancePolicySlice.reducerPath]: InsurancePolicySlice.reducer,
    [AdminSlice.reducerPath]: AdminSlice.reducer,
    [ChatbotService.reducerPath]: ChatbotService.reducer,
  },
  middleware: (GetDefaultMiddleware) =>
    GetDefaultMiddleware().concat(
      userApi.middleware,
      InsuranceProductSlice.middleware,
      claimMetadataApi.middleware,
      s3Api.middleware,
      InsurancePolicySlice.middleware,
      AdminSlice.middleware,
      ChatbotService.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
