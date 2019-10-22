"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_1 = require("react");
const react_native_1 = require("react-native");
const PlayerEventTypes_1 = require("./PlayerEventTypes");
function withEvents(BCPlayerComponent) {
    // ...and returns another component...
    class BCPlayerComponentWithEvents extends react_1.Component {
        constructor(props) {
            super(props);
            this.state = {
                percentageTracked: { Q1: false, Q2: false, Q3: false, Q4: false },
                mediainfo: null,
                firstPlayed: false,
                quality: 'Auto'
            };
        }
        /**
         * Event triggered when the player is ready to play
         * @param {NativeEvent} event
         */
        onReady(event) {
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.READY });
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.IMPRESSION });
            this.props.onReady && this.props.onReady(event);
        }
        /**
         * Event triggered when the player sets the metadata
         * @param {NativeEvent} event
         */
        onMetadataLoaded(event) {
            this.setState({ mediainfo: event.mediainfo }, () => {
                this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.METADATA_LOADED });
            });
            this.props.onMetadataLoaded && this.props.onMetadataLoaded(event);
        }
        /**
         * Event triggered everytime that it starts playing. Can be when it starts, or when it resumes from pause
         * @param {NativeEvent} event
         */
        onPlay(event) {
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.PLAY });
            if (!this.state.firstPlayed) {
                this.setState({ firstPlayed: true }, () => {
                    this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.VIEW });
                });
            }
            this.props.onPlay && this.props.onPlay(event);
        }
        /**
         * Event triggered everytime the user clicks pause
         * @param {NativeEvent} event
         */
        onPause(event) {
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.PAUSE });
            this.props.onPause && this.props.onPause(event);
        }
        /**
         * Event triggered when the video ends
         * @param {NativeEvent} event
         */
        onEnd(event) {
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.END });
            this.props.onEnd && this.props.onEnd(event);
        }
        /**
         * Event triggered when buffering started
         * @param {NativeEvent} event
         */
        onBufferingStarted(event) {
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.BUFFERING_STARTED });
            this.props.onBufferingStarted && this.props.onBufferingStarted(event);
        }
        /**
         * Event triggered when the video ends
         * @param {NativeEvent} event
         */
        onBufferingCompleted(event) {
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.BUFFERING_COMPLETED });
            this.props.onBufferingCompleted && this.props.onBufferingCompleted(event);
        }
        /**
         * Event trigger when there is a change in the connectivity
         * @param {NativeEvent} event
         */
        onNetworkConnectivityChange(event) {
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.NETWORK_CONNECTIVITY_CHANGE, status: event.status });
            this.props.onNetworkConnectivityChange && this.props.onNetworkConnectivityChange(event);
        }
        /**
         * Event triggered as the stream progress.
         * @param {NativeEvent} event
         * @param {number} event.currentTime - The current time of the video
         * @param {number} event.duration - The total duration of the video
         */
        onProgress(event) {
            const { currentTime, duration } = event, { percentageTracked } = this.state;
            if (duration > -1) {
                /*
                * Calculate the percentage played
                */
                let percentagePlayed = Math.round(currentTime / duration * 100), roundUpPercentage = Math.ceil(percentagePlayed / 25) * 25 || 25; // make sure that 0 is 25
                /**
                 * The following logic is applied:
                 * Between 0% - 25% - Track Q1 mark
                 * Between 25% - 50% - Track Q2 mark
                 * Between 50% - 75% - Track Q3 mark
                 * Between 75% - 100% - Track Q4 mark
                 */
                if (roundUpPercentage === 25 && !percentageTracked.Q1) {
                    this.trackQuarters(1, percentagePlayed);
                }
                else if (roundUpPercentage === 50 && !percentageTracked.Q2) {
                    this.trackQuarters(2, percentagePlayed);
                }
                else if (roundUpPercentage === 75 && !percentageTracked.Q3) {
                    this.trackQuarters(3, percentagePlayed);
                }
                else if (roundUpPercentage === 100 && !percentageTracked.Q4) {
                    this.trackQuarters(4, percentagePlayed);
                }
            }
            // Fire the call back of the onProgress
            this.props.onProgress && this.props.onProgress(event);
        }
        getPlayerMark(mark) {
            switch (mark) {
                case 1:
                    return PlayerEventTypes_1.PlayerEventTypes.PROGRESS_Q1;
                case 2:
                    return PlayerEventTypes_1.PlayerEventTypes.PROGRESS_Q2;
                case 3:
                    return PlayerEventTypes_1.PlayerEventTypes.PROGRESS_Q3;
                case 4:
                    return PlayerEventTypes_1.PlayerEventTypes.PROGRESS_Q4;
                default:
                    return PlayerEventTypes_1.PlayerEventTypes.PROGRESS_Q1;
            }
        }
        /**
         * Method that tracks back to the "onEvent" call back to communicate a tracking of a quarter
         * @param {number} mark - The number of the quarter (1,2,3,4)
         * @param {number} percentagePlayed - The percentage played at the time of the tracking
         */
        trackQuarters(mark, percentagePlayed) {
            this.setState((prevState) => ({
                percentageTracked: Object.assign(Object.assign({}, prevState.percentageTracked), { [`Q${mark}`]: true })
            }));
            this.onEvent({
                type: this.getPlayerMark(mark),
                percentagePlayed
            });
        }
        /**
         * Event triggered when the fullscreen happens
         * @param {NativeEvent} event
         */
        onEnterFullscreen(event) {
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.ENTER_FULLSCREEN });
            this.props.onEnterFullscreen && this.props.onEnterFullscreen(event);
        }
        /**
         * Event triggered when the user exists from the fullscreen
         * @param {NativeEvent} event
         */
        onExitFullscreen(event) {
            this.onEvent({ 'type': PlayerEventTypes_1.PlayerEventTypes.EXIT_FULLSCREEN });
            this.props.onExitFullscreen && this.props.onExitFullscreen(event);
        }
        /**
         * Event triggered when an error gets triggered
         * @param {NativeEvent} event
         */
        onError(event) {
            // Make sure that if an errorCode or errorMessage is passed, then
            if (!event.error_code && !(event.errorMessage || event.message)) {
                return;
            }
            let { errorCode, errorMessage } = this.normaliseErrorCodes({
                errorCode: event.error_code,
                errorMessage: event.errorMessage || event.message
            });
            this.onEvent({
                'type': PlayerEventTypes_1.PlayerEventTypes.ERROR,
                errorCode,
                errorMessage
            });
            this.props.onError && this.props.onError(event);
        }
        /**
         * Some of the errors are not very consistent. So we need to normalise them in order to get proper meaninful messages
         * and make sure ios and Android are aligned with the same errors
         * @params error {object} - Error object
         * @params error.error_code - The error code sent from native
         * @params error.errorMessage - error message
         */
        normaliseErrorCodes({ error_code, errorMessage }) {
            if (react_native_1.Platform.OS === 'android') {
                // This happens on Android, it means that the internet might be down or it couldn't get through the segments
                if (errorMessage === 'onLoadError: sourceId: -1') {
                    return {
                        errorCode: 'LOAD_ERROR',
                        errorMessage: 'There was an error trying to play the video. Check your internet connection.'
                    };
                }
                // This happens on Android, it means that it cannot process the video anymore.
                // One scenario is that it retried to download the segments a few times and it failed, so this event gets thrown
                if (errorMessage === 'onPlayerError') {
                    return {
                        errorCode: 'PLAYER_ERROR',
                        errorMessage: 'There was an error with the player. Check your internet connection and refresh.'
                    };
                }
            }
            if (react_native_1.Platform.OS === 'ios') {
                /**
                 * Error Code that indicates there was an error connecting to the Playback API.
                 */
                if (error_code === '1') {
                    return {
                        errorCode: 'LOAD_ERROR',
                        errorMessage: 'There was an error trying to play the video. Check your internet connection.' + ((errorMessage) ? `(${errorMessage})` : '')
                    };
                }
                /**
                 * Error Code that indicates there was an error returned by the API. It could be any error from the API.
                 */
                if (error_code === '3') {
                    error_code = 'PLAYER_ERROR';
                }
            }
            // If no error code is defined, then use a generic one, and pass the error message or the default 'There was an error'
            return { errorCode: error_code || 'ERROR', errorMessage: errorMessage || 'There was an error!' };
        }
        /**
         * Handler to normalise the events and send it back to the onEvent callback if that exists
         * @param {object} event
         * @param {string} event.type - the event type
         */
        onEvent(event) {
            const eventObj = Object.assign(Object.assign({}, event), { name: this.state.mediainfo && this.state.mediainfo.title || 'N/A', videoId: this.props.videoId, referenceId: this.props.referenceId, accountId: this.props.accountId, playerId: this.props.playerId, platform: react_native_1.Platform.OS });
            this.props.onEvent && this.props.onEvent(eventObj);
        }
        render() {
            const _a = this.props, { forwardedRef } = _a, props = __rest(_a, ["forwardedRef"]);
            // ... and renders the wrapped component with the fresh data!
            // Notice that we pass through any additional props
            return (React.createElement(BCPlayerComponent, Object.assign({}, props, { ref: forwardedRef, onReady: this.onReady.bind(this), onMetadataLoaded: this.onMetadataLoaded.bind(this), onPlay: this.onPlay.bind(this), onPause: this.onPause.bind(this), onEnd: this.onEnd.bind(this), onProgress: this.onProgress.bind(this), onBufferingStarted: this.onBufferingStarted.bind(this), onBufferingCompleted: this.onBufferingCompleted.bind(this), onNetworkConnectivityChange: this.onNetworkConnectivityChange.bind(this), onEnterFullscreen: this.onEnterFullscreen.bind(this), onExitFullscreen: this.onExitFullscreen.bind(this), onError: this.onError.bind(this) })));
        }
    }
    const forwardComponent = React.forwardRef((props, ref) => {
        return React.createElement(BCPlayerComponentWithEvents, Object.assign({}, props, { forwardedRef: ref }));
    });
    // // Rename the new component name to be the same as the high order component
    // // This is done because there are other components that looks up to the name of the BCPlayer (like ScrollView)
    forwardComponent.displayName = 'BrightcovePlayer';
    return forwardComponent;
}
exports.default = withEvents;
//# sourceMappingURL=Events.js.map