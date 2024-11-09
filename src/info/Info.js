import self from "../img/self.png"

/* Hi there! Thanks for checking out my portfolio template. Be sure to read the comments to get a better understanding of
how to make this template work best for you! */

export let colors = ["rgb(0,255,164)", "rgb(166,104,255)"];
/*
I highly recommend using a gradient generator like https://gradientgenerator.paytonpierce.dev/ to generate a pair of colors that you like.
These colors will be used to style your name on the homepage, the background of your picture, and some other accents throughout
the site.
 */

/* 
This variable will change the layout of the website from multipage to single, scrollable page
*/
export let singlePage = true;

/*
So let's get started! Some of the info below is pretty self-explanatory, like 'firstName' and 'bio'. I'll try to explain anything
that might not be obvious right off the bat :) I recommend looking at the template example live using "npm start" to get an idea
of what each of the values mean.
 */

export const info = {
    firstName: "Matteo",
    lastName: "Tortora",
    initials: "MT", // the example uses first and last, but feel free to use three or more if you like.
    position: "an Assistant Professor in AI",
    selfPortrait: self, // don't change this unless you want to name your self-portrait in the "img" folder something else!
    gradient: `-webkit-linear-gradient(135deg, ${colors})`, // don't change this either
    baseColor: colors[0],
    miniBio: [ // these are just some "tidbits" about yourself. You can look at mine https://paytonjewell.github.io/#/ for an example if you'd like
        {
            emoji: '👨‍🏫',
            text: 'AI Researcher',
        },
        {
            emoji: '🌎',
            text: 'Based in Italy'
        },
        {
            emoji: "💼",
            text: "Assistant Professor at UNIGE"
        },
        {
            emoji: '🎓',
            text: 'PhD in Biomedical Engineering at UCBM'
        },
        {
            emoji: "📧",
            text: "matteo.tortora@unige.it"
        }
    ],
    socials: [
        {
            link: "https://scholar.google.com/citations?user=3WpZse0AAAAJ&hl=it&oi=ao",
            icon: "fa fa-graduation-cap",
            label: 'scholar'
        },
        {
            link: "https://github.com/matteotortora",
            icon: "fa fa-github",
            label: 'github'
        },
        {
            link: "https://www.linkedin.com/in/matteotortora/",
            icon: "fa fa-linkedin",
            label: 'linkedin'
        },


// Feel free to remove any of these that you don't have. I'll write an FAQ on how to add new ones later, let me know if you have a request for an icon!
// Just change the links so that they lead to your social profiles.

    ],
    portfolio: [ // This is where your portfolio projects will be detailed

    ],
    publications: [
        {
            title: "Title of the Publication 1",
            journal: "Journal Name or Conference",
            year: "2023",
            link: "https://linktopublication1.com"
        },
    ]
}