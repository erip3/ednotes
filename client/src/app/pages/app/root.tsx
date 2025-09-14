import { Outlet } from 'react-router';

import { ContentLayout } from '@/components/layouts';

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

const AppRoot = () => {
  return (
    <ContentLayout title="EdNotes">
      <Outlet />
    </ContentLayout>
  );
};

export default AppRoot;
