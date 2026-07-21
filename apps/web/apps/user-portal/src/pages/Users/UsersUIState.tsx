import { useGetUsersInfinite } from '@/hooks/rq/queries/useGetUsersInfinite';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

/**
 * Generate the user interface state for managing users.
 *
 * @return {Object} An object containing the user data, loading text, button disabled state, and functions to fetch next page.
 */
export const UsersUIState = () => {
  // Call react query hook
  // Pull all query properties
  const {
    data: users,
    isLoading,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useGetUsersInfinite({
    refetchOnMount: true, // refetchOnMount: true, This will fetch all the loaded pages again on mount.
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // TODO: Add search bar with debounce
  const { ref: infiniteRef, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  const loadingText = isLoading
    ? 'Loading...'
    : isFetchingNextPage || isFetching
      ? 'Loading more...'
      : '';

  const fetchingOrLoading = isFetching || isLoading;
  const isButtonDisabled = fetchingOrLoading || !hasNextPage;

  return {
    // export state to render
    users,
    infiniteRef,
    loadingText,
    fetchingOrLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    isLoading,
    isButtonDisabled,
    fetchNextPage,
  };
};
