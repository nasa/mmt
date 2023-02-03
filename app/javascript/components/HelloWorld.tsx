import React from "react"
import PropTypes from "prop-types"

interface HelloWorldProps {
  greeting: string
}
class HelloWorld extends React.Component<HelloWorldProps, never> {
  // static propTypes: { greeting: PropTypes.Requireable<string>; };
  render () {
    return (
      <React.Fragment>
        <div>
          Greetings from !@!@!@!@!: {this.props.greeting}
        </div>
      </React.Fragment>
    );
  }
}

// HelloWorld.propTypes = {
//   greeting: PropTypes.string
// };
export default HelloWorld