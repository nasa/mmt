import React from "react"
import PropTypes from "prop-types"

interface HelloWorldProps {
  greeting: string
}
class HelloWorld extends React.Component<HelloWorldProps, never> {
  render () {
    return (
      <React.Fragment>
        <div>
          Greetings from: {this.props.greeting}
        </div>
      </React.Fragment>
    );
  }
}

export default HelloWorld