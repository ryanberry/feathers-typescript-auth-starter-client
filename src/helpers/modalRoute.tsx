import * as React from 'react'
import { Route, RouteComponentProps, RouteProps } from 'react-router-dom'
import { Modal } from 'antd'
import { css } from 'emotion'

type RouteComponent =
  | React.StatelessComponent<RouteComponentProps<{}>>
  | React.ComponentClass<any>

export const ModalRoute: React.StatelessComponent<RouteProps> = ({
  component,
  ...rest
}) => {
  const renderFn = (Component?: RouteComponent) => (
    props: RouteComponentProps<{}>,
  ) => {
    if (!Component) {
      return null
    }

    const handleCancel = () => {
      props.history.push('/')
    }

    return (
      <Modal
        wrapClassName={css({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
        className={css({
          top: 0,
        })}
        visible={true}
        onCancel={handleCancel}
        destroyOnClose={true}
        footer={null}
      >
        <Component {...props} />
      </Modal>
    )
  }

  return <Route {...rest} render={renderFn(component)} />
}
