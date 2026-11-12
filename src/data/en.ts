// English marketing copy, kept separate from the original Serbian (ijekavian) pages.
// Never pass unreviewed Serbian page bodies through an English-language route.
export const enServices = [
  {slug:'performance-marketing',title:'Meta & Google advertising',summary:'Campaign strategy, tracking and creative testing focused on enquiries, bookings and measurable business results.',benefits:['A clear offer and campaign plan','Conversion tracking and transparent reporting','Creative testing and ongoing optimization']},
  {slug:'aktivacije-i-eventi',title:'Events & brand activations',summary:'Concept, teams, suppliers, locations and production coordinated by one accountable partner.',benefits:['Event concept and operating plan','On-site teams and supplier coordination','Photo and video documentation']},
  {slug:'web-i-konverzije',title:'Websites & digital products',summary:'Mobile-first websites, landing pages and digital platforms that make it easy for customers to take the next step.',benefits:['Clear website structure and responsive design','Enquiry forms, integrations and analytics','Search-friendly foundations and maintainability']},
  {slug:'sadrzaj-za-kampanje',title:'Content & creative production',summary:'Photography, video, campaign concepts and social content designed to communicate a real offer.',benefits:['Creative concepts and messaging','Photo and video production','Social media and advertising-ready assets']},
  {slug:'recruitment-kampanje',title:'Recruitment campaigns',summary:'Job campaigns, application flows and communication that help employers reach suitable candidates.',benefits:['Clear job and employer messaging','Application and enquiry experiences','Distribution and campaign measurement']},
] as const

export const enIndustries = [
  {slug:'ugostiteljstvo-i-turizam',title:'Hospitality & tourism',summary:'Seasonal campaigns, direct enquiries, location content and digital support for hotels, venues, restaurants and travel experiences.'},
  {slug:'retail-i-fmcg',title:'Retail & consumer brands',summary:'In-store promotions, coordinated teams, multiple locations and creative distribution for product launches and campaigns.'},
  {slug:'eventi-i-venue',title:'Events & venues',summary:'Production, ticketing or registration journeys, event staff and communications for corporate and community events.'},
  {slug:'nekretnine-i-premium-usluge',title:'Property & premium services',summary:'Presentation websites, targeted campaigns and content that make sophisticated offers easier to understand.'},
  {slug:'poslodavci-i-zaposljavanje',title:'Employers & recruitment',summary:'Employer campaigns, job listings, applicant journeys and hiring communications.'},
] as const

export const enCaseSummaries = [
  {slug:'imaposla-digitalni-proizvod',title:'ImaPosla.me - a jobs and services platform',summary:'A digital product connecting employers, candidates, short-term assignments and local services. Our work covered product positioning, journeys, site development and distribution.'},
  {slug:'battlebots-arena',title:'BattleBots Arena - a multi-stage education event',summary:'A programme bringing together registrations, workshops, mentors, competition logistics and the final arena event.'},
  {slug:'sistem-za-terenske-angazmane',title:'Field team coordination system',summary:'Planning people, shifts, briefings, locations, transport and reporting for promotional and event projects.'},
  {slug:'privatni-i-korporativni-dogadjaji',title:'Private & corporate events',summary:'A single operational partner for programmes, suppliers, venues, people and production.'},
  {slug:'mini-sajtovi-i-digitalni-alati',title:'Microsites & digital tools',summary:'Practical websites and online tools for creative partners, events, performers and local businesses.'},
  {slug:'hive-agency-platforma',title:'Hive Agency - a team-building catalogue',summary:'An online catalogue helping companies explore programmes and request a tailored group experience.'},
  {slug:'student-connect-mini-festival',title:'Student Connect - a student festival',summary:'A two-day event bringing together students, partners, programming and production.'},
  {slug:'kucica-na-podgorickom-pazaru',title:'Sindikat at the Podgorica market',summary:'A seasonal venue concept involving planning, daily operations, content and an on-site team.'},
] as const

export const enNavigation = [
  {label:'Services',href:'/en/usluge/'},
  {label:'Industries',href:'/en/industrije/'},
  {label:'Projects',href:'/en/radovi/'},
  {label:'Pricing',href:'/en/cijene/'},
  {label:'Blog',href:'/en/blog/'},
  {label:'About',href:'/en/o-nama/'},
  {label:'Contact',href:'/en/kontakt/'},
] as const

