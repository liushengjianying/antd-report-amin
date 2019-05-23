import React from 'react'

class ModalControl extends React.PureComponent {

  componentWillUnmount(){
    clearTimeout(this.myClear)
  };

  showModalHandler = (e) => {
    if (e) {
      e.stopPropagation()
    }
    this.setState({
      visible: true
    })
  };

  hideModalHandler = () => {
    this.setState({
      visible: false
    });

    this.myClear =  setTimeout(this.props.form.resetFields,300);
  };
}

export default ModalControl
