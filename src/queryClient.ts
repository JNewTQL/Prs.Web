import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

function showError(error: Error) {
  toast.error(error.message, { duration: 6000 });
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: showError,
  }),

  mutationCache: new MutationCache({
    onError: showError,
  }),
});
