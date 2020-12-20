import React from 'react'
import { Alert } from 'react-bootstrap'

// children is the prop passed in to Message component from other component
const Message = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>
}

Message.defaultProps = {
  variant: 'info',
}

// ****** the above code  also can be writen as error prop that is passed from home screen to message which display error from home screen ****//
// const Message = ({ variant, error }) => {
//   return <Alert variant={variant}>{error}</Alert>;
// };

export default Message
