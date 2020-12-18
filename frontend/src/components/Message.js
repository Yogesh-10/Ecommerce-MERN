import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, error }) => {
  return <Alert variant={variant}>{error}</Alert>;
};

Message.defaultProps = {
  variant: 'info',
};

// ****** the above also can be writen as children prop which display error from home screen ****//
// const Message = ({ variant,children  }) => {
//   return <Alert variant={variant}>{children}</Alert>;
// };

export default Message;
