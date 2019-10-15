import React from 'react'
import PropTypes from 'prop-types'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Icons from 'react-native-vector-icons/MaterialIcons'

const backgroundColor = 'transparent'

const styles = StyleSheet.create({
    btnContainer: {
        alignItems: 'center',
        backgroundColor,
        justifyContent: 'center',
        zIndex: 101
    }
})

const QualityControl = (props) => {
    const {
        paddingLeft,
        paddingRight,
        theme,
        size
    } = props

    const padding = {
        paddingLeft: paddingLeft ? paddingLeft : 0,
        paddingRight: paddingRight ? paddingRight : 0
    }

    return (
        <View style={styles.btnContainer}>

            <TouchableOpacity
                onPress={() => props.toggleQuality()}
            >
                <Icons
                    style={padding}
                    name={"hd"}
                    color={theme}
                    size={size}
                />
            </TouchableOpacity>
        </View>
    )
}

QualityControl.propTypes = {
    onPress: PropTypes.func,
    theme: PropTypes.string.isRequired,
    size: PropTypes.number,
    paddingRight: PropTypes.number,
    paddingLeft: PropTypes.number
}

QualityControl.defaultProps = {
    onPress: undefined,
    isOn: false,
    size: 25,
    paddingRight: false,
    paddingLeft: false
}

export { QualityControl }