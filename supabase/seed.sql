-- seed.sql — realistic demo data for SecureHealth Inc.

insert into company_profile (name, industry, employees, environment, summary)
values ('SecureHealth Inc.','Healthcare',150,
  array['Microsoft 365','AWS','Remote workers','Patient data (PHI)','Employee laptops','Cloud storage'],
  'SecureHealth Inc. is a 150-person healthcare provider handling protected health information (PHI). Its hybrid environment spans Microsoft 365, AWS cloud storage, and a distributed remote workforce, placing it under HIPAA Security Rule obligations and mapped here to NIST CSF 2.0.')
on conflict do nothing;

insert into assets (asset_code, asset_name, asset_type, owner, business_criticality, data_classification, description) values
('AST-001','Patient Records Database','Database','Dr. Alan Reyes (CMO)','Critical','Restricted (PHI)','Primary EHR store containing patient medical records and PHI.'),
('AST-002','HR Database','Database','Maria Gomez (HR Director)','High','Confidential','Employee PII, payroll, and benefits data.'),
('AST-003','Microsoft 365 Email','SaaS','Priya Nair (IT Manager)','High','Confidential','Corporate email, calendars, and Teams collaboration.'),
('AST-004','AWS Cloud Storage','Cloud','Priya Nair (IT Manager)','Critical','Restricted (PHI)','S3 buckets storing backups, imaging files, and PHI exports.'),
('AST-005','Employee Laptops','Endpoint','James Okoro (IT Support)','Medium','Confidential','Fleet of ~150 Windows/macOS laptops used by remote staff.'),
('AST-006','Office Network','Network','Priya Nair (IT Manager)','High','Internal','On-prem LAN, Wi-Fi, and VPN gateway for the HQ office.')
on conflict (asset_code) do nothing;

insert into controls (control_code, control_name, control_type, description, framework_reference, implementation_status, owner) values
('CTL-001','Multi-Factor Authentication','Technical','Enforce MFA on M365, AWS, and VPN for all users.','NIST CSF PR.AA-03','Partially Implemented','Priya Nair'),
('CTL-002','Security Awareness Training','Administrative','Annual and quarterly phishing/security training for all staff.','NIST CSF PR.AT-01','Implemented','Maria Gomez'),
('CTL-003','Daily Encrypted Backups','Technical','Automated daily encrypted backups with offsite retention.','NIST CSF PR.DS-11','Partially Implemented','James Okoro'),
('CTL-004','Endpoint Detection and Response','Technical','EDR agents on all endpoints with central monitoring.','NIST CSF DE.CM-01','Implemented','James Okoro'),
('CTL-005','Data Encryption','Technical','Encryption at rest and in transit for PHI and PII.','NIST CSF PR.DS-01','Implemented','Priya Nair'),
('CTL-006','Access Review','Administrative','Periodic least-privilege access reviews of critical systems.','NIST CSF PR.AA-05','Not Implemented','Priya Nair'),
('CTL-007','Incident Response Plan','Administrative','Documented, tested IR plan with defined roles and runbooks.','NIST CSF RS.MA-01','Partially Implemented','Priya Nair')
on conflict (control_code) do nothing;

insert into risks (risk_code, risk_title, asset_id, threat, vulnerability, likelihood, impact, risk_rating, control_recommendation, residual_risk_score, status, owner) values
('RSK-001','Phishing attack due to lack of MFA',(select id from assets where asset_code='AST-003'),'Credential phishing / account takeover','MFA not enforced on all M365 accounts',4,5,'Critical','Enforce MFA org-wide; deploy phishing-resistant methods; expand awareness training.',6,'Open','Priya Nair'),
('RSK-002','Ransomware due to insufficient backups',(select id from assets where asset_code='AST-004'),'Ransomware / data encryption extortion','Backups not tested and not fully offsite',4,5,'Critical','Implement tested immutable offsite backups; validate restore quarterly; EDR containment.',8,'Open','James Okoro'),
('RSK-003','Lost laptop exposing sensitive data',(select id from assets where asset_code='AST-005'),'Device theft / loss','Inconsistent full-disk encryption on endpoints',3,4,'High','Enforce full-disk encryption + remote wipe via MDM; asset tracking.',4,'In Progress','James Okoro'),
('RSK-004','Insider threat accessing patient records',(select id from assets where asset_code='AST-001'),'Malicious or negligent insider','No periodic least-privilege access reviews',3,5,'High','Quarterly access reviews; audit logging + alerting on PHI access.',6,'Open','Priya Nair'),
('RSK-005','Cloud misconfiguration exposing data',(select id from assets where asset_code='AST-004'),'Public exposure of cloud storage','Misconfigured S3 bucket permissions',3,5,'High','Enable CSPM scanning; block public access; IaC guardrails.',4,'Open','Priya Nair')
on conflict (risk_code) do nothing;

