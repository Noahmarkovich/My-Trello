import { useLocation } from 'react-router-dom';

export function useShouldShowHeader() {
  const { pathname } = useLocation();

  return !['/', '/login'].includes(pathname);
}
