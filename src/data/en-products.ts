import type { ServiceProduct } from '@/data/service-products'

export const enProducts: Record<string, ServiceProduct[]> = {
'performance-marketing':[
{name:'Audit & action plan',price:'from €50',description:'A practical review of your current offer, campaign setup and opportunities before making a larger investment.',includes:['Offer and enquiry journey review','Campaign and tracking audit','Prioritized action plan']},
{name:'Campaign setup',price:'from €100',description:'Prepare new advertising campaigns or reorganize existing ones with proper measurement.',includes:['Meta and/or Google Ads structure','Conversion tracking setup','Ad preparation and launch'],featured:true},
{name:'Monthly management',price:'from €150 / month',description:'Ongoing improvements for businesses that want to understand and grow their enquiries.',includes:['Weekly optimization','Creative and audience testing','Monthly results overview']},
],
'web-i-konverzije':[
{name:'Landing page',price:'from €100',description:'A focused page built around one clear offer and a straightforward enquiry journey.',includes:['UX and sales structure','Mobile and desktop design','Contact form, tracking and SEO basics']},
{name:'Business microsite',price:'from €250',description:'A stronger digital presence for a business, event or service with more content.',includes:['Multiple pages or sections','Clear copy and content structure','Integrations, analytics and QA'],featured:true},
{name:'Digital product',price:'from €500',description:'Platforms and application systems that need custom functionality and business logic.',includes:['Functional and user experience planning','Project-specific functionality','Integrations and launch handover']},
],
'aktivacije-i-eventi':[
{name:'Activation concept',price:'from €100',description:'The creative idea, operational plan and budget structure before event production.',includes:['Activation concept and audience journey','Operational plan','Budget and logistics structure']},
{name:'Event production & coordination',price:'from €300',description:'Teams, schedules, locations, suppliers and on-site oversight for events and activations.',includes:['Crew selection and briefing','Locations, shifts and logistics','Supervision and reporting'],featured:true},
{name:'Integrated project',price:'from €500',description:'Digital campaigns, production, people, field work and content coordinated under one objective.',includes:['Digital distribution','Production and on-site delivery','Measurement and post-event content']},
],
'sadrzaj-za-kampanje':[
{name:'Creative concept',price:'from €50',description:'Messaging, content formats and a production outline before shooting.',includes:['Messaging and format proposals','Opening hooks and copy directions','Production plan']},
{name:'Ad creative package',price:'from €100',description:'A set of campaign-ready materials for structured testing.',includes:['Multiple creative variations','Channel-specific formats','Ad copy and calls to action'],featured:true},
{name:'Ongoing content production',price:'from €200 / month',description:'A recurring content plan with new materials informed by campaign results.',includes:['Monthly content plan','Production of new formats','Improvement of successful ideas']},
],
'recruitment-kampanje':[
{name:'Single-role hiring campaign',price:'from €100',description:'One open role with a clear message and a simple way for applicants to respond.',includes:['Job and employer messaging','Application journey','Campaign setup and distribution']},
{name:'Seasonal hiring campaign',price:'from €200',description:'A coordinated campaign for multiple roles or seasonal recruitment.',includes:['Multiple job adverts and formats','Distribution and optimization','Application tracking'],featured:true},
{name:'Ongoing recruitment',price:'from €300',description:'Regular candidate outreach and employer communication across relevant channels.',includes:['Employer content','Continual candidate outreach','Application records and process']},
],
}
