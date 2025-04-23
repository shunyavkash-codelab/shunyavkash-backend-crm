export const generateAssignmentEmail = (employeeName, projectTitle, role) => {
  return `
    <div style="background-color: #F9FAFB; padding: 20px; font-family: 'Segoe UI', sans-serif; color: #1F2937;">
      <div style="background-color: #FFFFFF; border: 1px solid #E5E7EB; border-radius: 8px; padding: 24px; max-width: 600px; margin: auto;">
        <h2 style="color: #111827; font-size: 24px; margin-bottom: 16px;">New Project Assignment</h2>
        <p style="font-size: 16px; color: #1F2937; margin-bottom: 12px;">
          Hi <strong>${employeeName}</strong>,
        </p>
        <p style="font-size: 16px; color: #1F2937; margin-bottom: 16px;">
          You have been assigned to the project <strong style="color: #2563EB;">${projectTitle}</strong> as a <strong>${role}</strong>.
        </p>
        <p style="font-size: 15px; color: #6B7280; margin-bottom: 24px;">
          Please log in to the CRM portal to view more details.
        </p>
        <a href="https://your-crm-link.com/projects" 
           style="display: inline-block; padding: 12px 24px; background-color: #2563EB; color: #FFFFFF; text-decoration: none; border-radius: 6px; font-weight: 500;">
          View Project
        </a>
        <hr style="margin: 32px 0; border: none; border-top: 1px solid #E5E7EB;" />
        <p style="font-size: 13px; color: #6B7280;">
          This is an automated email from CRM System. Please do not reply.
        </p>
      </div>
    </div>
  `;
};
