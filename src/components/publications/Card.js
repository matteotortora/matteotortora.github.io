import React from 'react';
import Style from "./Card.module.scss"; // Usa lo stile di Terminal per mantenere coerenza
import {Box, Link, Typography} from "@mui/material";
import classNames from "classnames";

function Card({imagePath, title, authors, links}) {
    return (
        <Box component={'section'} className={classNames(Style.terminal, Style.shadowed)} width={{xs: '55%', md: '55%'}}
             borderRadius={'0.5rem'} mb={'4rem'} display="flex" overflow="hidden">
            {/* Immagine a sinistra con larghezza fissa di 300px */}
            <Box display="flex" justifyContent="center" alignItems="center" width="350px" height="220px">
                <Box component="img" src={imagePath} alt={title} className={Style.cardImage}/>
            </Box>
            {/* Contenuto a destra */}
            <Box py={{xs: '1rem', md: '2rem'}} px={{xs: '1rem', md: '0rem'}} width="60%" sx={{}}>
                {/* Titolo con Roboto Bold, 17px */}
                <Typography variant="h6" fontWeight="bold" fontSize="17px" fontFamily="Roboto">
                    {title}
                </Typography>

                {/* Autori con Roboto Regular, 16px */}
                <Typography variant="body1" color="textSecondary" fontSize="16px" fontFamily="Roboto" mt={1}>
                    {authors.split(', ').map((author, index) => (
                        <span key={index} style={{fontWeight: author === 'Matteo Tortora' ? 'bold' : 'normal'}}>
                     {author}{index < authors.split(', ').length - 1 ? ', ' : ''}
                  </span>
                    ))}
                </Typography>

                {/* Link con Roboto Regular, 17px */}
                <Box mt={2}>
                    {links && links.map((link, index) => (
                        <Link
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={index}
                            display="block"
                            fontSize="17px"
                            fontFamily="Roboto"
                            fontWeight="bold"
                            color="primary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default Card;
