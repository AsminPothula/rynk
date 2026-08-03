<?php
/**
 * Template Name: Rynk Privacy Policy
 *
 * /privacy-policy — the full Rynk Privacy Policy and Agreement.
 *
 * The long-form legal copy is styled with a scoped style block (`.legal-prose`)
 * rather than per-element utility classes: it keeps the ~20 sections readable in
 * source and self-contained. Colors mirror the brand tokens in tailwind.config.
 *
 * @package rynk-ai
 */

get_header();
?>

<style>
	.legal-prose { color: #a5adc8; }
	.legal-prose h2 {
		font-family: var(--font-serif), Georgia, serif;
		color: #eeeaf6;
		font-size: 1.5rem;
		line-height: 1.25;
		font-weight: 500;
		letter-spacing: -0.01em;
		margin-top: 3.25rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(255,255,255,0.08);
	}
	.legal-prose h3 {
		font-family: var(--font-serif), Georgia, serif;
		color: #eeeaf6;
		font-size: 1.125rem;
		font-weight: 500;
		margin-top: 1.85rem;
		margin-bottom: 0.35rem;
	}
	.legal-prose p {
		font-size: 15px;
		line-height: 1.75;
		margin: 0.9rem 0;
	}
	.legal-prose ul {
		list-style: none;
		margin: 0.75rem 0 1rem;
		padding: 0;
	}
	.legal-prose li {
		position: relative;
		padding-left: 1.35rem;
		font-size: 15px;
		line-height: 1.7;
		margin: 0.4rem 0;
	}
	.legal-prose li::before {
		content: "";
		position: absolute;
		left: 0.15rem;
		top: 0.72em;
		width: 5px;
		height: 5px;
		border-radius: 9999px;
		background: #9c8cf0;
	}
	.legal-prose strong { color: #eeeaf6; font-weight: 600; }
	.legal-prose a { color: #8fa8ff; text-decoration: underline; text-underline-offset: 2px; }
	.legal-prose a:hover { color: #c9d5ff; }
	@media (min-width: 768px) {
		.legal-prose h2 { font-size: 1.75rem; }
	}
</style>

<div class="relative text-brand-text overflow-x-hidden">
	<section class="relative px-6 py-20 md:px-10 md:py-24">
		<div class="pointer-events-none absolute inset-0 bg-grid-brand opacity-50" aria-hidden="true"></div>
		<div class="relative mx-auto max-w-3xl">
			<p class="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-violetSoft animate-rise">
				Legal
			</p>
			<h1
				class="mt-5 font-serif text-4xl md:text-5xl font-medium leading-[1.05] tracking-tight animate-rise"
				style="animation-delay: 60ms;"
			>
				Privacy Policy and Agreement
			</h1>
			<p
				class="mt-4 font-mono text-[12px] uppercase tracking-[0.16em] text-brand-textMute animate-rise"
				style="animation-delay: 120ms;"
			>
				Effective Date: July 31, 2026
			</p>

			<div class="legal-prose mt-10 animate-rise" style="animation-delay: 180ms;">
			<p>Rynk (“Rynk,” “we,” “us,” or “our”) is an AI-driven software company that helps small and midsize businesses improve how they are discovered and represented across AI assistants, such as ChatGPT, Gemini, Copilot, Perplexity, and Claude, and traditional search engines.</p>
			<p>Our platform uses artificial intelligence, automated data processing, and machine-generated analysis to evaluate, recommend, and, where authorized by a client, implement changes to a client’s online presence, website content, business listings, and structured data.</p>
			<p>This Privacy Policy explains what information we collect, where we obtain it, how we use and disclose it, how our AI systems process it, how long we retain it, and the choices available to you.</p>
			<p>This Privacy Policy applies when you visit our website, create a Rynk account, communicate with us, or use our products and services collectively referred to as the “Services.”</p>
			<p>This Privacy Policy is a notice of our privacy practices and does not replace or modify our Terms of Service, Data Processing Addendum, or any other agreement between Rynk and a client.</p>
			<h2>1. Information We Collect</h2>
			<p>We may collect the following categories of information:</p>
			<h3>Account and Contact Information</h3>
			<p>We may collect your name, business name, job title, email address, phone number, billing address, account identifiers, login credentials, and other information used to create and manage your Rynk account.</p>
			<h3>Business and Website Data</h3>
			<p>We may collect or process:</p>
			<ul>
			<li>Website URLs and website content;</li>
			<li>Business names, addresses, hours, contact details, and listings;</li>
			<li>Publicly available business information;</li>
			<li>Reviews, ratings, keywords, and search-related information;</li>
			<li>Structured data and website metadata;</li>
			<li>Website traffic and analytics;</li>
			<li>Search performance information;</li>
			<li>Business profiles and directory listings;</li>
			<li>Content, files, or records that you upload or connect to the Services; and</li>
			<li>Other information you authorize us to access to provide AI recommendations, analytics, and dashboards.</li>
			</ul>
			<p>Business and website data may include personal information about business owners, employees, contractors, customers, reviewers, or other individuals.</p>
			<h3>Payment Information</h3>
			<p>Payments are processed through third-party payment processors. Rynk does not store complete payment card numbers. We may receive limited payment-related information, such as billing status, transaction date, payment method type, and the last four digits of a payment card.</p>
			<h3>Usage and Device Data</h3>
			<p>We may automatically collect information about how you access and use the Services, including:</p>
			<ul>
			<li>IP address;</li>
			<li>Browser type;</li>
			<li>Operating system;</li>
			<li>Device type and identifiers;</li>
			<li>Referring URLs;</li>
			<li>Pages viewed;</li>
			<li>Features used;</li>
			<li>Dates and times of access;</li>
			<li>Session activity;</li>
			<li>Error and diagnostic information; and</li>
			<li>Interactions with the Services.</li>
			</ul>
			<p>This information may be collected through cookies, log files, software development kits, pixels, and similar technologies.</p>
			<h3>AI Interaction Data</h3>
			<p>We may process:</p>
			<ul>
			<li>Prompts;</li>
			<li>Queries;</li>
			<li>Instructions;</li>
			<li>Uploaded content;</li>
			<li>Feedback;</li>
			<li>User inputs;</li>
			<li>AI-generated outputs;</li>
			<li>Recommendations;</li>
			<li>Draft content;</li>
			<li>Suggested edits; and</li>
			<li>Other interactions with Rynk’s AI-enabled features.</li>
			</ul>
			<h3>Communications</h3>
			<p>We may collect information you provide when you contact us for sales, support, billing assistance, product feedback, or other communications.</p>
			<h3>Integration and Authentication Data</h3>
			<p>When you connect a third-party website, analytics provider, business listing, content management system, or other platform to Rynk, we may receive authentication tokens, permissions, account identifiers, configuration information, and data made available through that integration.</p>
			<p>Where possible, Rynk uses access tokens or delegated permissions rather than collecting your third-party account password.</p>
			<h2>2. Sources of Information</h2>
			<p>We may obtain information from the following sources:</p>
			<ul>
			<li>Directly from you when you create an account, use the Services, submit a prompt, contact us, or provide information;</li>
			<li>From your employer, organization, account administrator, or another authorized user;</li>
			<li>From websites, business listings, search engines, online directories, review platforms, social media pages, and other publicly available sources;</li>
			<li>From third-party platforms and services that you connect to Rynk;</li>
			<li>From analytics, advertising, security, and technology service providers;</li>
			<li>Through cookies and similar technologies;</li>
			<li>From payment processors and billing providers; and</li>
			<li>Through our own analysis of information collected or provided through the Services.</li>
			</ul>
			<p>Clients are responsible for ensuring that they have the necessary authority, permissions, and legal basis to provide personal information and other data to Rynk or authorize Rynk to access it.</p>
			<h2>3. How We Use Information</h2>
			<p>We may use information to:</p>
			<ul>
			<li>Create, administer, authenticate, and support user accounts;</li>
			<li>Operate, maintain, secure, and improve the Services;</li>
			<li>Analyze a client’s online presence;</li>
			<li>Generate visibility scores, reports, competitive comparisons, and recommendations;</li>
			<li>Develop content, structured data, business listing, and search-visibility recommendations;</li>
			<li>Create drafts and suggested edits for client review;</li>
			<li>Implement changes that have been authorized by a client;</li>
			<li>Provide dashboards, analytics, reporting, and performance measurements;</li>
			<li>Personalize the Services for a client or authorized user;</li>
			<li>Process payments and manage billing;</li>
			<li>Communicate about accounts, transactions, updates, security, and support requests;</li>
			<li>Respond to feedback and improve product functionality;</li>
			<li>Test and evaluate the performance, safety, and accuracy of the Services;</li>
			<li>Detect, investigate, and prevent fraud, misuse, unauthorized access, and security incidents;</li>
			<li>Maintain audit logs and enforce access controls;</li>
			<li>Comply with legal obligations;</li>
			<li>Establish, exercise, or defend legal claims; and</li>
			<li>Enforce our agreements and policies.</li>
			</ul>
			<p>Rynk does not sell personal information for monetary compensation.</p>
			<h2>4. Use of Customer Data for AI Training</h2>
			<p>Rynk does not use Client Data, customer prompts, customer inputs, or customer-specific AI outputs to train generalized artificial intelligence or machine-learning models without the client’s prior written approval.</p>
			<p>For purposes of this Policy, “Client Data” means information submitted to, uploaded to, connected to, or processed through the Services on behalf of a client. Client Data includes nonpublic website information, connected analytics, prompts, instructions, files, drafts, reports, recommendations, and customer-specific AI outputs.</p>
			<p>Written approval must be affirmative, specific, and provided by an authorized representative of the client. A client’s use of the Services alone does not constitute approval for model training.</p>
			<p>Unless a client provides written approval, Rynk will not use Client Data to:</p>
			<ul>
			<li>Train or fine-tune a generalized Rynk model;</li>
			<li>Train a model for the benefit of unrelated customers;</li>
			<li>Permit a third-party AI provider to train its generalized models; or</li>
			<li>Develop commercial models or datasets unrelated to providing the Services to that client.</li>
			</ul>
			<p>Rynk may use limited technical and operational information that does not identify a client or individual to maintain, secure, measure, and improve the Services. This may include aggregated statistics, de-identified product telemetry, error rates, latency measurements, feature usage, and security information.</p>
			<p>Rynk will take reasonable measures designed to prevent de-identified information from being associated with an identifiable person or client and will not attempt to reidentify information that has been properly de-identified.</p>
			<p>Rynk may use feedback voluntarily submitted by a user to evaluate and improve the Services. Where feedback contains Client Data or personal information, the restrictions described in this section continue to apply unless the client separately authorizes broader use in writing.</p>
			<h2>5. How Our AI Systems Process Information</h2>
			<p>Rynk’s Services use automated and AI-assisted processing to analyze connected data sources and generate outputs such as:</p>
			<ul>
			<li>Visibility scores;</li>
			<li>Content recommendations;</li>
			<li>Competitive comparisons;</li>
			<li>Website analyses;</li>
			<li>Structured-data recommendations;</li>
			<li>Business listing recommendations;</li>
			<li>Draft website content;</li>
			<li>Suggested edits;</li>
			<li>Reports; and</li>
			<li>Other machine-generated insights.</li>
			</ul>
			<p>AI-generated outputs are probabilistic and may be incomplete, inaccurate, outdated, or inappropriate for a particular use. Clients and authorized users should independently review AI-generated recommendations and outputs before relying on, publishing, or implementing them.</p>
			<p>Rynk may use third-party AI models and infrastructure providers to process information as part of delivering the Services. Rynk seeks to contractually restrict such providers from using Client Data for their own generalized model training unless the client has provided prior written approval.</p>
			<p>Rynk personnel may access Client Data only where reasonably necessary to:</p>
			<ul>
			<li>Provide support requested by the client;</li>
			<li>Investigate security incidents or suspected misuse;</li>
			<li>Maintain or troubleshoot the Services;</li>
			<li>Perform client-authorized professional services;</li>
			<li>Comply with legal obligations; or</li>
			<li>Protect the rights and safety of Rynk, its clients, and others.</li>
			</ul>
			<p>Access to Client Data is subject to appropriate authorization, confidentiality obligations, and access controls.</p>
			<p>The Services are not intended to make decisions that produce legal or similarly significant effects concerning individuals without appropriate human review.</p>
			<h2>6. Rynk’s Role as Controller and Processor</h2>
			<p>Depending on the context, Rynk may act as either a controller of personal information or a processor acting on behalf of a client.</p>
			<h3>Rynk as a Controller</h3>
			<p>Rynk acts as a controller, or in an equivalent role under applicable privacy law, when it determines the purposes and means of processing personal information for its own business operations.</p>
			<p>These controller activities may include processing information for:</p>
			<ul>
			<li>Account registration and administration;</li>
			<li>Billing and payment management;</li>
			<li>Direct communications with users;</li>
			<li>Sales and marketing;</li>
			<li>Website analytics;</li>
			<li>Product security;</li>
			<li>Fraud and abuse prevention;</li>
			<li>Legal compliance;</li>
			<li>Internal business operations; and</li>
			<li>Maintaining business and transaction records.</li>
			</ul>
			<p>When Rynk acts as a controller, this Privacy Policy governs how Rynk processes personal information.</p>
			<h3>Rynk as a Processor</h3>
			<p>Rynk acts as a processor, service provider, contractor, or equivalent entity when it processes Client Data on behalf of a client and under the client’s instructions.</p>
			<p>Processor activities may include:</p>
			<ul>
			<li>Analyzing client websites and online profiles;</li>
			<li>Processing connected analytics;</li>
			<li>Generating client-specific recommendations;</li>
			<li>Creating drafts and reports;</li>
			<li>Processing client prompts;</li>
			<li>Managing client-authorized website or listing changes; and</li>
			<li>Performing other processing described in the applicable service agreement.</li>
			</ul>
			<p>When Rynk acts as a processor, the client generally determines why and how the personal information is processed. Individuals seeking to exercise rights concerning information processed by Rynk solely on behalf of a client should ordinarily direct their requests to that client.</p>
			<p>Rynk will reasonably assist clients in responding to applicable privacy requests where required by law or contract.</p>
			<h3>Data Processing Addendum</h3>
			<p>Rynk offers a Data Processing Addendum, or “DPA,” governing Rynk’s processing of Client Data on behalf of clients.</p>
			<p>The DPA addresses matters including:</p>
			<ul>
			<li>The subject matter and duration of processing;</li>
			<li>The nature and purposes of processing;</li>
			<li>The categories of personal information and affected individuals;</li>
			<li>Client instructions;</li>
			<li>Confidentiality;</li>
			<li>Information security;</li>
			<li>Use of subprocessors;</li>
			<li>Assistance with privacy-rights requests;</li>
			<li>Security incident notification;</li>
			<li>Deletion or return of Client Data;</li>
			<li>Audit and compliance obligations; and</li>
			<li>International data-transfer safeguards.</li>
			</ul>
			<p>Where the DPA conflicts with this Privacy Policy regarding Rynk’s processing of Client Data as a processor, the DPA and the applicable client agreement will control.</p>
			<p>Clients may request Rynk’s DPA by contacting privacy@rynk.ai.</p>
			<h2>7. How We Disclose Information</h2>
			<p>We may disclose information to the following categories of recipients:</p>
			<h3>Service Providers and Subprocessors</h3>
			<p>We may disclose information to vendors that provide services such as:</p>
			<ul>
			<li>Cloud hosting;</li>
			<li>Data storage;</li>
			<li>AI infrastructure;</li>
			<li>Analytics;</li>
			<li>Payment processing;</li>
			<li>Customer support;</li>
			<li>Email delivery;</li>
			<li>Authentication;</li>
			<li>Security monitoring;</li>
			<li>Logging;</li>
			<li>Error detection; and</li>
			<li>Other technical and professional services.</li>
			</ul>
			<p>These providers may process information only as necessary to provide services to Rynk and are subject to contractual confidentiality, privacy, and security obligations where required.</p>
			<h3>AI Providers</h3>
			<p>We may transmit prompts, instructions, relevant context, or other information to third-party AI providers when necessary to provide AI-enabled features.</p>
			<p>Rynk seeks to configure and contract with these providers so that Client Data is not used to train their generalized models unless the affected client has provided prior written approval.</p>
			<h3>AI Assistants, Search Engines, and Online Platforms</h3>
			<p>When a client authorizes publication or submission, Rynk may disclose approved content, business listings, website information, or structured data to search engines, AI assistants, business directories, content platforms, or other third-party services.</p>
			<p>Information submitted to these platforms may become publicly available and may be indexed, cached, copied, transformed, or retained by third parties outside Rynk’s control.</p>
			<h3>Professional Advisers</h3>
			<p>We may disclose information to lawyers, accountants, auditors, insurers, consultants, and other professional advisers where reasonably necessary for legitimate business or legal purposes.</p>
			<h3>Legal and Safety Purposes</h3>
			<p>We may disclose information when we reasonably believe disclosure is necessary to:</p>
			<ul>
			<li>Comply with applicable law, regulation, court order, or lawful government request;</li>
			<li>Enforce our agreements;</li>
			<li>Investigate fraud, misuse, or security incidents;</li>
			<li>Protect the rights, property, or safety of Rynk, our clients, users, or others; or</li>
			<li>Establish, exercise, or defend legal claims.</li>
			</ul>
			<h3>Business Transactions</h3>
			<p>We may disclose information in connection with a proposed or completed merger, acquisition, financing, reorganization, bankruptcy, sale of assets, or similar transaction.</p>
			<p>Any recipient will be expected to process personal information in accordance with applicable law and any confidentiality commitments associated with the transaction.</p>
			<h3>With Your Direction or Consent</h3>
			<p>We may disclose information when you direct us to do so or provide consent.</p>
			<h2>8. Subprocessors</h2>
			<p>Rynk may engage subprocessors to support delivery of the Services. Subprocessors may include cloud infrastructure providers, AI model providers, analytics vendors, authentication providers, support platforms, and security vendors.</p>
			<p>Rynk evaluates subprocessors based on factors such as:</p>
			<ul>
			<li>The nature of the information processed;</li>
			<li>Security and privacy practices;</li>
			<li>Data-location practices;</li>
			<li>Contractual protections;</li>
			<li>Retention practices;</li>
			<li>Use of information for model training;</li>
			<li>Incident-response capabilities; and</li>
			<li>Compliance with applicable data-protection requirements.</li>
			</ul>
			<p>Where Rynk acts as a processor, subprocessors are required to process Client Data only for authorized purposes and in accordance with contractual obligations that are materially consistent with Rynk’s obligations to the client.</p>
			<p>Rynk may maintain a current list of material subprocessors on its website or make the list available upon request. Clients may contact privacy@rynk.ai to request information about Rynk’s current subprocessors.</p>
			<p>Where required by the applicable DPA, Rynk will provide notice of new material subprocessors and an opportunity for the client to raise reasonable data-protection concerns.</p>
			<h2>9. Client-Approved Changes to Online Content</h2>
			<p>The Services may recommend, draft, or implement changes to a client’s website, listings, content, or structured data based on AI-generated analysis.</p>
			<p>Where client approval is required, Rynk will implement or publish a recommended change only after receiving approval from an authorized user or representative of the client.</p>
			<p>Client approval authorizes Rynk to carry out the approved change. Clients are responsible for reviewing proposed changes for accuracy, suitability, legal compliance, brand alignment, and business impact before approval.</p>
			<p>Approval of a change does not authorize Rynk to publish content that materially differs from what the client approved.</p>
			<p>Additional terms governing:</p>
			<ul>
			<li>Client responsibilities;</li>
			<li>Authorized approvers;</li>
			<li>Publication procedures;</li>
			<li>Rollbacks;</li>
			<li>Third-party platform actions;</li>
			<li>Performance disclaimers;</li>
			<li>Warranty limitations; and</li>
			<li>Limitations of liability</li>
			</ul>
			<p>are contained in Rynk’s Terms of Service or applicable client agreement.</p>
			<p>Nothing in this Privacy Policy waives or limits rights or remedies that cannot lawfully be waived or limited.</p>
			<h2>10. Cookies and Tracking Technologies</h2>
			<p>We use cookies and similar technologies to:</p>
			<ul>
			<li>Operate and secure our website and dashboard;</li>
			<li>Authenticate users;</li>
			<li>Maintain user sessions;</li>
			<li>Remember settings and preferences;</li>
			<li>Understand how the Services are used;</li>
			<li>Diagnose errors;</li>
			<li>Measure product performance; and</li>
			<li>Improve user experience.</li>
			</ul>
			<p>Depending on our practices and your location, we may request consent before using certain nonessential cookies.</p>
			<p>You may manage cookies through your browser settings or through any cookie-preference tool made available through the Services. Disabling certain cookies may prevent some features from operating properly.</p>
			<p>Where required by applicable law, Rynk will provide additional disclosures and choices concerning targeted advertising, cross-context behavioral advertising, or the sale or sharing of personal information.</p>
			<h2>11. Data Retention</h2>
			<p>We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including providing the Services, maintaining security, complying with legal obligations, resolving disputes, and enforcing agreements.</p>
			<p>Unless a different period is stated in a client agreement, DPA, or applicable law, Rynk generally applies the following retention periods:</p>
			<ul>
			<li>Account and profile information: Retained for the duration of the account and generally deleted or de-identified within 30 days after account closure, unless continued retention is required for legal, security, billing, or dispute-resolution purposes.</li>
			<li>Client Data: Retained for the duration of the client relationship and generally deleted or returned within 30 days after termination or expiration of the Services, subject to the applicable client agreement and DPA.</li>
			<li>AI prompts and customer-specific outputs: Retained while the account is active and generally deleted within 30 days after account closure or termination, unless the client requests earlier deletion or a different period applies under the client agreement.</li>
			<li>Connected-system credentials and access tokens: Retained while the applicable integration remains active and revoked or deleted when the integration is disconnected or the account is closed.</li>
			<li>Security and access logs: Generally retained for up to 12 months, unless a longer period is reasonably necessary to investigate a security incident, prevent fraud, or comply with law.</li>
			<li>Support and business communications: Generally retained for up to three years after the communication or closure of the related matter.</li>
			<li>Billing, tax, and transaction records: Generally retained for up to seven years or for another period required by applicable tax, accounting, or legal obligations.</li>
			<li>Cookie and analytics information: Retained according to the duration of the applicable cookie or analytics configuration, which may vary depending on the technology used.</li>
			<li>Backups: Deleted information may remain in encrypted backups for up to 90 days before being overwritten through Rynk’s ordinary backup cycle.</li>
			</ul>
			<p>We may retain information for a longer period when reasonably necessary to:</p>
			<ul>
			<li>Comply with law;</li>
			<li>Preserve evidence;</li>
			<li>Exercise or defend legal claims;</li>
			<li>Investigate fraud or security incidents;</li>
			<li>Enforce an agreement; or</li>
			<li>Honor a legal hold.</li>
			</ul>
			<p>When information is no longer required, we may delete, aggregate, anonymize, or de-identify it.</p>
			<p>Information published to third-party websites, search engines, AI assistants, directories, or other platforms may remain available after it has been deleted from Rynk’s systems. Rynk may not be able to delete information retained or independently processed by those third parties.</p>
			<h2>12. Data Security</h2>
			<p>Rynk uses commercially reasonable administrative, technical, and physical safeguards designed to protect information against unauthorized access, loss, misuse, alteration, or disclosure.</p>
			<p>Depending on the nature of the Services and information involved, safeguards may include:</p>
			<ul>
			<li>Encryption in transit;</li>
			<li>Encryption at rest where appropriate;</li>
			<li>Role-based access controls;</li>
			<li>Multifactor authentication;</li>
			<li>Logging and monitoring;</li>
			<li>Secure software-development practices;</li>
			<li>Vulnerability management;</li>
			<li>Vendor risk management;</li>
			<li>Employee confidentiality requirements;</li>
			<li>Incident-response procedures; and</li>
			<li>Backup and recovery controls.</li>
			</ul>
			<p>No system, transmission method, or storage environment can be guaranteed to be completely secure. Rynk therefore cannot guarantee absolute security.</p>
			<p>If Rynk identifies a security incident involving personal information, it will investigate and provide legally required notifications to affected clients, individuals, regulators, or other parties.</p>
			<p>Clients are responsible for maintaining the confidentiality of their login credentials, restricting account access to authorized users, and promptly notifying Rynk of suspected unauthorized access.</p>
			<h2>13. International Processing and Data Transfers</h2>
			<p>Rynk and its service providers may process information in the United States and other countries where Rynk or its providers maintain operations.</p>
			<p>These countries may have privacy and data-protection laws that differ from the laws of the country in which you are located.</p>
			<p>When Rynk transfers personal information across national borders, it takes reasonable measures designed to protect the information in accordance with this Privacy Policy and applicable law.</p>
			<p>Where required, Rynk may rely on recognized transfer mechanisms, including:</p>
			<ul>
			<li>Adequacy decisions;</li>
			<li>The European Commission’s Standard Contractual Clauses;</li>
			<li>The United Kingdom’s International Data Transfer Addendum or International Data Transfer Agreement;</li>
			<li>Contractual protections with recipients;</li>
			<li>Consent where legally permitted; or</li>
			<li>Another valid transfer mechanism recognized under applicable law.</li>
			</ul>
			<p>Where Rynk acts as a processor, international transfer requirements may also be addressed in the applicable DPA.</p>
			<p>You may contact privacy@rynk.ai to request additional information regarding applicable international transfer safeguards.</p>
			<h2>14. Your Rights and Choices</h2>
			<p>Depending on your location and applicable law, you may have the right to:</p>
			<ul>
			<li>Confirm whether we process your personal information;</li>
			<li>Access your personal information;</li>
			<li>Correct inaccurate personal information;</li>
			<li>Request deletion of personal information;</li>
			<li>Obtain a portable copy of certain personal information;</li>
			<li>Object to or restrict certain processing;</li>
			<li>Withdraw consent where processing is based on consent;</li>
			<li>Opt out of certain sales, sharing, targeted advertising, or qualifying profiling;</li>
			<li>Limit certain uses of sensitive personal information;</li>
			<li>Appeal a decision concerning a privacy request; and</li>
			<li>Lodge a complaint with an applicable regulatory authority.</li>
			</ul>
			<p>Rynk will not discriminate against you for exercising a privacy right protected by applicable law.</p>
			<p>To submit a privacy request, contact:</p>
			<p>Email: privacy@rynk.ai</p>
			<p>Your request should describe the right you wish to exercise and identify the information or account involved.</p>
			<p>We may request additional information to reasonably verify your identity and authority to make the request. We will use verification information only to process and document the request.</p>
			<p>Where permitted by law, an authorized agent may submit a request on your behalf. We may require evidence of the agent’s authority and may ask you to verify your identity directly.</p>
			<p>If we deny a request, you may have the right to appeal by emailing privacy@rynk.ai and including “Privacy Request Appeal” in the subject line.</p>
			<p>Where Rynk processes personal information solely as a processor for a client, we may refer your request to the applicable client or instruct you to contact that client directly.</p>
			<h2>15. Marketing Communications</h2>
			<p>You may opt out of promotional email communications by using the unsubscribe link contained in the email or by contacting us.</p>
			<p>Even after opting out of marketing communications, you may continue to receive non-promotional communications regarding:</p>
			<ul>
			<li>Your account;</li>
			<li>Transactions;</li>
			<li>Billing;</li>
			<li>Security;</li>
			<li>Service changes;</li>
			<li>Support matters; and</li>
			<li>Other administrative issues.</li>
			</ul>
			<h2>16. Sensitive Personal Information</h2>
			<p>The Services are designed primarily to process business and website information. Users should not submit highly sensitive personal information unless it is necessary for an authorized use and permitted under the applicable agreement.</p>
			<p>Unless specifically authorized, users should not submit:</p>
			<ul>
			<li>Government identification numbers;</li>
			<li>Complete financial account information;</li>
			<li>Medical or health information;</li>
			<li>Biometric identifiers;</li>
			<li>Precise geolocation information;</li>
			<li>Passwords for third-party services;</li>
			<li>Information about children; or</li>
			<li>Other highly sensitive or legally protected information.</li>
			</ul>
			<p>If Rynk learns that prohibited or unnecessary sensitive information has been submitted, it may delete or restrict access to that information.</p>
			<h2>17. Children’s Privacy</h2>
			<p>The Services are intended for business users and are not directed to children.</p>
			<p>Individuals must be at least 18 years old, or the age of legal majority in their jurisdiction, to create a Rynk account unless an authorized organization has established a legally compliant arrangement permitting otherwise.</p>
			<p>We do not knowingly collect personal information directly from children through the Services. If you believe a child has provided personal information to Rynk, contact privacy@rynk.ai so that we can review and take appropriate action.</p>
			<h2>18. Third-Party Links and Platforms</h2>
			<p>The Services may link to, integrate with, retrieve information from, or publish information to third-party websites, AI assistants, search engines, analytics providers, directories, and other platforms.</p>
			<p>This Privacy Policy does not govern the independent privacy practices of third parties that Rynk does not control.</p>
			<p>Third parties may independently collect, retain, use, modify, index, or disclose information according to their own terms and privacy policies. We encourage you to review those policies before connecting an account or authorizing publication.</p>
			<p>Rynk is not responsible for the privacy or data-handling practices of third parties that process information independently from Rynk.</p>
			<h2>19. Changes to This Privacy Policy</h2>
			<p>We may update this Privacy Policy periodically to reflect changes in:</p>
			<ul>
			<li>Our Services;</li>
			<li>Technology;</li>
			<li>AI providers;</li>
			<li>Data-processing practices;</li>
			<li>Legal requirements;</li>
			<li>Security practices; or</li>
			<li>Business operations.</li>
			</ul>
			<p>We will post the revised Privacy Policy with a new “Last Updated” date.</p>
			<p>Where required by law or appropriate based on the nature of the change, we may provide additional notice through the Services, by email, or through another reasonable method.</p>
			<p>If a change would materially expand Rynk’s use of Client Data for model training or another materially different purpose, Rynk will not apply that use retroactively without any notice, consent, or written approval required by applicable law and our contractual commitments.</p>
			<h2>20. Contact Us</h2>
			<p>If you have questions about this Privacy Policy, Rynk’s privacy practices, the DPA, subprocessors, international transfers, or a privacy-rights request, contact us at:</p>
			<p>Rynk<br />Legal entity: Rynk.ai, Inc.</p>
			<p>Mailing address: 16803 Dallas Parkway, Suite 300, Addison TX 75001<br />Email: privacy@rynk.ai<br />Website: rynk.ai</p>
			</div>
		</div>
	</section>
</div>

<?php
get_footer();
