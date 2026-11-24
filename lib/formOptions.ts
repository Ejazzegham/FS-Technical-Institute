// Static dropdown option lists for forms. These are universal UI enumerations,
// not institute content, so they stay in code.
import type { GalleryCategory } from "@/lib/types";

export const qualifications: string[] = ["Under Matric", "Matric", "Intermediate", "Bachelor's", "Master's", "Other"];
export const religions: string[] = ["Islam", "Christianity", "Hinduism", "Sikhism", "Other"];
export const bloodGroups: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
export const galleryCategories: GalleryCategory[] = ["Classrooms", "Labs", "Events", "Workshops", "Achievements"];
