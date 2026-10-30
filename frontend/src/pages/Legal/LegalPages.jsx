import { Box, Container, Divider, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const sections = {
  privacy: {
    title: "Privacy Policy",
    updated: "October 30, 2026",
    intro: "This notice explains how CampSync handles information when you use the campus management application.",
    blocks: [
      ["Information handled", "The application may process account and profile details such as name, email address, username, contact number and profile image, together with academic records entered by authorized users, including student, faculty, course, subject and attendance information."],
      ["How information is used", "Information is used to authenticate accounts, provide campus and academic management features, display dashboards and reports, and maintain application security and operation."],
      ["Authentication and cookies", "CampSync uses browser cookies for authentication. The application may also use session storage for a short-lived access token. Cookie settings are controlled by the browser and some features may not work when required cookies are blocked."],
      ["Service providers and storage", "Application data is handled by the services configured by the operator, including the application hosting provider, database and file/image storage services. The exact providers and processing locations depend on the deployment configuration."],
      ["Analytics and consent", "Optional analytics are not activated by this notice alone. If an analytics measurement ID is configured, the analytics script is loaded only after you choose to allow analytics in the cookie banner. You can change that choice by clearing this site's stored cookie preference."],
      ["Your choices and requests", "You can contact the CampSync operator using the Contact page to ask about your information or raise a privacy concern. Account and academic data changes may require verification that you are authorized to request them."],
      ["Scope and updates", "This notice describes the application behavior currently intended by its code and deployment. The operator should update it when data practices, service providers or contact channels change."]
    ]
  },
  terms: {
    title: "Terms of Use",
    updated: "October 30, 2026",
    intro: "By accessing CampSync, you agree to use the application responsibly and in accordance with your institution's policies.",
    blocks: [
      ["Authorized use", "Use CampSync only if you are authorized by the institution or workspace operator. Keep your login credentials private and notify the operator if you suspect unauthorized access."],
      ["Accurate information", "You are responsible for entering information that is accurate, lawful and appropriate for your role. Do not upload content you do not have permission to use."],
      ["Student and staff information", "Access academic and personal records only for legitimate institutional purposes and only to the extent permitted by your role and applicable policies."],
      ["Prohibited activity", "Do not attempt to bypass authentication, access another person's account, disrupt the service, upload malicious content, or use the application in violation of law."],
      ["Availability and changes", "Features may be changed, suspended or unavailable during maintenance or due to service-provider interruptions. The application is provided as an operational tool and users should follow institutional procedures for authoritative record keeping."],
      ["Contact", "Questions about these terms or access to CampSync can be submitted through the Contact page."]
    ]
  }
};

export default function LegalPages({ type }) {
  const page = sections[type] || sections.privacy;
  return <Container maxWidth="md" sx={{ py: { xs: 3, sm: 6 } }}>
    <Typography component="p" variant="overline" color="primary">CAMPSYNC · POLICIES</Typography>
    <Typography component="h1" variant="h3" fontWeight={750} sx={{ mt: 1 }}>{page.title}</Typography>
    <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>Last updated: {page.updated}</Typography>
    <Typography sx={{ lineHeight: 1.8, mb: 3 }}>{page.intro}</Typography>
    <Divider sx={{ mb: 3 }}/>
    {page.blocks.map(([heading, body]) => <Box key={heading} sx={{ mb: 3 }}>
      <Typography component="h2" variant="h6" fontWeight={700} sx={{ mb: 1 }}>{heading}</Typography>
      <Typography color="text.secondary" sx={{ lineHeight: 1.85 }}>{body}</Typography>
    </Box>)}
    <Typography color="text.secondary" variant="body2" sx={{ mt: 4 }}>Related: <Link to="/contact">Contact CampSync</Link> · <Link to="/support">Support</Link></Typography>
  </Container>;
}