insert into compliance_mappings (mapping_code, control_id, framework, function_category, requirement, compliance_status, evidence_notes) values
('MAP-001',(select id from controls where control_code='CTL-001'),'NIST CSF 2.0','Protect (PR.AA)','Identities and credentials are managed with MFA.','Partially Compliant','MFA enforced on AWS + VPN; ~30% of M365 accounts pending.'),
('MAP-002',(select id from controls where control_code='CTL-002'),'NIST CSF 2.0','Protect (PR.AT)','Personnel are provided security awareness training.','Compliant','Annual + quarterly phishing sims; 96% completion recorded.'),
('MAP-003',(select id from controls where control_code='CTL-003'),'NIST CSF 2.0','Protect (PR.DS)','Backups of data are created, protected, and tested.','Partially Compliant','Daily backups run; restore tests not yet scheduled.'),
('MAP-004',(select id from controls where control_code='CTL-004'),'NIST CSF 2.0','Detect (DE.CM)','The network and systems are monitored to find events.','Compliant','EDR deployed to 100% of endpoints; SOC alerting live.'),
('MAP-005',(select id from controls where control_code='CTL-005'),'NIST CSF 2.0','Protect (PR.DS)','Data-at-rest and in-transit are protected.','Compliant','TLS 1.2+ enforced; AES-256 at rest on PHI stores.'),
('MAP-006',(select id from controls where control_code='CTL-006'),'NIST CSF 2.0','Protect (PR.AA)','Access permissions are managed with least privilege.','Non-Compliant','No formal periodic access review process exists.'),
('MAP-007',(select id from controls where control_code='CTL-007'),'NIST CSF 2.0','Respond (RS.MA)','Incident response plan is executed and maintained.','Partially Compliant','IR plan documented; tabletop exercise never conducted.'),
('MAP-008',(select id from controls where control_code='CTL-006'),'NIST CSF 2.0','Govern (GV.RM)','Risk management strategy is established and reviewed.','Not Started','Formal risk governance cadence not yet defined.')
on conflict (mapping_code) do nothing;

insert into policies (policy_code, title, purpose, scope, policy_statement, owner, review_date, status) values
('POL-001','Password Policy','Ensure strong authentication credentials protect company and patient data.','All employees, contractors, and systems.','Passwords must be at least 12 characters, unique per system, and rotated on compromise. MFA is required for all remote and privileged access. Shared accounts are prohibited.','Priya Nair','2026-12-31','Active'),
('POL-002','Acceptable Use Policy','Define appropriate use of company IT resources.','All users of SecureHealth systems and networks.','Company systems are for authorized business use. Users must not disable security controls, install unapproved software, or access PHI without a legitimate need-to-know.','Priya Nair','2026-11-30','Active'),
('POL-003','Data Classification Policy','Classify data to apply appropriate safeguards.','All company and patient data.','Data is classified as Public, Internal, Confidential, or Restricted (PHI). Restricted data must be encrypted at rest and in transit and access-logged.','Dr. Alan Reyes','2026-10-15','Draft'),
('POL-004','Remote Work Policy','Secure the distributed remote workforce.','All remote and hybrid employees.','Remote access requires company-managed, encrypted devices connected via VPN with MFA. Public Wi-Fi use for PHI is prohibited without VPN.','Maria Gomez','2026-12-01','Active'),
('POL-005','Incident Response Policy','Establish a consistent response to security incidents.','All employees and IT/security staff.','Suspected incidents must be reported within 1 hour. The IR team follows defined containment, eradication, recovery, and notification procedures, including HIPAA breach assessment.','Priya Nair','2026-09-30','Active'),
('POL-006','Backup Policy','Ensure data can be recovered after loss or ransomware.','All critical systems and PHI stores.','Critical data is backed up daily, encrypted, and retained offsite for 30 days. Restore tests must be performed quarterly.','James Okoro','2026-12-31','Active')
on conflict (policy_code) do nothing;

insert into gap_assessments (requirement, current_state, gap, risk_level, recommendation, priority) values
('MFA enforced on all accounts (PR.AA-03)','MFA on AWS + VPN; partial on M365','~30% of M365 accounts lack MFA','Critical','Complete org-wide MFA rollout with phishing-resistant methods','High'),
('Backups tested regularly (PR.DS-11)','Daily backups run but never restore-tested','No validated recovery capability','High','Schedule quarterly restore tests and adopt immutable backups','High'),
('Formal data classification (PR.DS)','Data Classification Policy still in Draft','No approved, enforced classification scheme','Medium','Finalize, approve, and operationalize the Data Classification Policy','Medium'),
('Quarterly access reviews (PR.AA-05)','No periodic access reviews performed','Least-privilege not verified on PHI systems','High','Implement quarterly least-privilege access reviews with sign-off','High'),
('IR plan tested (RS.MA-01)','IR plan documented but never exercised','Response effectiveness unproven','Medium','Run a tabletop exercise and update runbooks from lessons learned','Medium')
on conflict do nothing;
