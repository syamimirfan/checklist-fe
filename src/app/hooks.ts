import { useCallback } from 'react';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { getApiErrorMessages, isFallbackError } from '../shared/api';
import { showToast } from '../shared/toast';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Shows whatever went wrong calling the backend as error toasts: the backend's own message(s),
 * or a generic one if it sent none. Call it from a `catch`: `catch (e) { handleApiError(e); }`.
 * The returned function is stable, so it's safe in effect dependency lists.
 */
export function useApiErrorHandler() {
  const dispatch = useAppDispatch();
  return useCallback(
    (error: unknown) => {
      // A generic stand-in hides the real cause from the user, so keep it in the console.
      if (isFallbackError(error)) console.error('Full API error:', error);
      getApiErrorMessages(error).forEach((message) =>
        dispatch(showToast({ message, tone: 'error' })),
      );
    },
    [dispatch],
  );
}

/** The signed-in user. Never null: `AppShell` redirects to /login before rendering any page that calls this. */
export type CurrentUser = NonNullable<RootState['auth']['user']>;

/** Only valid inside a route rendered under `AppShell`, which supplies the user as outlet context. */
export const useCurrentUser = () => useOutletContext<CurrentUser>();
