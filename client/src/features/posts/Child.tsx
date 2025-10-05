import React from 'react'
import { useGetPostsQuery } from '../../app/services/posts'

function Child() {
    useGetPostsQuery()
  return (
    <div>
      我说子组件啊
    </div>
  )
}

export default Child
