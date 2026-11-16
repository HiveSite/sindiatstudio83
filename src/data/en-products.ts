import type { ServiceProduct } from '@/data/service-products'

// Each product mirrors the Serbian catalogue by service slug and array index.
// Prices, featured positions, deliverables and scope are kept identical.
export const enProducts: Record<string, ServiceProduct[]> = {
  'performance-marketing':[
    {name:'Diagnosis and plan',price:'from €50',description:'For businesses that first want to know what needs fixing before making a larger investment.',includes:['Review of the offer and path to enquiry','Review of campaigns and measurement','Prioritized action plan']},
    {name:'Campaign setup',price:'from €100',description:'For launching new ads or improving existing campaigns, with accurate tracking of results.',includes:['Meta and/or Google campaign structure','Measurement of enquiries and other important actions','Ad preparation and campaign launch'],featured:true},
    {name:'Monthly management',price:'from €150 / month',description:'For businesses that want to improve their ads regularly and track which ones generate enquiries.',includes:['Weekly optimization','Creative and audience testing','Monthly results overview']}
  ],
  'web-i-konverzije':[
    {name:'Landing page',price:'from €100',description:'A focused sales page built around a clear offer and a conversion.',includes:['UX and sales structure','Mobile- and desktop-friendly design','Contact form, tracking and SEO foundations']},
    {name:'Advanced microsite',price:'from €250',description:'For a business or project that needs a more substantial digital presentation with more content.',includes:['Multiple pages or sections','Written copy and clear content structure','Integrations, analytics and QA'],featured:true},
    {name:'Digital product',price:'from €500',description:'For platforms, application systems and digital products with custom business logic.',includes:['Functionality and user-experience plan','Project-specific features','Integrations and production handover']}
  ],
  'aktivacije-i-eventi':[
    {name:'Activation plan',price:'from €100',description:'The concept and operational foundation before production and on-site execution.',includes:['Promotional concept and execution approach','Operational plan','Budget and logistics framework']},
    {name:'Production and coordination',price:'from €300',description:'For events and activations where we take responsibility for people, scheduling, logistics and supervision.',includes:['Team and briefing','Locations, shifts and logistics','Supervision and report'],featured:true},
    {name:'Complete campaign',price:'from €500',description:'Digital, production, people, on-site work and content connected by one objective.',includes:['Digital distribution','Production and on-site execution','Measurement, content and post-event activities']}
  ],
  'sadrzaj-za-kampanje':[
    {name:'Creative plan',price:'from €50',description:'Opening messages, formats and a filming plan before content is produced.',includes:['Suggested messages and formats','Opening headlines and copy','Production plan']},
    {name:'Ad and visual package',price:'from €100',description:'A package of materials ready for a campaign and controlled testing.',includes:['Multiple creative variations','Channel-specific formats','Copy and calls to action'],featured:true},
    {name:'Ongoing production',price:'from €200 / month',description:'A monthly system of new materials and iterations informed by campaign results.',includes:['Monthly content plan','New-format production','Iterations of successful creative directions']}
  ],
  'recruitment-kampanje':[
    {name:'Single-position campaign',price:'from €100',description:'For one open position or a specific need for a new employee.',includes:['Job ad copy and employer offer','Simple application journey','Campaign setup and distribution']},
    {name:'Seasonal campaign',price:'from €200',description:'For multiple positions, larger candidate volumes or seasonal recruitment.',includes:['Multiple job ads and creative directions','Distribution and optimization','Application review and organization'],featured:true},
    {name:'Ongoing recruitment',price:'from €300',description:'For continuous hiring and employer branding across several channels.',includes:['Employer content','Regular candidate attraction','Candidate database and application process']}
  ]
}
