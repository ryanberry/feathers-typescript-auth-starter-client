import * as React from 'react'
import { Component } from 'react'
import Exception from 'ant-design-pro/lib/Exception'
import { Link } from 'react-router-dom'
import { Button } from 'antd'

export class NotFound extends Component {
  render() {
    const action = (
      <Link to="/">
        <Button type="primary">Get me outta here!</Button>
      </Link>
    )
    return (
      <Exception
        type="404"
        title="Oops!"
        desc="Looks like the page you're looking for doesn't exist :("
        actions={action}
      />
    )
  }
}
