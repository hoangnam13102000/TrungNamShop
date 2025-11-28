import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetAll = (key, apiFn, options = {}) => {
  const { params, ...rest } = options;

  return useQuery({
    queryKey: [key, params], 
    queryFn: () => apiFn({ params }), 
    ...rest,
    onSuccess: (data) => {
      console.log(`Fetched ${key}:`, data);
      rest?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error(`Fetch ${key} failed:`, error);
      rest?.onError?.(error);
    },
  });
};

/** Hook CREATE / UPDATE / DELETE */
export const useMutate = (key, apiFn, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      if (variables && typeof variables === "object") {
        if ("id" in variables && "data" in variables) {
          // update
          try {
            return await apiFn(variables.id, variables.data);
          } catch {
            return await apiFn({ id: variables.id, data: variables.data });
          }
        } else if ("id" in variables) {
          // delete
          return await apiFn(variables.id);
        }
      }
      // create
      return await apiFn(variables);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries([key]);
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
