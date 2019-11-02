import React from 'react'
import { Keyboard, Platform, View, Text } from 'react-native'


function readableKeyboard(keyboardFrame) {
    if (!keyboardFrame) {
      return ''
    }
    return `H: ${Math.round(keyboardFrame.height)}, Y: ${Math.round(keyboardFrame.screenY)}`
  }
  
  function readableView(viewFrame) {
    if (!viewFrame) {
      return ''
    }
    return `H: ${Math.round(viewFrame.height)}, Y: ${Math.round(viewFrame.y)}`
  }

export class DebugKeyboardAvoidingView extends React.Component {
    state = { padding: 0 }
  
    _subscriptions = []
    viewRefGet = React.createRef()
    viewFrame= undefined
    endKeyboardFrame = undefined
  
    onViewLayout = () => {
      if (!this.viewRefGet.current) {
        return
      }
      this.viewRefGet.current.measureInWindow(this.onViewMeasure)
    }
  
    onViewMeasure = (x, y, width, height) => {
      if (height > 0) {
        this.viewFrame = { x, y, width, height }
        this.updatePadding()
      }
    }
  
    updatePadding() {
      this.setState({ padding: this.calculatePadding() })
    }
  
    calculatePadding() {
      if (!this.viewFrame || !this.endKeyboardFrame) {
        return 0
      }
      return this.endKeyboardFrame.height
    }
  
    handleKeyboardEvent(ev) {
      this.endKeyboardFrame = ev.endCoordinates
      this.startKeyboardFrame = ev.startCoordinates
      if (ev.duration) {
        LayoutAnimation.animateUpdate(ev.duration)
      }
      this.updatePadding()
    }
  
    handleKeyboardWillChangeFrameAndroid = (ev) => {
      if (!ev) {
        this.endKeyboardFrame = undefined
        this.updatePadding()
        return
      }
  
      this.handleKeyboardEvent(ev)
    }
  
    handleKeyboardWillChangeFrameIOS = (ev) => {
      this.handleKeyboardEvent(ev)
    }
  
    componentDidMount() {
      this._subscriptions = [
        Keyboard.addListener('keyboardDidShow', this.handleKeyboardWillChangeFrameAndroid),
        Keyboard.addListener('keyboardDidHide', this.handleKeyboardWillChangeFrameAndroid),
      ]
    }
  
    componentWillUnmount() {
      this._subscriptions.forEach(subscription => {
        subscription.remove()
      })
    }
  
    renderDebug() {
      return (
        <>
          <View
            style={{
              position: 'absolute',
              backgroundColor: 'red',
              top: 0,
              right: 0,
              width: 40,
              height: this.state.padding,
            }}
          />
          <View style={{ position: 'absolute', top: 0, right: 40, backgroundColor: 'green', maxWidth: 200 }}>
            <Text style={{ color: 'white' }}>
              <Text>SAFE AREA KEYBOARD{'\n'}</Text>
              <Text>PADDING: {Math.round(this.state.padding)}{'\n'}</Text>
              <Text>KEYBOARD END: {readableKeyboard(this.endKeyboardFrame)}{'\n'}</Text>
              <Text>VIEW: {readableView(this.viewFrame)}{'\n'}</Text>
            </Text>
          </View>
        </>
      )
    }
  
    render() {
      const { children, ...props } = this.props
      return (
        <View
          {...props}
          ref={this.viewRefGet}
          style={[this.props.style, { paddingBottom: this.state.padding, flexGrow: 1 }]}
          onLayout={this.onViewLayout}
        >
          {children}
          {this.renderDebug()}
        </View>
      )
    }
  }