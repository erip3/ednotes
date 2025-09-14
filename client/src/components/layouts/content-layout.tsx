import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { Footer } from '@/components/ui/footer';
import { Header } from '@/components/ui/header';

type ContentLayoutProps = {
  children: React.ReactNode;
  title?: string;
  parentId?: number;
  footerContent?: string;
  centered?: boolean;
};

export const ContentLayout = ({
  children,
  title,
  parentId,
  footerContent,
  centered = true,
}: ContentLayoutProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (parentId !== null && parentId !== undefined) {
      navigate(`/categories/${parentId}`);
    } else {
      navigate('/');
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  return (
    <>
      <Header onBack={handleBack} onHome={handleHome} />
      <main
        className={
          centered
            ? 'flex min-h-screen flex-col items-center justify-center'
            : 'flex min-h-screen flex-col'
        }
      >
        <div
          className={
            centered
              ? 'w-full max-w-7xl px-4 text-center sm:px-6 md:px-8'
              : 'mx-auto w-full max-w-3xl px-4 sm:px-6 md:px-8'
          }
        >
          <h1
            className={
              centered
                ? 'text-5xl font-semibold'
                : 'mb-8 mt-8 text-left text-4xl font-semibold'
            }
          >
            {title}
          </h1>
          <div className={centered ? 'py-6' : 'py-0'}>{children}</div>
        </div>
      </main>
      <Footer content={footerContent} />
    </>
  );
};
