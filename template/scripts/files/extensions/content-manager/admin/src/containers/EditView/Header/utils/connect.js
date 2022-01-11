import React from 'react';
import { PreviewProvider } from 'strapi-plugin-preview-content';

import { useContentManagerEditViewDataManager } from 'strapi-helper-plugin';

function connect(WrappedComponent, select) {
  return function (props) {
    // eslint-disable-next-line react/prop-types
    const selectors = select();
    const { slug } = useContentManagerEditViewDataManager();

    return (
      <PreviewProvider {...selectors} {...props.allowedActions} slug={slug}>
        <WrappedComponent {...props} {...selectors} />
      </PreviewProvider>
    );
  };
}

export default connect;
