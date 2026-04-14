import { G } from './theme';

export const ALL_SERVICES = [
  { abbr:"AC", name:"AC Repair & Servicing",     cat:"Electrical & Cooling",  type:"assessment", price:"GHS 300", popular:true,  desc:"Diagnose, clean, regas, and repair all AC brands. Same-day available in most areas." },
  { abbr:"EL", name:"Electrical Repairs",          cat:"Electrical & Cooling",  type:"assessment", price:"GHS 300", popular:false, desc:"Fault finding, socket repairs, wiring, breaker issues, and rewiring." },
  { abbr:"LT", name:"Light Installation",          cat:"Electrical & Cooling",  type:"fixed",      price:"GHS 80",  popular:false, desc:"Ceiling lights, bulb replacements, chandelier installation." },
  { abbr:"GR", name:"Generator Repair",            cat:"Electrical & Cooling",  type:"assessment", price:"GHS 300", popular:false, desc:"Diagnose and fix generator faults. Servicing and maintenance packages available." },
  { abbr:"PL", name:"Plumbing Repairs",            cat:"Plumbing & Water",      type:"assessment", price:"GHS 300", popular:true,  desc:"Leaking pipes, burst pipes, blocked drains, toilet repairs, and fixture installation." },
  { abbr:"PT", name:"Polytank Cleaning",           cat:"Plumbing & Water",      type:"fixed",      price:"GHS 80",  popular:true,  desc:"Deep clean and disinfect your polytank. Before/after photos provided." },
  { abbr:"BH", name:"Borehole & Pump Repair",      cat:"Plumbing & Water",      type:"assessment", price:"GHS 300", popular:false, desc:"Submersible pump repair, borehole servicing, pressure tank issues." },
  { abbr:"CL", name:"House Cleaning",              cat:"Cleaning",              type:"fixed",      price:"GHS 120", popular:true,  desc:"Full home clean with all equipment provided. Weekly packages available." },
  { abbr:"DC", name:"Deep Cleaning",               cat:"Cleaning",              type:"fixed",      price:"GHS 200", popular:false, desc:"Intensive clean for kitchens, bathrooms, and heavily soiled areas." },
  { abbr:"CP", name:"Sofa & Carpet Cleaning",     cat:"Cleaning",              type:"fixed",      price:"GHS 150", popular:false, desc:"Steam clean sofas, mattresses, rugs, and carpets." },
  { abbr:"FM", name:"Fumigation & Pest Control",   cat:"Cleaning",              type:"fixed",      price:"GHS 150", popular:false, desc:"Cockroaches, mosquitoes, rats, bedbugs, and termites." },
  { abbr:"IP", name:"Interior Painting",           cat:"Painting & Decor",      type:"assessment", price:"GHS 300", popular:false, desc:"Walls, ceilings, trim. Emulsion, oil, or textured finishes." },
  { abbr:"EP", name:"Exterior Painting",           cat:"Painting & Decor",      type:"assessment", price:"GHS 300", popular:false, desc:"Weather-resistant exterior coatings. Compound walls and gates included." },
  { abbr:"CP", name:"Carpentry & Woodwork",        cat:"Construction & Fixes",  type:"assessment", price:"GHS 300", popular:false, desc:"Doors, windows, cabinets, furniture repairs, and custom woodwork." },
  { abbr:"TL", name:"Tiling & Floor Laying",       cat:"Construction & Fixes",  type:"assessment", price:"GHS 300", popular:false, desc:"Floor and wall tiles, bathroom tiling, and grouting." },
  { abbr:"CV", name:"CCTV Installation",           cat:"Security",              type:"assessment", price:"GHS 300", popular:true,  desc:"IP cameras, DVR setup, night vision, and remote viewing configuration." },
  { abbr:"SL", name:"Door Lock & Security",        cat:"Security",              type:"fixed",      price:"GHS 60",  popular:false, desc:"Lock replacement, mortise locks, digital locks, and deadbolts." },
  { abbr:"SO", name:"Solar Panel Installation",    cat:"Energy",                type:"assessment", price:"GHS 300", popular:false, desc:"Grid-tie and off-grid solar systems. Inverter and battery setup." },
  { abbr:"TV", name:"TV Mounting & Setup",         cat:"Mounting",              type:"fixed",      price:"GHS 80",  popular:false, desc:"Wall-mount any TV size. HDMI setup, cable management included." },
  { abbr:"GD", name:"Garden & Lawn Care",          cat:"Outdoor",               type:"fixed",      price:"GHS 100", popular:false, desc:"Grass cutting, trimming, weeding, and compound maintenance." },
];

export const CATS = ["All", "Electrical & Cooling", "Plumbing & Water", "Cleaning", "Painting & Decor", "Construction & Fixes", "Security", "Energy", "Mounting", "Outdoor"];

