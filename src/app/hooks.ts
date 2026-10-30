import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/** The signed-in user. Never null: `AppShell` redirects to /login before rendering any page that calls this. */
export type CurrentUser = NonNullable<RootState['auth']['user']>;

/** Only valid inside a route rendered under `AppShell`, which supplies the user as outlet context. */
export const useCurrentUser = () => useOutletContext<CurrentUser>();
