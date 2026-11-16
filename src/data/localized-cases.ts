import type { CaseStudy } from '@/types/content'
import { cases,caseBySlug } from '@/data/cases'
import { enCaseParity } from '@/data/en-case-parity'
import type { SiteLocale } from '@/lib/locale'

const translatedExternalCaseLinks:Record<string,string> = {
 'Pogledaj ImaPosla.me':'View ImaPosla.me',
 'Pogledaj BattleBotsArena.me':'View BattleBotsArena.me',
 'Pogledaj HiveAgency.me':'View HiveAgency.me',
 'Pogledaj Sindikat Events':'View Sindikat Events',
 'Stan na dan':'Short-stay apartment',
 'Grafičke mape':'Graphical maps'
}

type CaseTranslation={
 type:string;role:string;coverLabel:string;scope:string[];
 metrics?:string[][];subprojects?:[string,string][]
}
export const caseTranslations:Record<string,CaseTranslation> = {
  "imaposla-digitalni-proizvod": {
    "type": "Digital product + growth",
    "role": "Sindikat developed the product concept, positioning, user journeys, information architecture and production web platform, then connected it to distribution, community engagement and workflows for employers, candidates and administrators.",
    "coverLabel": "A platform for jobs, temporary assignments and services in Montenegro",
    "scope": [
      "Product positioning and definition of key user groups",
      "User journeys for candidates, employers, service providers and administrators",
      "Job listings, short-term assignments, worker profiles and service marketplace",
      "City, category, company and individual listing pages",
      "Registration, applications, content management and commercial packages",
      "SEO, analytics, campaign distribution and community integration"
    ],
    "metrics": [
      [
        "3 journeys",
        "jobs, short-term assignments and services"
      ],
      [
        "3 roles",
        "candidate, employer and administrator"
      ],
      [
        "Montenegro",
        "local product focus"
      ]
    ]
  },
  "battlebots-arena": {
    "type": "STEAM programme + event production",
    "role": "Sindikat participated in project coordination, digital presentation, registration and communications, workshop organization and production of the final event.",
    "coverLabel": "National STEAM programme and final robot-fighting arena",
    "scope": [
      "Concept, phased planning and operational design for a multi-month programme",
      "Website, registration flows and participant information",
      "Coordination of workshops, trainers, mentors and partner organizations",
      "Communication of deadlines, rules, safety requirements and next steps",
      "Production of the final arena, event protocol, programme and participant flow",
      "Photography, video, content, reporting and final documentation"
    ],
    "metrics": [
      [
        "10",
        "finalist teams"
      ],
      [
        "4",
        "themed workshops"
      ],
      [
        "6 months",
        "programme duration"
      ]
    ]
  },
  "sistem-za-terenske-angazmane": {
    "type": "Promotional teams + logistics",
    "role": "Sindikat coordinates teams from the first brief to the completed shift, covering staff selection, availability checks, preparation, schedules, communication, contingency staffing, supervision and operational reporting.",
    "coverLabel": "People, shifts, locations and delivery control",
    "scope": [
      "Translate the brief into accurate staffing numbers, profiles, locations and time slots",
      "Recruit, check availability and select staff according to project requirements",
      "Briefings, communication rules, uniforms, materials and checklists",
      "Shift schedules, transport, team leaders and backup staff",
      "Record attendance, changes, exceptions and delivery by location",
      "Final operational and photographic reporting"
    ],
    "metrics": [
      [
        "150+",
        "people in the operational network"
      ],
      [
        "20+",
        "partners and collaborators"
      ],
      [
        "Montenegro",
        "assignments across the country"
      ]
    ],
    "subprojects": [
      [
        "Admiral Bet field operations",
        "Coordination of adult promotional teams and logistics across multiple locations with clear shifts, preparation and reporting. This case study focuses on operations and delivery standards."
      ],
      [
        "Multi-location promotions",
        "Scheduling, transport, materials, shift leaders and backup staff when an activation runs simultaneously at multiple venues."
      ],
      [
        "Event and hospitality staffing",
        "Hostesses, promoters, support staff and shift leaders for events, hospitality, special programmes and seasonal work."
      ]
    ]
  },
  "aktivacije-regulisanih-brendova": {
    "type": "Brand activations + field operations",
    "role": "Sindikat manages the activation team and operational workflow, including adult staff selection, briefings, schedules, venue coordination, quality standards and final photo documentation.",
    "coverLabel": "Adult teams and professional execution with clear standards",
    "scope": [
      "Select adult promotional staff according to the brief and type of venue",
      "Prepare messaging, uniforms, positions and conduct guidelines",
      "Plan shifts, confirm attendance and communicate with venue staff",
      "Coordinate with brand representatives and shift leaders",
      "Monitor visual and operational standards during execution",
      "Photographic documentation and final delivery review by location or date"
    ],
    "subprojects": [
      [
        "Jägermeister activations",
        "Promotional teams, preparation and branded execution at hospitality venues for adult audiences, following pre-agreed presentation standards."
      ],
      [
        "Jack Daniel’s activations",
        "Coordinating an adult promotional team, venue setup, location communication and documentation under the same operating process."
      ]
    ]
  },
  "privatni-i-korporativni-dogadjaji": {
    "type": "Event production + coordination",
    "role": "Sindikat can take responsibility for complete event coordination or clearly defined production elements, with a single operational plan, schedule, responsible people and contingency procedures during the event.",
    "coverLabel": "Private celebrations, corporate events and special formats",
    "scope": [
      "Event objective, format, budget framework and production plan",
      "Venue, supplier, performer and staff selection and coordination",
      "Setup, arrivals, programme, key moments and closing schedule",
      "Technical requirements, hospitality, guest welcome, protocol and communication",
      "On-site event management and real-time response to changes",
      "Photo and video documentation and final production review"
    ]
  },
  "mini-sajtovi-i-digitalni-alati": {
    "type": "Website development + digital tools",
    "role": "Sindikat develops the structure, content flow, design and frontend of compact digital experiences that explain the offer and guide visitors towards contacting, booking, finding the location or taking another concrete action.",
    "coverLabel": "DJ portfolio, accommodation and digital maps",
    "scope": [
      "Understand the offer and define one primary user action",
      "Content architecture and sales-oriented microsite sequence",
      "Visual systems tailored to each partner or format",
      "Mobile layout, direct contact, location and navigation",
      "Hosting within the existing domain and technical publication",
      "Maintenance and quick updates without rebuilding the platform"
    ],
    "subprojects": [
      [
        "DJ Miqelly",
        "A portfolio microsite introducing the performer, music identity, event formats, collaboration options and a direct booking contact."
      ],
      [
        "Short-stay accommodation",
        "A compact accommodation sales page with photos, location, amenities and a clear direct enquiry path."
      ],
      [
        "Graphic maps",
        "A mobile-friendly digital map tool for navigating illustrated locations and helping visitors find their way."
      ]
    ]
  },
  "hive-agency-platforma": {
    "type": "Digital product + web platform",
    "role": "Sindikat developed the structure of the digital offering, user journeys, design and web implementation of a platform that turns a large collection of different activities into an understandable sales catalogue.",
    "coverLabel": "Team-building programmes organized through clear digital journeys",
    "scope": [
      "Map programmes, activities and categories to how users search",
      "Information architecture for homepage, catalogue, categories and programme details",
      "Sales journey from inspiration through enquiry and scheduling",
      "Visual system and reusable components for many different activities",
      "Mobile experience, contact options and clear calls to action",
      "Technical implementation, publishing and foundations for catalogue expansion"
    ]
  },
  "student-connect-mini-festival": {
    "type": "Community programme + event production",
    "role": "The project involved the programme design and organization, coordination of participants and content, communication with student audiences and on-site production.",
    "coverLabel": "Education, connections and festival atmosphere",
    "scope": [
      "Programme structure and scheduling for a two-day format",
      "Coordination of workshops, participants and different content types",
      "Communication of the programme and practical information to students",
      "Venue production, schedules and audience movement",
      "On-site coordination during both event days",
      "Documentation of the atmosphere, content and community moments"
    ],
    "metrics": [
      [
        "2",
        "programme days"
      ],
      [
        "Podgorica",
        "location"
      ],
      [
        "Community",
        "learning and connections"
      ]
    ]
  },
  "kucica-na-podgorickom-pazaru": {
    "type": "Seasonal activation + operations",
    "role": "Sindikat combined digital presentation of the offering, team coordination, daily operations, content and venue management in an intensive seasonal format.",
    "coverLabel": "Seasonal venue, digital menu, team and daily operations",
    "scope": [
      "Visual and functional setup of the seasonal stand",
      "Team schedules, shifts and responsibility assignment",
      "Digital QR menu and simple mobile access to information",
      "Daily coordination of offers, content and on-site communication",
      "Adaptation to programme changes and visitor demand",
      "Documentation of the venue, atmosphere and operational execution"
    ]
  }
}
export const translatedCases:CaseStudy[]=cases.map(item=>{
 const en=enCaseParity[item.slug]
 const detail=enCaseParity[item.slug]
 const extra=caseTranslations[item.slug]
 if(!en||!detail||!extra)throw new Error('Case study missing English localization: '+item.slug)
 if(extra.scope.length!==item.scope.length)throw new Error('Case study scope count differs: '+item.slug)
 if((extra.metrics?.length||0)!==(item.metrics?.length||0))throw new Error('Case study metric count differs: '+item.slug)
 if((extra.subprojects?.length||0)!==(item.subprojects?.length||0))throw new Error('Case study subproject count differs: '+item.slug)
 return {
  ...item,type:extra.type,title:en.title,summary:en.summary,role:extra.role,
  links:item.links?.map(link=>({...link,label:translatedExternalCaseLinks[link.label]||link.label})),
  challenge:detail.challenge,solution:detail.solution,result:detail.result,
  coverLabel:extra.coverLabel,scope:[...extra.scope],
  metrics:extra.metrics,
  subprojects:item.subprojects?.map((sub,i)=>({
   ...sub,title:extra.subprojects![i][0],summary:extra.subprojects![i][1],
   link:sub.link?{...sub.link,label:sub.link.label.includes('alat')?'Open tool':'Open microsite'}:undefined
  })),
  coverImage:item.coverImage?{...item.coverImage,alt:'Project cover: '+en.title}:undefined,
  socialImage:item.socialImage?{...item.socialImage,alt:'Case study: '+en.title}:undefined,
  gallery:item.gallery.map((media,i)=>({
    ...media,label:en.title+' - view '+String(i+1),
    image:media.image?{...media.image,alt:en.title+' - project image '+String(i+1)}:undefined
  }))
 }
})
export const translatedCaseBySlug:Record<string,CaseStudy>=Object.fromEntries(translatedCases.map(item=>[item.slug,item]))
export function localizedCase(slug:string,locale:SiteLocale):CaseStudy|undefined{
 return locale==='en'?translatedCaseBySlug[slug]:caseBySlug[slug]
}
