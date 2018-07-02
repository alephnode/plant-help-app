import React from 'react'

export default ({ data }) => (
  <div>
    {console.log(data)}
    <p>{data.name}</p>
    <img src={data.images.length ? data.images[0].url : ''} alt={data.name} />
    <p>{data.description}</p>
  </div>
)
