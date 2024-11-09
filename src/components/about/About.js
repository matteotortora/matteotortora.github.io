import React from 'react';
import Terminal from "./Terminal";
import {Box} from "@mui/material";
import {info} from "../../info/Info";


export default function About({innerRef}) {
    const firstName = info.firstName.toLowerCase()

    function aboutMeText() {
        return (
            <>
                <p style={{color: "#1f1f1f", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                    🌟 Hello! I’m an Assistant Professor at University of Genoa, Department of Naval, Electrical,
                    Electronics and Telecommunications Engineering.
                </p>
                <p style={{color: "#1f1f1f", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                    ⏰ Previously, I graduated with honors in biomedical engineering from the University Campus
                    Bio-Medico of Rome (UCBM), where I also completed my PhD in Biomedical Engineering (Computer Science
                    area).
                    Subsequently, I undertook a PostDoc focusing on Artificial Intelligence for precision medicine at
                    UCBM on the topic of Artificial Intelligence.
                </p>
                <p style={{color: "#1f1f1f", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                    💡My research interests encompass multimodal deep learning, reinforcement learning, and computer
                    vision in biomedical and industrial fields.
                </p>
                <p style={{color: "#1f1f1f", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                    👩‍🎓 <strong>Supervising Students:</strong> As a mentor, I’ve had the honor of guiding brilliant
                    students:
                </p>

                <ul style={{
                    fontFamily: "RobotoRegular, sans-serif",
                    fontSize: "17px",
                    listStyleType: "disc",
                    paddingLeft: "20px"
                }}>

                    <li style={{color: "#000000", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                        <a href="https://www.linkedin.com/in/elenamulero/" target="_blank" rel="noopener noreferrer"
                           style={{color: "#000000", textDecoration: "none"}}>
                            Elena Mulero Ayllon
                        </a>: B.Sc. in Biomedical Sciences at International University of Catalonia
                    </li>
                    <li style={{
                        color: "#000000",
                        fontFamily: "RobotoRegular, sans-serif",
                        fontSize: "17px"
                    }}>
                        <a href="https://www.linkedin.com/in/massimiliano-mantegna-b9138a1b9/" target="_blank"
                           rel="noopener noreferrer"
                           style={{color: "#000000", textDecoration: "none"}}>
                            Massimiliano Mantegna
                        </a>: PhD in Artificial Intelligence at UCBM
                    </li>
                    <li style={{color: "#000000", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                        <a href="https://www.linkedin.com/in/leonardo-furia-91852a1ab/" target="_blank"
                           rel="noopener noreferrer"
                           style={{color: "#000000", textDecoration: "none"}}>
                            Leonardo Furia
                        </a>: PhD in Artificial Intelligence at UCBM
                    </li>
                    <li style={{color: "#000000", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                        <a href="https://www.linkedin.com/in/lorenzo-marcoccia-3306a0218/" target="_blank"
                           rel="noopener noreferrer"
                           style={{color: "#000000", textDecoration: "none"}}>
                            Lorenzo Marcoccia
                        </a>: PhD in Artificial Intelligence at UCBM
                    </li>
                    <li style={{color: "#000000", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                        <a href="https://www.linkedin.com/in/domenicopaolo99/" target="_blank" rel="noopener noreferrer"
                           style={{color: "#000000", textDecoration: "none"}}>
                            Domenico Paolo
                        </a>: PhD in Artificial Intelligence at UCBM
                    </li>
                    <li style={{color: "#000000", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                        <a href="https://www.linkedin.com/in/alessandro-ferranti/" target="_blank" rel="noopener noreferrer"
                           style={{color: "#000000", textDecoration: "none"}}>
                            Alessandro Ferranti
                        </a>: B.Sc. in Industrial Engineering at UCBM
                    </li>
                    <li style={{color: "#000000", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                        <a href="https://www.linkedin.com/in/domiziana-tornaghi-98a0a7204/" target="_blank" rel="noopener noreferrer"
                           style={{color: "#000000", textDecoration: "none"}}>
                            Domiziana Tornaghi
                        </a>: M.Sc. in Biomedical Engineering at UCBM
                    </li>
                    <li style={{color: "#000000", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                        <a href="https://www.linkedin.com/in/edoardo-caliano-b263162a3/" target="_blank" rel="noopener noreferrer"
                           style={{color: "#000000", textDecoration: "none"}}>
                            Edoardo Caliano
                        </a>: B.Sc. in Biomedical Engineering at UCBM
                    </li>
                </ul>

                <p style={{color: "#1f1f1f", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                    💪 <strong>Services:</strong> I contribute as a reviewer to the following journals:
                    Artificial Intelligence in Medicine, Breast Cancer Research and Treatment, Computational and
                    Structural Biotechnology Journal,
                    Computer Methods and Programs in Biomedicine, Expert Systems with Applications, International
                    Journal of Transportation Science and Technology,
                    Mathematical Biosciences and Engineering, Medical Physics, World Journal of Surgical Oncology.
                </p>
                <p style={{color: "#1f1f1f", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                    I also contribute as a reviewer to the following conferences:
                    ACM Conference on Bioinformatics, Computational Biology, and Health Informatics,
                    IEEE Conference on Artificial Intelligence (CAI), IEEE International Conference on Healthcare
                    Informatics,
                    IEEE World Congress on Computational Intelligence

                </p>
                <p style={{color: "#1f1f1f", fontFamily: "RobotoRegular, sans-serif", fontSize: "17px"}}>
                    I also co-organize the following workshops:
                    Generative Artificial Intelligence for Biomedical Application at the International Symposium
                    on Computer-Based Medical Systems 2025.
                </p>
            </>
        );
    }


    return (
        <Box ref={innerRef} display={'flex'} flexDirection={'column'} alignItems={'center'} mt={'3rem'} id={'about'}>
            <Terminal text={aboutMeText()}/>
        </Box>
    )

}