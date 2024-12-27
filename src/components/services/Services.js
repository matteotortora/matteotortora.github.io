import React from 'react';
import Terminal from "./Terminal";
import { Box } from "@mui/material";
import { info } from "../../info/Info";

export default function Services({ innerRef }) {
    const firstName = info.firstName.toLowerCase();

    function aboutMeText() {
        return (
            <>
                {/* Short Description */}
                <p style={{ color: "#1f1f1f", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px", textAlign: "left" }}>
                    Overview of my professional services and contributions, including roles as a editor, workshop organizer and reviewer.
                </p>

                {/* Editorial Section */}
                <h2 style={{ color: "#1f1f1f", fontFamily: "RobotoBold, sans-serif", fontSize: "17px", marginTop: "1.5rem" }}>
                    Editorial Roles
                </h2>
                <ul style={{
                    color: "#1f1f1f",
                    fontFamily: "RobotoRegular, sans-serif",
                    fontSize: "17px",
                    listStyleType: "disc",
                    paddingLeft: "20px"
                }}>
                    <li>
                        Lead Guest Editor: Computerized Medical Imaging and Graphics
                    </li>
                </ul>

                {/* Workshops Section */}
                <h2 style={{ color: "#1f1f1f", fontFamily: "RobotoBold, sans-serif", fontSize: "17px", marginTop: "1.5rem" }}>
                    Workshop Organizer
                </h2>
                <ul style={{
                    color: "#1f1f1f",
                    fontFamily: "RobotoRegular, sans-serif",
                    fontSize: "17px",
                    listStyleType: "disc",
                    paddingLeft: "20px"
                }}>
                    <li>
                        <a href="https://sites.google.com/view/fmmedicine/home" target="_blank" rel="noopener noreferrer" style={{ color: "#1f1f1f", textDecoration: "none" }}>
                            Foundation Models in Medicine (FMM)
                        </a> at the International Joint Conference on Neural Networks (IJCNN) 2025
                    </li>
                    <li>
                        <a href="https://sites.google.com/view/gai4ba/home" target="_blank" rel="noopener noreferrer" style={{ color: "#1f1f1f", textDecoration: "none" }}>
                            Generative Artificial Intelligence for Biomedical Applications (GAI4BA)
                        </a> at the International Symposium on Computer-Based Medical Systems (CBMS) 2025
                    </li>
                </ul>

                {/* Area Chair Section */}
                <h2 style={{ color: "#1f1f1f", fontFamily: "RobotoBold, sans-serif", fontSize: "17px", marginTop: "1.5rem" }}>
                    Area Chair
                </h2>
                <ul style={{
                    color: "#1f1f1f",
                    fontFamily: "RobotoRegular, sans-serif",
                    fontSize: "17px",
                    listStyleType: "disc",
                    paddingLeft: "20px"
                }}>
                    <li>
                        International Joint Conference on Neural Networks (IJCNN) 2025
                    </li>
                </ul>

                {/* Reviewer for Journals */}
                <h2 style={{ color: "#1f1f1f", fontFamily: "RobotoBold, sans-serif", fontSize: "17px", marginTop: "1.5rem" }}>
                    Reviewer (Journals)
                </h2>
                <ul style={{
                    color: "#1f1f1f",
                    fontFamily: "RobotoRegular, sans-serif",
                    fontSize: "17px",
                    listStyleType: "disc",
                    paddingLeft: "20px"
                }}>
                    <li>Artificial Intelligence in Medicine</li>
                    <li>Expert Systems with Applications</li>
                    <li>Computer Methods and Programs in Biomedicine</li>
                    <li>Computerized Medical Imaging and Graphics</li>
                    <li>Breast Cancer Research and Treatment</li>
                    <li>Computational and Structural Biotechnology Journal</li>
                    <li>International Journal of Transportation Science and Technology</li>
                    <li>Mathematical Biosciences and Engineering</li>
                    <li>Medical Physics</li>
                    <li>World Journal of Surgical Oncology</li>
                </ul>

                {/* Reviewer for Conferences */}
                <h2 style={{ color: "#1f1f1f", fontFamily: "RobotoBold, sans-serif", fontSize: "17px", marginTop: "1.5rem" }}>
                    Reviewer (Conferences)
                </h2>
                <ul style={{
                    color: "#1f1f1f",
                    fontFamily: "RobotoRegular, sans-serif",
                    fontSize: "17px",
                    listStyleType: "disc",
                    paddingLeft: "20px"
                }}>
                    <li>ACM Conference on Bioinformatics, Computational Biology, and Health Informatics</li>
                    <li>IEEE Conference on Artificial Intelligence (CAI)</li>
                    <li>IEEE International Conference on Healthcare Informatics</li>
                    <li>IEEE World Congress on Computational Intelligence</li>
                </ul>
            </>
        );
    }

    return (
        <Box ref={innerRef} display={'flex'} flexDirection={'column'} alignItems={'center'} mt={'3rem'} id={'services'}>
            <Terminal text={aboutMeText()} />
        </Box>
    );
}
