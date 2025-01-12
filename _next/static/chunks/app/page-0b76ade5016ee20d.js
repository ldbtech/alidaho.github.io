(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{5743:(e,t,i)=>{Promise.resolve().then(i.bind(i,2291)),Promise.resolve().then(i.bind(i,8943)),Promise.resolve().then(i.bind(i,6560)),Promise.resolve().then(i.bind(i,7494)),Promise.resolve().then(i.bind(i,2143)),Promise.resolve().then(i.bind(i,7758)),Promise.resolve().then(i.t.bind(i,7970,23))},2291:(e,t,i)=>{"use strict";i.d(t,{default:()=>d});var l=i(5155),a=i(2115),s=i(5565),r=i(6759);let n={default:{width:0},active:{width:"calc(100% - 0.75rem)"}},o=e=>{let{active:t,selectTab:i,children:a}=e;return(0,l.jsxs)("button",{onClick:i,children:[(0,l.jsx)("p",{className:"mr-3 font-semibold hover:text-white ".concat(t?"text-white":"text-[#ADB7BE]"),children:a}),(0,l.jsx)(r.P.div,{animate:t?"active":"default",variants:n,className:"h-1 bg-primary-500 mt-2 mr-3"})]})},c=[{title:"Skills",id:"skills",content:(0,l.jsxs)("ul",{className:"list-disc pl-2",children:[(0,l.jsx)("li",{children:"Programming Languages: Python, Java, C/C++, Scala, Go"}),(0,l.jsx)("li",{children:"AI: Pytorch, TensorFlow, Pandas, Matplotlib, Tableau, PowerBI"}),(0,l.jsx)("li",{children:"Data Management: Snowflake, SQL, Spark, Haadop"}),(0,l.jsx)("li",{children:"Hardware: Arduino, AC Controls, Assembly MIPS, Verilog"}),(0,l.jsx)("li",{children:"Cloud: AWS, Google Cloud, Firebase"}),(0,l.jsx)("li",{})]})},{title:"Education",id:"education",content:(0,l.jsx)("ul",{className:"list-disc pl-2",children:(0,l.jsx)("li",{children:"B.S in Computer Science - University at Buffalo - Buffalo, NY"})})},{title:"Certifications",id:"certifications",content:(0,l.jsxs)("ul",{className:"list-disc pl-2",children:[(0,l.jsx)("li",{children:"Coursera: Deep Learning Specialisation - DeepLearning.ai"}),(0,l.jsx)("li",{children:"Coursera: Self-Driving Car - Toronto University"}),(0,l.jsx)("li",{children:"Coursera: Java Programming Language - Duke University"})]})}],d=()=>{let[e,t]=(0,a.useState)("skills"),[i,r]=(0,a.useTransition)(),n=e=>{r(()=>{t(e)})};return(0,l.jsx)("section",{className:"text-white",id:"about",children:(0,l.jsxs)("div",{className:"md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16",children:[(0,l.jsx)(s.default,{src:"/images/profile-portfolio.jpg",width:500,height:500}),(0,l.jsxs)("div",{className:"mt-4 md:mt-0 text-left flex flex-col h-full",children:[(0,l.jsx)("h2",{className:"text-4xl font-bold text-white mb-4",children:"About Me"}),(0,l.jsx)("p",{className:"text-base lg:text-lg",children:"I am Computer Scientist student from University at Buffalo. I am passionate about building softwares that solves real world problems. I have worked on variety of projects in the past that involve Artifial intelligence, iOS development, Data engineering, Web develpment and Machine Learning. I am currently working on LLM Project to make it easier for freelancers and customers to find each others."}),(0,l.jsxs)("div",{className:"flex flex-row justify-start mt-8",children:[(0,l.jsxs)(o,{selectTab:()=>n("skills"),active:"skills"===e,children:[" ","Skills"," "]}),(0,l.jsxs)(o,{selectTab:()=>n("education"),active:"education"===e,children:[" ","Education"," "]}),(0,l.jsxs)(o,{selectTab:()=>n("certifications"),active:"certifications"===e,children:[" ","Certifications"," "]})]}),(0,l.jsx)("div",{className:"mt-8",children:c.find(t=>t.id===e).content})]})]})})}},8943:(e,t,i)=>{"use strict";i.d(t,{default:()=>r});var l=i(5155);i(2115);let a=(0,i(7711).default)(()=>Promise.all([i.e(103),i.e(182)]).then(i.t.bind(i,3332,23)),{loadableGenerated:{webpack:()=>[3332]},ssr:!1}),s=[{metric:"Projects",value:"100",postfix:"+"},{prefix:"~",metric:"Users",value:"100"},{metric:"Years",value:"5"}],r=()=>(0,l.jsx)("div",{className:"py-8 px-4 xl:gap-16 sm:py-16 xl:px-16",children:(0,l.jsx)("div",{className:"sm:border-[#33353F] sm:border rounded-md py-8 px-16 flex flex-col sm:flex-row items-center justify-between",children:s.map((e,t)=>(0,l.jsxs)("div",{className:"flex flex-col items-center justify-center mx-4 my-4 sm:my-0",children:[(0,l.jsxs)("h2",{className:"text-white text-4xl font-bold flex flex-row",children:[e.prefix,(0,l.jsx)(a,{includeComma:!0,animateToNumber:parseInt(e.value),locale:"en-US",className:"text-white text-4xl font-bold",configs:(e,t)=>({mass:1,friction:100,tensions:140*(t+1)})}),e.postfix]}),(0,l.jsx)("p",{className:"text-[#ADB7BE] text-base",children:e.metric})]},t))})})},6560:(e,t,i)=>{"use strict";i.d(t,{default:()=>d});var l=i(5155),a=i(2115);let s={src:"/alidaho.github.io/_next/static/media/github-icon.04fa7de0.svg",height:48,width:48,blurWidth:0,blurHeight:0},r={src:"/alidaho.github.io/_next/static/media/linkedin-icon.67ae5368.svg",height:48,width:48,blurWidth:0,blurHeight:0};var n=i(8173),o=i.n(n),c=i(5565);let d=()=>{let[e,t]=(0,a.useState)(!1),i=async e=>{e.preventDefault();let i=JSON.stringify({email:e.target.email.value,subject:e.target.subject.value,message:e.target.message.value}),l=await fetch("/api/send",{method:"POST",headers:{"Content-Type":"application/json"},body:i});await l.json(),200===l.status&&(console.log("Message sent."),t(!0))};return(0,l.jsxs)("section",{id:"contact",className:"grid md:grid-cols-2 my-12 md:my-12 py-24 gap-4 relative",children:[(0,l.jsx)("div",{className:"bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900 to-transparent rounded-full h-80 w-80 z-0 blur-lg absolute top-3/4 -left-4 transform -translate-x-1/2 -translate-1/2"}),(0,l.jsxs)("div",{className:"z-10",children:[(0,l.jsx)("h5",{className:"text-xl font-bold text-white my-2",children:"Let's Connect"}),(0,l.jsxs)("p",{className:"text-[#ADB7BE] mb-4 max-w-md",children:[" ","I'm currently looking for new opportunities, my inbox is always open. Whether you have a question or just want to say hi, I'll try my best to get back to you!"]}),(0,l.jsxs)("div",{className:"socials flex flex-row gap-2",children:[(0,l.jsx)(o(),{href:"https://github.com/ldbtech",children:(0,l.jsx)(c.default,{src:s,alt:"Github Icon"})}),(0,l.jsx)(o(),{href:"https://www.linkedin.com/in/alidaho/",children:(0,l.jsx)(c.default,{src:r,alt:"Linkedin Icon"})})]})]}),(0,l.jsx)("div",{children:e?(0,l.jsx)("p",{className:"text-green-500 text-sm mt-2",children:"Email sent successfully!"}):(0,l.jsxs)("form",{className:"flex flex-col",onSubmit:i,children:[(0,l.jsxs)("div",{className:"mb-6",children:[(0,l.jsx)("label",{htmlFor:"email",className:"text-white block mb-2 text-sm font-medium",children:"Your email"}),(0,l.jsx)("input",{name:"email",type:"email",id:"email",required:!0,className:"bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5",placeholder:"example@domain.com"})]}),(0,l.jsxs)("div",{className:"mb-6",children:[(0,l.jsx)("label",{htmlFor:"subject",className:"text-white block text-sm mb-2 font-medium",children:"Subject"}),(0,l.jsx)("input",{name:"subject",type:"text",id:"subject",required:!0,className:"bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5",placeholder:"Just saying hi"})]}),(0,l.jsxs)("div",{className:"mb-6",children:[(0,l.jsx)("label",{htmlFor:"message",className:"text-white block text-sm mb-2 font-medium",children:"Message"}),(0,l.jsx)("textarea",{name:"message",id:"message",className:"bg-[#18191E] border border-[#33353F] placeholder-[#9CA2A9] text-gray-100 text-sm rounded-lg block w-full p-2.5",placeholder:"Let's talk about..."})]}),(0,l.jsx)("button",{type:"submit",className:"bg-primary-500 hover:bg-primary-600 text-white font-medium py-2.5 px-5 rounded-lg w-full",children:"Send Message"})]})})]})}},7494:(e,t,i)=>{"use strict";i.d(t,{default:()=>c});var l=i(5155);i(2115);var a=i(5565),s=i(2615),r=i(6759),n=i(8173),o=i.n(n);let c=()=>(0,l.jsx)("section",{className:"lg:py-16",children:(0,l.jsxs)("div",{className:"grid grid-cols-1 sm:grid-cols-12",children:[(0,l.jsxs)(r.P.div,{initial:{opacity:0,scale:.5},animate:{opacity:1,scale:1},transition:{duration:.5},className:"col-span-8 place-self-center text-center sm:text-left justify-self-start",children:[(0,l.jsxs)("h1",{className:"text-white mb-4 text-4xl sm:text-5xl lg:text-8xl lg:leading-normal font-extrabold",children:[(0,l.jsxs)("span",{className:"text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-600",children:["Hello, I'm"," "]}),(0,l.jsx)("br",{}),(0,l.jsx)(s.d,{sequence:["Ali",1e3,"AI Developer",1e3,"iOS Developer",1e3,"Java Developer",1e3],wrapper:"span",speed:50,repeat:1/0})]}),(0,l.jsx)("p",{className:"text-[#ADB7BE] text-base sm:text-lg mb-6 lg:text-xl",children:"Explore a portfolio rich with projects in Mobile Development, Data Analytics, Data Engineering and Machine Learning."}),(0,l.jsxs)("div",{children:[(0,l.jsx)(o(),{href:"/#contact",className:"px-6 inline-block py-3 w-full sm:w-fit rounded-full mr-4 bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-200 text-white",children:"Hire Me"}),(0,l.jsx)(o(),{href:"/",className:"px-1 inline-block py-1 w-full sm:w-fit rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 hover:bg-slate-800 text-white mt-3",children:(0,l.jsx)("span",{className:"block bg-[#121212] hover:bg-slate-800 rounded-full px-5 py-2",children:"Download CV"})})]})]}),(0,l.jsx)(r.P.div,{initial:{opacity:0,scale:.5},animate:{opacity:1,scale:1},transition:{duration:.5},className:"col-span-4 place-self-center mt-4 lg:mt-0",children:(0,l.jsx)("div",{className:"rounded-full bg-[#181818] w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] relative",children:(0,l.jsx)(a.default,{src:"/images/Image.jpg",alt:"hero image",className:"absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2",width:300,height:300})})})]})})},2143:(e,t,i)=>{"use strict";i.d(t,{default:()=>h});var l=i(5155),a=i(8173),s=i.n(a),r=i(2115);let n=e=>{let{href:t,title:i}=e;return(0,l.jsx)(s(),{href:t,className:"block py-2 pl-3 pr-4 text-[#ADB7BE] sm:text-xl rounded md:p-0 hover:text-white",children:i})};var o=i(2460),c=i(4450);let d=e=>{let{links:t}=e;return(0,l.jsx)("ul",{className:"flex flex-col py-4 items-center",children:t.map((e,t)=>(0,l.jsx)("li",{children:(0,l.jsx)(n,{href:e.path,title:e.title})},t))})},m=[{title:"About",path:"#about"},{title:"Projects",path:"#projects"},{title:"Contact",path:"#contact"}],h=()=>{let[e,t]=(0,r.useState)(!1);return(0,l.jsxs)("nav",{className:"fixed mx-auto border border-[#33353F] top-0 left-0 right-0 z-10 bg-[#121212] bg-opacity-100",children:[(0,l.jsxs)("div",{className:"flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2",children:[(0,l.jsx)(s(),{href:"/",className:"text-2xl md:text-5xl text-white font-semibold",children:"LOGO"}),(0,l.jsx)("div",{className:"mobile-menu block md:hidden",children:e?(0,l.jsx)("button",{onClick:()=>t(!1),className:"flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white",children:(0,l.jsx)(c.A,{className:"h-5 w-5"})}):(0,l.jsx)("button",{onClick:()=>t(!0),className:"flex items-center px-3 py-2 border rounded border-slate-200 text-slate-200 hover:text-white hover:border-white",children:(0,l.jsx)(o.A,{className:"h-5 w-5"})})}),(0,l.jsx)("div",{className:"menu hidden md:block md:w-auto",id:"navbar",children:(0,l.jsx)("ul",{className:"flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0",children:m.map((e,t)=>(0,l.jsx)("li",{children:(0,l.jsx)(n,{href:e.path,title:e.title})},t))})})]}),e?(0,l.jsx)(d,{links:m}):null]})}},7758:(e,t,i)=>{"use strict";i.d(t,{default:()=>p});var l=i(5155),a=i(2115),s=i(557),r=i(351),n=i(8173),o=i.n(n);let c=e=>{let{imgUrl:t,title:i,description:a,gitUrl:n,previewUrl:c}=e;return(0,l.jsxs)("div",{children:[(0,l.jsx)("div",{className:"h-52 md:h-72 rounded-t-xl relative group",style:{background:"url(".concat(t,")"),backgroundSize:"cover"},children:(0,l.jsxs)("div",{className:"overlay items-center justify-center absolute top-0 left-0 w-full h-full bg-[#181818] bg-opacity-0 hidden group-hover:flex group-hover:bg-opacity-80 transition-all duration-500 ",children:[(0,l.jsx)(o(),{href:n,className:"h-14 w-14 mr-2 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link",children:(0,l.jsx)(s.A,{className:"h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white"})}),(0,l.jsx)(o(),{href:c,className:"h-14 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link",children:(0,l.jsx)(r.A,{className:"h-10 w-10 text-[#ADB7BE] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  cursor-pointer group-hover/link:text-white"})})]})}),(0,l.jsxs)("div",{className:"text-white rounded-b-xl mt-3 bg-[#181818]py-6 px-4",children:[(0,l.jsx)("h5",{className:"text-xl font-semibold mb-2",children:i}),(0,l.jsx)("p",{className:"text-[#ADB7BE]",children:a})]})]})},d=e=>{let{name:t,onClick:i,isSelected:a}=e;return(0,l.jsx)("button",{className:"".concat(a?"text-white border-primary-500":"text-[#ADB7BE] border-slate-600 hover:border-white"," rounded-full border-2 px-6 py-3 text-xl cursor-pointer"),onClick:()=>i(t),children:t})};var m=i(8586),h=i(6759);let x=[{id:1,title:"iOS App - Social Media",description:"Flikor, is an app to make it easy for students to find roommates.",image:"/images/ios-v2.png",tag:["All","iOS"],gitUrl:"https://github.com/ldbtech/Flikor_Continues",previewUrl:"/"},{id:2,title:"Rienforcement Learing Agent Play Tic Tac Toe",description:"I used Deep Q-LEARNING to create an agent that can play tic tac toe. ",image:"/images/tictactoe.jpeg",tag:["All","AI"],gitUrl:"/",previewUrl:"/"},{id:3,title:"Soccer Player Position Prediction",description:"This project is about predicting players positions in soccer matches based on their previous performance.",image:"/images/football.jpeg",tag:["All","AI"],gitUrl:"/",previewUrl:"/"},{id:4,title:"Food Ordering Web Application",description:"Build a food delivery web application, enabling users to browse restaurants, place orders, and track deliveries in real-time.",image:"/images/food-delivery.jpeg",tag:["All","Java"],gitUrl:"/",previewUrl:"/"},{id:5,title:"NS-3 Simulator",description:"- The project involves experimenting with the NS-3 Simulator on Linux Ubuntu, completing a total of four tasks.\n- Implemented and reviewed networking concepts such as routing, congestion control, delays, and network Quality of Service (QoS) parameters.",image:"/images/ns3-sim.jpeg",tag:["All","C/C++"],gitUrl:"/",previewUrl:"/"},{id:6,title:"Handwriting Recognition",description:"\nHandwritten Digits Classification\nHandwritten Digits Classification\nJul 2022 - Aug 2022Jul 2022 - Aug 2022\n\nAssociated with University at Buffalo\nAssociated with University at Buffalo\n• Built a neural network using python and no usage of external libraries, model accuracy on the MNIST Dataset was 82.4%. \n• Deployed a deep neural network model using TensorFlow and Python for classifying the MNIST dataset following AlexNet Architecture. The model was successfully getting an accuracy of 98.2% on the test set.",image:"/images/handwriting-detection.jpeg",tag:["All","AI"],gitUrl:"/",previewUrl:"/"},{id:7,title:"TCP/UDP Text Chat",description:"Built text chat application using TCP and UDP protocols.",image:"/images/tcp-ip.jpeg",tag:["All","C/C++"],gitUrl:"/",previewUrl:"/"},{id:8,title:"Conway's Game of Life Simulation",description:"Created a simulation of Conway's Game of Life, a cellular automaton that models the evolution of cells in a 2D grid based on a set of rules.",image:"/images/conways-game.png",tag:["All","C/C++"],gitUrl:"/",previewUrl:"/"},{id:9,title:"Face Detection - Image Processing",description:"Performed Face Detection using OpenCV and Python; used multiple facial detection algorithms like Haar Cascade, Deep Neural Network, and HOG. The F1 score of each algorithm was calculated by using the result JSON file to select the best algorithm. ",image:"/images/face-detection.png",tag:["All","AI"],gitUrl:"https://github.com/ldbtech/FaceDetection.git",previewUrl:"/"}],p=()=>{let[e,t]=(0,a.useState)("All"),i=(0,a.useRef)(null),s=(0,m.W)(i,{once:!0}),r=e=>{t(e)},n=x.filter(t=>t.tag.includes(e)),o={initial:{y:50,opacity:0},animate:{y:0,opacity:1}};return(0,l.jsxs)("section",{id:"projects",children:[(0,l.jsx)("h2",{className:"text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12",children:"My Projects"}),(0,l.jsxs)("div",{className:"text-white flex flex-row justify-center items-center gap-2 py-6",children:[(0,l.jsx)(d,{onClick:r,name:"All",isSelected:"All"===e}),(0,l.jsx)(d,{onClick:r,name:"AI",isSelected:"AI"===e}),(0,l.jsx)(d,{onClick:r,name:"iOS",isSelected:"iOS"===e}),(0,l.jsx)(d,{onClick:r,name:"Java",isSelected:"Java"===e}),(0,l.jsx)(d,{onClick:r,name:"C/C++",isSelected:"C/C++"===e})]}),(0,l.jsx)("ul",{ref:i,className:"grid md:grid-cols-3 gap-8 md:gap-12",children:n.map((e,t)=>(0,l.jsx)(h.P.li,{variants:o,initial:"initial",animate:s?"animate":"initial",transition:{duration:.3,delay:.4*t},children:(0,l.jsx)(c,{title:e.title,description:e.description,imgUrl:e.image,gitUrl:e.gitUrl,previewUrl:e.previewUrl},e.id)},t))})]})}}},e=>{var t=t=>e(e.s=t);e.O(0,[224,441,517,358],()=>t(5743)),_N_E=e.O()}]);