
export type EnglishServiceDetail = {
  bestFor:string[]; needFromYou:string[]; successSignals:string[];
  includes:string[]; process:{name:string;text:string}[]; faq:{question:string;answer:string}[];
}

export const enServiceDetails:Record<string,EnglishServiceDetail> = {
  'performance-marketing':{
    bestFor:[
      'Businesses with a viable offer but an inconsistent flow of qualified enquiries',
      'Teams spending on advertising without trustworthy tracking or clear results',
      'Product launches, seasonal campaigns and local offers that need structured testing',
      'Projects combining ads with landing pages, creative production or on-site activity'
    ],
    needFromYou:[
      'Your actual offer, pricing or business model, and what customers can currently purchase',
      'Access to existing advertising accounts, website and analytics where available',
      'A decision-maker who can approve messaging and changes promptly',
      'The capacity to follow up on enquiries and share feedback on their quality'
    ],
    successSignals:[
      'Important steps in the customer journey are measured correctly',
      'We understand which ads produce enquiries and how much they cost',
      'Successful messages and formats can be repeated or expanded',
      'We can identify what to improve when enquiry volume or quality declines'
    ],
    includes:[
      'Review of goals, audience, offer and current sales journey',
      'Channel plan, campaign structure and testing phases',
      'Setup or restructuring of Meta and Google Ads campaigns',
      'GA4, GTM and events that measure meaningful conversions',
      'Campaign concepts, advertising copy and testable creative variations',
      'Budget optimization and understandable reporting with next steps'
    ],
    process:[
      {name:'Audit',text:'We examine the offer, market, data, existing campaigns and points where prospective customers drop off.'},
      {name:'Setup and measurement',text:'We connect the campaign, audience, landing page and tracking so each test can be interpreted.'},
      {name:'Controlled testing',text:'We test messages, formats and audiences on a scale that can produce useful feedback without prematurely exhausting the budget.'},
      {name:'Improvement',text:'We shift budget towards combinations producing better-quality results and document what to develop next.'}
    ],
    faq:[
      {question:'What advertising budget should we start with?',answer:'It depends on the offer, margins, market, duration and amount of data needed. We first define a realistic test rather than promise a universal budget.'},
      {question:'Do you only run Meta Ads?',answer:'No. We use Meta, Google and other relevant channels where they clearly support the customer journey.'},
      {question:'Can you work with our existing website?',answer:'Yes. We review loading speed, messaging, mobile usability, calls to action and measurement. Sometimes improvements are enough; sometimes a dedicated landing page makes more sense.'},
      {question:'Who follows up on campaign enquiries?',answer:'Clients may handle their own enquiries while we help organize feedback and tracking. For broader projects, the intake and initial qualification process can also be included.'}
    ]
  },
  'aktivacije-i-eventi':{
    bestFor:[
      'Brands planning activities at one or several locations',
      'Seasonal projects requiring team rosters, travel, shift managers and backup coverage',
      'Events where marketing, production and staff must follow one schedule',
      'Experiences linking in-person participation with QR actions, sign-ups, content or follow-up'
    ],
    needFromYou:[
      'Objectives, dates, locations and an estimate of attendance',
      'Brand guidelines, communication rules and materials',
      'One person who can make operational decisions and provide approvals',
      'Known venue, supplier and category-specific restrictions'
    ],
    successSignals:[
      'Every shift is staffed, confirmed and supported by a backup plan',
      'Team members understand their message, location and responsibilities',
      'Equipment, materials and records meet the agreed standard',
      'The client receives a delivery report with evidence and practical recommendations'
    ],
    includes:[
      'Activation or event concept and operating plan',
      'Selection and coordination of promoters, hosts, shift supervisors and event staff',
      'Locations, shifts, travel, equipment and contingency arrangements',
      'Team briefing, checklists and clear communication responsibilities',
      'Photo and video documentation and agreed measures of interaction',
      'Final report covering delivery, issues, findings and next steps'
    ],
    process:[
      {name:'Objective and format',text:'We define what visitors should experience or do and what successful delivery means.'},
      {name:'Operating plan',text:'We document locations, schedules, team size, materials, logistics, responsibilities and risks.'},
      {name:'Team selection and briefing',text:'We select and confirm the right people, explain the message and standards, and review procedures in advance.'},
      {name:'Delivery and supervision',text:'The project lead monitors attendance, changes, materials and delivery quality during the event.'},
      {name:'Reporting and follow-up',text:'The client receives evidence of delivery, findings from the field and recommendations for future activity.'}
    ],
    faq:[
      {question:'Do you work outside Podgorica?',answer:'Yes. We coordinate projects across Montenegro. Travel, accommodation and additional logistics are scoped according to the location and schedule.'},
      {question:'Who provides uniforms and materials?',answer:'We can manage procurement and production or work with client-supplied materials. Either way, a checklist is agreed before deployment.'},
      {question:'How do you measure an activation?',answer:'The measure depends on its purpose: shifts delivered, interactions, registrations, QR actions, coupons, materials, content or qualitative field reporting.'},
      {question:'What happens if someone on the team cancels?',answer:'For larger and more time-sensitive projects, we plan backup staff, confirmation deadlines and replacement procedures in advance.'}
    ]
  },
  'web-i-konverzije':{
    bestFor:[
      'Businesses whose current website looks polished but leaves the offer unclear or produces too few enquiries',
      'New products, events and services needing a focused landing page',
      'Partners looking for a shareable microsite with direct contact, booking or directions',
      'Digital products with multiple users, profiles, content types and custom business rules'
    ],
    needFromYou:[
      'Your offer, main audience and the action the visitor should take',
      'Existing brand materials and photographs or a plan to create them',
      'Access to domains, hosting, analytics and integrations where applicable',
      'An owner who can approve structure, content and features at agreed stages'
    ],
    successSignals:[
      'Mobile visitors can quickly understand the offer and their next step',
      'Forms, redirects, links and integrations work reliably',
      'Important events are measured and campaigns have a suitable destination',
      'The website is documented, maintainable and ready for future development'
    ],
    includes:[
      'Information architecture, content priorities and user journeys',
      'Clear sales messaging, page titles, calls to action and microcopy',
      'Responsive design and production-quality frontend development',
      'Contact forms, applications, registration journeys and integrations',
      'Technical SEO, metadata, sitemap, redirects and structured data',
      'Analytics, quality assurance and launch preparation'
    ],
    process:[
      {name:'Page strategy',text:'We identify the audience, problem, information needs and the main conversion action.'},
      {name:'Structure and prototype',text:'We agree on page order, screens, content and functionality before final production.'},
      {name:'Design and development',text:'We build responsive, accessible and efficient interfaces with the required integrations.'},
      {name:'Content and measurement',text:'Copy, imagery, forms, analytics and SEO are aligned with the visitor journey.'},
      {name:'Testing and launch',text:'We test devices, links, forms, events, redirects and performance before and after release.'}
    ],
    faq:[
      {question:'Do we own the source code and accounts?',answer:'Yes. Ownership, handover, access, documentation and repository management are agreed as part of the project.'},
      {question:'Do you provide maintenance?',answer:'Yes. Ongoing maintenance or individual updates can be arranged, with new functionality scoped separately.'},
      {question:'Can you keep our existing forms and analytics?',answer:'Yes. Before migration we map endpoints, domains, conversions and redirects to prevent the loss of working functionality.'},
      {question:'Do we need all our photographs and content before starting?',answer:'Not necessarily. We can define the structure with working content, but final assets and text should be approved before launch.'}
    ]
  },
  'sadrzaj-za-kampanje':{
    bestFor:[
      'Campaigns without enough distinct creative ideas to test properly',
      'Brands connecting social content with an event, location or activation',
      'Teams that publish regularly but cannot explain which content supports business objectives',
      'Projects that need organized photo, video and design assets across formats and channels'
    ],
    needFromYou:[
      'Campaign objective, audience and accurate offer details',
      'Brand guidelines, existing assets and any communication restrictions',
      'Access to people, products or locations involved in production',
      'Timely approvals and feedback on enquiry quality or audience response'
    ],
    successSignals:[
      'Every asset has a defined audience, channel and role',
      'Campaigns have genuinely different messages and formats to test',
      'Strong concepts are developed further and weak ones are revised',
      'Photos, videos and design files remain useful across future campaigns'
    ],
    includes:[
      'Communication concepts and a content plan tied to the campaign objective',
      'Opening hooks, headlines and calls to action',
      'Scripts, shot lists, schedules and production organization',
      'Photography, video, design and repurposing of existing material',
      'Exports for advertising, social platforms, websites and agreed channels',
      'An asset library, naming of variants and plans for reuse'
    ],
    process:[
      {name:'Audience and message',text:'We develop distinct communication angles based on the offer and the audience’s motivations.'},
      {name:'Production planning',text:'We agree on scenes, formats, people, locations, permissions, deliverables and dates.'},
      {name:'Production',text:'We film, design or adapt material in useful packages for the intended channels.'},
      {name:'Testing and analysis',text:'We connect creative variants to results instead of judging only their appearance.'},
      {name:'Developing successful ideas',text:'Useful messages and formats shape the next content and production cycle.'}
    ],
    faq:[
      {question:'Can you manage our social media?',answer:'Yes, where social channels have a clear role in sales, reputation or community building. We do not treat the number of posts as the only goal.'},
      {question:'Do you shoot on location?',answer:'Yes. Location production can be coordinated with venues, events, activations or a client’s internal team.'},
      {question:'Do we receive editable source files?',answer:'Final exports are standard. Editable files and working project materials can be included if agreed in the scope.'},
      {question:'Can you work with material we already have?',answer:'Yes. We first check quality, format and usage rights, then decide whether adapting existing content is more useful than another shoot.'}
    ]
  },
  'recruitment-kampanje':{
    bestFor:[
      'Employers hiring seasonal, operational or hard-to-find profiles',
      'Companies recruiting for multiple roles or locations simultaneously',
      'Job advertisements receiving too few replies or too many unsuitable applications',
      'Teams needing a mix of campaigns, ImaPosla distribution and basic application organization'
    ],
    needFromYou:[
      'Accurate job details, location, schedule, requirements and non-negotiable conditions',
      'A realistic and clearly stated offer for the candidate',
      'A hiring contact who can respond to promising applicants promptly',
      'Feedback about interviews, decisions, hires and drop-offs'
    ],
    successSignals:[
      'The vacancy clearly explains the role and reduces mistaken expectations',
      'Candidates can complete a short application on their phone',
      'We know which channels bring suitable candidates rather than just volume',
      'Response times between application and first contact are visible'
    ],
    includes:[
      'Candidate profile and employer offer development',
      'Job copy, campaign concepts and role-specific messaging',
      'Landing page, form or another simple application flow',
      'Meta campaigns and distribution through ImaPosla and relevant channels',
      'Initial questions, application organization and status records',
      'Reporting on application sources, volume and suitability'
    ],
    process:[
      {name:'Profile and priorities',text:'We clarify the role, essential requirements, urgent vacancies and reasons for applicants to choose the offer.'},
      {name:'Offer and application',text:'We improve the job listing, benefits, terms and questions to make applying easier.'},
      {name:'Distribution',text:'We use campaigns and channels with access to relevant candidates in the target market.'},
      {name:'Feedback and follow-up',text:'We review response speed and applicant quality, not just clicks or form completion.'},
      {name:'Optimization',text:'We refine messaging, channels and questions based on the suitability of candidates.'}
    ],
    faq:[
      {question:'Can you guarantee that we will hire someone?',answer:'No. We can improve candidate reach, applications and process quality, but hiring depends on the job offer, conditions and employer decisions.'},
      {question:'Can we promote several vacancies at once?',answer:'Yes. We group campaigns according to urgency, location, profile and the employer’s capacity to process responses.'},
      {question:'Is ImaPosla required?',answer:'No. It is an option where its audience is relevant, but channels are selected according to the candidate profile.'},
      {question:'Do you run interviews?',answer:'Initial screening questions and application organization may be included. Detailed interviewing and final hiring decisions are agreed separately.'}
    ]
  }
}
