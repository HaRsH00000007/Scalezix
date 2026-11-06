// November 2026 copy update: "Scalezix Homepage Copy: B2B Enterprise Version".
// Same format as content-map.js, but the "from" side is the text currently on the site
// (after content-map.js was applied). Apply with:
//
//   node tools/rebrand.js tools/content-update-2026-11.js
//   node tools/homepage-structure-2026-11.js   (adds the extra cards / FAQs / stages)
//   node tools/version-assets.js
//
// Positioning, tone and numbers come from that copy doc. One accuracy figure is used everywhere (99.8%).

module.exports = {
  raw: [],
  text: [
    // ── SEO meta (index bundle + prerendered <head>) ──────────────────────────
    ['Scalezix | AI Automation, Software Development & Growth Systems',
      'Scalezix | AI Automation, ERP Integration & WhatsApp AI for Enterprises in India'],
    ['Scalezix builds AI automation systems, software, agents, and growth infrastructure for modern businesses in India.',
      'Scalezix builds AI agents, ERP and CRM integrations, and WhatsApp and voice automation for Indian enterprises. Cut routine costs by 40–65%. Live in under 6 weeks.'],

    // ── Announcement bar + navigation (Footer chunk) ──────────────────────────
    ['Find your biggest AI opportunities in under 30 minutes.', 'Find your biggest AI opportunities in 30 minutes.'],
    ['Services', 'Solutions'],
    ['About Us', 'About'],

    // ── Hero (routes) ─────────────────────────────────────────────────────────
    ['Scale smarter with AI.', 'Run operations on AI, not on headcount.'],
    ['We engineer multi-agent squads, ERP middleware and growth engines',
      'Scalezix builds AI agents, ERP and CRM integrations, and WhatsApp and voice automation'],
    [' that streamline operations and accelerate throughput.',
      ' that cut routine operating costs by 40–65%. Live in under 6 weeks, backed by an SLA.'],
    { from: ' to production', to: ' from audit to production', js: ['routes'] },
    { from: ' lower OPEX', to: ' lower operating cost', js: ['routes'] },

    // ── Proof strip + capability tiles (routes, LogoGrid) ─────────────────────
    ['Engineered for modern enterprise operations', 'Trusted by teams in healthcare, real estate, D2C, logistics and construction'],
    ['Self-healing workflows, document processing and exception routing.',
      'Self-healing workflows that process documents and escalate to a human only when needed.'],
    ['Multi-agent squads that reason, query data and act 24/7.',
      'Specialised agents that reason over your data, act in your systems and log every step.'],
    ['Next.js, React and Node platforms and AI-native SaaS.',
      'Platforms and AI-native SaaS built for your workflows, not bent around a template.'],
    ['Bi-directional SAP, Oracle, Zoho and Salesforce sync.',
      'One real-time layer: two-way sync with SAP, Oracle, Zoho and Salesforce.'],
    ['Sub-650ms AI voice calls and official WhatsApp Cloud API.',
      'Official WhatsApp Cloud API and AI voice calls in Hindi, English and regional languages.'],
    ['Live revenue and CAC dashboards with predictive LTV.',
      'Live dashboards that show what is working while there is still time to act.'],
    ['Plug-and-play AI products before a full transformation.',
      'Modular AI products from ₹3,000/month, before any full transformation.'],
    ['Pipeline AI with India GST and Tally Prime sync.',
      'AI-driven pipeline, automated rep follow-ups and Tally Prime GST sync.'],
    ['Task agent pods across your databases and SaaS APIs.',
      'Task agents working across your databases and SaaS tools.'],
    ['Insurance checks, reminders and follow-ups across 8 clinics.',
      'Insurance checks, reminders and follow-ups across 8 clinics. Live in 4 weeks.'],

    // ── Business impact (routes) ──────────────────────────────────────────────
    ['Measurable business impact', 'Measured in rupees saved'],
    [' across every deployment.', ' and hours returned.'],
    ['Financial value & OPEX optimization.', 'Lower operating cost.'],
    ['40–65% lower routine processing costs, with AI workers running 24/7 at a fixed monthly cost.',
      '40–65% reduction in routine processing cost. AI workers run 24/7 for a fixed monthly fee.'],
    ['Operational velocity & speed-to-lead.', 'Faster to the customer.'],
    ['Leads answered in under 2 minutes, qualified and followed up before a rep picks up.',
      'Leads answered in under 2 minutes, qualified and followed up before a rep picks up the phone.'],
    ['Zero-trust security & data sovereignty.', 'A bigger team without hiring.'],
    ['Zero data retention: your data is never stored by AI vendors or used to train public models.',
      '+300% capacity. Your people move from data entry to decisions and relationships.'],
    ['Payback within 60–90 days.', 'Payback in 60–90 days.'],
    ['Pay-for-value modular pods instead of bloated consulting, no per-seat licensing markups, and 0% markup on official Meta WhatsApp API costs.',
      'No per-seat licence markups, no bloated consulting retainer, and 0% markup on official Meta WhatsApp API costs.'],

    // ── How we work (routes); stage 3 "Pilot deployment" is added by the structure script ──
    ['A simple process to turn operational bottlenecks into AI-powered systems.',
      'From audit to production in 6 weeks, then we stay and run it.'],
    ['Analyze your business', 'Discover and audit'],
    ['We audit your workflows before we build anything.',
      'Days 1–7: we map your workflows, bottlenecks and customer journeys.'],
    ['We audit your current workflows, growth bottlenecks, and customer journeys to prioritize the highest-ROI automations, with hard ROI modeling behind every recommendation.',
      'Then we model the ROI of each opportunity. You get a ranked list of what to automate first and what it is worth. Deliverables: workflow map, ROI model, prioritised roadmap.'],
    ['Build custom AI systems', 'Blueprint and guardrails'],
    ['We design, integrate and test AI agents, workflows and dashboards around your exact operating model.',
      'Days 8–14: our architects design data ingestion, memory, model routing and validation gates.'],
    ['Then we deploy them into your ERP, CRM and communication channels, tracking real KPIs from day one.',
      'So the system is accurate and auditable before it touches production. Deliverables: architecture blueprint, guardrail rules, integration plan.'],
    ['Scale and optimize', 'Scale under SLA'],
    ['We refine performance, train teams, and evolve the system as your operations and customer volume grow.',
      'Ongoing: full rollout with 24/7 monitoring and a dedicated AI pod.'],
    ['Dedicated AI pod engineering, 24/7 monitoring and continuous prompt calibration, backed by an uptime SLA.',
      'Continuous prompt calibration, team training and an uptime SLA. Deliverables: monitoring, monthly optimisation, upskilling workshops.'],

    // ── Industries (routes); the "where else" list is rebuilt by the structure script ──
    ['D2C, Real Estate & Services', 'We know how your business runs.'],
    ['We build across your entire customer lifecycle, from', 'Systems built around the full customer and operations lifecycle, from'],
    ['the first lead you capture to the revenue you report.', 'the first lead to the final invoice.'],
    ['CALENDAR DISPATCH & FOLLOW-UP', 'CALENDAR BOOKING & FOLLOW-UP'],
    ['Cart recovery and GST invoicing', 'CART RECOVERY & GST INVOICING'],

    // ── Why Scalezix (routes); card 4 "Priced for value" is added by the structure script ──
    ['Deterministic, not experimental.', 'Reliable, not experimental.'],
    ['Multi-LLM routing with strict validation gates and human-in-the-loop guardrails, engineered for 99.8% accuracy.',
      'Multi-model routing, strict validation gates and human approval where it matters. Engineered for 99.8% accuracy.'],
    ['Dedicated AI pods.', 'A dedicated pod, not a ticket queue.'],
    ['A dedicated pod of engineers scopes the work, builds the system and stays on with 24/7 monitoring and SLA support.',
      'Engineers scope the work, build the system and stay on with 24/7 monitoring and SLA support.'],
    ['Zero data retention, private VPC or on-premise hosting, and full alignment with India’s DPDP Act, 2023.',
      'Zero data retention, private VPC or on-premise hosting, and alignment with India’s DPDP Act, 2023. Deploy on managed cloud, a dedicated VPC or on-premise, air-gapped.'],

    // ── Articles (routes) ─────────────────────────────────────────────────────
    ['Our latest thinking.', 'Practical thinking on AI in operations.'],

    // ── Final CTA (Footer + Faq chunks) ───────────────────────────────────────
    ['Build your enterprise advantage today.', 'Find where AI pays back fastest in your business.'],

    // ── FAQ (Faq chunk); three new questions are added by the structure script ──
    ['Scalezix is an applied AI and workflow automation agency based in Ahmedabad. We build custom AI software, deploy intelligent agents, and connect your business systems to drive efficiency and operational scale.',
      'An applied AI and automation company based in Ahmedabad. We build custom AI software, deploy agents and connect your business systems so your operations scale without scaling headcount.'],
    ['Start by booking a free strategy call or running our AI Opportunity Audit. We will analyze your tools and map your highest-ROI opportunities.',
      'Book a free 30-minute strategy call or run the AI Opportunity Audit. We map your tools and rank your highest-ROI opportunities.'],
    ['How much does AI automation cost?', 'How much does it cost?'],
    ['Pricing is transparent and modular: the WhatsApp AI Platform starts at ₹3,000/mo, alongside Starter ($1.5k), Growth ($4k) and Enterprise Custom plans.',
      'Pricing is modular and transparent. The WhatsApp AI Suite starts at ₹3,000/month. Programme plans start at $1.5k (Starter) and $4k (Growth), with custom Enterprise scoping.'],
    ['No. We run a zero data retention model: client data is never stored on external AI vendor servers or used to train foundation models, with optional private VPC or on-premise hosting.',
      'No. We run a zero-data-retention model. Your data is never stored on AI vendor servers or used to train foundation models. Private VPC and on-premise hosting are available.'],
    ['How long does it take to deploy AI automation?', 'How long does deployment take?'],
    ['Initial automation setups and WhatsApp CRM integrations are typically deployed, tested, and live in under 6 weeks, and WhatsApp AI base pilots in under 24 hours.',
      'Initial automations and CRM integrations go live in under 6 weeks. WhatsApp AI pilots can be live in under 24 hours.'],
    ['Do I need technical knowledge to use AI automation?', 'Does our team need technical skills?'],
    ['No. We handle all backend integrations, API configurations, and prompt engineering. We build simple custom dashboards and upskill your team during onboarding.',
      'No. We handle integrations, configuration and prompt engineering, build simple dashboards and train your team during onboarding.'],
    ['Do you provide post-launch support?', 'What support do you provide after launch?'],
    ['Yes. Monthly SLA support packages cover monitoring API integrations, adjusting prompts, updating workflows, and optimizing server resources as you scale.',
      'Monthly SLA packages cover monitoring, prompt tuning, workflow updates and infrastructure optimisation as you grow.'],

    // ── Enterprise ready (shared chunk): DPDP only, no GDPR claim, no model names ──
    ['DPDP 2023 and GDPR aligned.', 'DPDP Act 2023 aligned.'],
    ['Strict compliance with India’s Digital Personal Data Protection Act, 2023 and international standards.',
      'Built in line with India’s Digital Personal Data Protection Act, 2023.'],
    ['Optional isolated AWS or GCP VPC, or on-premise LLM hosting with Llama 3 and Mistral Large.',
      'Managed cloud, a dedicated AWS or GCP VPC, or on-premise, air-gapped hosting.'],
    ['DPDP 2023 compliant', 'DPDP 2023 aligned'],
    ['Compliant, with zero data retention', 'Aligned, with zero data retention'],

    // ── Services page: no model names, no "six" (the page has five groups) ─────
    ['Engineered for modern enterprise operations.', 'Systems that take work off your team.'],
    ['Zero-hallucination agent squads, bi-directional ERP middleware, conversational voice engines and private data infrastructure that deliver permanent operational advantages.',
      'Start with the one that hurts most. Add the rest as it pays back.'],
    ['Multi-LLM smart routing.', 'Smart routing across leading AI models.'],
    ['Every task goes to the right model: Claude 3.5 Sonnet for deep logic, GPT-4o for speed, and Llama 3 70B inside private VPCs.',
      'Every task goes to the model best suited to it, with open models available inside your private VPC.'],
    ['Integrated frameworks — Claude, GPT-4o, Llama 3, Mistral, LangGraph', 'Integrated frameworks — leading AI models, LangGraph, Pinecone'],
  ],
};
