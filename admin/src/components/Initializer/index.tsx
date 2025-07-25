/**
 *
 * Initializer
 *
 */

import { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { PLUGIN_ID } from '../../pluginId'

const Initializer = ({ setPlugin }: any) => {
    const ref = useRef<any>(null)
    ref.current = setPlugin

    useEffect(() => {
        ref.current(PLUGIN_ID)
    }, [])

    return null
}

Initializer.propTypes = {
    setPlugin: PropTypes.func.isRequired,
}

export default Initializer