export const enCaseDetails: Record<string,{challenge:string;solution:string;result:string}> = {
  'imaposla-digitalni-proizvod':{
    challenge:'Jobs and recruitment information were scattered across social networks, messages, groups and disconnected listings. Candidates needed a reliable way to browse and apply, while employers needed simpler management of vacancies, candidates and promotions. The product had to support several user groups without making the first step complicated.',
    solution:'We structured a modular platform with separate journeys for job vacancies, short-term assignments and local services. The work includes city and category pages, employer and candidate profiles, applications, administrative controls, search-friendly content and community distribution. Mobile use is a central design priority.',
    result:'ImaPosla.me now provides a central digital experience that can develop through new employers, candidates, listings and revenue models without rebuilding the original concept. Both employers and candidates have clearer routes to the action they need.'
  },
  'battlebots-arena':{
    challenge:'A multi-month educational programme needed to connect participants, mentors, partners, technical requirements, workshops, communications and the final arena event. Each phase had to be understandable to newcomers, coordinated in time and suitable for a structured robotics programme.',
    solution:'We helped structure the journey from information and applications through workshops, team development and testing to the final event. The website and campaign materials centralized information and deadlines, while production planning coordinated people, partners and technical requirements.',
    result:'The programme developed a recognizable identity and a coherent route from application to public presentation. The educational work became an event that participants, partners, visitors and media could understand.'
  },
  'sistem-za-terenske-angazmane':{
    challenge:'Coordinating temporary teams across multiple locations involves more than collecting names. Attendance, transport, briefing, substitutions and on-site responsibilities have to work together, especially when several shifts and cities are involved.',
    solution:'We organized a central team roster, availability and shift confirmation process, pre-event briefing, attendance records, supervisor responsibilities and contingency replacements. Travel and logistics are planned as part of the operation rather than added at the last minute.',
    result:'Clients work with one coordination point instead of managing every individual. Multiple shifts and locations can follow a consistent process, with problems identified and addressed through a defined operating system.'
  },
  'privatni-i-korporativni-dogadjaji':{
    challenge:'Events frequently involve venues, performers, technical suppliers, staff and hosts working to different deadlines. Without one shared production plan, the client becomes responsible for coordinating too many moving parts.',
    solution:'We first agree on the format, attendance, venue, budget range and priorities. Then we plan the schedule, suppliers, technical needs, setup, guest experience, communication and contingency arrangements, with one person coordinating delivery on the day.',
    result:'Organizers have a clearer process and one point of contact, while guests experience an event with less visible friction. Documentation and a practical follow-up record remain after delivery.'
  },
  'mini-sajtovi-i-digitalni-alati':{
    challenge:'Smaller businesses and creative partners often need something more professional than a social profile or PDF, without the cost and complexity of a large website. Essential information must work well on mobile and be easy to share.',
    solution:'We developed a modular microsite approach using a common technical foundation and individual visual structures. Contact, location, calls and other important actions are prioritized in each mobile experience.',
    result:'Partners gain an independent professional online presentation without unnecessary infrastructure. The approach is reusable for performers, venues, events, services and small digital tools.'
  },
  'hive-agency-platforma':{
    challenge:'A broad team-building catalogue can overwhelm visitors. Companies need to understand the differences between activities, find a relevant option and see how to request a tailored programme.',
    solution:'We organized the offering into activity categories, featured programmes, dedicated pages and a clear journey towards consultation. The design and mobile experience help visitors explore options without losing sight of the next step.',
    result:'Hive Agency has a central commercial platform for its activities. Companies can explore programmes before contacting the team and arrive with a clearer idea of the experience they want.'
  },
  'student-connect-mini-festival':{
    challenge:'A student programme has to offer genuinely useful content while remaining lively enough to encourage conversation, participation and a sense of community. Multiple programme blocks need to feel part of one event.',
    solution:'We structured a two-day mini-festival with distinct educational, interactive and social parts. Communications and production were planned around the needs of a student audience and easy transitions between activities.',
    result:'The event combined learning, student connections and a festival atmosphere without becoming either a conventional conference or an event without substance.'
  },
  'kucica-na-podgorickom-pazaru':{
    challenge:'A seasonal venue must deliver a consistent visitor experience despite variations in attendance, staffing, weather and the wider programme. Visitors need clear information, while the team needs predictable daily operations.',
    solution:'We created a recognizable physical presentation, scheduled the on-site team and introduced a QR-accessible digital menu. Daily operations, content and communication were aligned with the actual event schedule.',
    result:'The project demonstrates practical delivery of an owned seasonal format where a digital tool, a team, content and a physical location all operate as one experience.'
  }
}
