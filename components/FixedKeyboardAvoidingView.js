'use strict';

const Keyboard = require('Keyboard');
const LayoutAnimation = require('LayoutAnimation');
const Platform = require('Platform');
const React = require('React');
const TimerMixin = require('react-timer-mixin');
const View = require('View');

const PropTypes = React.PropTypes;

import type EmitterSubscription from 'EmitterSubscription';

type Rect = {
  x: number,
  y: number,
  width: number,
  height: number,
};
type ScreenRect = {
  screenX: number,
  screenY: number,
  width: number,
  height: number,
};
type KeyboardChangeEvent = {
  startCoordinates?: ScreenRect,
  endCoordinates: ScreenRect,
  duration?: number,
  easing?: string,
};
type LayoutEvent = {
  nativeEvent: {
    layout: Rect,
  }
};

const viewRef = 'VIEW';

/**
 * It is a component to solve the common problem of views that need to move out of the way of the virtual keyboard.
 * It can automatically adjust either its position or bottom padding based on the position of the keyboard.
 */
const FixedKeyboardAvoidingView = React.createClass({
  mixins: [TimerMixin],

  propTypes: {
    ...View.propTypes,
    behavior: PropTypes.oneOf(['height', 'position', 'padding']),

    /**
     * The style of the content container(View) when behavior is 'position'.
     */
    contentContainerStyle: View.propTypes.style,

    /**
     * This is the distance between the top of the user screen and the react native view,
     * may be non-zero in some use cases.
     */
    keyboardVerticalOffset: PropTypes.number.isRequired,
  },

  getDefaultProps() {
    return {
      keyboardVerticalOffset: 0,
    };
  },

  getInitialState() {
    return {
      bottom: 0,
    };
  },

  subscriptions: ([]: Array<EmitterSubscription>),
  frame: (null: ?Rect),

  relativeKeyboardHeight(keyboardFrame: ScreenRect): number {
    const frame = this.frame;
    if (!frame || !keyboardFrame) {
      return 0;
    }

    const y1 = Math.max(frame.y, keyboardFrame.screenY - this.props.keyboardVerticalOffset);
    const y2 = Math.min(frame.y + frame.height, keyboardFrame.screenY + keyboardFrame.height - this.props.keyboardVerticalOffset);
    return Math.max(y2 - y1, 0);
  },

  onKeyboardChange(event: ?KeyboardChangeEvent) {
    if (!event) {
      this.setState({bottom: 0});
      return;
    }
    const {duration, easing, endCoordinates} = event;
    const height = this.relativeKeyboardHeight(endCoordinates);
    console.log('keyboardchange from kav; endcoord(keyboard): '+JSON.stringify(endCoordinates)+'frame coord: '+JSON.stringify(this.frame));

    if (duration && easing) {
      LayoutAnimation.configureNext({
        duration: duration,
        update: {
          duration: duration,
          type: LayoutAnimation.Types[easing] || 'keyboard',
        },
      });
    }
    this.setState({bottom: height});
  },

  onLayout(event: LayoutEvent) {
      console.log("keyboardavoid onLayout"+JSON.stringify(event.nativeEvent.layout)+" pad "+this.state.bottom)
    this.refs.VIEW.measure((relX, relY, width, height, x, y) => {
      this.frame={width,height,x,y};
    });
  },

  componentWillUpdate(nextProps: Object, nextState: Object, nextContext?: Object): void {
    if (nextState.bottom === this.state.bottom &&
        this.props.behavior === 'height' &&
        nextProps.behavior === 'height') {
      // If the component rerenders without an internal state change, e.g.
      // triggered by parent component re-rendering, no need for bottom to change.
      nextState.bottom = 0;
    }
  },

  componentWillMount() {
    if (Platform.OS === 'ios') {
      this.subscriptions = [
        Keyboard.addListener('keyboardWillChangeFrame', this.onKeyboardChange),
      ];
    } else {
      this.subscriptions = [
        Keyboard.addListener('keyboardDidHide', this.onKeyboardChange),
        Keyboard.addListener('keyboardDidShow', this.onKeyboardChange),
      ];
    }
  },

  componentWillUnmount() {
    this.subscriptions.forEach((sub) => sub.remove());
  },

  render(): React.Element<any> {
    const {behavior, children, style, ...props} = this.props;

    switch (behavior) {
      case 'height':
        let heightStyle;
        if (this.frame) {
          // Note that we only apply a height change when there is keyboard present,
          // i.e. this.state.bottom is greater than 0. If we remove that condition,
          // this.frame.height will never go back to its original value.
          // When height changes, we need to disable flex.
          heightStyle = {height: this.frame.height - this.state.bottom, flex: 0};
        }
        return (
          <View ref={viewRef} style={[style, heightStyle]} onLayout={this.onLayout} {...props}>
            {children}
          </View>
        );

      case 'position':
        const positionStyle = {bottom: this.state.bottom};
        const { contentContainerStyle } = this.props;

        return (
          <View ref={viewRef} style={style} onLayout={this.onLayout} {...props}>
            <View style={[contentContainerStyle, positionStyle]}>
              {children}
            </View>
          </View>
        );

      case 'padding':
        const paddingStyle = {paddingBottom: this.state.bottom};
        return (
          <View ref={viewRef} style={[style, paddingStyle]} onLayout={this.onLayout} {...props}>
            {children}
          </View>
        );

      default:
        return (
          <View ref={viewRef} onLayout={this.onLayout} style={style} {...props}>
            {children}
          </View>
        );
    }
  },
});

module.exports = FixedKeyboardAvoidingView;
