"use client";

import CrudManager from "@/components/admin/CrudManager";

export default function AdminCoursesPage() {
  return (
    <CrudManager
      title="Courses"
      description="Courses shown on the Courses page and course detail pages."
      collectionName="site_courses"
      idField="slug"
      columns={["title", "category", "duration"]}
      fields={[
        { key: "slug", label: "Slug", required: true, placeholder: "web-development", helpText: "Used in the URL: /courses/your-slug. Letters, numbers, and dashes only." },
        { key: "title", label: "Title", required: true },
        {
          key: "category",
          label: "Category",
          type: "select",
          required: true,
          options: [
            "IT & Programming",
            "Design & Multimedia",
            "Freelancing",
            "Digital Marketing",
            "Microsoft Office",
            "Trading & Finance",
            "Personal Development",
          ],
        },
        { key: "description", label: "Short Description", type: "textarea", required: true },
        { key: "duration", label: "Duration", required: true, placeholder: "3 Months" },
        { key: "level", label: "Level", required: true, placeholder: "Beginner to Advanced" },
        {
          key: "icon",
          label: "Icon",
          type: "select",
          required: true,
          options: [
            "code",
            "palette",
            "trending-up",
            "layout-grid",
            "smartphone",
            "terminal",
            "video",
            "ruler",
            "megaphone",
            "briefcase",
            "youtube",
            "line-chart",
            "languages",
            "graduation-cap",
          ],
        },
        { key: "image", label: "Course Image Path", placeholder: "/images/courses/your-course.jpg", helpText: "Path under /public, e.g. /images/courses/web-designing-developing.jpg. Leave blank to show an icon instead." },
        { key: "monthlyFee", label: "Monthly Fee", placeholder: "Rs. 3,000/month", helpText: "Shown in the Course Information box on the course page. The admission fee is set once for all courses under Fee Management." },
        { key: "enrolledStudents", label: "Students Enrolled", type: "number", placeholder: "120", helpText: "Total students who've enrolled in this course to date." },
        { key: "completedStudents", label: "Students Completed", type: "number", placeholder: "95", helpText: "Students who successfully completed this course." },
        { key: "rating", label: "Rating (out of 5)", type: "number", placeholder: "4.8" },
        { key: "reviewsCount", label: "Number of Reviews", type: "number", placeholder: "42" },
        { key: "overview", label: "Overview", type: "textarea", required: true },
        {
          key: "curriculumGroups",
          label: "Curriculum (What You Will Learn)",
          type: "outline",
          helpText:
            "This builds the 3-column curriculum layout on the course page. Click \"Add Heading & Items\" for each topic — e.g. heading \"MS Word\", then list its lessons underneath, one per line. Add another section for \"MS Excel\", another for \"MS PowerPoint\", and so on.",
        },
        {
          key: "practiceGroups",
          label: "Practice (Hands-On Projects)",
          type: "outline",
          helpText:
            "Same idea as above, for the Practice section. Heading \"MS Word Projects\", then list the real documents students build underneath, one per line. Add another section for \"MS Excel Projects\", etc.",
        },
        {
          key: "curriculum",
          label: "Curriculum — simple list (fallback)",
          type: "list",
          helpText:
            "Only used if the grouped Curriculum above is left empty. One topic per line, no headings.",
        },
        {
          key: "projects",
          label: "Projects — simple list (fallback)",
          type: "list",
          helpText:
            "Only used if the grouped Practice above is left empty. One project per line, no headings.",
        },
        { key: "careers", label: "Career Paths", type: "list", helpText: "One career path per line." },
      ]}
    />
  );
}