export const STEPS_DATA = [
  {
    n:"01", color: G.gold,
    title:"Choose your service",
    short:"Browse & select",
    desc:"Browse 30+ home services organized by category. Pick Fixed Price for straightforward jobs or Assessment Visit for complex repairs.",
    detail:"Our categories are built around how Ghanaian homes actually work - from AC systems that struggle with Dumsor to polytank cleaning.",
    tip:"Tip: Not sure which service you need? Tap Assessment and describe your problem.",
  },
  {
    n:"02", color: G.green,
    title:"Get matched in minutes",
    short:"Find your Tasker",
    desc:"Our algorithm finds the nearest available Tasker with the right skills, highest rating, and relevant experience.",
    detail:"You'll see their full profile - real photo, Ghana Card verified badge, all past reviews, and job count before you confirm.",
    tip:"Tip: Look for the Elite badge - these are Taskers with 100+ jobs and a 4.8+ rating.",
  },
  {
    n:"03", color: G.gold,
    title:"Pay safely via MoMo",
    short:"Secure payment",
    desc:"Pay the GHS 300 assessment fee (for mapping, measurements, and analysis) or full amount via MoMo. Your money goes into escrow - not to the Tasker - until you confirm the job is done.",
    detail:"For jobs requiring materials: 50% is released as a deposit when the Tasker's quote is approved. They must upload a receipt photo.",
    tip:"Tip: You're always in control. The Tasker cannot touch your money until you say so.",
  },
  {
    n:"04", color: G.green,
    title:"Tasker arrives & works",
    short:"Job in progress",
    desc:"Your Tasker arrives at the scheduled time, completes the assessment or job, and keeps you updated through the app.",
    detail:"For assessment jobs: the Tasker inspects the problem and submits a detailed quote in the app - labour cost, materials list, and time.",
    tip:"Tip: Tap 'Work Started' in the app when the Tasker begins - this starts the job timer.",
  },
  {
    n:"05", color: G.green,
    title:"Confirm & release payment",
    short:"You're in control",
    desc:"Inspect the completed work yourself. Happy? Tap 'Job Done' and payment is released to the Tasker instantly via MoMo.",
    detail:"Our Happiness Guarantee means if the job isn't right, we'll send another Tasker to fix it free - or refund you in full.",
    tip:"Tip: Leave an honest review - it helps other families find great Taskers.",
  },
];

export const TEAM = [
  { name:"Kwame Asante",   role:"Co-Founder & CEO",      bg:G.green, init:"KA", bio:"Former product manager at Jumia Ghana. Passionate about fixing broken marketplaces." },
  { name:"Adwoa Mensah",   role:"Co-Founder & CTO",      bg:G.black, init:"AM", bio:"Full-stack engineer with 8 years building mobile products for African markets." },
  { name:"Kofi Boateng",   role:"Head of Operations",    bg:G.gold,  init:"KB", bio:"Ex-Bolt Ghana operations lead. Knows Accra's streets intimately." },
  { name:"Ama Darko",      role:"Head of Tasker Success", bg:G.green, init:"AD", bio:"HR professional dedicated to supporting the Tasker community." },
];

export const SUPPORT_CHANNELS = [
  { name:"WhatsApp Support",   desc:"Chat with our team directly. Fastest response - usually under 15 minutes.", action:"Open WhatsApp", color:G.green, available:"7 days - 7AM-10PM" },
  { name:"Call Us",            desc:"Speak to a real person for urgent issues or complex disputes.", action:"0XX XXX XXXX", color:G.gold, available:"Mon-Sat - 8AM-8PM" },
  { name:"Email Support",      desc:"For non-urgent queries, billing questions, or formal complaints.", action:"support@taskgh.com", color:G.black, available:"Response within 4 hours" },
  { name:"In-App Chat",        desc:"Chat with support directly inside the TaskGH app while tracking your job.", action:"Open App", color:G.green, available:"24/7 for active bookings" },
];

export const SUPPORT_FAQS = [
  { cat:"Payments",  q:"How does escrow work exactly?",                   a:"When you pay for a job, your money is held in our escrow system - not released to the Tasker until you tap 'Job Done'. For assessment jobs requiring materials, 50% is released upfront (with receipt required)." },
  { cat:"Payments",  q:"What if I paid but the Tasker didn't show up?",   a:"Raise a dispute in the app within 24 hours and we will issue a full refund within 2 business days and remove the Tasker." },
  { cat:"Taskers",   q:"How do I know if a Tasker is real?",              a:"Every Tasker submits a Ghana Card or Voter ID, provides a reference, and passes our vetting review. Look for the green verified badge." },
  { cat:"Taskers",   q:"Can I request the same Tasker again?",            a:"Yes! After a completed job, you can tap 'Rebook' on the Tasker's profile and schedule directly with them." },
  { cat:"Bookings",  q:"Can I cancel a booking?",                         a:"Yes. Cancel before the Tasker accepts for a full refund. Cancel within 2 hours and the GHS 300 assessment fee is non-refundable." },
  { cat:"Bookings",  q:"What areas do you cover?",                        a:"We currently cover East Legon, Airport Residential, Cantonments, Osu, Spintex, Tema, Adenta, Madina, and Achimota." },
];
