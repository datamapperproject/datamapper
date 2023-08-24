//create array of objects 
var proms = [
  {name: "sense", type: "verb", column: 0, action:0, active : true, links : ["link A", "link B", "story A", "case A"], desc: "Using senses as a tool for understanding cities involves immersing ourselves in their sensory experiences. By engaging with the sights, sounds, and even the tactile sensations of urban environments, we can discern their unique rhythms, cultures, and dynamics. This sensory-driven approach deepens our connection to cities, unveiling layers of meaning that go beyond conventional analyses. | img1 "},
  {name: "lifeworlds", type: "subject", column:1, action:0, active : false, links : ["case A","Tool B"],desc: "Lifeworld refers to the subjective and experiential reality of individuals within their immediate living environment. In the context of livable spaces, lifeworld encompasses the personal perceptions, emotions, and interactions that individuals have with their surroundings. It includes how people interpret and make sense of their environment, the routines and rituals they engage in, and the emotional connections they develop with the spaces they inhabit. Understanding lifeworld is crucial for creating truly livable spaces that cater to the holistic needs and well-being of the people who inhabit them.| img2 "},
  {name:"to describe", type:"verb2", column:2, action:0, active : false, links : ["link B"], desc: "An action refers to the process of articulating and detailing the various sensory, experiential, and perceptual aspects of the environment. This involves using language to convey the visual, auditory, tactile, and even emotional qualities of a place, capturing its unique character, ambiance, and the feelings it evokes. Describing livable spaces enables individuals to share their perspectives, insights, and personal connections, contributing to a richer and more comprehensive understanding of the environment's impact on human experience."},
  {name: "needs & aspirations", type:"object", column:3, action:0 , active :false, links : ["case A","Tool A"], desc: "Needs and aspirations refer to the essential requirements and desires that individuals have in relation to their lives and living environments.Needs: These are the fundamental necessities that individuals require for their well-being and survival. These can include things like shelter, clean water, food, safety, and access to basic services. In the context of livable spaces, understanding the needs of people helps in designing environments that meet their fundamental requirements, ensuring comfort and security.Aspirations: Aspirations are the higher-level goals, hopes, and desires that individuals strive to achieve. These can include factors like personal growth, social connections, a sense of purpose, and opportunities for advancement. In terms of livable spaces, acknowledging people's aspirations allows for the creation of environments that not only fulfill basic needs but also foster a sense of fulfillment, belonging, and personal development.When designing cities and spaces, considering both the needs and aspirations of the people who will inhabit them is essential for creating environments that promote well-being, satisfaction, and a high quality of life."},
  {name: "formulate", type: "verb", column: 0, action:1, active : true, links : ["case C"], desc: "Formulation is a way to understand"},
  {name: "concepts", type: "subject", column:1, action:1, active : false, links : ["link C"], desc: "Concepts are the things we think"},
  {name:"to frame", type:"verb2", column:2, action:1, active : false, links : ["link D"], desc: "Framing helps us to formulate"},
  {name: "problems", type:"object", column:3 , action:1, active : false, links : ["story D", "Tool A"], desc: "Problems are the things we want to change"},
  {name: "gather", type: "verb", column: 0, action:2, active : true, links : ["link E","urscape"], desc: "Gathering put things together"},
  {name: "data", type: "subject", column:1, action:2, active : false, links : ["case E", "urscape","Data mapper"], desc: "Data is the things we know"},
  {name:"to analyse", type:"verb2", column:2, action:2, active : false, links : ["link F", "story B"], desc: "Analysis gives us insights"},
  {name: "limits", type:"object", column:3, action:2, active : false , links : ["story B", "link K"], desc: "Limits are the things we can't do"},
  {name: "imagine", type: "verb", column: 0, action:3, active : true, links : ["link G"], desc: "Imagination gives us ideas"},
  {name: "potentials", type: "subject", column:1, action:3, active : false, links : ["link G"], desc: "Potentials are the things we can do"},
  {name:"to create", type:"verb2", column:2, action:3, active : false, links : ["link B", "story C"], desc: "Creation is process of making things"},
  {name: "ideas", type:"object", column:3, action:3 , active : false, links : ["story C", "link A"], desc: "Ideas are the things we can do"},
  {name: "craft", type: "verb", column: 0, action:4, active : true, links : ["link H"], desc: "Craft helps us to elevate our ideas"},
  {name: "cases", type: "subject", column:1, action:4, active : false, links : ["link H"], desc: "Cases are the things we can do"},
  {name:"to evaluate", type:"verb2", column:2, action:4, active : false, links : ["link D", "story D","Tool B"], desc: "Evaluation discovers the value of things"},
  {name: "solutions", type:"object", column:3 , action:4, active : false, links : ["story A", "case A","Tool A"], desc: "Solutions are the final products"},
  {name: "empower", type: "verb", column: 0, action:5, active : true, links : ["link I","Tool C"], desc: "Empowerment pushes others to do things"},
  {name: "participants", type: "subject", column:1, action:5, active : false, links : ["link I", "link J"], desc: "Participants are the things we can do"},
  {name:"to negotiate", type:"verb2", column:2, action:5, active : false, links : ["link F", "story A","case A"], desc: "Negotiation is a way to find compromises"},
  {name: "projects", type:"object", column:3 , action:5, active : false, links : ["story C", "story D"], desc: "Projects are the things we can do"},
];

var historyData = [
  {name: "sense lifeworlds to describe needs & aspirations", user:1, desc: "In HofenCity, we did sense structure of the city"},
  {name: "formulate concepts to frame problems",user:1, desc: "In HofenCity, we formulate Open city concepts to frame problems"},
  {name: "gather data to analyse limits",user:1, desc: "In HofenCity, we gathered data on accesibility to analyse limits | img3"},
  {name: "imagine data to frame needs & aspirations",user:1,desc: "In HofenCity we tried to imagine run survey to frame needs & aspirations of people"},
  {name: "empower cases to create limits",user:3, desc: "In Czechia, we got so far and try so hard but on the end nothing really matters"},

];

layoutSetup = [
  {x: 0, y: 0,w : 0, h : 0}, // header
  {x: 0, y: 10,w : 40, h : 70},  //actions
  {x: 0, y: 80,w : 100, h : 20}, //dna
  {x: 60, y: 0,w : 0, h : 0}, //tools
  {x: 40, y: 10,w : 60, h : 70}, //arena
  {x: 70, y: 0,w : 0, h : 70} //right
];

var toolsList = [
  {name:"urscape"},
  {name:"toolA"},  
  {name:"toolB"},
  {name:"toolC"},
  {name:"toolD"},

];
