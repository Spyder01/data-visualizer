import React, {useEffect} from 'react';
import  PropTypes from 'prop-types';
import  MonacoEditor from '@monaco-editor/react';

const Editor = ( {handleChange, value}) => {

    useEffect(()=>{

    }, [])

    return (
        <MonacoEditor
            language="json"
            height="100%"
            width="100%"
            defaultValue={""}
            onChange={handleChange}
            value={value}
            options={{readOnly: false}}
        />
    )
}

Editor.propTypes = {
    handleChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

export default Editor;
