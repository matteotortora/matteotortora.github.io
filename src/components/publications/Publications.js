import React from 'react';
import Card from './Card';
import {Box, Typography} from "@mui/material";
import publ1 from '../../img/publ_1.png';
import publ2 from '../../img/publ_2.png';
import publ3 from '../../img/publ_3.png';
import publ4 from '../../img/publ_4.png';
import publ5 from '../../img/publ_5.png';

function Publications({innerRef}) {
    const publications = [
        {
            imagePath: publ1,  // Percorso dell'immagine
            title: 'Deep Reinforcement Learning for Fractionated Radiotherapy in Non-Small Cell Lung Carcinoma',  // Titolo della pubblicazione
            authors: 'Matteo Tortora,  Ermanno Cordelli,  Rosa Sicilia,  Marianna Miele,  Paolo Matteucci,  Giulio Iannello,  Sara Ramella,  Paolo Soda',  // Autori della pubblicazione
            links: [
                {
                    url: 'https://www.sciencedirect.com/science/article/abs/pii/S0933365721001305#preview-section-abstract',
                    label: 'Artificial Intelligence in Medicine, 2021'
                },
            ]
        },
        {
            imagePath: publ2,
            title: 'RadioPathomics: multimodal learning in non-small cell lung cancer for adaptive radiotherapy',

            authors: 'Matteo Tortora, Ermanno Cordelli, Rosa Sicilia, Lorenzo Nibid, Edy Ippolito, Giuseppe Perrone, Sara Ramella, Paolo Soda',
            links: [
                {url: 'https://ieeexplore.ieee.org/abstract/document/10122541/', label: 'IEEE Access, 2023'}
            ]
        },
        {
            imagePath: publ3,
            title: 'PyTrack: a Map-Matching-based Python Toolbox for Vehicle Trajectory Reconstruction',

            authors: 'Matteo Tortora, Ermanno Cordelli, Paolo Soda',
            links: [
                {url: 'https://ieeexplore.ieee.org/abstract/document/9927417/', label: 'IEEE Access, 2022'},
                {url: 'https://github.com/cosbidev/PyTrack', label: 'Project Page'}
            ]
        },
        {
            imagePath: publ4,
            title: 'MATNet: Multi-Level Fusion Transformer-Based Model for Day-Ahead PV Generation Forecasting',

            authors: 'Matteo Tortora, Francesco Conte, Gianluca Natrella, Paolo Soda',
            links: [
                {url: 'https://scholar.google.com/scholar?oi=bibs&cluster=2439803367656401650&btnI=1&hl=it', label: 'arXiv, 2023'},
            ]
        },
    {
            imagePath: publ5,
            title: 'Exploring Early Stress Detection from Multimodal Time Series with Deep Reinforcement Learning',

            authors: 'Leonardo Furia, Matteo Tortora, Paolo Soda, Rosa Sicilia',
            links: [
                {url: 'https://ieeexplore.ieee.org/abstract/document/10385549/', label: 'BIBM, 2023'},
            ]
        }
    ];

    return (
        <Box ref={innerRef} display="flex" flexDirection="column" alignItems="center" mt={4} id={"publications"}>
            <Typography variant="body1" sx={{fontWeight: 'normal', fontSize: '17px', fontFamily: 'Roboto'}} mb={2}>
                A complete and up-to-date list of publications can be found on <a
                href="https://scholar.google.com/citations?user=3WpZse0AAAAJ" target="_blank" rel="noopener noreferrer"
                style={{color: "#793eee", textDecoration: "none"}}>Google Scholar</a>.
            </Typography>
            {publications.map((pub, index) => (
                <Card
                    key={index}
                    imagePath={pub.imagePath}
                    title={pub.title}
                    authors={pub.authors}
                    links={pub.links}
                />
            ))}
        </Box>
    );
}

export default Publications;
