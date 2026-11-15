import React from 'react';
import Style from "./Terminal.module.scss";
import classNames from "classnames";
import {Box} from "@mui/material";


function Terminal(props) {
   const {text} = props;

   return (
      <Box component={'div'} className={classNames(Style.terminal, Style.shadowed)}
           width={'100%'} borderRadius={'0.5rem'} mb={0}>
         <Box py={{xs: '1rem', md: '2rem'}} px={{xs: '1.25rem', md: '2.5rem'}} borderRadius={'0 0 0.5rem 0.5rem'}
              fontSize={'1rem'} fontFamily={'inherit'} lineHeight={1.65}>
            {text}
         </Box>
      </Box>
   );
}

export default Terminal;