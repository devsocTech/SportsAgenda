import * as React from 'react';
import { Snackbar } from 'react-native-paper';

export default (props)=>{

    return(
        
        <Snackbar
          visible={props.visibleSnackBar}
          onDismiss={() => props.dismissSnackbar()}
          >
          {props.mensajeSnackBar}
        </Snackbar>

    )
}
