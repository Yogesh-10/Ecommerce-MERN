import React from 'react'
import { Helmet } from 'react-helmet'

const Meta = ({ title, description, keywords }) => {
  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keyword' content={keywords} />
      </Helmet>
    </div>
  )
}

Meta.defaultProps = {
  title: 'Welcome to Shop Online',
  description: 'buy cheap and low cost products online',
  keywords: 'electronics, buy electronics, cheap electronics',
}

export default Meta
