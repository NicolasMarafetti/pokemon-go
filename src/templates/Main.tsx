import type { ReactNode } from 'react';

import Menu from '@/components/Menu';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="w-full px-1 text-gray-700 antialiased">
    {props.meta}

    <Menu />

    <div className="content py-5 text-xl">{props.children}</div>
  </div>
);

export { Main };
