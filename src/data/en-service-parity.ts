// Hand-written translation pairs follow the original five Serbian service pages.
// Every array entry corresponds to the same source position in src/data/services.ts.
export const enServiceParity: Record<string, {
 eyebrow:string;title:string;shortTitle:string;summary:string;
 outcomes:string[];engagements:{name:string;text:string}[];
}> = {
 'performance-marketing':{
  eyebrow:'Advertising system',
  title:'Ads that generate enquiries, bookings and sales',
  shortTitle:'Digital advertising',
  summary:'We connect Meta and Google campaigns with the offer, landing page, measurement and creative work. We optimize not just for clicks, but for actions with business value: an enquiry, booking, registration, visit or sale.',
  outcomes:['More qualified conversions','A clearer relationship between budget and results','A clear way to identify which ads work'],
  engagements:[
   {name:'Diagnostic sprint',text:'An audit of the offer, campaigns, measurement and sales journey, with priorities and a concrete plan for the next steps.'},
   {name:'Setup and launch',text:'Measurement, campaign structure, creative package, landing page and a controlled launch.'},
   {name:'Continuous optimization',text:'A regular cycle of testing, budget allocation, learning, reporting and developing new creative directions.'}
  ]
 },
 'aktivacije-i-eventi':{
  eyebrow:'Field + digital',
  title:'Activations and events with a clear plan for people, locations and responsibilities',
  shortTitle:'Activations and events',
  summary:'We plan the concept, team, schedule, logistics, communication and on-site content. An activation is more than brand presence at a venue: it is an operational system with a goal, supervision and a final report.',
  outcomes:['A reliable team and well-organized logistics','Controlled execution at every location','Evidence and data to inform the next step'],
  engagements:[
   {name:'Activation plan',text:'Concept, mechanics, operational plan, responsibilities, deadlines and budget structure.'},
   {name:'Production and coordination',text:'People, shifts, locations, equipment, transport, supervision and a final report.'},
   {name:'Integrated campaign',text:'Digital distribution, content, field execution and measurement combined around one goal.'}
  ]
 },
 'web-i-konverzije':{
  eyebrow:'Websites and applications',
  title:'Websites and digital products that guide users to a clear action',
  shortTitle:'Websites and conversions',
  summary:'We build mobile-first landing pages, microsites and more complex digital products, with a clear offer, logical user journey, analytics and functional integrations.',
  outcomes:['An offer users understand quickly','Fewer obstacles to contacting you or applying','A technical foundation ready for campaigns and growth'],
  engagements:[
   {name:'Landing page',text:'One focused sales page with a clear call to action, form, analytics and basic SEO.'},
   {name:'Advanced microsite',text:'A compact presentation of a service, venue, performer or partner with multiple sections and a mobile-first approach.'},
   {name:'Digital product',text:'More complex user journeys, roles, integrations, administration and custom business logic.'}
  ]
 },
 'sadrzaj-za-kampanje':{
  eyebrow:'Content system',
  title:'Content people want to watch that also supports sales',
  shortTitle:'Campaign content',
  summary:'We plan messaging, formats and production around the audience, channel and stage of the customer journey. We create photography, video and design for Instagram, advertising and websites. The goal is not merely an attractive feed but content that delivers the right message.',
  outcomes:['More useful creative tests','Clearer, more consistent offer messaging','Assets ready for ads, social media and on-site use'],
  engagements:[
   {name:'Creative sprint',text:'Messages, angles, formats, scripts and a production plan for a specific objective or campaign.'},
   {name:'Production package',text:'An agreed set of photo, video and design assets, with final exports for selected channels.'},
   {name:'Continuous content system',text:'A regular cycle of planning, production, testing, refinement and asset reuse.'}
  ]
 },
 'recruitment-kampanje':{
  eyebrow:'Recruitment campaigns',
  title:'Job advertisements that reach the right candidates more easily',
  shortTitle:'Recruitment campaigns',
  summary:'We connect the employer offer, job ad, landing page or application form, distribution and initial screening questions. The goal is not to collect as many CVs as possible, but to reach people who meet the requirements and make applications easier to review.',
  outcomes:['More relevant applications','A faster, more organized initial process','Clearer insight into candidate sources and quality'],
  engagements:[
   {name:'Candidate profile and launch',text:'A clear job offer, tailored ad, application path and targeted distribution for an open position.'},
   {name:'Seasonal recruitment campaign',text:'Coordinated job advertising and applications for multiple positions or seasonal hiring needs.'},
   {name:'Ongoing recruitment system',text:'Regular job advertising, employer communication and organized candidate intake across relevant channels.'}
  ]
 }
}
