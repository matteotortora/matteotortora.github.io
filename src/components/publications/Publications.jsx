import React from 'react';
import Card from './Card';
import { Box, Typography } from '@mui/material';
import PageSection from '../PageSection';
import publications from '../../info/publications.json';
import radioPathomics from '../../img/publ_2.png';
import matnet from '../../img/publ_4.png';
import vmambax from '../../img/publ_6.png';
import foundationModelsLung from '../../img/publ_7.png';
import sampleAwareTta from '../../img/publications/sample-aware-tta.webp';
import multiAgentTta from '../../img/publications/multi-agent-tta.webp';
import vegsim from '../../img/publications/vegsim.webp';
import ndviForecasting from '../../img/publications/ndvi-forecasting.webp';
import tumorBenchmark from '../../img/publications/tumor-benchmark.webp';
import virtualTreatment from '../../img/publications/virtual-treatment.webp';
import hybridQuantumForecasting from '../../img/publications/hybrid-quantum-forecasting.webp';

const images = {
    'sample-aware-tta': sampleAwareTta,
    'multi-agent-tta': multiAgentTta,
    vegsim,
    'ndvi-forecasting': ndviForecasting,
    'tumor-benchmark': tumorBenchmark,
    'virtual-treatment': virtualTreatment,
    'hybrid-quantum-forecasting': hybridQuantumForecasting,
    radiopathomics: radioPathomics,
    matnet,
    vmambax,
    'foundation-models-lung': foundationModelsLung,
};

export default function Publications({ innerRef }) {
    return (
        <PageSection id="publications" title="Selected Publications" innerRef={innerRef}>
            <Typography variant="body1" sx={{ fontSize: '1rem', fontFamily: 'inherit' }} mb={3}>
                Selected recent and representative publications. For the complete list, see{' '}
                <a href="https://scholar.google.com/citations?user=3WpZse0AAAAJ" target="_blank" rel="noopener noreferrer">Google Scholar</a>.
            </Typography>
            <Box display="grid" gap={{ xs: 3, md: 4 }}>
                {publications.map(publication => (
                    <Card key={publication.id} {...publication} imagePath={images[publication.image]} />
                ))}
            </Box>
        </PageSection>
    );
}
