import { enServiceParity } from '@/data/en-service-parity'
import { enCaseParity } from '@/data/en-case-parity'

// English marketing copy, kept separate from the original Serbian (ijekavian) pages.
// Never pass unreviewed Serbian page bodies through an English-language route.
export const enServices = [
  {slug:'performance-marketing', title:enServiceParity['performance-marketing'].shortTitle, summary:enServiceParity['performance-marketing'].summary, benefits:enServiceParity['performance-marketing'].outcomes},
  {slug:'aktivacije-i-eventi', title:enServiceParity['aktivacije-i-eventi'].shortTitle, summary:enServiceParity['aktivacije-i-eventi'].summary, benefits:enServiceParity['aktivacije-i-eventi'].outcomes},
  {slug:'web-i-konverzije', title:enServiceParity['web-i-konverzije'].shortTitle, summary:enServiceParity['web-i-konverzije'].summary, benefits:enServiceParity['web-i-konverzije'].outcomes},
  {slug:'sadrzaj-za-kampanje', title:enServiceParity['sadrzaj-za-kampanje'].shortTitle, summary:enServiceParity['sadrzaj-za-kampanje'].summary, benefits:enServiceParity['sadrzaj-za-kampanje'].outcomes},
  {slug:'recruitment-kampanje', title:enServiceParity['recruitment-kampanje'].shortTitle, summary:enServiceParity['recruitment-kampanje'].summary, benefits:enServiceParity['recruitment-kampanje'].outcomes},
] as const

export const enIndustries = [
  {slug:'ugostiteljstvo-i-turizam',title:'Hospitality and tourism',summary:'Campaigns, direct enquiries, seasonal planning, content, local visibility and operational support for hotels, restaurants, beach bars, accommodation and tourism programmes.'},
  {slug:'retail-i-fmcg',title:'Retail and FMCG',summary:'Product launches, point-of-sale promotions, promotional teams, multi-location logistics, content and digital follow-up to campaigns.'},
  {slug:'eventi-i-venue',title:'Events and venues',summary:'Concept, promotion, registrations or ticket sales, production, staff, guest flow and content for private, corporate, educational and community events.'},
  {slug:'nekretnine-i-premium-usluge',title:'Real estate and premium services',summary:'Clear digital presentation, campaigns for qualified enquiries, screening questions and contact tracking for offers with longer decision-making journeys.'},
  {slug:'poslodavci-i-zaposljavanje',title:'Employers and recruitment',summary:'Employer offers, campaigns, easy applications, ImaPosla distribution and organization of the initial recruitment journey for seasonal, operational and other positions.'},
] as const

export const enCaseSummaries = [
  {slug:'imaposla-digitalni-proizvod',title:enCaseParity['imaposla-digitalni-proizvod'].title,summary:enCaseParity['imaposla-digitalni-proizvod'].summary},
  {slug:'battlebots-arena',title:enCaseParity['battlebots-arena'].title,summary:enCaseParity['battlebots-arena'].summary},
  {slug:'sistem-za-terenske-angazmane',title:enCaseParity['sistem-za-terenske-angazmane'].title,summary:enCaseParity['sistem-za-terenske-angazmane'].summary},
  {slug:'aktivacije-regulisanih-brendova',title:enCaseParity['aktivacije-regulisanih-brendova'].title,summary:enCaseParity['aktivacije-regulisanih-brendova'].summary},
  {slug:'privatni-i-korporativni-dogadjaji',title:enCaseParity['privatni-i-korporativni-dogadjaji'].title,summary:enCaseParity['privatni-i-korporativni-dogadjaji'].summary},
  {slug:'mini-sajtovi-i-digitalni-alati',title:enCaseParity['mini-sajtovi-i-digitalni-alati'].title,summary:enCaseParity['mini-sajtovi-i-digitalni-alati'].summary},
  {slug:'hive-agency-platforma',title:enCaseParity['hive-agency-platforma'].title,summary:enCaseParity['hive-agency-platforma'].summary},
  {slug:'student-connect-mini-festival',title:enCaseParity['student-connect-mini-festival'].title,summary:enCaseParity['student-connect-mini-festival'].summary},
  {slug:'kucica-na-podgorickom-pazaru',title:enCaseParity['kucica-na-podgorickom-pazaru'].title,summary:enCaseParity['kucica-na-podgorickom-pazaru'].summary},
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

export const enCaseDetails: Record<string,{
challenge:string;solution:string;result:string}> = {
  'aktivacije-regulisanih-brendova': {
    challenge:'Brand activations in regulated categories require clear staff instructions, reliable coordination with venues and consistent operational standards. Every team member needs to understand their responsibilities and the agreed requirements before a shift starts.',
    solution:'Sindikat organizes adult promotional staff, briefings, schedules, venue communication, supervision and documentation. We define the process in advance and monitor execution against the agreed standards.',
    result:'The project has a clear operational point of responsibility, properly prepared teams and consistent documentation of what was delivered at each location.'
  },

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
