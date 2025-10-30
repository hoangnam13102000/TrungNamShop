import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Hook GET ALL
export const useGetAll = (key, apiFn, options = {}) => {
  return useQuery({
    queryKey: [key],
    queryFn: apiFn,
    ...options,
    onSuccess: (data) => {
      console.log(`Fetched ${key}:`, data);
      options?.onSuccess?.(data);
    },
    onError: (error) => {
      console.error(`Fetch ${key} failed:`, error);
      options?.onError?.(error);
    },
  });
};

// Hook CREATE / UPDATE / DELETE
export const useMutate = (key, apiFn, options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables) => {
      /**
       *  1️. create(data)
       *  2️. update({ id, data })
       *  3️. delete(id)
       */
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
      // console.log(`Mutation ${key} success:`, data);
      // invalidate cache -> reload data after mutate
      queryClient.invalidateQueries([key]);
      options?.onSuccess?.(data);
    },

    onError: (error) => {
      // console.error(`Mutation ${key} failed:`, error);
      options?.onError?.(error);
    },
  });
};
